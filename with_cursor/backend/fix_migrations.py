#!/usr/bin/env python3
"""
Script to fix migration issues in the Temple Management System
"""

import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'temple_management.settings')
django.setup()

from django.core.management import execute_from_command_line
from django.db import connection

def fix_migrations():
    """Fix migration issues by ensuring proper order"""
    
    print("🔧 Fixing Migration Issues...")
    print("=" * 40)
    
    try:
        # First, make sure users app migrations exist
        print("1. Creating users app migrations...")
        execute_from_command_line(['manage.py', 'makemigrations', 'users'])
        
        # Apply users migrations first
        print("2. Applying users migrations...")
        execute_from_command_line(['manage.py', 'migrate', 'users'])
        
        # Then apply all other migrations
        print("3. Applying all other migrations...")
        execute_from_command_line(['manage.py', 'migrate'])
        
        print("✅ Migrations completed successfully!")
        
        # Create admin users
        print("\n4. Creating admin users...")
        execute_from_command_line(['manage.py', 'runscript', 'create_admin'])
        
    except Exception as e:
        print(f"❌ Error during migration fix: {e}")
        print("\nTrying alternative approach...")
        
        try:
            # Try to reset migrations
            print("Attempting to reset and recreate migrations...")
            
            # Drop and recreate database tables
            with connection.cursor() as cursor:
                cursor.execute("DROP SCHEMA public CASCADE;")
                cursor.execute("CREATE SCHEMA public;")
                cursor.execute("GRANT ALL ON SCHEMA public TO postgres;")
                cursor.execute("GRANT ALL ON SCHEMA public TO public;")
            
            print("Database reset completed. Now applying migrations...")
            
            # Apply migrations in correct order
            execute_from_command_line(['manage.py', 'makemigrations'])
            execute_from_command_line(['manage.py', 'migrate'])
            
            print("✅ Database reset and migrations completed!")
            
        except Exception as e2:
            print(f"❌ Alternative approach also failed: {e2}")
            print("\nManual intervention required. Please:")
            print("1. Stop all containers")
            print("2. Remove the postgres volume")
            print("3. Restart containers")
            print("4. Run: python manage.py migrate")
            print("5. Run: python create_admin.py")

if __name__ == '__main__':
    fix_migrations()
