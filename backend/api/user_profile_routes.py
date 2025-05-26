"""
user_profile_routes.py
-----------------------------
This module contains the routes for user profile management, including
getting, editing, and deleting a user's bio.
"""
from logging import getLogger
import sqlalchemy.exc
from flask import Blueprint, jsonify, request
from models import db
from flask_jwt_extended import jwt_required
from utils import get_user_or_404, check_for_token, return_500_response, log_request

user_profile_bp = Blueprint('user_profile_routes', __name__)
logger = getLogger(__name__)

@user_profile_bp.route('/users/<string:username>/bio', methods=['GET'])
def get_bio(username):
    """ Get a user's bio """
    try:
        log_request(request)
        logger.debug('Fetching bio for user: %s', username)

        user, error_response, status = get_user_or_404(username)
        if error_response:
            return error_response, status

        return jsonify({
            'bio': user.bio
        }), 200

    except sqlalchemy.exc.SQLAlchemyError as exception:
        logger.error("SQLAlchemyError in get_bio: %s", exception)
        db.session.rollback()
        return return_500_response(exception=exception)

@user_profile_bp.route('/users/<string:username>/bio', methods=['PUT'])
@jwt_required()
def edit_bio(username):
    """ Edit a user's bio """
    try:
        log_request(request)
        logger.debug('Editing bio for user: %s', username)

        data = request.get_json()
        current_user_identity, error_response_token, status = check_for_token()
        if error_response_token:
            return error_response_token, status

        if current_user_identity != username:
            # Or, if you store user_id in JWT, fetch user by username from URL, then compare IDs.
            return jsonify({'message': 'You are not authorized to edit this bio'}), 403

        new_bio = data.get('bio')
        # Consider allowing empty string for bio if user wants to clear it
        if new_bio is None:  # Check for None explicitly if empty string is allowed
            return jsonify({'message': 'New bio is required'}), 400

        user, error_response_user, status = get_user_or_404(username)
        if error_response_user:
            return error_response_user, status

        user.bio = new_bio
        db.session.commit()
        return jsonify({
            'message': 'Bio updated successfully',
            'bio': user.bio
        }), 200

    except sqlalchemy.exc.SQLAlchemyError as exception:
        logger.error("SQLAlchemyError in edit_bio: %s", exception)
        db.session.rollback()
        return return_500_response(exception=exception)

@user_profile_bp.route('/users/<string:username>/bio', methods=['DELETE'])
@jwt_required()
def delete_bio(username):
    """ Delete a user's bio """
    try:
        log_request(request)
        logger.debug('Deleting bio for user: %s', username)

        current_user_identity, error_response_token, status = check_for_token()
        if error_response_token:
            return error_response_token, status

        if current_user_identity != username:
            return jsonify({'message': 'You are not authorized to delete this bio'}), 403

        user, error_response_user, status = get_user_or_404(username)
        if error_response_user:
            return error_response_user, status

        user.bio = None
        db.session.commit()
        return jsonify({
            'message': 'Bio deleted successfully',
            'bio': user.bio  # Will be None
        }), 200

    except sqlalchemy.exc.SQLAlchemyError as exception:
        logger.error("SQLAlchemyError in delete_bio: %s", exception)
        db.session.rollback()
        return return_500_response(exception=exception)
