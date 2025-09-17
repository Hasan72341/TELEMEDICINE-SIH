from typing import Optional, Any
from pydantic import BaseModel
from datetime import datetime
from app.schemas.user import User

class HealthRecordBase(BaseModel):
    record_type: str
    title: str
    description: Optional[str] = None
    file_url: Optional[str] = None

class HealthRecordCreate(HealthRecordBase):
    pass

class HealthRecordUpdate(HealthRecordBase):
    record_type: Optional[str] = None
    title: Optional[str] = None

class HealthRecord(HealthRecordBase):
    id: int
    patient_id: int
    patient: Optional[User] = None
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
