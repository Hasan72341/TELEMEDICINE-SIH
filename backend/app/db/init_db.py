import json
import os
from sqlalchemy.orm import Session
from app.models.doctor import Doctor
from app.models.product import Product
from app.models.remedy import Remedy
from app.models.appointment import Appointment
from app.models.user import User
from app.db.base_models import Base
from app.db.session import engine
from app.core.security import get_password_hash

# Load JSON data
def load_json(filename):
    file_path = os.path.join(os.path.dirname(__file__), "../../data", filename)
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return None
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

def init_db(db: Session):
    # WARNING: This drops all data. Use only for initial setup or dev.
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    # 1. Seed Admin User
    admin_user = User(
        email="admin@example.com",
        hashed_password=get_password_hash("adminpassword"),
        full_name="System Admin",
        role="admin",
        is_active=True,
        is_superuser=True
    )
    db.add(admin_user)
    
    # 2. Seed Patient Users
    patients = [
        {"email": "patient1@example.com", "name": "Rahul Kumar"},
        {"email": "patient2@example.com", "name": "Sita Devi"},
        {"email": "patient3@example.com", "name": "Amit Singh"},
        {"email": "test@example.com", "name": "Test User"},
    ]
    db_patients = []
    for p in patients:
        user = User(
            email=p["email"],
            hashed_password=get_password_hash("password" if p["email"] != "test@example.com" else "testpassword"),
            full_name=p["name"],
            role="patient",
            is_active=True
        )
        db.add(user)
        db_patients.append(user)
    
    db.flush()
    print(f"Seeded {len(db_patients)} patients.")

    # 3. Seed Doctors
    doctors_data = load_json("doctors.json")
    doctors_map = {}
    if doctors_data:
        for item in doctors_data.get("doctors", []):
            email = f"{item['id']}@example.com"
            user = User(
                email=email,
                hashed_password=get_password_hash("password"),
                full_name=item["name"]["en"],
                role="doctor",
                is_active=True
            )
            db.add(user)
            db.flush()

            doc = Doctor(
                user_id=user.id,
                doctor_id=item["id"],
                name=item["name"],
                qualification=item["qualification"],
                specialization=item["specialization"],
                experience=item["experience"],
                image=item["image"],
                rating=item["rating"],
                reviews=item["reviews"],
                availability=item.get("available", True),
                fees=item.get("consultationFee"),
                languages=item["languages"],
                bio=item.get("description")
            )
            db.add(doc)
            db.flush()
            doctors_map[item["id"]] = doc.id
        print(f"Seeded {len(doctors_map)} doctors.")

    # 4. Seed Products
    shop_data = load_json("shop.json")
    if shop_data:
        for item in shop_data.get("medicines", []):
            prod = Product(
                product_id=item["id"],
                name=item["name"],
                generic_name=item["genericName"],
                brand=item["brand"],
                category=item["category"],
                price=item["price"],
                original_price=item["originalPrice"],
                image=item["image"],
                description=item["description"],
                prescription_required=item["prescriptionRequired"],
                in_stock=item["inStock"],
                pack_size=item["packSize"],
                dosage=item["dosage"],
                manufacturer=item["manufacturer"],
                uses=item["uses"],
                rating=item["rating"],
                reviews=item["reviews"]
            )
            db.add(prod)
        print("Products seeded.")
    
    # 5. Seed Remedies
    remedies_data = load_json("remedies.json")
    if remedies_data:
        for item in remedies_data.get("remedies", []):
            rem = Remedy(
                remedy_id=item["id"],
                symptoms=item["symptoms"],
                title=item["title"],
                description=item["description"],
                remedies_list=item["remedies"],
                warning=item["warning"],
                audio_text=item["audioText"]
            )
            db.add(rem)
        print("Remedies seeded.")

    # 6. Seed Appointments (Slots)
    slots_data = load_json("slots.json")
    if slots_data:
        for group in slots_data.get("timeSlots", []):
            date = group["date"]
            for slot in group["slots"]:
                doc_db_id = doctors_map.get(slot["doctorId"])
                if doc_db_id:
                    # Some slots are already booked for demo purposes
                    patient_id = None
                    status = "pending"
                    available = slot["available"]
                    
                    if not available:
                        # Book it for the first patient as an example
                        patient_id = db_patients[0].id
                        status = "confirmed"

                    appt = Appointment(
                        slot_id=slot["id"],
                        time=slot["time"],
                        date=date,
                        available=available,
                        doctor_id=doc_db_id,
                        patient_id=patient_id,
                        status=status,
                        symptoms="General checkup" if patient_id else None
                    )
                    db.add(appt)
        print("Appointments seeded.")

    db.commit()

if __name__ == "__main__":
    from app.db.session import SessionLocal
    db = SessionLocal()
    init_db(db)
    db.close()