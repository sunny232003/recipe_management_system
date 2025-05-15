# backend/app/models/ingredient.py
from app import db
from sqlalchemy import DECIMAL

class Ingredient(db.Model):
    __tablename__ = 'ingredients'
    
    ingredient_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    calories_per_100g = db.Column(DECIMAL(6,2))
    proteins_per_100g = db.Column(DECIMAL(6,2))
    fats_per_100g = db.Column(DECIMAL(6,2))
    carbs_per_100g = db.Column(DECIMAL(6,2))
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def to_dict(self):
        return {
            'ingredient_id': self.ingredient_id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'calories_per_100g': float(self.calories_per_100g) if self.calories_per_100g else 0,
            'proteins_per_100g': float(self.proteins_per_100g) if self.proteins_per_100g else 0,
            'fats_per_100g': float(self.fats_per_100g) if self.fats_per_100g else 0,
            'carbs_per_100g': float(self.carbs_per_100g) if self.carbs_per_100g else 0
        }