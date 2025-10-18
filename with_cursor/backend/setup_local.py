#!/usr/bin/env python3
"""
Local development setup script for Temple Management Backend
"""

import os
import subprocess
import sys

def create_env_file():
    """Create .env file for local development"""
    env_content = """# Django Settings
DEBUG=True
SECRET_KEY=django-insecure-local-development-key-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Settings
DB_HOST=localhost
DB_PORT=5432
DB_NAME=temple_db
DB_USER=temple_user
DB_PASSWORD=temple_password

# Redis Settings
REDIS_URL=redis://localhost:6379/0

# Email Settings (for development)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend

# Google OAuth Settings (you'll need to set these up)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Payment Gateway Settings (you'll need to set these up)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
"""
    
    env_file = '.env'
    if not os.path.exists(env_file):
        with open(env_file, 'w') as f:
            f.write(env_content)
        print(f"✅ Created {env_file}")
    else:
        print(f"⚠️  {env_file} already exists")

def install_dependencies():
    """Install Python dependencies"""
    print("📦 Installing Python dependencies...")
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], check=True)
        print("✅ Dependencies installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False
    return True

def run_migrations():
    """Run Django migrations"""
    print("🗄️  Running database migrations...")
    try:
        subprocess.run([sys.executable, 'manage.py', 'makemigrations'], check=True)
        subprocess.run([sys.executable, 'manage.py', 'migrate'], check=True)
        print("✅ Migrations completed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to run migrations: {e}")
        return False
    return True

def create_superuser():
    """Create a superuser"""
    print("👤 Creating superuser...")
    try:
        subprocess.run([sys.executable, 'manage.py', 'createsuperuser'], check=True)
        print("✅ Superuser created successfully")
    except subprocess.CalledProcessError as e:
        print(f"⚠️  Superuser creation failed or was cancelled: {e}")

def main():
    print("🚀 Setting up Temple Management Backend for local development...")
    print()
    
    # Check if virtual environment is activated
    if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("⚠️  Warning: It looks like you're not in a virtual environment.")
        print("   Consider creating one: python -m venv venv && source venv/bin/activate")
        print()
    
    # Create .env file
    create_env_file()
    print()
    
    # Install dependencies
    if not install_dependencies():
        return
    print()
    
    # Run migrations
    if not run_migrations():
        return
    print()
    
    # Create superuser
    create_superuser()
    print()
    
    print("🎉 Setup completed!")
    print()
    print("Next steps:")
    print("1. Update the .env file with your actual API keys")
    print("2. Run the development server: python manage.py runserver")
    print("3. Access the admin panel at: http://localhost:8000/admin")
    print("4. Access the API at: http://localhost:8000/api/")

if __name__ == '__main__':
    main()
