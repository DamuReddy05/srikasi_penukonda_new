#!/usr/bin/env python3
"""
Script to set up sample seva data for the Temple Management System
"""

import os
import sys
import django
from datetime import date, timedelta

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'temple_management.settings')
django.setup()

from django.contrib.auth import get_user_model
from sevas.models import SevaCategory, Seva, SevaSchedule

User = get_user_model()

def setup_seva_categories():
    """Create sample seva categories"""
    
    print("📂 Creating Seva Categories...")
    
    categories_data = [
        {
            'name': 'Daily Sevas',
            'description': 'Regular daily sevas performed at the temple'
        },
        {
            'name': 'Special Sevas',
            'description': 'Special sevas performed on specific occasions'
        },
        {
            'name': 'Festival Sevas',
            'description': 'Sevas performed during festivals and special days'
        },
        {
            'name': 'Personal Sevas',
            'description': 'Personal sevas for individual devotees'
        }
    ]
    
    for cat_data in categories_data:
        category, created = SevaCategory.objects.get_or_create(
            name=cat_data['name'],
            defaults=cat_data
        )
        if created:
            print(f"   ✅ Created category: {category.name}")
        else:
            print(f"   ℹ️  Category already exists: {category.name}")

def setup_sevas():
    """Create sample sevas"""
    
    print("\n🕉️ Creating Sample Sevas...")
    
    # Get categories
    daily_category = SevaCategory.objects.get(name='Daily Sevas')
    special_category = SevaCategory.objects.get(name='Special Sevas')
    festival_category = SevaCategory.objects.get(name='Festival Sevas')
    personal_category = SevaCategory.objects.get(name='Personal Sevas')
    
    # Get admin user
    admin_user = User.objects.filter(user_type='admin').first()
    
    sevas_data = [
        {
            'name': 'Abhishekam',
            'seva_type': 'pratyaksha',
            'category': daily_category,
            'description': 'Sacred bath of the deity with various substances',
            'how_performed': 'The deity is bathed with milk, honey, ghee, curd, and other sacred substances while chanting mantras',
            'duration': '1 hour',
            'start_time': '06:00:00',
            'end_time': '07:00:00',
            'base_cost': 500.00,
            'currency': 'INR',
            'temple_provides': 'Milk, honey, ghee, curd, sacred water, flowers, incense',
            'devotee_brings': 'Clean white clothes, coconut, fruits (optional)',
            'benefits': 'Purification of mind and body, removal of sins, spiritual upliftment',
            'images': ['abhishekam1.jpg', 'abhishekam2.jpg'],
            'is_active': True,
            'max_participants': 5
        },
        {
            'name': 'Archana',
            'seva_type': 'pratyaksha',
            'category': daily_category,
            'description': 'Recitation of 108 names of the deity',
            'how_performed': 'The priest recites 108 sacred names of the deity while offering flowers',
            'duration': '30 minutes',
            'start_time': '08:00:00',
            'end_time': '08:30:00',
            'base_cost': 200.00,
            'currency': 'INR',
            'temple_provides': 'Flowers, sacred water, incense, prasad',
            'devotee_brings': 'Clean clothes, devotion',
            'benefits': 'Blessings of the deity, fulfillment of desires, spiritual progress',
            'images': ['archana1.jpg'],
            'is_active': True,
            'max_participants': 10
        },
        {
            'name': 'Rudrabhishekam',
            'seva_type': 'paroksha',
            'category': special_category,
            'description': 'Special abhishekam to Lord Shiva with Rudra mantras',
            'how_performed': 'Elaborate abhishekam performed with Rudra mantras and special substances',
            'duration': '2 hours',
            'start_time': '18:00:00',
            'end_time': '20:00:00',
            'base_cost': 1000.00,
            'currency': 'INR',
            'temple_provides': 'All sacred substances, priest services, prasad',
            'devotee_brings': 'Clean clothes, devotion, family members',
            'benefits': 'Removal of all obstacles, health and prosperity, spiritual enlightenment',
            'images': ['rudrabhishekam1.jpg', 'rudrabhishekam2.jpg'],
            'is_active': True,
            'max_participants': 3
        },
        {
            'name': 'Satyanarayana Puja',
            'seva_type': 'pratyaksha',
            'category': personal_category,
            'description': 'Sacred puja to Lord Satyanarayana for fulfillment of vows',
            'how_performed': 'Complete puja with katha recitation and special offerings',
            'duration': '3 hours',
            'start_time': '09:00:00',
            'end_time': '12:00:00',
            'base_cost': 1500.00,
            'currency': 'INR',
            'temple_provides': 'All puja materials, priest services, prasad, food',
            'devotee_brings': 'Clean clothes, family members, devotion',
            'benefits': 'Fulfillment of vows, family harmony, prosperity',
            'images': ['satyanarayana1.jpg'],
            'is_active': True,
            'max_participants': 15
        },
        {
            'name': 'Maha Shivaratri Puja',
            'seva_type': 'paroksha',
            'category': festival_category,
            'description': 'Special puja on the auspicious night of Lord Shiva',
            'how_performed': 'All-night puja with special abhishekam and bhajans',
            'duration': '6 hours',
            'start_time': '22:00:00',
            'end_time': '04:00:00',
            'base_cost': 2000.00,
            'currency': 'INR',
            'temple_provides': 'All puja materials, priest services, prasad, tea/coffee',
            'devotee_brings': 'Warm clothes, devotion, family members',
            'benefits': 'Blessings of Lord Shiva, removal of all sins, spiritual awakening',
            'images': ['shivaratri1.jpg', 'shivaratri2.jpg'],
            'is_active': True,
            'max_participants': 50
        }
    ]
    
    for seva_data in sevas_data:
        seva, created = Seva.objects.get_or_create(
            name=seva_data['name'],
            defaults={**seva_data, 'created_by': admin_user}
        )
        if created:
            print(f"   ✅ Created seva: {seva.name} ({seva.get_seva_type_display()})")
        else:
            print(f"   ℹ️  Seva already exists: {seva.name}")

def setup_seva_schedules():
    """Create sample seva schedules"""
    
    print("\n📅 Creating Sample Seva Schedules...")
    
    # Get sevas
    abhishekam = Seva.objects.get(name='Abhishekam')
    archana = Seva.objects.get(name='Archana')
    rudrabhishekam = Seva.objects.get(name='Rudrabhishekam')
    satyanarayana = Seva.objects.get(name='Satyanarayana Puja')
    shivaratri = Seva.objects.get(name='Maha Shivaratri Puja')
    
    # Get admin user
    admin_user = User.objects.filter(user_type='admin').first()
    
    # Create schedules for next 30 days
    today = date.today()
    
    schedules_data = []
    
    # Daily sevas for next 30 days
    for i in range(30):
        schedule_date = today + timedelta(days=i)
        
        # Abhishekam - daily at 6 AM
        schedules_data.append({
            'seva': abhishekam,
            'date': schedule_date,
            'start_time': '06:00:00',
            'end_time': '07:00:00',
            'is_active': True,
            'created_by': admin_user
        })
        
        # Archana - daily at 8 AM
        schedules_data.append({
            'seva': archana,
            'date': schedule_date,
            'start_time': '08:00:00',
            'end_time': '08:30:00',
            'is_active': True,
            'created_by': admin_user
        })
    
    # Special sevas - weekly
    for i in range(4):
        schedule_date = today + timedelta(weeks=i+1)
        
        # Rudrabhishekam - every Sunday
        if schedule_date.weekday() == 6:  # Sunday
            schedules_data.append({
                'seva': rudrabhishekam,
                'date': schedule_date,
                'start_time': '18:00:00',
                'end_time': '20:00:00',
                'is_active': True,
                'created_by': admin_user
            })
    
    # Satyanarayana Puja - every Saturday
    for i in range(4):
        schedule_date = today + timedelta(weeks=i+1)
        if schedule_date.weekday() == 5:  # Saturday
            schedules_data.append({
                'seva': satyanarayana,
                'date': schedule_date,
                'start_time': '09:00:00',
                'end_time': '12:00:00',
                'is_active': True,
                'created_by': admin_user
            })
    
    # Maha Shivaratri - next occurrence (simulated)
    shivaratri_date = today + timedelta(days=15)  # Simulate in 15 days
    schedules_data.append({
        'seva': shivaratri,
        'date': shivaratri_date,
        'start_time': '22:00:00',
        'end_time': '04:00:00',
        'is_active': True,
        'created_by': admin_user
    })
    
    # Create schedules
    for schedule_data in schedules_data:
        schedule, created = SevaSchedule.objects.get_or_create(
            seva=schedule_data['seva'],
            date=schedule_data['date'],
            start_time=schedule_data['start_time'],
            defaults=schedule_data
        )
        if created:
            print(f"   ✅ Created schedule: {schedule.seva.name} on {schedule.date}")
        else:
            print(f"   ℹ️  Schedule already exists: {schedule.seva.name} on {schedule.date}")

def main():
    """Main setup function"""
    
    print("🏛️ Temple Management System - Seva Setup")
    print("=" * 50)
    
    try:
        # Check if admin user exists
        admin_user = User.objects.filter(user_type='admin').first()
        if not admin_user:
            print("❌ No admin user found. Please create an admin user first.")
            print("   Run: python create_admin.py")
            return
        
        print(f"✅ Admin user found: {admin_user.email}")
        
        # Setup seva data
        setup_seva_categories()
        setup_sevas()
        setup_seva_schedules()
        
        print("\n" + "=" * 50)
        print("🎉 Seva Setup Completed Successfully!")
        print("=" * 50)
        print("✅ Seva categories created")
        print("✅ Sample sevas created")
        print("✅ Seva schedules created")
        print("\nYou can now test the seva management system!")
        
    except Exception as e:
        print(f"❌ Error during seva setup: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()

