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

def log_request(request):
    """ Log request method, URL, headers, and sanitized body """
    logger.info('Request: %s %s', request.method, request.url)
    logger.debug('Headers: %s', dict(request.headers))

    if request.is_json:
        data = request.get_json()
        sanitized = {k: ('***' if 'pass' in k.lower() or 'token' in k.lower() else v) for k, v in data.items()}
        logger.debug('Body: %s', sanitized)
    else:
        logger.debug('Body: Not JSON')
