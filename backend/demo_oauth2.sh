#!/bin/bash

# OAuth2 Authentication Demo for Telemedicine API
# Make sure the server is running on http://localhost:8001

echo "🏥 Telemedicine API - OAuth2 Authentication Demo"
echo "================================================"

# Test API status
echo "1. Testing API Status..."
curl -s http://localhost:8001/ | python3 -m json.tool
echo ""

# Register a new user
echo "2. Registering a new user..."
USER_RESPONSE=$(curl -s -X POST "http://localhost:8001/auth/user/register" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Alice Johnson",
    "date_of_birth": "1995-03-20",
    "gender": "Female",
    "phone_number": "+1555000001",
    "email": "alice@example.com",
    "password": "alicepass123",
    "preferred_language": "English"
  }')

echo $USER_RESPONSE | python3 -m json.tool
echo ""

# Login user and get token
echo "3. Logging in user..."
USER_TOKEN_RESPONSE=$(curl -s -X POST "http://localhost:8001/auth/user/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=+1555000001&password=alicepass123")

USER_TOKEN=$(echo $USER_TOKEN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null)

if [ ! -z "$USER_TOKEN" ]; then
    echo "✅ User login successful!"
    echo "Token: ${USER_TOKEN:0:50}..."
    echo ""
    
    # Test protected user endpoint
    echo "4. Testing protected user endpoint..."
    curl -s -X GET "http://localhost:8001/users/me" \
      -H "Authorization: Bearer $USER_TOKEN" | python3 -m json.tool
    echo ""
else
    echo "❌ User login failed"
    echo $USER_TOKEN_RESPONSE
    echo ""
fi

# Register a new doctor
echo "5. Registering a new doctor..."
DOCTOR_RESPONSE=$(curl -s -X POST "http://localhost:8001/auth/doctor/register" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Dr. Bob Wilson",
    "phone_number": "+1555000002",
    "email": "dr.bob@example.com",
    "password": "bobdocpass123",
    "specialization": "Pediatrics",
    "qualification": "MD, FAAP",
    "license_number": "DOC54321",
    "years_experience": 20,
    "consultation_fee": 200.0
  }')

echo $DOCTOR_RESPONSE | python3 -m json.tool
echo ""

# Login doctor and get token
echo "6. Logging in doctor..."
DOCTOR_TOKEN_RESPONSE=$(curl -s -X POST "http://localhost:8001/auth/doctor/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=+1555000002&password=bobdocpass123")

DOCTOR_TOKEN=$(echo $DOCTOR_TOKEN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null)

if [ ! -z "$DOCTOR_TOKEN" ]; then
    echo "✅ Doctor login successful!"
    echo "Token: ${DOCTOR_TOKEN:0:50}..."
    echo ""
    
    # Test protected doctor endpoint
    echo "7. Testing protected doctor endpoint..."
    curl -s -X GET "http://localhost:8001/doctors/me" \
      -H "Authorization: Bearer $DOCTOR_TOKEN" | python3 -m json.tool
    echo ""
else
    echo "❌ Doctor login failed"
    echo $DOCTOR_TOKEN_RESPONSE
    echo ""
fi

# Test unified login
echo "8. Testing unified login endpoint..."
UNIFIED_RESPONSE=$(curl -s -X POST "http://localhost:8001/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=+1555000001&password=alicepass123")

echo "User unified login:"
echo $UNIFIED_RESPONSE | python3 -m json.tool
echo ""

UNIFIED_DOC_RESPONSE=$(curl -s -X POST "http://localhost:8001/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=+1555000002&password=bobdocpass123")

echo "Doctor unified login:"
echo $UNIFIED_DOC_RESPONSE | python3 -m json.tool
echo ""

echo "🎉 OAuth2 Authentication Demo Complete!"
echo ""
echo "📖 Available Endpoints:"
echo "  POST /auth/user/register    - Register new user"
echo "  POST /auth/doctor/register  - Register new doctor"
echo "  POST /auth/user/login       - User login"
echo "  POST /auth/doctor/login     - Doctor login"
echo "  POST /auth/login           - Unified login (auto-detect user/doctor)"
echo "  GET  /users/me             - Current user info (protected)"
echo "  GET  /doctors/me           - Current doctor info (protected)"
echo "  GET  /docs                 - Interactive API documentation"