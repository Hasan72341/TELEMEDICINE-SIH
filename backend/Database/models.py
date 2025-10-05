from sqlalchemy import Column, Integer, String, Date, DateTime, JSON, Float
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    date_of_birth = Column(Date)
    gender = Column(String)
    phone_number = Column(String, unique=True, index=True)
    email = Column(String, unique=True, nullable=True)
    password_hash = Column(String)
    preferred_language = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Doctor(Base):
    __tablename__ = "doctors"

    doctor_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    phone_number = Column(String, unique=True, index=True)
    email = Column(String, unique=True, nullable=True)
    password_hash = Column(String)
    specialization = Column(String)
    qualification = Column(String)
    license_number = Column(String, unique=True)
    years_experience = Column(Integer, nullable=True)
    availability = Column(JSON, nullable=True)  # JSON for flexible schedule
    consultation_fee = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
