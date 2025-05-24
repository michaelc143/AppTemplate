"""
user_profile_routes.py
-----------------------------
This module contains the routes for user profile management, including
getting, editing, and deleting a user's bio.
"""
import sqlalchemy.exc
from flask import Blueprint, jsonify, request
from models import db, User
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/users/<string:username>', methods=['GET'])
def get_user(username):
    """ Get a user by ID """
    try:
        # Find the user by username
        user = User.query.filter_by(username=username).first()
        if user is None:
            return jsonify({'message': 'User not found'}), 404

        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'bio': user.bio,
            'created_at': user.created_at
        }), 200
    except sqlalchemy.exc.SQLAlchemyError:
        db.session.rollback()
        return jsonify({'message': 'Internal server error'}), 500

@user_bp.route('/users/<string:username>', methods=['DELETE'])
@jwt_required()
def delete_user(username):
    """ Delete a user by username """
    try:
        current_user_identity = get_jwt_identity()
        if current_user_identity != username:
            return jsonify({'message': 'You are not authorized to delete this user'}), 403

        # Find the user by username
        user = User.query.filter_by(username=username).first()

        if user is None:
            # If the user doesn't exist, return an error
            return jsonify({'message': 'User not found'}), 404

        # Delete the user and commit the changes
        db.session.delete(user)
        db.session.commit()

        # Return a success message
        return jsonify({'message': 'User deleted successfully'}), 200
    except sqlalchemy.exc.SQLAlchemyError:
        db.session.rollback()
        return jsonify({'message': 'Internal server error'}), 500

@user_bp.route('/users/<string:username>/username', methods=['PUT'])
@jwt_required()
def edit_username(username):
    """ Edit a user's username """
    try:
        data = request.get_json()
        current_user_identity = get_jwt_identity()

        if current_user_identity != username:
            return jsonify({'message': 'You are not authorized to edit this user'}), 403

        new_username = data.get('newUsername')
        if not new_username:
            return jsonify({'message': 'New username is required'}), 400

        # Find the user by current username
        user = User.query.filter_by(username=username).first()

        if user is None:
            return jsonify({'message': 'User not found'}), 404

        # Check if the new username is already taken
        existing_user = User.query.filter_by(username=new_username).first()
        if existing_user and existing_user.id != user.id: # Check if it's a different user
            return jsonify({'message': 'Username is already taken'}), 400

        # Update the username and commit the changes
        user.username = new_username
        db.session.commit()

        # Create a new access token with the new username
        new_access_token = create_access_token(identity=new_username)

        return jsonify({
            'message': 'Username updated successfully',
            'username': user.username,
            'access_token': new_access_token # Return the new token
        }), 200
    except sqlalchemy.exc.SQLAlchemyError as exception:
        db.session.rollback()
        print(f"Error in edit_username: {exception}")
        return jsonify({'message': f'Internal server error: {exception}'}), 500
