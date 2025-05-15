# app/routes/notification_routes.py

from flask import Blueprint, jsonify
from app import db
from app.utils.auth import token_required
from sqlalchemy import text

bp = Blueprint('notification_bp', __name__, url_prefix='/api/notifications')

@bp.route('', methods=['GET'])
@token_required
def get_notifications(current_user):
    try:
        print(f"Fetching notifications for chef_id: {current_user.user_id}")  # Debug log
        
        if current_user.role != 'chef':
            return jsonify({
                'message': 'Only chefs can access notifications'
            }), 403

        # First verify if there are any notifications
        count = db.session.execute(text("""
            SELECT COUNT(*) as count FROM notifications 
            WHERE chef_id = :chef_id
        """), {
            'chef_id': current_user.user_id
        }).scalar()
        
        print(f"Found {count} notifications")  # Debug log

        notifications = db.session.execute(text("""
            SELECT 
                n.notification_id,
                n.message,
                n.type,
                n.recipe_id,
                n.user_id,
                n.is_read,
                n.created_at,
                u.username as user_name,
                r.recipe_name
            FROM notifications n
            JOIN users u ON n.user_id = u.user_id
            JOIN recipes r ON n.recipe_id = r.recipe_id
            WHERE n.chef_id = :chef_id
            ORDER BY n.created_at DESC
        """), {
            'chef_id': current_user.user_id
        }).fetchall()

        result = [{
            'notification_id': n.notification_id,
            'message': n.message,
            'type': n.type,
            'recipe_id': n.recipe_id,
            'user_name': n.user_name,
            'recipe_name': n.recipe_name,
            'is_read': bool(n.is_read),
            'created_at': n.created_at.isoformat()
        } for n in notifications]

        print(f"Returning {len(result)} notifications")  # Debug log
        return jsonify(result)

    except Exception as e:
        print(f"Error fetching notifications: {str(e)}")
        return jsonify({
            'message': 'Error fetching notifications',
            'error': str(e)
        }), 500

@bp.route('/<int:notification_id>/read', methods=['POST'])
@token_required
def mark_as_read(current_user, notification_id):
    try:
        if current_user.role != 'chef':
            return jsonify({
                'message': 'Only chefs can access notifications'
            }), 403

        result = db.session.execute(text("""
            UPDATE notifications 
            SET is_read = TRUE 
            WHERE notification_id = :nid AND chef_id = :chef_id
            RETURNING notification_id
        """), {
            'nid': notification_id,
            'chef_id': current_user.user_id
        }).first()

        if not result:
            return jsonify({
                'message': 'Notification not found'
            }), 404
        
        db.session.commit()

        return jsonify({
            'message': 'Notification marked as read'
        })

    except Exception as e:
        print(f"Error marking notification as read: {str(e)}")
        db.session.rollback()
        return jsonify({
            'message': 'Error marking notification as read',
            'error': str(e)
        }), 500

@bp.route('/test', methods=['POST'])
@token_required
def create_test_notification(current_user):
    """Endpoint to create a test notification"""
    try:
        if current_user.role != 'chef':
            return jsonify({
                'message': 'Only chefs can create test notifications'
            }), 403

        # Create a test notification
        db.session.execute(text("""
            INSERT INTO notifications (
                chef_id,
                message,
                type,
                recipe_id,
                user_id,
                is_read
            ) VALUES (
                :chef_id,
                'This is a test notification',
                'like',
                (SELECT recipe_id FROM recipes WHERE chef_id = :chef_id LIMIT 1),
                :user_id,
                FALSE
            )
        """), {
            'chef_id': current_user.user_id,
            'user_id': current_user.user_id
        })

        db.session.commit()

        return jsonify({
            'message': 'Test notification created'
        })

    except Exception as e:
        print(f"Error creating test notification: {str(e)}")
        db.session.rollback()
        return jsonify({
            'message': 'Error creating test notification',
            'error': str(e)
        }), 500