""" Routes for the API """
import sqlalchemy.exc
from flask import Blueprint, jsonify, request
from models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

@api.route('/users/<string:username>', methods=['GET'])
@jwt_required()
def get_user(username):
    """ Get a user by ID """
    try:
        data = request.get_json()

        current_user = get_jwt_identity()
        if current_user != data.get('username'):
            return jsonify({'message': 'You are not authorized to view this user'}), 403

        # Find the user by username
        user = User.query.filter_by(username=username).first()
        if user is None:
            return jsonify({'message': 'User not found'}), 404

        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'created_at': user.created_at
        }), 200
    except sqlalchemy.exc.SQLAlchemyError:
        return jsonify({'message': 'Internal server error'}), 500

@api.route('/users/<string:username>', methods=['DELETE'])
@jwt_required()
def delete_user(username):
    """ Delete a user by username """

    try:
        current_user = get_jwt_identity()
        if current_user != username:
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
        return jsonify({'message': 'Internal server error'}), 500

@api.route('/login', methods=['POST'])
def login():
    """ Log in a user """
    try:
        # Parse the JSON request
        data = request.get_json()

        # Get the username and password from the request
        username = data.get('username')
        password = data.get('password')
        
        # Validate the input
        if not username or not password:
            return jsonify({'error': 'Missing username or password'}), 400

        # Find the user in the database
        user = User.query.filter_by(username=username).first()

        # If the user doesn't exist or the password is wrong, return an error
        if user is None or not check_password_hash(user.password, password):
            return jsonify({'message': 'Invalid username or password'}), 401

        # Create a JWT token for the user
        access_token = create_access_token(identity=user.username)

        # If the username and password are correct, return data and 200 response
        return jsonify({
            'message': 'Logged in successfully',
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'date_joined': user.created_at,
            'access_token': access_token
        }), 200
    except Exception as e:
        # Log the error and return a 500 response
        print(f"Error in /login: {e}")
        return jsonify({'error': f'Internal server error {e}'}), 500

@api.route('/register', methods=['POST'])
def register():
    """ Register a new user """
    try:
        # Parse the JSON request
        data = request.get_json()

        # Get the username and password from the request
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        # Check if a user with the provided username already exists
        user = User.query.filter_by(username=username).first()
        user_email = User.query.filter_by(email=email).first()

        if user is not None or user_email is not None:
            # If a user with the provided username/email already exists, return an error
            return jsonify({'message': 'Username/Email already taken'}), 401

        # Hash the password
        hashed_password = generate_password_hash(password)

        # Create a new user and save it to the database
        user = User(username=username, password=hashed_password, email=email)
        db.session.add(user)
        db.session.commit()

        # Return a success message
        return jsonify({
            'message': 'Registered successfully',
            'username': user.username,
            'email': user.email,
            'date_joined': str(user.created_at)
        }), 200
    except sqlalchemy.exc.SQLAlchemyError:
        return jsonify({'message': 'Internal server error'}), 500

@api.route('/users/<string:username>/username', methods=['PUT'])
@jwt_required()
def edit_username(username):
    """ Edit a user's username """
    try:
        data = request.get_json()
        print(f"Request data: {data}")

        # Get the current user from the JWT
        current_user = get_jwt_identity()
        print(f"Current user: {current_user}")


        if current_user != username:
            return jsonify({'message': f'You are not authorized to edit this user {current_user}'}), 403

        # Get the new username from the request
        new_username = data.get('username')
        if not new_username:
            return jsonify({'message': 'New username is required'}), 400
        
        if 'userId' in data:
            user_id = data.get('userId')

        else:
            # If user_id is not provided, return an error
            return jsonify({'message': 'User ID is required'}), 400

        # Find the user by ID
        user = User.query.get(user_id)

        if user is None:
            # If the user doesn't exist, return an error
            return jsonify({'message': 'User not found'}), 404
        
        # Check if the new username is already taken
        existing_user = User.query.filter_by(username=new_username).first()
        if existing_user:
            return jsonify({'message': 'Username is already taken'}), 400

        # Update the username and commit the changes
        user.username = new_username
        db.session.commit()

        # Return a success message
        return jsonify({
            'message': 'Username updated successfully',
            'username': user.username}), 200
    except Exception as e:
        print(f"Error in edit_username: {e}")
        return jsonify({'message': f'Internal server error: {e}'}), 500

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

@api.route('/', methods=['GET'])
def test():
    """ Test message to ensure the API is working """
    return jsonify({'message': 'Hello, World!'}), 200
