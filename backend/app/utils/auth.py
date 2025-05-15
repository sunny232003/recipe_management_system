from functools import wraps
from flask import request, jsonify
import jwt
from app.models import User
from config import Config

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check if token is in headers
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return jsonify({
                    'message': 'Invalid token format!',
                    'error': 'Unauthorized'
                }), 401

        if not token:
            return jsonify({
                'message': 'Token is missing!',
                'error': 'Unauthorized'
            }), 401

        try:
            # Decode token
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.filter_by(user_id=data['user_id']).first()
            
            if not current_user:
                return jsonify({
                    'message': 'User not found!',
                    'error': 'Unauthorized'
                }), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({
                'message': 'Token has expired!',
                'error': 'Unauthorized'
            }), 401
        except jwt.InvalidTokenError:
            return jsonify({
                'message': 'Invalid token!',
                'error': 'Unauthorized'
            }), 401

        # Pass user to route
        return f(current_user, *args, **kwargs)

    return decorated

def admin_required(f):
    @wraps(f)
    @token_required
    def decorated(current_user, *args, **kwargs):
        if not current_user.role == 'admin':
            return jsonify({
                'message': 'Admin privileges required!',
                'error': 'Forbidden'
            }), 403
        return f(current_user, *args, **kwargs)
    return decorated

def chef_required(f):
    @wraps(f)
    @token_required
    def decorated(current_user, *args, **kwargs):
        if not current_user.role == 'chef':
            return jsonify({
                'message': 'Chef privileges required!',
                'error': 'Forbidden'
            }), 403
        return f(current_user, *args, **kwargs)
    return decorated

# Additional utility functions
def generate_token(user, expires_in=24):
    from datetime import datetime, timedelta
    
    token = jwt.encode({
        'user_id': user.user_id,
        'role': user.role,
        'exp': datetime.utcnow() + timedelta(hours=expires_in)
    }, Config.SECRET_KEY)
    
    return token

def verify_token(token):
    try:
        data = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
        return User.query.filter_by(user_id=data['user_id']).first()
    except:
        return None