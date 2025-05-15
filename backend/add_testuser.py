from app import create_app, db
from app.models import User

app = create_app()

def add_test_users():
    with app.app_context():
        # Add chef user
        chef = User.query.filter_by(email='chef@test.com').first()
        if not chef:
            chef = User(
                username='testchef',
                email='chef@test.com',
                role='chef'
            )
            chef.set_password('chef123')  # Password will be 'chef123'
            db.session.add(chef)

        # Add normal user
        user = User.query.filter_by(email='user@test.com').first()
        if not user:
            user = User(
                username='testuser',
                email='user@test.com',
                role='normal'
            )
            user.set_password('user123')  # Password will be 'user123'
            db.session.add(user)

        db.session.commit()
        print("Test users added successfully!")
        
        # Print all users
        print("\nCurrent Users:")
        users = User.query.all()
        for user in users:
            print(f"\nUsername: {user.username}")
            print(f"Email: {user.email}")
            print(f"Role: {user.role}")

if __name__ == '__main__':
    add_test_users()