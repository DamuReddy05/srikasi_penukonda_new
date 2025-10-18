#!/usr/bin/env python3
"""
Setup script for Temple Management System Backend
"""

import os
import sys
import subprocess
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n{description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✓ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def main():
    """Main setup function"""
    print("🚀 Setting up Temple Management System Backend")
    print("=" * 50)
    
    # Check if Python 3.8+ is available
    if sys.version_info < (3, 8):
        print("✗ Python 3.8 or higher is required")
        sys.exit(1)
    
    print(f"✓ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    
    # Create virtual environment
    if not os.path.exists('venv'):
        if not run_command('python -m venv venv', 'Creating virtual environment'):
            sys.exit(1)
    else:
        print("✓ Virtual environment already exists")
    
    # Activate virtual environment and install dependencies
    if os.name == 'nt':  # Windows
        activate_cmd = 'venv\\Scripts\\activate'
        pip_cmd = 'venv\\Scripts\\pip'
    else:  # Unix/Linux/macOS
        activate_cmd = 'source venv/bin/activate'
        pip_cmd = 'venv/bin/pip'
    
    # Install requirements
    if not run_command(f'{pip_cmd} install -r requirements.txt', 'Installing dependencies'):
        sys.exit(1)
    
    # Copy environment file
    if not os.path.exists('.env'):
        if os.path.exists('env.example'):
            run_command('cp env.example .env', 'Creating .env file from template')
            print("⚠️  Please update .env file with your configuration")
        else:
            print("⚠️  env.example not found. Please create .env file manually")
    
    # Run Django migrations
    if not run_command(f'{activate_cmd} && python manage.py makemigrations', 'Creating database migrations'):
        sys.exit(1)
    
    if not run_command(f'{activate_cmd} && python manage.py migrate', 'Applying database migrations'):
        sys.exit(1)
    
    # Create superuser
    print("\n📝 Creating superuser account...")
    print("Please provide the following information:")
    try:
        subprocess.run(f'{activate_cmd} && python manage.py createsuperuser', shell=True)
        print("✓ Superuser created successfully")
    except KeyboardInterrupt:
        print("\n⚠️  Superuser creation cancelled. You can create it later with:")
        print("   python manage.py createsuperuser")
    
    # Collect static files
    if not run_command(f'{activate_cmd} && python manage.py collectstatic --noinput', 'Collecting static files'):
        print("⚠️  Static files collection failed, but setup can continue")
    
    print("\n🎉 Backend setup completed successfully!")
    print("\nNext steps:")
    print("1. Update .env file with your configuration")
    print("2. Start the development server: python manage.py runserver")
    print("3. Access the admin panel at: http://localhost:8000/admin")
    print("4. Access the API documentation at: http://localhost:8000/api/docs/")

if __name__ == '__main__':
    main()
