from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.HealthRecord])
def read_health_records(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Retrieve health records for the current user.
    """
    if current_user.role == "doctor" or current_user.is_superuser:
        return db.query(models.HealthRecord).offset(skip).limit(limit).all()
    return db.query(models.HealthRecord).filter(models.HealthRecord.patient_id == current_user.id).offset(skip).limit(limit).all()

@router.post("/", response_model=schemas.HealthRecord)
def create_health_record(
    *,
    db: Session = Depends(deps.get_db),
    record_in: schemas.HealthRecordCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Create a new health record for the current user.
    """
    record = models.HealthRecord(
        **record_in.dict(),
        patient_id=current_user.id
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/{id}", response_model=schemas.HealthRecord)
def read_health_record(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get a specific health record by ID.
    """
    record = db.query(models.HealthRecord).filter(models.HealthRecord.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Health record not found")
    if record.patient_id != current_user.id and current_user.role != "doctor" and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not authorized to access this record")
    return record
