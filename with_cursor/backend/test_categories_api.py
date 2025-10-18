#!/usr/bin/env python3
"""
Test script to verify the Categories API functionality
"""

import requests
import json

def test_categories_api():
    """Test the categories API endpoints"""
    
    print("🧪 Testing Categories API...")
    print("=" * 50)
    
    base_url = "http://localhost:8000/api"
    
    # Test 1: Admin Login
    print("1. Admin Login...")
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
            
            # Test 2: Get Categories
            print("\n2. Testing Get Categories...")
            categories_response = requests.get(f"{base_url}/sevas/categories/", headers=headers)
            print(f"   Status Code: {categories_response.status_code}")
            
            if categories_response.status_code == 200:
                categories = categories_response.json()
                print(f"   ✅ Get Categories: SUCCESS ({len(categories)} categories)")
                print(f"   Raw response: {categories}")
                for cat in categories:
                    print(f"      - {cat['name']}: {cat['description']}")
            else:
                print(f"   ❌ Get Categories: FAILED")
                print(f"   Response: {categories_response.text}")
            
            # Test 3: Create Category
            print("\n3. Testing Create Category...")
            new_category = {
                "name": "Test Category",
                "description": "A test category for API testing"
            }
            
            create_response = requests.post(f"{base_url}/sevas/categories/", headers=headers, json=new_category)
            print(f"   Status Code: {create_response.status_code}")
            
            if create_response.status_code == 201:
                created_category = create_response.json()
                print(f"   ✅ Create Category: SUCCESS")
                print(f"      - Created: {created_category['name']} (ID: {created_category['id']})")
                
                # Test 4: Get Categories Again (to verify the new one is there)
                print("\n4. Testing Get Categories Again...")
                categories_response2 = requests.get(f"{base_url}/sevas/categories/", headers=headers)
                if categories_response2.status_code == 200:
                    categories2 = categories_response2.json()
                    print(f"   ✅ Get Categories Again: SUCCESS ({len(categories2)} categories)")
                    for cat in categories2:
                        print(f"      - {cat['name']}: {cat['description']}")
                
                # Test 5: Delete the test category
                print("\n5. Testing Delete Category...")
                delete_response = requests.delete(f"{base_url}/sevas/categories/{created_category['id']}/", headers=headers)
                print(f"   Status Code: {delete_response.status_code}")
                
                if delete_response.status_code == 204:
                    print(f"   ✅ Delete Category: SUCCESS")
                else:
                    print(f"   ❌ Delete Category: FAILED")
                    print(f"   Response: {delete_response.text}")
                
            else:
                print(f"   ❌ Create Category: FAILED")
                print(f"   Response: {create_response.text}")
            
        else:
            print(f"   ❌ Admin Login: FAILED - {login_response.status_code}")
            print(f"   Response: {login_response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Backend server is not running on localhost:8000")
        print("   Please start the backend server first")
    except Exception as e:
        print(f"❌ Error during categories API test: {e}")

if __name__ == "__main__":
    test_categories_api()
