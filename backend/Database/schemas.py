from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

# Users
class UserCreate(BaseModel):
    full_name: str
    date_of_birth: date
    gender: str
    phone_number: str
    email: Optional[EmailStr] = None
    password_hash: str
    preferred_language: str

class UserResponse(BaseModel):
    user_id: int
    full_name: str
    phone_number: str
    email: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Doctors
class DoctorCreate(BaseModel):
    full_name: str
    phone_number: str
    email: Optional[EmailStr] = None
    password_hash: str
    specialization: str
    qualification: str
    license_number: str
    years_experience: Optional[int] = None
    availability: Optional[dict] = None
    consultation_fee: Optional[float] = None

class DoctorResponse(BaseModel):
    doctor_id: int
    full_name: str
    phone_number: str
    email: Optional[str] = None
    specialization: str
    qualification: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Authentication Schemas
class UserLogin(BaseModel):
    phone_number: str
    password: str

class DoctorLogin(BaseModel):
    phone_number: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None
    user_type: Optional[str] = None  # "user" or "doctor"

class UserRegister(BaseModel):
    full_name: str
    date_of_birth: date
    gender: str
    phone_number: str
    email: Optional[EmailStr] = None
    password: str  # Plain password, will be hashed
    preferred_language: str

class DoctorRegister(BaseModel):
    full_name: str
    phone_number: str
    email: Optional[EmailStr] = None
    password: str  # Plain password, will be hashed
    specialization: str
    qualification: str
    license_number: str
    years_experience: Optional[int] = None
    availability: Optional[dict] = None
    consultation_fee: Optional[float] = None
