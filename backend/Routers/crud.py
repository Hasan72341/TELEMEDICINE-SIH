from sqlalchemy.orm import Session
import Database.models as models, Database.schemas as schemas

# Users
def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        full_name=user.full_name,
        date_of_birth=user.date_of_birth,
        gender=user.gender,
        phone_number=user.phone_number,
        email=user.email,
        password_hash=user.password_hash,
        preferred_language=user.preferred_language
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Doctors
def create_doctor(db: Session, doctor: schemas.DoctorCreate):
    db_doc = models.Doctor(
        full_name=doctor.full_name,
        phone_number=doctor.phone_number,
        email=doctor.email,
        password_hash=doctor.password_hash,
        specialization=doctor.specialization,
        qualification=doctor.qualification,
        license_number=doctor.license_number,
        years_experience=doctor.years_experience,
        availability=doctor.availability,
        consultation_fee=doctor.consultation_fee
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc
