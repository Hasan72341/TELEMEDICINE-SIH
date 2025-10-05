from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from Database import schemas, models
from database import SessionLocal
from fastapi import Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='auth/login')

# Get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


def verify_access_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id: str = payload.get("user_id")
        user_type: str = payload.get("user_type")
        
        if id is None:
            raise credentials_exception
            
        token_data = schemas.TokenData(id=id, user_type=user_type)
    except JWTError:
        raise credentials_exception

    return token_data


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials", 
        headers={"WWW-Authenticate": "Bearer"}
    )

    token_data = verify_access_token(token, credentials_exception)

    user = db.query(models.User).filter(models.User.user_id == token_data.id).first()

    if user is None:
        raise credentials_exception

    return user


def get_current_doctor(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials", 
        headers={"WWW-Authenticate": "Bearer"}
    )

    token_data = verify_access_token(token, credentials_exception)

    # Check if the token is for a doctor
    if token_data.user_type != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource"
        )

    doctor = db.query(models.Doctor).filter(models.Doctor.doctor_id == token_data.id).first()

    if doctor is None:
        raise credentials_exception

    return doctor


def get_current_user_flexible(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Get current user or doctor based on token type
    Returns tuple (user/doctor, user_type)
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials", 
        headers={"WWW-Authenticate": "Bearer"}
    )

    token_data = verify_access_token(token, credentials_exception)

    if token_data.user_type == "doctor":
        doctor = db.query(models.Doctor).filter(models.Doctor.doctor_id == token_data.id).first()
        if doctor is None:
            raise credentials_exception
        return doctor, "doctor"
    else:
        user = db.query(models.User).filter(models.User.user_id == token_data.id).first()
        if user is None:
            raise credentials_exception
        return user, "user"