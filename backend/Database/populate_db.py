from sqlalchemy.orm import Session
import Database.models as models, Database.schemas as schemas, Routers.crud as crud
from database import SessionLocal, engine
from datetime import date

models.Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Users
users = [
    {"full_name": "Alice Johnson", "date_of_birth": date(1990,5,20), "gender":"Female",
     "phone_number":"1234567890", "email":"alice@example.com", "password_hash":"hashed_pw1", "preferred_language":"English"},
    {"full_name": "Bob Singh", "date_of_birth": date(1985,8,15), "gender":"Male",
     "phone_number":"9876543210", "email":"bob@example.com", "password_hash":"hashed_pw2", "preferred_language":"Hindi"},
    {"full_name": "Charlie Kumar", "date_of_birth": date(1992,3,10), "gender":"Male",
     "phone_number":"1112223334", "email":"charlie@example.com", "password_hash":"hashed_pw3", "preferred_language":"English"},
    {"full_name": "Diana Patel", "date_of_birth": date(1988,11,25), "gender":"Female",
     "phone_number":"5556667777", "email":"diana@example.com", "password_hash":"hashed_pw4", "preferred_language":"Punjabi"},
    {"full_name": "Ethan Roy", "date_of_birth": date(1995,7,12), "gender":"Male",
     "phone_number":"8889990001", "email":"ethan@example.com", "password_hash":"hashed_pw5", "preferred_language":"Hindi"},
    {"full_name": "Fiona Sharma", "date_of_birth": date(1991,4,8), "gender":"Female",
     "phone_number":"2223334445", "email":"fiona@example.com", "password_hash":"hashed_pw6", "preferred_language":"English"},
    {"full_name": "George Mehta", "date_of_birth": date(1987,6,19), "gender":"Male",
     "phone_number":"3334445556", "email":"george@example.com", "password_hash":"hashed_pw7", "preferred_language":"English"},
    {"full_name": "Hannah Verma", "date_of_birth": date(1993,9,30), "gender":"Female",
     "phone_number":"4445556667", "email":"hannah@example.com", "password_hash":"hashed_pw8", "preferred_language":"Hindi"},
    {"full_name": "Ian Kapoor", "date_of_birth": date(1994,2,5), "gender":"Male",
     "phone_number":"5556667778", "email":"ian@example.com", "password_hash":"hashed_pw9", "preferred_language":"Punjabi"},
    {"full_name": "Julia Singh", "date_of_birth": date(1990,12,17), "gender":"Female",
     "phone_number":"6667778889", "email":"julia@example.com", "password_hash":"hashed_pw10", "preferred_language":"English"},
]


for u in users:
    user_data = schemas.UserCreate(**u)
    crud.create_user(db, user_data)

# Doctors
doctors = [
    {"full_name":"Dr. Smith","phone_number":"1112223333","email":"smith@example.com",
     "password_hash":"hashed_doc1","specialization":"Cardiology","qualification":"MBBS, MD",
     "license_number":"LIC12345","years_experience":10,"availability":{"Mon":"9-12","Wed":"14-18"},"consultation_fee":500.0},
    {"full_name":"Dr. Brown","phone_number":"4445556666","email":"brown@example.com",
     "password_hash":"hashed_doc2","specialization":"Dermatology","qualification":"MBBS, MD",
     "license_number":"LIC67890","years_experience":8,"availability":{"Tue":"10-16","Thu":"10-16"},"consultation_fee":400.0},
    {"full_name":"Dr. Green","phone_number":"7778889990","email":"green@example.com",
     "password_hash":"hashed_doc3","specialization":"Pediatrics","qualification":"MBBS, MD",
     "license_number":"LIC13579","years_experience":6,"availability":{"Mon":"10-14","Fri":"12-16"},"consultation_fee":350.0},
    {"full_name":"Dr. White","phone_number":"2223334441","email":"white@example.com",
     "password_hash":"hashed_doc4","specialization":"Neurology","qualification":"MBBS, MD",
     "license_number":"LIC24680","years_experience":12,"availability":{"Tue":"9-12","Thu":"14-18"},"consultation_fee":600.0},
    {"full_name":"Dr. Black","phone_number":"3334445552","email":"black@example.com",
     "password_hash":"hashed_doc5","specialization":"Orthopedics","qualification":"MBBS, MD",
     "license_number":"LIC11223","years_experience":9,"availability":{"Wed":"9-13","Fri":"10-15"},"consultation_fee":450.0},
    {"full_name":"Dr. Blue","phone_number":"4445556663","email":"blue@example.com",
     "password_hash":"hashed_doc6","specialization":"ENT","qualification":"MBBS, MD",
     "license_number":"LIC44556","years_experience":7,"availability":{"Mon":"8-12","Thu":"13-17"},"consultation_fee":400.0},
    {"full_name":"Dr. Red","phone_number":"5556667774","email":"red@example.com",
     "password_hash":"hashed_doc7","specialization":"Ophthalmology","qualification":"MBBS, MD",
     "license_number":"LIC77889","years_experience":5,"availability":{"Tue":"9-12","Wed":"14-18"},"consultation_fee":350.0},
    {"full_name":"Dr. Violet","phone_number":"6667778885","email":"violet@example.com",
     "password_hash":"hashed_doc8","specialization":"Psychiatry","qualification":"MBBS, MD",
     "license_number":"LIC99001","years_experience":8,"availability":{"Mon":"10-13","Fri":"12-16"},"consultation_fee":500.0},
    {"full_name":"Dr. Orange","phone_number":"7778889996","email":"orange@example.com",
     "password_hash":"hashed_doc9","specialization":"Gastroenterology","qualification":"MBBS, MD",
     "license_number":"LIC22334","years_experience":11,"availability":{"Tue":"11-15","Thu":"13-17"},"consultation_fee":550.0},
    {"full_name":"Dr. Pink","phone_number":"8889990007","email":"pink@example.com",
     "password_hash":"hashed_doc10","specialization":"Endocrinology","qualification":"MBBS, MD",
     "license_number":"LIC55667","years_experience":6,"availability":{"Wed":"9-12","Fri":"14-18"},"consultation_fee":450.0},
]


for d in doctors:
    doctor_data = schemas.DoctorCreate(**d)
    crud.create_doctor(db, doctor_data)

db.close()
print("Database populated successfully!")
