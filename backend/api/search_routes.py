"""
user_profile_routes.py
-----------------------------
This module contains the routes for user profile management, including
getting, editing, and deleting a user's bio.
"""
from logging import getLogger
from flask import Blueprint, jsonify, request
from models import User, db
import sqlalchemy.exc
from utils import log_request

search_bp = Blueprint('search_bp', __name__)
logger = getLogger(__name__)

@search_bp.route('/search', methods=['GET'])
def search_users():
    """Search users by username (partial match)"""
    try:
        log_request(request)
        logger.debug('Searching for users with query: %s', request.args.get('q', ''))
        query = request.args.get('q', '')
        if not query:
            # Consider if this should be an error or just an empty list
            return jsonify({'message': 'Search query cannot be empty', 'users': []}), 400

        users = User.query.filter(User.username.ilike(f"%{query}%")).all() # Using ilike for case-insensitive search

        if not users:
            return jsonify({
                'message': 'No users found matching your query', 'users': []
                }), 200 # 200 is appropriate for no results

        followers = [{
            'username': user.username,
            'userId': user.id,
            'email': user.email,
            'bio': user.bio,
            'dateJoined': str(user.created_at)} for user in users if user in user.followers]

        following = [{
            'username': user.username,
            'userId': user.id,
            'email': user.email,
            'bio': user.bio,
            'dateJoined': str(user.created_at)} for user in users if user in user.following]

        results = [{
            'username': u.username,
            'userId': u.id, # Changed from id to userId for consistency with frontend User interface
            'email': u.email,
            'bio': u.bio,
            'dateJoined': str(u.created_at), # Changed from date_joined to dateJoined,
            'followers': followers,
            'following': following
        } for u in users]
        return jsonify({'users': results}), 200
    except sqlalchemy.exc.SQLAlchemyError:
        logger.error("Database error during user search")
        db.session.rollback() # Rollback in case of database error
        return jsonify({'message': 'Internal server error during user search'}), 500
    except Exception as sql_error: # pylint: disable=broad-exception-caught
        logger.error("Unexpected error during user search: %s", str(sql_error))
        db.session.rollback()
        return jsonify({'message': f'An unexpected error occurred: {str(sql_error)}'}), 500
