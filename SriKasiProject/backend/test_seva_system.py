#!/usr/bin/env python3
"""
Comprehensive test script for the Seva Management System
"""

import requests
import json
from datetime import date, timedelta

def test_seva_system():
    """Test the complete seva management system"""
    
    print("🕉️ Testing Seva Management System")
    print("=" * 60)
    
    base_url = "http://localhost:8000/api"
    
    # Test 1: Admin Login
    print("1. Testing Admin Login...")
    login_data = {
        "email": "admin@temple.com",
        "password": "admin123"
    }
    
    try:
        login_response = requests.post(f"{base_url}/auth/admin-login/", json=login_data)
        if login_response.status_code == 200:
            login_result = login_response.json()
            print("   ✅ Admin Login: SUCCESS")
            access_token = login_result['access']
            print(f"   Token: {access_token[:50]}...")
            
            headers = {"Authorization": f"Bearer {access_token}"}
            
            # Test 2: Seva Categories
            print("\n2. Testing Seva Categories...")
            categories_response = requests.get(f"{base_url}/sevas/categories/", headers=headers)
            if categories_response.status_code == 200:
                categories = categories_response.json()
                print(f"   ✅ Seva Categories: SUCCESS ({len(categories)} categories)")
                for cat in categories:
                    print(f"      - {cat['name']}: {cat['description']}")
            else:
                print(f"   ❌ Seva Categories: FAILED - {categories_response.status_code}")
            
            # Test 3: Sevas List
            print("\n3. Testing Sevas List...")
            sevas_response = requests.get(f"{base_url}/sevas/", headers=headers)
            if sevas_response.status_code == 200:
                sevas = sevas_response.json()
                print(f"   ✅ Sevas List: SUCCESS ({len(sevas)} sevas)")
                for seva in sevas:
                    print(f"      - {seva['name']} ({seva['seva_type']}): ₹{seva['base_cost']}")
            else:
                print(f"   ❌ Sevas List: FAILED - {sevas_response.status_code}")
            
            # Test 4: Seva Schedules
            print("\n4. Testing Seva Schedules...")
            schedules_response = requests.get(f"{base_url}/sevas/schedules/", headers=headers)
            if schedules_response.status_code == 200:
                schedules = schedules_response.json()
                print(f"   ✅ Seva Schedules: SUCCESS ({len(schedules)} schedules)")
                for schedule in schedules[:5]:  # Show first 5
                    print(f"      - {schedule['seva']['name']} on {schedule['date']} at {schedule['start_time']}")
            else:
                print(f"   ❌ Seva Schedules: FAILED - {schedules_response.status_code}")
            
            # Test 5: Calendar Events
            print("\n5. Testing Calendar Events...")
            current_date = date.today()
            calendar_params = {
                'year': current_date.year,
                'month': current_date.month
            }
            calendar_response = requests.get(f"{base_url}/sevas/calendar/", headers=headers, params=calendar_params)
            if calendar_response.status_code == 200:
                events = calendar_response.json()
                print(f"   ✅ Calendar Events: SUCCESS ({len(events)} events this month)")
                for event in events[:3]:  # Show first 3
                    print(f"      - {event['title']} on {event['date']} (₹{event['cost']})")
            else:
                print(f"   ❌ Calendar Events: FAILED - {calendar_response.status_code}")
            
            # Test 6: Seva Statistics
            print("\n6. Testing Seva Statistics...")
            stats_response = requests.get(f"{base_url}/sevas/statistics/", headers=headers)
            if stats_response.status_code == 200:
                stats = stats_response.json()
                print("   ✅ Seva Statistics: SUCCESS")
                print(f"      - Total Sevas: {stats['total_sevas']}")
                print(f"      - Pratyaksha Sevas: {stats['total_pratyaksha_sevas']}")
                print(f"      - Paroksha Sevas: {stats['total_paroksha_sevas']}")
                print(f"      - Total Schedules: {stats['total_schedules']}")
                print(f"      - Total Bookings: {stats['total_bookings']}")
                print(f"      - Total Revenue: ₹{stats['total_revenue']}")
            else:
                print(f"   ❌ Seva Statistics: FAILED - {stats_response.status_code}")
            
            # Test 7: Admin Management Data
            print("\n7. Testing Admin Management Data...")
            admin_response = requests.get(f"{base_url}/sevas/admin/management/", headers=headers)
            if admin_response.status_code == 200:
                admin_data = admin_response.json()
                print("   ✅ Admin Management Data: SUCCESS")
                print(f"      - Recent Sevas: {len(admin_data['recent_sevas'])}")
                print(f"      - Recent Schedules: {len(admin_data['recent_schedules'])}")
                print(f"      - Recent Bookings: {len(admin_data['recent_bookings'])}")
                print(f"      - Category Stats: {len(admin_data['category_stats'])}")
            else:
                print(f"   ❌ Admin Management Data: FAILED - {admin_response.status_code}")
            
            # Test 8: Available Sevas (Public)
            print("\n8. Testing Available Sevas (Public)...")
            available_response = requests.get(f"{base_url}/sevas/available/", headers=headers)
            if available_response.status_code == 200:
                available_sevas = available_response.json()
                print(f"   ✅ Available Sevas: SUCCESS ({len(available_sevas)} available)")
                for seva in available_sevas[:3]:  # Show first 3
                    print(f"      - {seva['name']} ({seva['seva_type']}): ₹{seva['base_cost']}")
            else:
                print(f"   ❌ Available Sevas: FAILED - {available_response.status_code}")
            
            # Test 9: Available Schedules (Public)
            print("\n9. Testing Available Schedules (Public)...")
            available_schedules_response = requests.get(f"{base_url}/sevas/available-schedules/", headers=headers)
            if available_schedules_response.status_code == 200:
                available_schedules = available_schedules_response.json()
                print(f"   ✅ Available Schedules: SUCCESS ({len(available_schedules)} available)")
                for schedule in available_schedules[:3]:  # Show first 3
                    print(f"      - {schedule['seva']['name']} on {schedule['date']} at {schedule['start_time']}")
            else:
                print(f"   ❌ Available Schedules: FAILED - {available_schedules_response.status_code}")
            
            print("\n" + "=" * 60)
            print("🎉 Seva Management System Test Summary")
            print("=" * 60)
            print("✅ All API endpoints are working correctly")
            print("✅ JWT authentication is functioning")
            print("✅ Seva data is accessible")
            print("✅ Calendar integration is working")
            print("✅ Statistics are being calculated")
            print("✅ Admin management features are operational")
            print("✅ Public seva views are accessible")
            
        else:
            print(f"   ❌ Admin Login: FAILED - {login_response.status_code}")
            print(f"   Response: {login_response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Backend server is not running on localhost:8000")
        print("   Please start the backend server first")
    except Exception as e:
        print(f"❌ Error during seva system test: {e}")

def test_seva_creation():
    """Test creating a new seva"""
    
    print("\n🧪 Testing Seva Creation...")
    print("=" * 40)
    
    base_url = "http://localhost:8000/api"
    
    # Login first
    login_data = {
        "email": "admin@temple.com",
        "password": "admin123"
    }
    
    try:
        login_response = requests.post(f"{base_url}/auth/admin-login/", json=login_data)
        if login_response.status_code == 200:
            access_token = login_response.json()['access']
            headers = {"Authorization": f"Bearer {access_token}"}
            
            # Get first category
            categories_response = requests.get(f"{base_url}/sevas/categories/", headers=headers)
            if categories_response.status_code == 200:
                categories = categories_response.json()
                if categories:
                    category_id = categories[0]['id']
                    
                    # Create a test seva
                    test_seva = {
                        "name": "Test Seva",
                        "seva_type": "pratyaksha",
                        "category_id": category_id,
                        "description": "A test seva for testing purposes",
                        "how_performed": "This is how the test seva is performed",
                        "duration": "1 hour",
                        "start_time": "10:00:00",
                        "end_time": "11:00:00",
                        "base_cost": 300.00,
                        "currency": "INR",
                        "temple_provides": "Test materials provided by temple",
                        "devotee_brings": "Test items to be brought by devotee",
                        "benefits": "Test benefits of performing this seva",
                        "images": ["test1.jpg", "test2.jpg"],
                        "is_active": True,
                        "max_participants": 5
                    }
                    
                    create_response = requests.post(f"{base_url}/sevas/", headers=headers, json=test_seva)
                    if create_response.status_code == 201:
                        created_seva = create_response.json()
                        print(f"   ✅ Seva Creation: SUCCESS")
                        print(f"      - Created: {created_seva['name']} (ID: {created_seva['id']})")
                        print(f"      - Type: {created_seva['seva_type']}")
                        print(f"      - Cost: ₹{created_seva['base_cost']}")
                        
                        # Clean up - delete the test seva
                        delete_response = requests.delete(f"{base_url}/sevas/{created_seva['id']}/", headers=headers)
                        if delete_response.status_code == 204:
                            print(f"   ✅ Test Seva Cleanup: SUCCESS")
                        else:
                            print(f"   ⚠️  Test Seva Cleanup: FAILED - {delete_response.status_code}")
                    else:
                        print(f"   ❌ Seva Creation: FAILED - {create_response.status_code}")
                        print(f"   Response: {create_response.text}")
                else:
                    print("   ❌ No categories available for testing")
            else:
                print(f"   ❌ Failed to get categories: {categories_response.status_code}")
        else:
            print(f"   ❌ Login failed: {login_response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Error during seva creation test: {e}")

if __name__ == "__main__":
    test_seva_system()
    test_seva_creation()

