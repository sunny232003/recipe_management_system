import os
from app import create_app, db
from app.models import User
from sqlalchemy import text

app = create_app()

def check_system():
    print("\n=== System Check ===")
    
    # 1. Directory Structure Check
    print("\n1. Checking Directory Structure...")
    required_directories = [
        'app',
        'app/models',
        'app/routes',
        'app/utils',
        'venv'
    ]
    
    for directory in required_directories:
        if os.path.exists(directory):
            print(f"✅ Found {directory}")
        else:
            print(f"❌ Missing {directory}")

    # 2. Database Check
    print("\n2. Checking Database Connection...")
    with app.app_context():
        try:
            db.session.execute(text('SELECT 1'))
            print("✅ Database connection successful")
            
            # Check tables
            result = db.session.execute(text('SHOW TABLES'))
            tables = [row[0] for row in result]
            print(f"✅ Found tables: {', '.join(tables)}")
            
            # Check users
            users = User.query.all()
            print(f"✅ Found {len(users)} users")
            
            # Print available logins
            chef = User.query.filter_by(role='chef').first()
            normal = User.query.filter_by(role='normal').first()
            
            print("\n3. Available Login Credentials:")
            if chef:
                print("\nChef Login:")
                print(f"Email: {chef.email}")
                print("Password: test")
            
            if normal:
                print("\nNormal User Login:")
                print(f"Email: {normal.email}")
                print("Password: test")
            
        except Exception as e:
            print(f"❌ Database error: {str(e)}")

if __name__ == '__main__':
    check_system()