from sqlalchemy import Column, Integer, String, Float, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    doctor_id = Column(String, unique=True, index=True) # e.g. "dr_sharma"
    name = Column(JSON) # {"en": "...", "hi": "...", "pa": "..."}
    qualification = Column(JSON)
    specialization = Column(JSON)
    experience = Column(JSON)
    image = Column(String)
    rating = Column(Float)
    reviews = Column(Integer)
    availability = Column(Boolean, default=True)
    fees = Column(Integer)
    languages = Column(JSON) # ["English", "Hindi"]
    bio = Column(JSON)

    user = relationship("User", back_populates="doctor_profile")
    appointments = relationship("Appointment", back_populates="doctor")
