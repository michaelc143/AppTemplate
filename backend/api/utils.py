"""
utils.py
-----------------------------
This module contains utility functions for the API, such as error handling and logging.
"""
from logging import getLogger
from flask import jsonify
from models import User
from flask_jwt_extended import get_jwt_identity

logger = getLogger(__name__)

def get_user_or_404(username):
    """ Get a user or return a 404 error """
    user = User.query.filter_by(username=username).first()
    if user is None:
        logger.error('User not found: %s', username)
        return None, jsonify({'message': 'User not found'}), 404
    return user, None, None

def check_for_token():
    """ Check if the request has a valid JWT token """
    current_user_identity = get_jwt_identity()
    if not current_user_identity:
        logger.error('Unauthorized access attempt')
        return None, jsonify({'message': 'Unauthorized'}), 401
    return current_user_identity, None, None

def return_500_response(exception):
    """ Return a 500 error response with the exception message """
    logger.error('Internal server error: %s', str(exception))
    return jsonify({'message': 'Internal server error', 'error': str(exception)}), 500

def validate_required_fields(data: dict | None, required_fields: list, function_name: str) -> list:
    """
    Validates if all required fields are present and not empty in the data (dict).
    Returns a list of missing or empty fields, or an empty list if all are present.
    """
    missing_or_empty_fields = []
    if not isinstance(data, dict):
        # Or raise TypeError, or return a specific error object
        logger.error('validate_required_fields expects a dictionary for data in %s', function_name)
        return False, missing_or_empty_fields

    for field in required_fields:
        if field not in data or not data[field]: # Checks for presence and if value is falsy (e.g., empty string)
            missing_or_empty_fields.append(field)
    return True, missing_or_empty_fields

def log_request(request):
    """ Log request method, URL, headers, and sanitized body """
    logger.info('Request: %s %s', request.method, request.url)
    logger.debug('Headers: %s', dict(request.headers))

    # Check if the content type is application/json
    if request.content_type == 'application/json':
        data = request.get_json(silent=True)  # Use silent=True to avoid raising an exception
        if data is not None:
            sanitized_data = {
                k: ('***' if 'password' in k.lower() or 'token' in k.lower() else v)
                for k, v in data.items()
            }
            logger.debug('Body (JSON): %s', sanitized_data)
        else:
            # Log that Content-Type was application/json but body was empty or malformed
            logger.debug('Body: Content-Type was application/json, but request body was empty or not valid JSON.')
    else:
        # Log non-JSON body or if body is not expected to be JSON
        # For GET requests, request.data might be empty.
        # For other methods like POST with form data, request.form would be used.
        # This basic logging indicates it wasn't processed as JSON.
        logger.debug('Body: Not JSON or Content-Type not application/json. ' +
                     'Raw data length: %s', len(request.get_data(as_text=True)))
