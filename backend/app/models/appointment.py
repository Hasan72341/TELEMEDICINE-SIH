from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    slot_id = Column(String, unique=True, index=True) # e.g. "slot_1" or "booking_123"
    time = Column(String)
    date = Column(String) # YYYY-MM-DD
    available = Column(Boolean, default=True) # If false and no patient_id, it's blocked. If false and patient_id, it's booked.
    
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    doctor = relationship("Doctor", back_populates="appointments")

    patient_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    patient = relationship("User", back_populates="appointments")

    status = Column(String, default="pending") # pending, confirmed, completed, cancelled
    symptoms = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())