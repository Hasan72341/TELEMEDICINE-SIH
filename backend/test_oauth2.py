#!/usr/bin/env python3
"""
OAuth2 Authentication Test Script for Telemedicine API

This script demonstrates how to:
1. Register a user and doctor
2. Login and get JWT tokens
3. Access protected endpoints with authentication

Make sure the FastAPI server is running on http://localhost:8001
"""

import requests
import json
from datetime import date

BASE_URL = "http://localhost:8001"

def test_user_registration():
    """Test user registration"""
    print("🔧 Testing User Registration...")
    
    user_data = {
        "full_name": "John Doe",
        "date_of_birth": "1990-01-15",
        "gender": "Male",
        "phone_number": "+1234567890",
        "email": "john.doe@example.com",
        "password": "securepassword123",
        "preferred_language": "English"
    }
    
    response = requests.post(f"{BASE_URL}/auth/user/register", json=user_data)
    
    if response.status_code == 201:
        print("✅ User registered successfully!")
        return response.json()
    else:
        print(f"❌ User registration failed: {response.text}")
        return None

def test_doctor_registration():
    """Test doctor registration"""
    print("🔧 Testing Doctor Registration...")
    
    doctor_data = {
        "full_name": "Dr. Jane Smith",
        "phone_number": "+1987654321",
        "email": "dr.jane@example.com",
        "password": "doctorpassword123",
        "specialization": "Cardiology",
        "qualification": "MD, FACC",
        "license_number": "DOC12345",
        "years_experience": 15,
        "consultation_fee": 150.0
    }
    
    response = requests.post(f"{BASE_URL}/auth/doctor/register", json=doctor_data)
    
    if response.status_code == 201:
        print("✅ Doctor registered successfully!")
        return response.json()
    else:
        print(f"❌ Doctor registration failed: {response.text}")
        return None

def test_user_login():
    """Test user login and get JWT token"""
    print("🔧 Testing User Login...")
    
    login_data = {
        "username": "+1234567890",  # phone number
        "password": "securepassword123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/user/login", data=login_data)
    
    if response.status_code == 200:
        token_data = response.json()
        print("✅ User login successful!")
        return token_data["access_token"]
    else:
        print(f"❌ User login failed: {response.text}")
        return None

def test_doctor_login():
    """Test doctor login and get JWT token"""
    print("🔧 Testing Doctor Login...")
    
    login_data = {
        "username": "+1987654321",  # phone number
        "password": "doctorpassword123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/doctor/login", data=login_data)
    
    if response.status_code == 200:
        token_data = response.json()
        print("✅ Doctor login successful!")
        return token_data["access_token"]
    else:
        print(f"❌ Doctor login failed: {response.text}")
        return None

def test_protected_endpoints(user_token, doctor_token):
    """Test protected endpoints with JWT tokens"""
    print("🔧 Testing Protected Endpoints...")
    
    # Test user protected endpoint
    if user_token:
        headers = {"Authorization": f"Bearer {user_token}"}
        response = requests.get(f"{BASE_URL}/users/me", headers=headers)
        
        if response.status_code == 200:
            user_info = response.json()
            print(f"✅ User protected endpoint: {user_info['full_name']}")
        else:
            print(f"❌ User protected endpoint failed: {response.text}")
    
    # Test doctor protected endpoint
    if doctor_token:
        headers = {"Authorization": f"Bearer {doctor_token}"}
        response = requests.get(f"{BASE_URL}/doctors/me", headers=headers)
        
        if response.status_code == 200:
            doctor_info = response.json()
            print(f"✅ Doctor protected endpoint: {doctor_info['full_name']}")
        else:
            print(f"❌ Doctor protected endpoint failed: {response.text}")

def test_unified_login():
    """Test the unified login endpoint"""
    print("🔧 Testing Unified Login...")
    
    # Test with user credentials
    user_login_data = {
        "username": "+1234567890",
        "password": "securepassword123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", data=user_login_data)
    
    if response.status_code == 200:
        print("✅ Unified login (user) successful!")
    else:
        print(f"❌ Unified login (user) failed: {response.text}")
    
    # Test with doctor credentials
    doctor_login_data = {
        "username": "+1987654321",
        "password": "doctorpassword123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", data=doctor_login_data)
    
    if response.status_code == 200:
        print("✅ Unified login (doctor) successful!")
    else:
        print(f"❌ Unified login (doctor) failed: {response.text}")

def main():
    """Run all OAuth2 tests"""
    print("🏥 Telemedicine API - OAuth2 Authentication Test")
    print("=" * 50)
    
    try:
        # Test API availability
        response = requests.get(f"{BASE_URL}/")
        if response.status_code != 200:
            print("❌ API server is not running. Please start it first.")
            return
        
        print("✅ API server is running!")
        print()
        
        # Test registrations
        user = test_user_registration()
        print()
        
        doctor = test_doctor_registration()
        print()
        
        # Test logins
        user_token = test_user_login()
        print()
        
        doctor_token = test_doctor_login()
        print()
        
        # Test protected endpoints
        test_protected_endpoints(user_token, doctor_token)
        print()
        
        # Test unified login
        test_unified_login()
        
        print()
        print("🎉 OAuth2 Authentication Test Complete!")
        print()
        print("📖 Available endpoints:")
        print("  • POST /auth/user/register - Register new user")
        print("  • POST /auth/doctor/register - Register new doctor")
        print("  • POST /auth/user/login - User login")
        print("  • POST /auth/doctor/login - Doctor login")
        print("  • POST /auth/login - Unified login")
        print("  • GET /users/me - Current user info (protected)")
        print("  • GET /doctors/me - Current doctor info (protected)")
        print("  • GET /docs - API documentation")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API server. Make sure it's running on http://localhost:8001")
    except Exception as e:
        print(f"❌ Test failed with error: {e}")

if __name__ == "__main__":
    main()