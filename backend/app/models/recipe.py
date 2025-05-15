from app import db
from datetime import datetime
from sqlalchemy import DECIMAL
class Recipe(db.Model):
    __tablename__ = 'recipes'
    
    recipe_id = db.Column(db.Integer, primary_key=True)
    chef_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    recipe_name = db.Column(db.String(255), nullable=False)
    cuisine_type = db.Column(db.String(50))
    meal_type = db.Column(db.String(50))
    cooking_instructions = db.Column(db.Text, nullable=False)
    preparation_time = db.Column(db.Integer)
    serving_size = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    ingredients = db.relationship(
        'RecipeIngredient',
        cascade='all, delete-orphan',
        lazy='joined'
    )

    def to_dict(self):
        return {
            'recipe_id': self.recipe_id,
            'chef_id': self.chef_id,
            'recipe_name': self.recipe_name,
            'cuisine_type': self.cuisine_type,
            'meal_type': self.meal_type,
            'cooking_instructions': self.cooking_instructions,
            'preparation_time': self.preparation_time,
            'serving_size': self.serving_size,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
