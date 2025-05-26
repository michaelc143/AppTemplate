"""
user_profile_routes.py
-----------------------------
This module contains the routes for user profile management, including
getting, editing, and deleting a user's bio.
"""
from logging import getLogger
from utils import get_user_or_404, check_for_token, log_request
from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required
import sqlalchemy.exc
from models import db

settings_bp = Blueprint('settings_bp', __name__)
logger = getLogger(__name__)

@settings_bp.route('/<string:username>/changePassword', methods=['PUT'])
@jwt_required()
def change_password(username):
    """Change a user's password"""
    try:
        log_request(request)
        logger.debug('Changing password for user: %s', username)
        current_user_identity, error_response, status = check_for_token()
        if error_response:
            return error_response, status

        # Authorization: Check if the JWT identity matches the path username
        if current_user_identity != username:
            return jsonify({'message': 'You are not authorized to change this user\'s password'}), 403

        data = request.get_json()
        if not data:
            return jsonify({'message': 'Request body is missing or not JSON'}), 400

        new_password = data.get('newPassword')
        if not new_password:
            return jsonify({'message': 'New password is required'}), 400

        user, error_response, status = get_user_or_404(username)
        if error_response:
            return error_response, status

        if check_password_hash(user.password, new_password):
            return jsonify({'message': 'New password cannot be the same as the old one'}), 400

        user.password = generate_password_hash(new_password)
        db.session.commit()

        return jsonify({
            'message': 'Password updated successfully',
            'username': user.username
        }), 200
    except sqlalchemy.exc.SQLAlchemyError as sql_error:
        db.session.rollback()
        # current_app.logger.error(f"Database error during password change: {sql_error}")
        return jsonify({'message': f'Internal server error: {str(sql_error)}'}), 500 # Provide error string for clarity
    except Exception as sql_error: # pylint: disable=broad-exception-caught
        db.session.rollback()
        # current_app.logger.error(f"Unexpected error during password change: {sql_error}")
        return jsonify({'message': f'An unexpected error occurred: {str(sql_error)}'}), 500
