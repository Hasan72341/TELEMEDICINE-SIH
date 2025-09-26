import requests
import time

BASE_URL = "http://localhost:8000/api/v1"

def test_endpoint(name, method, path, data=None, params=None, token=None):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    url = f"{BASE_URL}{path}"
    try:
        if method == "GET":
            response = requests.get(url, headers=headers, params=params)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data, params=params)
        elif method == "PUT":
            response = requests.put(url, headers=headers, json=data)
        
        status = response.status_code
        print(f"[ {name:30} ] Status: {status}")
        if status >= 400:
            print(f"    Error: {response.text}")
        return response.json() if status < 400 else None
    except Exception as e:
        print(f"[ {name:30} ] Failed: {str(e)}")
        return None

def run_all_tests():
    print("Waiting for database initialization...")
    time.sleep(10) # Give it time to seed

    # 1. Login
    print("\n--- 1. AUTHENTICATION ---")
    login_data = {"username": "dr_sharma@example.com", "password": "password"}
    resp = requests.post(f"{BASE_URL}/users/login/access-token", data=login_data)
    if resp.status_code != 200:
        print(f"Doctor Login Failed: {resp.text}")
        return
    doctor_token = resp.json()["access_token"]
    print("Doctor login successful.")

    login_p = {"username": "patient1@example.com", "password": "password"}
    resp_p = requests.post(f"{BASE_URL}/users/login/access-token", data=login_p)
    patient_token = resp_p.json()["access_token"]
    print("Patient login successful.")

    # 2. Users
    print("\n--- 2. USERS ---")
    test_endpoint("Get Current User (Me)", "GET", "/users/me", token=patient_token)

    # 3. Doctors
    print("\n--- 3. DOCTORS ---")
    docs = test_endpoint("List All Doctors", "GET", "/doctors/", token=patient_token)
    available_docs = test_endpoint("List Available Doctors (Advanced)", "GET", "/doctors/available", token=patient_token)
    if available_docs:
        print(f"    Available docs found: {len(available_docs)}")

    # 4. Appointments
    print("\n--- 4. APPOINTMENTS ---")
    # Get dr_sharma ID from first doc
    if docs:
        doc_id = docs[0]['id']
        appt_data = {
            "doctor_id": doc_id,
            "date": "2025-12-24",
            "time": "11:00 AM",
            "symptoms": "Feeling a bit tired"
        }
        test_endpoint("Create Appointment", "POST", "/appointments/", data=appt_data, token=patient_token)
    
    test_endpoint("List My Appointments (Patient)", "GET", "/appointments/", token=patient_token)
    test_endpoint("List My Appointments (Doctor)", "GET", "/appointments/", token=doctor_token)

    # 5. Shop & Remedies
    print("\n--- 5. SHOP & REMEDIES ---")
    test_endpoint("List Products", "GET", "/shop/", token=patient_token)
    test_endpoint("List Remedies", "GET", "/remedies/", token=patient_token)

    # 6. Health Records
    print("\n--- 6. HEALTH RECORDS ---")
    record_data = {
        "record_type": "prescription",
        "title": "Initial Checkup",
        "description": "General fatigue",
        "file_url": "http://example.com/file.pdf"
    }
    test_endpoint("Create Health Record", "POST", "/health-records/", data=record_data, token=patient_token)
    test_endpoint("List Health Records", "GET", "/health-records/", token=patient_token)

    # 7. AI
    print("\n--- 7. AI ---")
    test_endpoint("AI Remedy Generation", "POST", "/ai/remedy", params={"symptom": "cold", "lang": "en"}, token=patient_token)

if __name__ == "__main__":
    run_all_tests()
