# app/models/notification.py
from app import db
from datetime import datetime

class Notification(db.Model):
    __tablename__ = 'notifications'
    
    notification_id = db.Column(db.Integer, primary_key=True)
    chef_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    type = db.Column(db.Enum('like', 'rating', name='notification_types'), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.recipe_id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    chef = db.relationship('User', foreign_keys=[chef_id], 
                         backref=db.backref('received_notifications', lazy='dynamic'))
    user = db.relationship('User', foreign_keys=[user_id],
                         backref=db.backref('sent_notifications', lazy='dynamic'))
    recipe = db.relationship('Recipe',
                          backref=db.backref('notifications', lazy='dynamic'))

    def to_dict(self):
        return {
            'notification_id': self.notification_id,
            'chef_id': self.chef_id,
            'message': self.message,
            'type': self.type,
            'recipe_id': self.recipe_id,
            'user_id': self.user_id,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'recipe_name': self.recipe.recipe_name if self.recipe else None,
            'user_name': self.user.username if self.user else None
        }