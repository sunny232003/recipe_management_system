# backend/check_config.py
from app import create_app, db
from app.models import User
from sqlalchemy import text
import os

app = create_app()

def check_configuration():
    print("\n=== Configuration Check ===")
    print("\n1. Environment Variables:")
    print(f"DATABASE_URL: {os.getenv('DATABASE_URL')}")
    print(f"FLASK_APP: {os.getenv('FLASK_APP')}")
    print(f"FLASK_ENV: {os.getenv('FLASK_ENV')}")

    print("\n2. Database Configuration:")
    print(f"URI: {app.config['SQLALCHEMY_DATABASE_URI']}")
    print(f"Track Modifications: {app.config['SQLALCHEMY_TRACK_MODIFICATIONS']}")

    print("\n3. Database Connection Test:")
    with app.app_context():
        try:
            # Test connection
            db.session.execute(text('SELECT 1'))
            print("✅ Database connection successful!")

            # Check users
            users = User.query.all()
            print(f"✅ Found {len(users)} users in database")

            print("\nSample Users:")
            for user in users[:3]:  # Show first 3 users
                print(f"- {user.username} ({user.role})")

            # Check tables
            result = db.session.execute(text('SHOW TABLES'))
            tables = [row[0] for row in result]
            print(f"\nDatabase Tables ({len(tables)}):")
            for table in tables:
                print(f"- {table}")

        except Exception as e:
            print("❌ Database error:", str(e))

    print("\n4. Available Credentials:")
    try:
        with app.app_context():
            chef = User.query.filter_by(role='chef').first()
            normal_user = User.query.filter_by(role='normal').first()
            
            if chef:
                print("\nChef User:")
                print(f"Username: {chef.username}")
                print(f"Email: {chef.email}")
                
            if normal_user:
                print("\nNormal User:")
                print(f"Username: {normal_user.username}")
                print(f"Email: {normal_user.email}")
    except Exception as e:
        print("❌ Error fetching users:", str(e))

if __name__ == '__main__':
    check_configuration()