from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app import models, schemas
from app.api import deps
from app.core import security

router = APIRouter()

@router.post("/login/access-token", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = security.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/signup", response_model=schemas.User)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
):
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    
    # Create the user with the specified role
    user = models.User(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        full_name=user_in.full_name,
        is_active=True,
        role=user_in.role or "patient"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # If role is doctor, create an empty doctor profile
    if user.role == "doctor":
        dp = user_in.doctor_profile or {}
        doctor_profile = models.Doctor(
            user_id=user.id,
            doctor_id=f"dr_{user.id}",
            name={"en": user.full_name, "hi": "", "pa": ""},
            qualification={"en": dp.get("qualification", "MBBS"), "hi": "", "pa": ""},
            specialization={"en": dp.get("specialization", "General Physician"), "hi": "", "pa": ""},
            experience={"en": dp.get("experience", "0 years"), "hi": "", "pa": ""},
            image="👨‍⚕️",
            rating=0.0,
            reviews=0,
            availability=True,
            fees=int(dp.get("fees", 500)),
            languages=dp.get("languages", ["English"]),
            bio={"en": dp.get("bio", ""), "hi": "", "pa": ""}
        )
        db.add(doctor_profile)
        db.commit()

    return user

@router.get("/me", response_model=schemas.User)
def read_user_me(
    current_user: models.User = Depends(deps.get_current_user),
):
    return current_user
