from app import db
from datetime import datetime
from sqlalchemy import DECIMAL

class Feedback(db.Model):
    __tablename__ = 'feedback'
    
    feedback_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.recipe_id'), nullable=False)
    rating = db.Column(DECIMAL(2,1), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', backref=db.backref('feedback', lazy=True))
    recipe = db.relationship('Recipe', backref=db.backref('feedback', lazy=True))

    def to_dict(self):
        return {
            'feedback_id': self.feedback_id,
            'user_id': self.user_id,
            'recipe_id': self.recipe_id,
            'rating': float(self.rating) if self.rating else None,
            'created_at': self.created_at.isoformat()
        }