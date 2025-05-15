from flask import Blueprint, jsonify
from app.models.user import User
from app.utils.auth import token_required

# Change the blueprint name to be unique
bp = Blueprint('user_bp', __name__, url_prefix='/api/users')

@bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify(current_user.to_dict())