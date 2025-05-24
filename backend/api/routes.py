""" Routes for the API """
import sqlalchemy.exc
from flask import Blueprint, jsonify, request
from models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

@api.route('/users/<string:username>/follow', methods=['POST'])
@jwt_required()
def follow_user(username):
    """ Follow a user """
    try:
        current_user = get_jwt_identity()
        data = request.get_json()

        if current_user != data.get('username'):
            return jsonify({'message': 'You are not authorized to follow this user'}), 403

        user_to_follow = User.query.filter_by(username=username).first()

        if user_to_follow is None:
            return jsonify({'message': 'User not found'}), 404

        if current_user == username:
            return jsonify({'message': 'You cannot follow yourself'}), 400

        current_user_obj = User.query.filter_by(username=current_user).first()
        if user_to_follow in current_user_obj.following:
            return jsonify({'message': 'You are already following this user'}), 400

        current_user_obj.following.append(user_to_follow)
        db.session.commit()

        return jsonify({'message': f'You are now following {username}'}), 200
    except sqlalchemy.exc.SQLAlchemyError:
        return jsonify({'message': 'Internal server error'}), 500

@api.route('/users/<string:username>/unfollow', methods=['POST'])
@jwt_required()
def unfollow_user(username):
    """ Unfollow a user """
    try:
        current_user = get_jwt_identity()
        data = request.get_json()

        if current_user != data.get('username'):
            return jsonify({'message': 'You are not authorized to unfollow this user'}), 403

        if current_user == username:
            return jsonify({'message': 'You cannot unfollow yourself'}), 400

        user_to_unfollow = User.query.filter_by(username=username).first()

        if user_to_unfollow is None:
            return jsonify({'message': 'User not found'}), 404

        current_user_obj = User.query.filter_by(username=current_user).first()
        if user_to_unfollow not in current_user_obj.following:
            return jsonify({'message': 'You are not following this user'}), 400

        current_user_obj.following.remove(user_to_unfollow)
        db.session.commit()

        return jsonify({'message': f'You have unfollowed {username}'}), 200
    except sqlalchemy.exc.SQLAlchemyError:
        return jsonify({'message': 'Internal server error'}), 500

@api.route('/users/<string:username>/followers', methods=['GET'])
def get_followers(username):
    """ Get followers of a user """
    try:
        user = User.query.filter_by(username=username).first()

        if user is None:
            return jsonify({'message': 'User not found'}), 404

        followers = [{'username': follower.username} for follower in user.followers]
        return jsonify({'followers': followers}), 200
    except sqlalchemy.exc.SQLAlchemyError:
        return jsonify({'message': 'Internal server error'}), 500

@api.route('/users/<string:username>/following', methods=['GET'])
def get_following(username):
    """ Get users that a user is following """
    try:
        user = User.query.filter_by(username=username).first()

        if user is None:
            return jsonify({'message': 'User not found'}), 404

        following = [{'username': followed.username} for followed in user.following]
        return jsonify({'following': following}), 200
    except sqlalchemy.exc.SQLAlchemyError:
        return jsonify({'message': 'Internal server error'}), 500

@api.route('/users/search', methods=['GET'])
def search_users():
    """Search users by username (partial match)"""
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify({'users': []}), 404
        users = User.query.filter(User.username.like(f"%{query}%")).all()
        results = [{
            'username': u.username,
            'id': u.id,
            'email': u.email,
            'bio': u.bio,
            'date_joined': str(u.created_at)
        } for u in users]
        return jsonify({'users': results}), 200
    except sqlalchemy.exc.SQLAlchemyError:
        return jsonify({'message': 'Internal server error'}), 500

@api.route('/users/<string:username>/changePassword', methods=['PUT'])
@jwt_required()
def change_password(username):
    """ Change a user's password """
    try:
        data = request.get_json()

        # Get the current user from the JWT
        current_user = get_jwt_identity()
        curr_username = data.get('username')

        if current_user != curr_username:
            return jsonify({'message': 'You are not authorized to change this user\'s password'}), 403

        # Get the new password from the request
        new_password = data.get('newPassword')
        if not new_password:
            return jsonify({'message': 'New password is required'}), 400

        # Find the user by username
        user = User.query.filter_by(username=username).first()

        if user is None:
            # If the user doesn't exist, return an error
            return jsonify({'message': 'User not found'}), 404

        # Check if the new password is the same as the old one
        hashed_password = generate_password_hash(new_password)
        if check_password_hash(user.password, new_password):
            return jsonify({'message': 'New password cannot be the same as the old one'}), 400

        # Update the password and commit the changes
        user.password = hashed_password
        db.session.commit()

        # Return a success message
        return jsonify({
            'message': 'Password updated successfully',
            'username': user.username}), 200
    except sqlalchemy.exc.SQLAlchemyError as exception:
        print(f"Error in change_password: {exception}")
        return jsonify({'message': f'Internal server error: {exception}'}), 500

@api.route('/', methods=['GET'])
def test():
    """ Test message to ensure the API is working """
    return jsonify({'message': 'Hello, World!'}), 200
