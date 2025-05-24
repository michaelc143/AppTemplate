"""
user_profile_routes.py
-----------------------------
This module contains the routes for user profile management, including
getting, editing, and deleting a user's bio.
"""
import sqlalchemy.exc
from flask import Blueprint, jsonify, request
from models import db, User  # Changed to relative import
from flask_jwt_extended import jwt_required, get_jwt_identity

user_profile_bp = Blueprint('user_profile_routes', __name__)

@user_profile_bp.route('/users/<string:username>/bio', methods=['GET'])
def get_bio(username):
    """ Get a user's bio """
    try:
        user = User.query.filter_by(username=username).first()
        if user is None:
            return jsonify({'message': 'User not found'}), 404
        return jsonify({
            'bio': user.bio
        }), 200
    except sqlalchemy.exc.SQLAlchemyError:
        return jsonify({'message': 'Internal server error'}), 500


@user_profile_bp.route('/users/<string:username>/bio', methods=['PUT'])
@jwt_required()
def edit_bio(username):
    """ Edit a user's bio """
    try:
        data = request.get_json()
        current_user_identity = get_jwt_identity()

        if current_user_identity != username:
            # Or, if you store user_id in JWT, fetch user by username from URL, then compare IDs.
            return jsonify({'message': 'You are not authorized to edit this bio'}), 403

        new_bio = data.get('bio')
        # Consider allowing empty string for bio if user wants to clear it
        if new_bio is None:  # Check for None explicitly if empty string is allowed
            return jsonify({'message': 'New bio is required'}), 400

        user = User.query.filter_by(username=username).first()
        if user is None:
            return jsonify({'message': 'User not found'}), 404

        user.bio = new_bio
        db.session.commit()
        return jsonify({
            'message': 'Bio updated successfully',
            'bio': user.bio
        }), 200
    except sqlalchemy.exc.SQLAlchemyError as exception:
        print(f"Error in edit_bio: {exception}")
        db.session.rollback()
        return jsonify({'message': f'Internal server error: {exception}'}), 500


@user_profile_bp.route('/users/<string:username>/bio', methods=['DELETE'])
@jwt_required()
def delete_bio(username):
    """ Delete a user's bio """
    try:
        current_user_identity = get_jwt_identity()
        if current_user_identity != username:
            return jsonify({'message': 'You are not authorized to delete this bio'}), 403

        user = User.query.filter_by(username=username).first()
        if user is None:
            return jsonify({'message': 'User not found'}), 404

        user.bio = None
        db.session.commit()
        return jsonify({
            'message': 'Bio deleted successfully',
            'bio': user.bio  # Will be None
        }), 200
    except sqlalchemy.exc.SQLAlchemyError as exception:
        print(f"Error in delete_bio: {exception}")
        db.session.rollback()
        return jsonify({'message': f'Internal server error: {exception}'}), 500
