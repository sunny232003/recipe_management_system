from app import create_app, db
from app.models import User

app = create_app()

def reset_all_passwords():
    with app.app_context():
        try:
            # Get all users
            users = User.query.all()
            
            print("\n=== Resetting All User Passwords ===")
            print(f"\nFound {len(users)} users to update")
            print("\nUpdated User Credentials:")
            print("-" * 50)
            
            # Reset each user's password
            for user in users:
                user.set_password('test')
                print(f"\nUsername: {user.username}")
                print(f"Email: {user.email}")
                print(f"Role: {user.role}")
                print(f"Password: test")
                print("-" * 30)
            
            # Commit the changes
            db.session.commit()
            print("\n✅ All passwords have been reset to 'test'")
            
            # Print summary for easy reference
            print("\n=== Quick Reference ===")
            print("\nChef Users:")
            for user in users:
                if user.role == 'chef':
                    print(f"Email: {user.email} | Password: test")
            
            print("\nNormal Users:")
            for user in users:
                if user.role == 'normal':
                    print(f"Email: {user.email} | Password: test")
            
            print("\n✅ You can now log in with any of these emails and password 'test'")
            
        except Exception as e:
            print(f"\n❌ Error resetting passwords: {str(e)}")
            db.session.rollback()

if __name__ == '__main__':
    reset_all_passwords()