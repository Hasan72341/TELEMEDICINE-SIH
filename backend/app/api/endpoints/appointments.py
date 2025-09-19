from typing import List, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.api import deps
from pydantic import BaseModel

router = APIRouter()

class AppointmentCreate(BaseModel):
    doctor_id: int
    date: str
    time: str
    symptoms: str

class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class AppointmentSchema(BaseModel):
    id: int
    doctor_id: int
    patient_id: Optional[int]
    patient: Optional[schemas.User] = None
    date: str
    time: str
    status: str
    symptoms: Optional[str]
    notes: Optional[str]
    created_at: Optional[Any] = None

    class Config:
        from_attributes = True

@router.get("/", response_model=List[AppointmentSchema])
def read_appointments(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_user),
):
    if current_user.role == "doctor":
        # Ensure doctor profile exists
        if not current_user.doctor_profile:
             raise HTTPException(status_code=404, detail="Doctor profile not found")
        return db.query(models.Appointment).filter(models.Appointment.doctor_id == current_user.doctor_profile.id).offset(skip).limit(limit).all()
    else:
        # Patient sees their own
        return db.query(models.Appointment).filter(models.Appointment.patient_id == current_user.id).offset(skip).limit(limit).all()

@router.post("/", response_model=AppointmentSchema)
def create_appointment(
    *,
    db: Session = Depends(deps.get_db),
    appointment_in: AppointmentCreate,
    current_user: models.User = Depends(deps.get_current_user),
):
    appointment = models.Appointment(
        doctor_id=appointment_in.doctor_id,
        patient_id=current_user.id,
        date=appointment_in.date,
        time=appointment_in.time,
        symptoms=appointment_in.symptoms,
        status="pending",
        available=False # Booked
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment

@router.put("/{id}", response_model=AppointmentSchema)
def update_appointment(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    appointment_in: AppointmentUpdate,
    current_user: models.User = Depends(deps.get_current_user),
):
    appointment = db.query(models.Appointment).filter(models.Appointment.id == id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Permission check (Doctor only)
    if current_user.role != "doctor" and not current_user.is_superuser:
         raise HTTPException(status_code=403, detail="Not authorized")

    if appointment_in.status:
        appointment.status = appointment_in.status
    if appointment_in.notes:
        appointment.notes = appointment_in.notes
        
    db.commit()
    db.refresh(appointment)
    return appointment
