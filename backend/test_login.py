# backend/test_login.py
from app import create_app, db
from app.models import User
import json

app = create_app()

def test_login():
    print("\n=== Testing Login System ===")
    
    with app.app_context():
        # Get a chef and normal user for testing
        chef = User.query.filter_by(role='chef').first()
        normal_user = User.query.filter_by(role='normal').first()
        
        if chef:
            print("\nChef Login Details:")
            print(f"Email: {chef.email}")
            print(f"Role: {chef.role}")
            print("\nTest this login in your frontend!")
        
        if normal_user:
            print("\nNormal User Login Details:")
            print(f"Email: {normal_user.email}")
            print(f"Role: {normal_user.role}")
            print("\nTest this login in your frontend!")
        
        print("\nTo test login in frontend:")
        print("1. Start your React app (npm start)")
        print("2. Go to login page")
        print("3. Use the email addresses above")
        print("4. Password should match what was set in the database")

if __name__ == '__main__':
    test_login()