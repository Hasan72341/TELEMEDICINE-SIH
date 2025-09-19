from typing import List, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.Remedy])
def read_remedies(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    remedies = db.query(models.Remedy).offset(skip).limit(limit).all()
    return remedies