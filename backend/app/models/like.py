from app import db
from datetime import datetime

class Like(db.Model):
    __tablename__ = 'likes'
    
    like_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.recipe_id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', backref=db.backref('likes', lazy=True))
    recipe = db.relationship('Recipe', backref=db.backref('likes', lazy=True))

    def to_dict(self):
        return {
            'like_id': self.like_id,
            'user_id': self.user_id,
            'recipe_id': self.recipe_id,
            'created_at': self.created_at.isoformat()
        }