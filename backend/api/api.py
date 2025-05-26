"""  API for the application """
import os
import logging
from dotenv import load_dotenv
from blueprints import register_blueprints
from flask_cors import CORS
from flask import Flask, jsonify
from models import db
from flask_jwt_extended import JWTManager
from logger_config import setup_logger

setup_logger()
logger = logging.getLogger(__name__)
logger.info("Starting the Flask application...")

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')  # Add a secret key for JWT
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
db.init_app(app)
jwt = JWTManager(app)

register_blueprints(app)

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
