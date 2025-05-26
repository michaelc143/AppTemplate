"""
user_profile_routes.py
-----------------------------
This module contains the routes for user profile management, including
getting, editing, and deleting a user's bio.
"""
import logging
from logging import getLogger
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import sqlalchemy.exc
from models import db, User

follow_bp = Blueprint('follow_bp', __name__)
logger = getLogger(__name__)
logging.basicConfig(filename='api.log', encoding='utf-8', level=logging.DEBUG)

@follow_bp.route('/<string:username>/follow', methods=['POST'])
@jwt_required()
def follow_user(username):
    """Follow a user"""
    try:
        logger.debug('Following user %s', username)
        current_user_identity = get_jwt_identity()
        if not current_user_identity:
            return jsonify({'message': 'Unauthorized'}), 401 # Corrected status code

        if current_user_identity == username:  # User cannot follow themselves
            return jsonify({'message': 'You cannot follow yourself'}), 400

        user_to_follow = User.query.filter_by(username=username).first()

        if user_to_follow is None:
            return jsonify({'message': 'No user found with that username'}), 404

        current_user_obj = User.query.filter_by(username=current_user_identity).first()
        if not current_user_obj:
            return jsonify({'message': 'Current user not found'}), 404

        if user_to_follow in current_user_obj.following:
            return jsonify({'message': 'You are already following this user'}), 400

        current_user_obj.following.append(user_to_follow)
        db.session.commit()

        following_list = [{'username': user.username, 'userId': user.id, 'email': user.email, 'bio': user.bio, 'dateJoined': str(user.created_at)} for user in current_user_obj.following]

        return jsonify({
            'message': 'Followed user successfully',
            'following': following_list
        }), 200
    except sqlalchemy.exc.SQLAlchemyError:
        db.session.rollback()
        return jsonify({'message': 'Internal server error while following user'}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'An unexpected error occurred: {str(e)}'}), 500

@follow_bp.route('/<string:username>/unfollow', methods=['POST'])
@jwt_required()
def unfollow_user(username):
    """Unfollow a user"""
    try:
        logger.debug('Unfollowing user %s', username)
        current_user_identity = get_jwt_identity()
        if not current_user_identity:
            return jsonify({'message': 'Unauthorized'}), 401 # Corrected status code

        if current_user_identity == username:  # User cannot unfollow themselves
            return jsonify({'message': 'You cannot unfollow yourself'}), 400

        user_to_unfollow = User.query.filter_by(username=username).first()

        if user_to_unfollow is None:
            return jsonify({'message': 'User not found'}), 404

        current_user_obj = User.query.filter_by(username=current_user_identity).first()
        if not current_user_obj:  # Should not happen
            return jsonify({'message': 'Current user not found'}), 404 # More specific message

        if user_to_unfollow not in current_user_obj.following:
            return jsonify({'message': 'You are not following this user'}), 400

        current_user_obj.following.remove(user_to_unfollow)
        db.session.commit()

        # Serialize the 'following' list to be JSON-friendly
        following_list = [{'username': user.username, 'userId': user.id, 'email': user.email, 'bio': user.bio, 'dateJoined': str(user.created_at)} for user in current_user_obj.following]

        return jsonify({
            'message': f'You have unfollowed {username}',
            'following': following_list # Return list of usernames
        }), 200
    except sqlalchemy.exc.SQLAlchemyError:
        db.session.rollback()  # Ensure rollback on error
        return jsonify({'message': 'Internal server error while unfollowing user'}), 500 # More specific message
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'An unexpected error occurred: {str(e)}'}), 500

@follow_bp.route('/<string:username>/followers', methods=['GET'])
def get_followers(username):
    """Get followers of a user"""
    try:
        logger.debug('Getting followers for user %s', username)
        user = User.query.filter_by(username=username).first()

        if user is None:
            return jsonify({'message': 'User not found'}), 404

        followers = [{'username': follower.username, 'dateJoined': str(follower.created_at), 'userId': follower.id, 'email': follower.email, 'bio': follower.bio} for follower in user.followers]
        return jsonify({'followers': followers}), 200
    except sqlalchemy.exc.SQLAlchemyError:
        db.session.rollback()
        return jsonify({'message': 'Internal server error retrieving followers'}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'An unexpected error occurred: {str(e)}'}), 500

@follow_bp.route('/<string:username>/following', methods=['GET'])
def get_following(username):
    """Get users that a user is following"""
    try:
        logger.debug('Getting following for user %s', username)
        user = User.query.filter_by(username=username).first()

        if user is None:
            return jsonify({'message': 'User not found'}), 404

        following = [{'username': followed.username, 'dateJoined': str(followed.created_at), 'userId': followed.id, 'email': followed.email, 'bio': followed.bio} for followed in user.following]
        return jsonify({'following': following}), 200
    except sqlalchemy.exc.SQLAlchemyError:
        db.session.rollback()
        return jsonify({'message': 'Internal server error retrieving followed users'}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'An unexpected error occurred: {str(e)}'}), 500
