from app import create_app, db
from app.models import User
from sqlalchemy import text

app = create_app()

def test_database_connection():
    with app.app_context():
        try:
            # Test connection with correct syntax
            db.session.execute(text('SELECT 1'))
            print("✅ Database connection successful!")
            
            # Check users table
            try:
                users_count = User.query.count()
                print(f"✅ Found {users_count} users in database")
                
                # List all users
                print("\nUsers in database:")
                users = User.query.all()
                for user in users:
                    print(f"ID: {user.user_id}")
                    print(f"Username: {user.username}")
                    print(f"Email: {user.email}")
                    print(f"Role: {user.role}")
                    print("-" * 30)
                    
            except Exception as e:
                print("❌ Error accessing users table:", str(e))
            
            # Print database configuration
            print("\nDatabase Configuration:")
            print(f"Database URL: {app.config['SQLALCHEMY_DATABASE_URI']}")
            
        except Exception as e:
            print("❌ Database connection failed!")
            print(f"Error: {str(e)}")
            
            # Additional connection troubleshooting
            print("\nTroubleshooting steps:")
            print("1. Check if MySQL is running")
            print("2. Verify database exists")
            print("3. Check credentials")
            print("\nTry these MySQL commands:")
            print("mysql -u root -puddisuddis")
            print("CREATE DATABASE IF NOT EXISTS dbms_proj;")
            print("USE dbms_proj;")
            print("SHOW TABLES;")

if __name__ == '__main__':
    test_database_connection()