#!/usr/bin/env python3
"""
Script to check admin user data in the database
"""

import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'temple_management.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def check_admin_user():
    """Check admin user data"""
    
    print("🔍 Checking Admin User Data...")
    print("=" * 40)
    
    try:
        # Check if admin user exists
        admin_user = User.objects.filter(email='admin@temple.com').first()
        
        if admin_user:
            print("✅ Admin user found!")
            print(f"   ID: {admin_user.id}")
            print(f"   Username: {admin_user.username}")
            print(f"   Email: {admin_user.email}")
            print(f"   First Name: {admin_user.first_name}")
            print(f"   Last Name: {admin_user.last_name}")
            print(f"   User Type: {admin_user.user_type}")
            print(f"   Is Staff: {admin_user.is_staff}")
            print(f"   Is Superuser: {admin_user.is_superuser}")
            print(f"   Is Active: {admin_user.is_active}")
            print(f"   Date Joined: {admin_user.date_joined}")
            print(f"   Last Login: {admin_user.last_login}")
            
            # Check if user_type is correctly set
            if admin_user.user_type == 'admin':
                print("   ✅ User type is correctly set to 'admin'")
            else:
                print(f"   ❌ User type is '{admin_user.user_type}', should be 'admin'")
                
        else:
            print("❌ Admin user not found!")
            print("   Creating admin user...")
            
            # Create admin user
            admin_user = User.objects.create_user(
                username='admin',
                email='admin@temple.com',
                password='admin123',
                first_name='Temple',
                last_name='Administrator',
                user_type='admin',
                is_staff=True,
                is_superuser=True
            )
            
            print("✅ Admin user created successfully!")
            print(f"   User Type: {admin_user.user_type}")
            
    except Exception as e:
        print(f"❌ Error checking admin user: {e}")

def check_all_users():
    """Check all users in the database"""
    
    print("\n👥 Checking All Users...")
    print("=" * 30)
    
    try:
        users = User.objects.all()
        
        if users:
            print(f"Total users: {users.count()}")
            for user in users:
                print(f"   - {user.email} (Type: {user.user_type})")
        else:
            print("No users found in database")
            
    except Exception as e:
        print(f"❌ Error checking users: {e}")

if __name__ == '__main__':
    check_admin_user()
    check_all_users()

