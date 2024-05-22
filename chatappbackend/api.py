"""  API for the chat application """
from flask_cors import CORS
from flask import Flask, jsonify, request
from models import db, User
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:password@db/chat_app'
db.init_app(app)

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """ Get a user by ID """
    user = User.query.get(user_id)
    if user is None:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'created_at': user.created_at
    }), 200

@app.route('/api/login', methods=['POST'])
def login():
    """ Log in a user """
    # Parse the JSON request
    data = request.get_json()

    # Get the username and password from the request
    username = data.get('username')
    password = data.get('password')

    # Find the user in the database
    user = User.query.filter_by(username=username).first()

    # If the user doesn't exist or the password is wrong, return an error
    if user is None or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid username or password'}), 401

    # If the username and password are correct, return data and 200 response
    return jsonify({
        'message': 'Logged in successfully',
        'username': user.username,
        'email': user.email,
        'date_joined': user.created_at
    }), 200

@app.route('/api/register', methods=['POST'])
def register():
    """ Register a new user """
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
        return jsonify({'message': 'Username/Email already taken'}), 400

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
        'date_joined': user.created_at
    }), 200

@app.route('/api', methods=['GET'])
def test():
    """ Test message to ensure the API is working """
    return jsonify({'message': 'Hello, World!'}), 200

@app.errorhandler(404)
def page_not_found(error):
    """ Handle 404 errors """
    return jsonify({
        'message': (
            error.description or
            'The requested URL was not found on the server. '
            'If you entered the URL manually please check your spelling and try again.'
        )
    }), 404

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
