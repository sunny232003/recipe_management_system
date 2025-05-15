# backend/app/routes/recipe_routes.py
from flask import Blueprint, request, jsonify
from app import db
from app.models import Recipe, Ingredient, RecipeIngredient, Like, Feedback
from app.utils.auth import token_required
from decimal import Decimal
from sqlalchemy import text

bp = Blueprint('recipe_bp', __name__, url_prefix='/api/recipes')

@bp.route('', methods=['POST'])
@token_required
def create_recipe(current_user):
    if current_user.role != 'chef':
        return jsonify({'message': 'Not authorized'}), 403
        
    try:
        data = request.get_json()
        print("Received recipe data:", data)  # Debug log
        
        # Validate required fields
        required_fields = ['recipe_name', 'meal_type', 'cooking_instructions']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'message': f'Missing required field: {field}'
                }), 400

        # Create recipe
        recipe = Recipe(
            chef_id=current_user.user_id,
            recipe_name=data['recipe_name'],
            cuisine_type=data['cuisine_type'],
            meal_type=data['meal_type'],
            cooking_instructions=data['cooking_instructions'],
            preparation_time=data['preparation_time'],
            serving_size=data['serving_size']
        )
        
        print("Created recipe object:", recipe)  # Debug log
        
        db.session.add(recipe)
        db.session.flush()
        
        # Handle ingredients
        for ing_data in data['ingredients']:
            # Convert empty strings or None to 0 for nutritional values
            calories = float(ing_data.get('calories_per_100g', 0) or 0)
            proteins = float(ing_data.get('proteins_per_100g', 0) or 0)
            fats = float(ing_data.get('fats_per_100g', 0) or 0)
            carbs = float(ing_data.get('carbs_per_100g', 0) or 0)
            
            # Check if ingredient exists
            ingredient = Ingredient.query.filter_by(name=ing_data['name'].lower().strip()).first()
            
            if not ingredient:
                # Create new ingredient
                ingredient = Ingredient(
                    name=ing_data['name'].lower().strip(),
                    calories_per_100g=calories,
                    proteins_per_100g=proteins,
                    fats_per_100g=fats,
                    carbs_per_100g=carbs
                )
                db.session.add(ingredient)
                db.session.flush()
            
            # Create recipe-ingredient relationship
            amount = float(ing_data.get('amount_in_grams', 0) or 0)
            recipe_ingredient = RecipeIngredient(
                recipe_id=recipe.recipe_id,
                ingredient_id=ingredient.ingredient_id,
                amount_in_grams=amount
            )
            db.session.add(recipe_ingredient)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Recipe created successfully',
            'recipe_id': recipe.recipe_id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error creating recipe: {str(e)}")
        return jsonify({
            'message': 'Failed to create recipe',
            'error': str(e)
        }), 500

@bp.route('', methods=['GET'])
def get_recipes():
    try:
        recipes = Recipe.query.all()
        return jsonify([{
            'recipe_id': recipe.recipe_id,
            'recipe_name': recipe.recipe_name,
            'cuisine_type': recipe.cuisine_type,
            'meal_type': recipe.meal_type,
            'preparation_time': recipe.preparation_time,
            'serving_size': recipe.serving_size
        } for recipe in recipes])
    except Exception as e:
        print(f"Error fetching recipes: {str(e)}")
        return jsonify({'message': 'Error fetching recipes'}), 500

@bp.route('/search', methods=['GET'])
def search_recipes():
    try:
        # Get search parameters
        name = request.args.get('name', '')
        ingredient = request.args.get('ingredient', '')
        cuisine_type = request.args.get('cuisine_type', '')
        meal_type = request.args.get('meal_type', '')
        preparation_time = request.args.get('preparation_time', '')

        # Start with base query
        query = Recipe.query

        # Apply filters
        if name:
            query = query.filter(Recipe.recipe_name.ilike(f'%{name}%'))
        
        if cuisine_type:
            query = query.filter(Recipe.cuisine_type == cuisine_type)
            
        if meal_type:
            query = query.filter(Recipe.meal_type == meal_type)
            
        if preparation_time:
            query = query.filter(Recipe.preparation_time <= int(preparation_time))
            
        if ingredient:
            query = query.join(RecipeIngredient).join(Ingredient).filter(
                Ingredient.name.ilike(f'%{ingredient}%')
            )

        # Execute query
        recipes = query.all()
        
        # Convert to JSON
        result = [{
            'recipe_id': recipe.recipe_id,
            'recipe_name': recipe.recipe_name,
            'cuisine_type': recipe.cuisine_type,
            'meal_type': recipe.meal_type,
            'preparation_time': recipe.preparation_time,
            'serving_size': recipe.serving_size
        } for recipe in recipes]

        return jsonify(result)

    except Exception as e:
        print(f"Search error: {str(e)}")
        return jsonify({
            'message': 'Error searching recipes',
            'error': str(e)
        }), 500

# backend/app/routes/recipe_routes.py
@bp.route('/chef/<int:chef_id>', methods=['GET'])
@token_required
def get_chef_recipes(current_user, chef_id):
    if current_user.user_id != chef_id:
        return jsonify({'message': 'Not authorized'}), 403
        
    try:
        recipes = Recipe.query.filter_by(chef_id=chef_id).all()
        return jsonify([recipe.to_dict() for recipe in recipes])
    except Exception as e:
        print(f"Error fetching chef recipes: {str(e)}")
        return jsonify({
            'message': 'Error fetching recipes',
            'error': str(e)
        }), 500

@bp.route('/<int:recipe_id>', methods=['DELETE'])
@token_required
def delete_recipe(current_user, recipe_id):
    try:
        recipe = Recipe.query.get_or_404(recipe_id)
        
        if recipe.chef_id != current_user.user_id:
            return jsonify({'message': 'Not authorized to delete this recipe'}), 403
        
        # Get related recipe_ingredients for logging
        related_ingredients = RecipeIngredient.query.filter_by(recipe_id=recipe_id).all()
        print(f"Deleting recipe {recipe_id} with {len(related_ingredients)} ingredients")
        
        try:
            # Delete the recipe (cascade should handle recipe_ingredients)
            db.session.delete(recipe)
            db.session.commit()
            print(f"Successfully deleted recipe {recipe_id}")
            return jsonify({'message': 'Recipe deleted successfully'}), 200
            
        except Exception as e:
            db.session.rollback()
            print(f"Error during deletion: {str(e)}")
            # Try manual deletion if cascade fails
            try:
                # First delete recipe_ingredients
                RecipeIngredient.query.filter_by(recipe_id=recipe_id).delete()
                # Then delete recipe
                Recipe.query.filter_by(recipe_id=recipe_id).delete()
                db.session.commit()
                print(f"Successfully deleted recipe {recipe_id} using manual deletion")
                return jsonify({'message': 'Recipe deleted successfully'}), 200
            except Exception as e2:
                db.session.rollback()
                print(f"Error during manual deletion: {str(e2)}")
                raise e2
                
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting recipe: {str(e)}")
        return jsonify({
            'message': 'Error deleting recipe',
            'error': str(e)
        }), 500

# backend/app/routes/recipe_routes.py
# Add this to your existing recipe_routes.py

from sqlalchemy import text

@bp.route('/<int:recipe_id>/calories', methods=['GET'])
@token_required
def get_recipe_calories(current_user, recipe_id):
    try:
        # Call MySQL function using SQLAlchemy
        result = db.session.execute(
            text('SELECT calculate_recipe_calories(:recipe_id) as calories'),
            {'recipe_id': recipe_id}
        ).first()
        
        calories = float(result[0]) if result[0] else 0
        
        return jsonify({
            'recipe_id': recipe_id,
            'calories_per_100g': calories
        })
        
    except Exception as e:
        print(f"Error calculating calories: {str(e)}")
        return jsonify({
            'message': 'Error calculating calories',
            'error': str(e)
        }), 500

# In recipe_routes.py


@bp.route('/<int:recipe_id>/details', methods=['GET'])
@token_required
def get_recipe_details(current_user, recipe_id):
    try:
        print(f"Fetching details for recipe {recipe_id}")  # Debug log
        
        # Get recipe details with analytics first
        result = db.session.execute(text("""
            SELECT 
                r.*,
                COALESCE(rp.view_count, 0) as view_count,
                COALESCE(rp.like_count, 0) as like_count,
                COALESCE(rp.rating_average, 0) as rating_average
            FROM recipes r
            LEFT JOIN recipe_popularity rp ON r.recipe_id = rp.recipe_id
            WHERE r.recipe_id = :recipe_id
        """), {'recipe_id': recipe_id}).first()
        
        if not result:
            return jsonify({'message': 'Recipe not found'}), 404

        # Get recipe ingredients
        ingredients = db.session.execute(text("""
            SELECT i.name, ri.amount_in_grams
            FROM recipe_ingredients ri
            JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
            WHERE ri.recipe_id = :recipe_id
        """), {'recipe_id': recipe_id}).all()

        # Single atomic update for view count
        db.session.execute(text("""
            INSERT INTO recipe_analytics (recipe_id, view_count)
            VALUES (:recipe_id, 1)
            ON DUPLICATE KEY UPDATE view_count = LAST_INSERT_ID(view_count + 1)
        """), {'recipe_id': recipe_id})

        view_count = db.session.execute(text("""
            SELECT LAST_INSERT_ID() as new_count
        """)).first().new_count

        print(f"Updated view count to {view_count}")  # Debug log

        db.session.commit()

        recipe_data = {
            'recipe_id': result.recipe_id,
            'recipe_name': result.recipe_name,
            'cuisine_type': result.cuisine_type,
            'meal_type': result.meal_type,
            'cooking_instructions': result.cooking_instructions,
            'preparation_time': result.preparation_time,
            'serving_size': result.serving_size,
            'view_count': view_count,
            'like_count': result.like_count,
            'rating_average': float(result.rating_average) if result.rating_average else 0,
            'ingredients': [{
                'name': ing.name,
                'amount_in_grams': float(ing.amount_in_grams)
            } for ing in ingredients]
        }

        return jsonify(recipe_data)
        
    except Exception as e:
        print(f"Error fetching recipe details: {str(e)}")
        db.session.rollback()
        return jsonify({
            'message': 'Error fetching recipe details',
            'error': str(e)
        }), 500

@bp.route('/<int:recipe_id>/like', methods=['POST'])
@token_required
def toggle_like(current_user, recipe_id):
    try:
        # Single query to check existence
        existing = db.session.execute(text(
            "SELECT 1 FROM likes WHERE user_id = :uid AND recipe_id = :rid"
        ), {
            'uid': current_user.user_id,
            'rid': recipe_id
        }).first()

        if existing:
            # Delete if exists
            db.session.execute(text(
                "DELETE FROM likes WHERE user_id = :uid AND recipe_id = :rid"
            ), {
                'uid': current_user.user_id,
                'rid': recipe_id
            })
            action = 'unliked'
        else:
            # Insert if doesn't exist
            db.session.execute(text(
                "INSERT INTO likes (user_id, recipe_id) VALUES (:uid, :rid)"
            ), {
                'uid': current_user.user_id,
                'rid': recipe_id
            })
            action = 'liked'

        db.session.commit()

        # Get current count
        count = db.session.execute(text(
            "SELECT COUNT(*) as cnt FROM likes WHERE recipe_id = :rid"
        ), {
            'rid': recipe_id
        }).scalar()

        return jsonify({
            'message': f'Recipe {action} successfully',
            'liked': action == 'liked',
            'like_count': count
        })

    except Exception as e:
        print(f"Error in toggle_like: {str(e)}")
        db.session.rollback()
        return jsonify({
            'message': 'Error processing like',
            'error': str(e)
        }), 500

@bp.route('/<int:recipe_id>/rate', methods=['POST'])
@token_required
def rate_recipe(current_user, recipe_id):
    try:
        data = request.get_json()
        rating = data.get('rating')

        if not rating or not isinstance(rating, (int, float)) or rating < 1 or rating > 5:
            return jsonify({
                'message': 'Invalid rating. Must be between 1 and 5'
            }), 400

        # Check if user already rated this recipe
        existing_rating = db.session.execute(text("""
            SELECT feedback_id 
            FROM feedback 
            WHERE user_id = :user_id AND recipe_id = :recipe_id
        """), {
            'user_id': current_user.user_id,
            'recipe_id': recipe_id
        }).first()

        if existing_rating:
            # Update existing rating
            db.session.execute(text("""
                UPDATE feedback 
                SET rating = :rating 
                WHERE feedback_id = :feedback_id
            """), {
                'rating': rating,
                'feedback_id': existing_rating.feedback_id
            })
            message = 'Rating updated successfully'
        else:
            # Insert new rating
            db.session.execute(text("""
                INSERT INTO feedback (user_id, recipe_id, rating) 
                VALUES (:user_id, :recipe_id, :rating)
            """), {
                'user_id': current_user.user_id,
                'recipe_id': recipe_id,
                'rating': rating
            })
            message = 'Rating added successfully'

        db.session.commit()

        # Get updated rating average from recipe_popularity
        result = db.session.execute(text("""
            SELECT rating_average 
            FROM recipe_popularity 
            WHERE recipe_id = :recipe_id
        """), {
            'recipe_id': recipe_id
        }).first()

        return jsonify({
            'message': message,
            'rating_average': float(result.rating_average) if result and result.rating_average else 0
        })

    except Exception as e:
        print(f"Error rating recipe: {str(e)}")
        db.session.rollback()
        return jsonify({
            'message': 'Error rating recipe',
            'error': str(e)
        }), 500


  

@bp.route('/<int:recipe_id>/user-interaction', methods=['GET'])
@token_required
def get_user_interaction(current_user, recipe_id):
    try:
        # Get user's like status
        like = Like.query.filter_by(
            user_id=current_user.user_id,
            recipe_id=recipe_id
        ).first()

        # Get user's rating
        feedback = Feedback.query.filter_by(
            user_id=current_user.user_id,
            recipe_id=recipe_id
        ).first()

        return jsonify({
            'has_liked': bool(like),
            'rating': feedback.rating if feedback else None
        })

    except Exception as e:
        print(f"Error fetching user interaction: {str(e)}")
        return jsonify({
            'message': 'Error fetching user interaction',
            'error': str(e)
        }), 500