"""
blueprints.py
-----------------------------
This module registers all the blueprints for the application.
"""
from auth_routes import auth_bp
from user_profile_routes import user_profile_bp
from user_routes import user_bp
from follow_routes import follow_bp
from search_routes import search_bp
from settings_routes import settings_bp

def register_blueprints(app_obj=None):
    """ Register all blueprints for the application """
    app_obj.register_blueprint(auth_bp, url_prefix='/api')
    app_obj.register_blueprint(user_profile_bp, url_prefix='/api')
    app_obj.register_blueprint(user_bp, url_prefix='/api')
    app_obj.register_blueprint(follow_bp, url_prefix='/api/users')
    app_obj.register_blueprint(search_bp, url_prefix='/api/users')
    app_obj.register_blueprint(settings_bp, url_prefix='/api/users')
