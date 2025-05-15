from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app, resources={
        r"/api/*": {
            "origins": "http://localhost:3000",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    db.init_app(app)
    
    from .routes import recipe_routes, user_routes, auth_routes
    
    # Register blueprints with unique names
    app.register_blueprint(auth_routes.bp, name='auth_blueprint')
    app.register_blueprint(recipe_routes.bp, name='recipe_blueprint')
    app.register_blueprint(user_routes.bp, name='user_blueprint')
    
    return app