#!/usr/bin/env python3
"""
Test script to verify JWT token authentication
"""

import requests
import json

def test_admin_login_and_dashboard():
    """Test admin login and dashboard access"""
    
    print("🧪 Testing Admin Login and Dashboard Access...")
    print("=" * 60)
    
    base_url = "http://localhost:8000/api"
    
    # Step 1: Admin Login
    print("1. Admin Login...")
    login_data = {
        "email": "admin@temple.com",
        "password": "admin123"
    }
    
    try:
        login_response = requests.post(f"{base_url}/auth/admin-login/", json=login_data)
        print(f"   Status Code: {login_response.status_code}")
        
        if login_response.status_code == 200:
            login_result = login_response.json()
            print("   ✅ Login successful!")
            print(f"   User: {login_result['user']['first_name']} {login_result['user']['last_name']}")
            
            # Extract token
            access_token = login_result['access']
            print(f"   Token: {access_token[:50]}...")
            
            # Step 2: Test Dashboard with Token
            print("\n2. Testing Dashboard with Token...")
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
            
            dashboard_response = requests.get(f"{base_url}/admin/dashboard/", headers=headers)
            print(f"   Status Code: {dashboard_response.status_code}")
            
            if dashboard_response.status_code == 200:
                dashboard_data = dashboard_response.json()
                print("   ✅ Dashboard access successful!")
                print(f"   Total Users: {dashboard_data['statistics']['total_users']}")
                print(f"   Total Devotees: {dashboard_data['statistics']['total_devotees']}")
                print(f"   Total Admins: {dashboard_data['statistics']['total_admins']}")
            else:
                print(f"   ❌ Dashboard access failed!")
                print(f"   Response: {dashboard_response.text}")
                
                # Test without token
                print("\n3. Testing Dashboard without Token...")
                no_token_response = requests.get(f"{base_url}/admin/dashboard/")
                print(f"   Status Code: {no_token_response.status_code}")
                print(f"   Response: {no_token_response.text}")
                
        else:
            print(f"   ❌ Login failed!")
            print(f"   Response: {login_response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Backend server is not running on localhost:8000")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_admin_login_and_dashboard()
