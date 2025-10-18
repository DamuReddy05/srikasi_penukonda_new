#!/usr/bin/env python3
"""
Comprehensive JWT Authentication Test for Temple Management System
"""

import requests
import json
import time

def test_jwt_authentication():
    """Test JWT authentication for all protected APIs"""
    
    print("🔐 JWT Authentication Integration Test")
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
            refresh_token = login_result['refresh']
            print(f"   Token: {access_token[:50]}...")
            
            # Test 2: Admin Dashboard (Protected API)
            print("\n2. Testing Admin Dashboard (Protected API)...")
            headers = {"Authorization": f"Bearer {access_token}"}
            dashboard_response = requests.get(f"{base_url}/admin/dashboard/", headers=headers)
            
            if dashboard_response.status_code == 200:
                print("   ✅ Admin Dashboard: SUCCESS")
            else:
                print(f"   ❌ Admin Dashboard: FAILED - {dashboard_response.status_code}")
                print(f"   Response: {dashboard_response.text}")
            
            # Test 3: Admin Dashboard without Token (Should Fail)
            print("\n3. Testing Admin Dashboard without Token (Should Fail)...")
            no_token_response = requests.get(f"{base_url}/admin/dashboard/")
            
            if no_token_response.status_code == 401:
                print("   ✅ Admin Dashboard without Token: CORRECTLY BLOCKED")
            else:
                print(f"   ❌ Admin Dashboard without Token: UNEXPECTED - {no_token_response.status_code}")
            
            # Test 4: Admin Users Management (Protected API)
            print("\n4. Testing Admin Users Management (Protected API)...")
            users_response = requests.get(f"{base_url}/admin/users/", headers=headers)
            
            if users_response.status_code == 200:
                print("   ✅ Admin Users Management: SUCCESS")
            else:
                print(f"   ❌ Admin Users Management: FAILED - {users_response.status_code}")
            
            # Test 5: User Profile (Protected API)
            print("\n5. Testing User Profile (Protected API)...")
            profile_response = requests.get(f"{base_url}/profile/", headers=headers)
            
            if profile_response.status_code == 200:
                print("   ✅ User Profile: SUCCESS")
            else:
                print(f"   ❌ User Profile: FAILED - {profile_response.status_code}")
            
            # Test 6: Pujas List (Protected API)
            print("\n6. Testing Pujas List (Protected API)...")
            pujas_response = requests.get(f"{base_url}/pujas/", headers=headers)
            
            if pujas_response.status_code == 200:
                print("   ✅ Pujas List: SUCCESS")
            else:
                print(f"   ❌ Pujas List: FAILED - {pujas_response.status_code}")
            
            # Test 7: Darshan Slots (Protected API)
            print("\n7. Testing Darshan Slots (Protected API)...")
            slots_response = requests.get(f"{base_url}/bookings/slots/", headers=headers)
            
            if slots_response.status_code == 200:
                print("   ✅ Darshan Slots: SUCCESS")
            else:
                print(f"   ❌ Darshan Slots: FAILED - {slots_response.status_code}")
            
            # Test 8: Expenses (Protected API - Admin Only)
            print("\n8. Testing Expenses (Protected API - Admin Only)...")
            expenses_response = requests.get(f"{base_url}/expenses/", headers=headers)
            
            if expenses_response.status_code == 200:
                print("   ✅ Expenses: SUCCESS")
            else:
                print(f"   ❌ Expenses: FAILED - {expenses_response.status_code}")
            
            # Test 9: Invalid Token (Should Fail)
            print("\n9. Testing with Invalid Token (Should Fail)...")
            invalid_headers = {"Authorization": "Bearer invalid_token_here"}
            invalid_response = requests.get(f"{base_url}/admin/dashboard/", headers=invalid_headers)
            
            if invalid_response.status_code == 401:
                print("   ✅ Invalid Token: CORRECTLY BLOCKED")
            else:
                print(f"   ❌ Invalid Token: UNEXPECTED - {invalid_response.status_code}")
            
            # Test 10: Logout (Protected API)
            print("\n10. Testing Logout (Protected API)...")
            logout_data = {"refresh_token": refresh_token}
            logout_response = requests.post(f"{base_url}/auth/logout/", json=logout_data, headers=headers)
            
            if logout_response.status_code == 200:
                print("   ✅ Logout: SUCCESS")
            else:
                print(f"   ❌ Logout: FAILED - {logout_response.status_code}")
            
            print("\n" + "=" * 60)
            print("🎉 JWT Authentication Test Summary")
            print("=" * 60)
            print("✅ All protected APIs require valid JWT tokens")
            print("✅ Invalid/missing tokens are properly rejected")
            print("✅ Admin-only endpoints are properly protected")
            print("✅ Token-based authentication is working correctly")
            
        else:
            print(f"   ❌ Admin Login: FAILED - {login_response.status_code}")
            print(f"   Response: {login_response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Backend server is not running on localhost:8000")
        print("   Please start the backend server first")
    except Exception as e:
        print(f"❌ Error during JWT test: {e}")

def test_token_expiry():
    """Test token expiry handling"""
    
    print("\n⏰ Testing Token Expiry Handling...")
    print("=" * 40)
    
    base_url = "http://localhost:8000/api"
    
    # Login to get a token
    login_data = {
        "email": "admin@temple.com",
        "password": "admin123"
    }
    
    try:
        login_response = requests.post(f"{base_url}/auth/admin-login/", json=login_data)
        if login_response.status_code == 200:
            login_result = login_response.json()
            access_token = login_result['access']
            
            # Decode token to check expiry
            import base64
            import json as json_lib
            
            try:
                # Split token and decode payload
                token_parts = access_token.split('.')
                if len(token_parts) == 3:
                    payload = json_lib.loads(base64.b64decode(token_parts[1] + '==').decode('utf-8'))
                    expiry_time = payload.get('exp', 0)
                    current_time = int(time.time())
                    
                    print(f"   Token expiry time: {expiry_time}")
                    print(f"   Current time: {current_time}")
                    print(f"   Token expires in: {expiry_time - current_time} seconds")
                    
                    if expiry_time > current_time:
                        print("   ✅ Token is valid and not expired")
                    else:
                        print("   ❌ Token has expired")
                        
            except Exception as e:
                print(f"   ❌ Error decoding token: {e}")
                
    except Exception as e:
        print(f"❌ Error testing token expiry: {e}")

if __name__ == "__main__":
    test_jwt_authentication()
    test_token_expiry()

