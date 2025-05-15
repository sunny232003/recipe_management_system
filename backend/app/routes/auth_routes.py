from flask import Blueprint, request, jsonify
from app import db
from app.models import User
from sqlalchemy import text
import jwt
from datetime import datetime, timedelta
from config import Config

bp = Blueprint('auth_bp', __name__, url_prefix='/api/auth')

@bp.route('/system-health', methods=['GET'])
def system_health():
    try:
        db.session.execute(text('SELECT 1'))
        db.session.commit()
        return jsonify({
            'status': 'success',
            'message': 'System is healthy',
            'database': 'connected'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Database connection failed: {str(e)}',
            'database': 'disconnected'
        }), 500

@bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print(f"Login attempt for email: {data.get('email')}")

        if not data or not data.get('email') or not data.get('password'):
            return jsonify({
                'status': 'error',
                'message': 'Missing email or password'
            }), 400

        user = User.query.filter_by(email=data['email']).first()
        print(f"User found: {user is not None}")

        if user and user.check_password(data['password']):
            token = jwt.encode({
                'user_id': user.user_id,
                'role': user.role,
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, Config.SECRET_KEY)

            return jsonify({
                'status': 'success',
                'token': token,
                'user': {
                    'id': user.user_id,
                    'email': user.email,
                    'role': user.role,
                    'username': user.username
                }
            }), 200

        return jsonify({
            'status': 'error',
            'message': 'Invalid email or password'
        }), 401

    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Login failed: {str(e)}'
        }), 500