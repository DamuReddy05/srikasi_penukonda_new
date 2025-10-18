#!/usr/bin/env python3
"""
Script to create an admin user for the Temple Management System
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
from django.core.management import execute_from_command_line

User = get_user_model()

def create_admin_user():
    """Create an admin user if it doesn't exist"""
    
    # Admin user details
    admin_email = 'admin@temple.com'
    admin_username = 'admin'
    admin_password = 'admin123'
    admin_first_name = 'Temple'
    admin_last_name = 'Administrator'
    
    try:
        # Check if admin user already exists
        if User.objects.filter(email=admin_email).exists():
            print(f"Admin user with email {admin_email} already exists!")
            return
        
        # Create admin user
        admin_user = User.objects.create_user(
            username=admin_username,
            email=admin_email,
            password=admin_password,
            first_name=admin_first_name,
            last_name=admin_last_name,
            user_type='admin',
            is_staff=True,
            is_superuser=True
        )
        
        print("✅ Admin user created successfully!")
        print(f"Email: {admin_email}")
        print(f"Username: {admin_username}")
        print(f"Password: {admin_password}")
        print(f"User Type: {admin_user.user_type}")
        print("\nYou can now use these credentials to login to the admin panel.")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")

def create_devotee_user():
    """Create a sample devotee user for testing"""
    
    devotee_email = 'devotee@temple.com'
    devotee_username = 'devotee'
    devotee_password = 'devotee123'
    devotee_first_name = 'Sample'
    devotee_last_name = 'Devotee'
    
    try:
        # Check if devotee user already exists
        if User.objects.filter(email=devotee_email).exists():
            print(f"Devotee user with email {devotee_email} already exists!")
            return
        
        # Create devotee user
        devotee_user = User.objects.create_user(
            username=devotee_username,
            email=devotee_email,
            password=devotee_password,
            first_name=devotee_first_name,
            last_name=devotee_last_name,
            user_type='devotee',
            phone_number='9876543210',
            address='Sample Address, Penukonda'
        )
        
        print("✅ Devotee user created successfully!")
        print(f"Email: {devotee_email}")
        print(f"Username: {devotee_username}")
        print(f"Password: {devotee_password}")
        print(f"User Type: {devotee_user.user_type}")
        
    except Exception as e:
        print(f"❌ Error creating devotee user: {e}")

if __name__ == '__main__':
    print("🏛️ Temple Management System - User Creation Script")
    print("=" * 50)
    
    # Create admin user
    print("\n1. Creating Admin User...")
    create_admin_user()
    
    # Create devotee user
    print("\n2. Creating Sample Devotee User...")
    create_devotee_user()
    
    print("\n" + "=" * 50)
    print("✅ User creation completed!")
    print("\nYou can now test the application with these credentials:")
    print("\nAdmin Login:")
    print("- Email: admin@temple.com")
    print("- Password: admin123")
    print("\nDevotee Login:")
    print("- Email: devotee@temple.com")
    print("- Password: devotee123")
