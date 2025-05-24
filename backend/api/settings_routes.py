"""
user_profile_routes.py
-----------------------------
This module contains the routes for user profile management, including
getting, editing, and deleting a user's bio.
"""
from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity
import sqlalchemy.exc
from models import db, User

settings_bp = Blueprint('settings_bp', __name__)

@settings_bp.route('/<string:username>/changePassword', methods=['PUT'])
@jwt_required()
def change_password(username):
    """Change a user's password"""
    try:
        current_user_identity = get_jwt_identity()
        if not current_user_identity:
            return jsonify({'message': 'Unauthorized'}), 401

        # Authorization: Check if the JWT identity matches the path username
        if current_user_identity != username:
            return jsonify({'message': 'You are not authorized to change this user\'s password'}), 403

        data = request.get_json()
        if not data:
            return jsonify({'message': 'Request body is missing or not JSON'}), 400

        new_password = data.get('newPassword')
        if not new_password:
            return jsonify({'message': 'New password is required'}), 400

        # It's good practice to also ask for the old password to confirm identity further, though JWT handles primary auth.
        # old_password = data.get('oldPassword')
        # if not old_password:
        #     return jsonify({'message': 'Old password is required'}), 400

        user = User.query.filter_by(username=username).first()
        if user is None:
            return jsonify({'message': 'User not found'}), 404

        # if not check_password_hash(user.password, old_password):
        #     return jsonify({'message': 'Incorrect old password'}), 401

        if check_password_hash(user.password, new_password):
            return jsonify({'message': 'New password cannot be the same as the old one'}), 400

        user.password = generate_password_hash(new_password)
        db.session.commit()

        return jsonify({
            'message': 'Password updated successfully',
            'username': user.username
        }), 200
    except sqlalchemy.exc.SQLAlchemyError as e:
        db.session.rollback()
        # current_app.logger.error(f"Database error during password change: {e}")
        return jsonify({'message': f'Internal server error: {str(e)}'}), 500 # Provide error string for clarity
    except Exception as e:
        db.session.rollback()
        # current_app.logger.error(f"Unexpected error during password change: {e}")
        return jsonify({'message': f'An unexpected error occurred: {str(e)}'}), 500
