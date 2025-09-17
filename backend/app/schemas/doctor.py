from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class DoctorBase(BaseModel):
    doctor_id: str
    user_id: Optional[int] = None
    name: Dict[str, str]
    qualification: Dict[str, str]
    specialization: Dict[str, str]
    experience: Dict[str, str]
    image: str
    rating: float
    reviews: int
    availability: bool
    fees: int
    languages: List[str]
    bio: Dict[str, str]

class DoctorCreate(DoctorBase):
    pass

class Doctor(DoctorBase):
    id: int

    class Config:
        from_attributes = True
