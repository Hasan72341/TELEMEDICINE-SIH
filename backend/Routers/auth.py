from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from Database import schemas, models
from database import SessionLocal
from utils import verify, hash
from oauth2 import create_access_token

router = APIRouter(tags=['Authentication'])

# Get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post('/user/register', status_code=status.HTTP_201_CREATED, response_model=schemas.UserResponse)
def register_user(user: schemas.UserRegister, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(models.User).filter(models.User.phone_number == user.phone_number).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already registered"
        )
    
    # Check email if provided
    if user.email:
        existing_email = db.query(models.User).filter(models.User.email == user.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    # Hash password
    hashed_password = hash(user.password)
    
    # Create new user
    new_user = models.User(
        full_name=user.full_name,
        date_of_birth=user.date_of_birth,
        gender=user.gender,
        phone_number=user.phone_number,
        email=user.email,
        password_hash=hashed_password,
        preferred_language=user.preferred_language
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


@router.post('/doctor/register', status_code=status.HTTP_201_CREATED, response_model=schemas.DoctorResponse)
def register_doctor(doctor: schemas.DoctorRegister, db: Session = Depends(get_db)):
    # Check if doctor already exists
    existing_doctor = db.query(models.Doctor).filter(models.Doctor.phone_number == doctor.phone_number).first()
    if existing_doctor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already registered"
        )
    
    # Check license number
    existing_license = db.query(models.Doctor).filter(models.Doctor.license_number == doctor.license_number).first()
    if existing_license:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="License number already registered"
        )
    
    # Check email if provided
    if doctor.email:
        existing_email = db.query(models.Doctor).filter(models.Doctor.email == doctor.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    # Hash password
    hashed_password = hash(doctor.password)
    
    # Create new doctor
    new_doctor = models.Doctor(
        full_name=doctor.full_name,
        phone_number=doctor.phone_number,
        email=doctor.email,
        password_hash=hashed_password,
        specialization=doctor.specialization,
        qualification=doctor.qualification,
        license_number=doctor.license_number,
        years_experience=doctor.years_experience,
        availability=doctor.availability,
        consultation_fee=doctor.consultation_fee
    )
    
    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)
    
    return new_doctor


@router.post('/user/login', response_model=schemas.Token)
def login_user(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # user_credentials.username will be the phone number
    user = db.query(models.User).filter(models.User.phone_number == user_credentials.username).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid Credentials"
        )
    
    if not verify(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid Credentials"
        )
    
    # Create access token
    access_token = create_access_token(data={"user_id": str(user.user_id), "user_type": "user"})
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post('/doctor/login', response_model=schemas.Token)
def login_doctor(doctor_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # doctor_credentials.username will be the phone number
    doctor = db.query(models.Doctor).filter(models.Doctor.phone_number == doctor_credentials.username).first()
    
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid Credentials"
        )
    
    if not verify(doctor_credentials.password, doctor.password_hash):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid Credentials"
        )
    
    # Create access token
    access_token = create_access_token(data={"user_id": str(doctor.doctor_id), "user_type": "doctor"})
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post('/login', response_model=schemas.Token)
def unified_login(credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Unified login endpoint that works for both users and doctors
    Tries to authenticate as user first, then as doctor
    """
    # Try user login first
    user = db.query(models.User).filter(models.User.phone_number == credentials.username).first()
    
    if user and verify(credentials.password, user.password_hash):
        access_token = create_access_token(data={"user_id": str(user.user_id), "user_type": "user"})
        return {"access_token": access_token, "token_type": "bearer"}
    
    # Try doctor login
    doctor = db.query(models.Doctor).filter(models.Doctor.phone_number == credentials.username).first()
    
    if doctor and verify(credentials.password, doctor.password_hash):
        access_token = create_access_token(data={"user_id": str(doctor.doctor_id), "user_type": "doctor"})
        return {"access_token": access_token, "token_type": "bearer"}
    
    # Neither user nor doctor found or password incorrect
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Invalid Credentials"
    )