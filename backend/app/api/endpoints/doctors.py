from typing import List, Any, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app import models, schemas
from app.api import deps
from app.models.appointment import Appointment

router = APIRouter()

@router.get("/", response_model=List[schemas.Doctor])
def read_doctors(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    available_only: bool = False,
    specialization: Optional[str] = None,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    query = db.query(models.Doctor)
    if available_only:
        query = query.filter(models.Doctor.availability == True)
    
    doctors = query.offset(skip).limit(limit).all()
    
    if specialization:
        doctors = [d for d in doctors if specialization.lower() in str(d.specialization).lower()]
        
    return doctors

@router.get("/available", response_model=List[Any])
def get_available_doctors(
    db: Session = Depends(deps.get_db),
    limit: int = 10,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    # This query finds doctors and counts their available slots
    results = db.query(
        models.Doctor,
        func.count(Appointment.id).label("available_slots_count")
    ).join(Appointment, models.Doctor.id == Appointment.doctor_id) \
     .filter(Appointment.available == True) \
     .group_by(models.Doctor.id) \
     .order_by(func.count(Appointment.id).desc()) \
     .limit(limit).all()
    
    # Format response
    output = []
    for doc, count in results:
        doc_data = schemas.Doctor.from_orm(doc).dict()
        doc_data["available_slots_count"] = count
        output.append(doc_data)
        
    return output