# backend/app/models/recipe_ingredient.py
from app import db
from sqlalchemy import DECIMAL

class RecipeIngredient(db.Model):
    __tablename__ = 'recipe_ingredients'
    
    recipe_id = db.Column(
        db.Integer, 
        db.ForeignKey('recipes.recipe_id', ondelete='CASCADE'),
        primary_key=True
    )
    ingredient_id = db.Column(
        db.Integer, 
        db.ForeignKey('ingredients.ingredient_id'),
        primary_key=True
    )
    amount_in_grams = db.Column(DECIMAL(8,2), nullable=False)

    # Relationships
    ingredient = db.relationship('Ingredient', lazy='joined')
    recipe = db.relationship('Recipe', lazy='joined')

    def to_dict(self):
        return {
            'recipe_id': self.recipe_id,
            'ingredient_id': self.ingredient_id,
            'amount_in_grams': float(self.amount_in_grams) if self.amount_in_grams else 0
        }