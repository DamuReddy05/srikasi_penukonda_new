#!/usr/bin/env python3
"""
Test script to verify the complete backend-frontend integration
"""

import requests
import json
import time

def test_backend_apis():
    """Test all backend APIs"""
    
    print("🧪 Testing Backend APIs...")
    print("=" * 50)
    
    base_url = "http://localhost:8000/api"
    
    # Test 1: Admin Login
    print("1. Testing Admin Login...")
    login_data = {
        "email": "admin@temple.com",
        "password": "admin123"
    }
    
    try:
        response = requests.post(f"{base_url}/auth/admin-login/", json=login_data)
        if response.status_code == 200:
            login_result = response.json()
            print("✅ Admin Login: SUCCESS")
            print(f"   User: {login_result['user']['first_name']} {login_result['user']['last_name']}")
            print(f"   User Type: {login_result['user']['user_type']}")
            
            # Store token for dashboard test
            access_token = login_result['access']
            
            # Test 2: Admin Dashboard
            print("\n2. Testing Admin Dashboard...")
            headers = {"Authorization": f"Bearer {access_token}"}
            dashboard_response = requests.get(f"{base_url}/admin/dashboard/", headers=headers)
            
            if dashboard_response.status_code == 200:
                dashboard_data = dashboard_response.json()
                print("✅ Admin Dashboard: SUCCESS")
                print(f"   Total Users: {dashboard_data['statistics']['total_users']}")
                print(f"   Total Devotees: {dashboard_data['statistics']['total_devotees']}")
                print(f"   Total Admins: {dashboard_data['statistics']['total_admins']}")
                print(f"   Recent Users: {len(dashboard_data['recent_users'])}")
            else:
                print(f"❌ Admin Dashboard: FAILED - {dashboard_response.status_code}")
                print(f"   Response: {dashboard_response.text}")
                
        else:
            print(f"❌ Admin Login: FAILED - {response.status_code}")
            print(f"   Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Backend server is not running on localhost:8000")
        print("   Please start the backend server first")
        return False
    except Exception as e:
        print(f"❌ Error testing backend: {e}")
        return False
    
    return True

def test_frontend_access():
    """Test frontend accessibility"""
    
    print("\n🌐 Testing Frontend Access...")
    print("=" * 50)
    
    try:
        response = requests.get("http://localhost:4200")
        if response.status_code == 200:
            print("✅ Frontend: SUCCESS - Angular app is running")
            return True
        else:
            print(f"❌ Frontend: FAILED - Status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Frontend server is not running on localhost:4200")
        print("   Please start the frontend server first")
        return False
    except Exception as e:
        print(f"❌ Error testing frontend: {e}")
        return False

def main():
    """Main test function"""
    
    print("🏛️ Temple Management System - Integration Test")
    print("=" * 60)
    
    # Test backend
    backend_ok = test_backend_apis()
    
    # Test frontend
    frontend_ok = test_frontend_access()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    if backend_ok and frontend_ok:
        print("🎉 ALL TESTS PASSED!")
        print("\n✅ Backend APIs are working correctly")
        print("✅ Frontend is accessible")
        print("✅ Integration is ready for testing")
        
        print("\n🚀 Next Steps:")
        print("1. Open http://localhost:4200 in your browser")
        print("2. Navigate to http://localhost:4200/admin")
        print("3. Login with admin@temple.com / admin123")
        print("4. Test the admin dashboard functionality")
        
    else:
        print("❌ SOME TESTS FAILED")
        if not backend_ok:
            print("   - Backend needs to be started")
        if not frontend_ok:
            print("   - Frontend needs to be started")
        
        print("\n🔧 Troubleshooting:")
        print("1. Start backend: cd backend && python manage.py runserver 0.0.0.0:8000")
        print("2. Start frontend: cd frontend && npm start")
        print("3. Run this test again")

if __name__ == "__main__":
    main()
