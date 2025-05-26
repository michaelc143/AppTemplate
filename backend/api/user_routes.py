"""
user_profile_routes.py
-----------------------------
This module contains the routes for user profile management, including
getting, editing, and deleting a user's bio.
"""
from logging import getLogger
import sqlalchemy.exc
from utils import get_user_or_404, return_500_response, check_for_token, log_request
from flask import Blueprint, jsonify, request
from models import db, User
from flask_jwt_extended import jwt_required, create_access_token

user_bp = Blueprint('user_bp', __name__)
logger = getLogger(__name__)

@user_bp.route('/users/<string:username>', methods=['GET'])
def get_user(username):
    """ Get a user by ID """
    try:
        log_request(request)
        logger.debug('Fetching user with username: %s', username)

        user, error_response, status = get_user_or_404(username)
        if error_response:
            return error_response, status

        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'bio': user.bio,
            'created_at': user.created_at
        }), 200

    except sqlalchemy.exc.SQLAlchemyError as exception:
        logger.error("SQLAlchemyError in get_user: %s", exception)
        db.session.rollback()
        return return_500_response(exception=exception)

@user_bp.route('/users/<string:username>', methods=['DELETE'])
@jwt_required()
def delete_user(username):
    """ Delete a user by username """
    try:
        log_request(request)
        logger.debug('Attempting to delete user with username: %s', username)

        current_user_identity, error_response_token, token_status = check_for_token()
        if error_response_token:
            return error_response_token, token_status

        if current_user_identity != username:
            return jsonify({'message': 'You are not authorized to delete this user'}), 403

        user, error_response_user, user_status = get_user_or_404(username)
        if error_response_user:
            return error_response_user, user_status

        # Delete the user and commit the changes
        db.session.delete(user)
        db.session.commit()

        # Return a success message
        return jsonify({'message': 'User deleted successfully'}), 200

    except sqlalchemy.exc.SQLAlchemyError as exception:
        logger.error("SQLAlchemyError in delete_user for username: %s, exception: %s", username, exception)
        db.session.rollback()
        return return_500_response(exception=exception)

@user_bp.route('/users/<string:username>/username', methods=['PUT'])
@jwt_required()
def edit_username(username):
    """ Edit a user's username """
    try:
        log_request(request)
        logger.debug('Editing username for user: %s', username)

        data = request.get_json()
        current_user_identity, error_response_token, token_status = check_for_token()
        if error_response_token:
            return error_response_token, token_status

        if current_user_identity != username:
            return jsonify({'message': 'You are not authorized to edit this user'}), 403

        new_username = data.get('newUsername')
        if not new_username:
            return jsonify({'message': 'New username is required'}), 400

        user, error_response, status = get_user_or_404(username)
        if error_response:
            return error_response, status

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
        logger.error("SQLAlchemyError in edit_username: %s", exception)
        db.session.rollback()
        return return_500_response(exception=exception)
