from app import create_app, db
from app.models import User, Recipe, Ingredient, RecipeIngredient

app = create_app()

def init_db():
    with app.app_context():
        # Create all tables
        db.create_all()
        
        '''# Check if admin user exists
        admin = User.query.filter_by(email='admin@example.com').first()
        if not admin:
            # Create admin user
            admin = User(
                username='admin',
                email='admin@example.com',
                role='chef'
            )
            admin.set_password('admin123')
            db.session.add(admin)
            
            # Create test user
            user = User(
                username='test',
                email='test@example.com',
                role='normal'
            )
            user.set_password('test123')
            db.session.add(user)
            
            db.session.commit()
            print("Added admin and test users")
        else:
            print("Admin user already exists")'''

if __name__ == '__main__':
    init_db()