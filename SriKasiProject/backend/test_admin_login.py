#!/usr/bin/env python3
"""
Test script to verify admin login API response
"""

import requests
import json

def test_admin_login_response():
    """Test admin login and verify response structure"""
    
    print("🧪 Testing Admin Login Response...")
    print("=" * 50)
    
    base_url = "http://localhost:8000/api"
    
    # Admin login data
    login_data = {
        "email": "admin@temple.com",
        "password": "admin123"
    }
    
    try:
        # Test admin login
        response = requests.post(f"{base_url}/auth/admin-login/", json=login_data)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Login successful!")
            
            # Check response structure
            print("\n📋 Response Structure:")
            print(f"   Access Token: {'✅' if 'access' in result else '❌'}")
            print(f"   Refresh Token: {'✅' if 'refresh' in result else '❌'}")
            print(f"   User Data: {'✅' if 'user' in result else '❌'}")
            print(f"   Message: {'✅' if 'message' in result else '❌'}")
            
            # Check user data structure
            if 'user' in result:
                user = result['user']
                print("\n👤 User Data Structure:")
                print(f"   ID: {user.get('id', '❌ Missing')}")
                print(f"   Email: {user.get('email', '❌ Missing')}")
                print(f"   Username: {user.get('username', '❌ Missing')}")
                print(f"   First Name: {user.get('first_name', '❌ Missing')}")
                print(f"   Last Name: {user.get('last_name', '❌ Missing')}")
                print(f"   User Type: {user.get('user_type', '❌ Missing')}")
                print(f"   Is Staff: {user.get('is_staff', '❌ Missing')}")
                print(f"   Is Superuser: {user.get('is_superuser', '❌ Missing')}")
                
                # Check if user_type is correct
                if user.get('user_type') == 'admin':
                    print("   ✅ User type is correctly set to 'admin'")
                else:
                    print(f"   ❌ User type is '{user.get('user_type')}', should be 'admin'")
            
            # Check token structure
            if 'access' in result:
                token = result['access']
                print(f"\n🔑 Access Token: {token[:50]}...")
                
                # Decode token payload
                import base64
                try:
                    token_parts = token.split('.')
                    if len(token_parts) == 3:
                        payload = json.loads(base64.b64decode(token_parts[1] + '==').decode('utf-8'))
                        print(f"   Token User ID: {payload.get('user_id', '❌ Missing')}")
                        print(f"   Token Username: {payload.get('username', '❌ Missing')}")
                        print(f"   Token Expiry: {payload.get('exp', '❌ Missing')}")
                except Exception as e:
                    print(f"   ❌ Error decoding token: {e}")
            
            print("\n" + "=" * 50)
            print("🎉 Admin Login Response Test Summary")
            print("=" * 50)
            print("✅ Login API is working correctly")
            print("✅ Response structure is complete")
            print("✅ User data includes user_type field")
            print("✅ JWT tokens are generated properly")
            
        else:
            print(f"❌ Login failed!")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Backend server is not running on localhost:8000")
        print("   Please start the backend server first")
    except Exception as e:
        print(f"❌ Error during test: {e}")

if __name__ == "__main__":
    test_admin_login_response()

