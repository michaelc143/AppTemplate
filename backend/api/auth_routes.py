import sqlalchemy.exc
from flask import Blueprint, jsonify, request
from models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth_routes', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """ Log in a user """
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'error': 'Missing username or password'}), 400

        user = User.query.filter_by(username=username).first()

        if user is None or not check_password_hash(user.password, password):
            return jsonify({'message': 'Invalid username or password'}), 401

        access_token = create_access_token(identity=user.username)

        return jsonify({
            'message': 'Logged in successfully',
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'bio': user.bio,
            'date_joined': user.created_at,
            'access_token': access_token
        }), 200
    except sqlalchemy.exc.SQLAlchemyError as exception:
        print(f"Error in /login: {exception}")
        return jsonify({'error': f'Internal server error {exception}'}), 500

@auth_bp.route('/register', methods=['POST'])
def register():
    """ Register a new user """
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        bio = data.get('bio')

        user_exists = User.query.filter_by(username=username).first()
        email_exists = User.query.filter_by(email=email).first()

        if user_exists is not None or email_exists is not None:
            return jsonify({'message': 'Username/Email already taken'}), 401

        hashed_password = generate_password_hash(password)
        new_user = User(username=username, password=hashed_password, email=email, bio=bio)
        db.session.add(new_user)
        db.session.commit()

        access_token = create_access_token(identity=new_user.username)

        return jsonify({
            'message': 'Registered successfully',
            'username': new_user.username,
            'email': new_user.email,
            'bio': new_user.bio,
            'date_joined': str(new_user.created_at),
            'access_token': access_token
        }), 200
    except sqlalchemy.exc.SQLAlchemyError as e:
        print(f"SQLAlchemyError in /register: {str(e)}")
        db.session.rollback()
        return jsonify({'message': f'Internal server error: {str(e)}'}), 500
