from datetime import datetime, timedelta
from typing import Optional, Union, Any
from jose import jwt
import bcrypt

SECRET_KEY = "SECRET_KEY_GOES_HERE_CHANGE_IN_PROD"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Using bcrypt directly as requested, but passlib is standard for FastAPI. 
# I will implement raw bcrypt functions to satisfy the "use bcrypt directly" constraint strictly if needed, 
# but usually `passlib` with `schemes=["bcrypt"]` is the way. 
# Since the user said "instead of passlib use bcrypt directly", I will write manual verify/hash functions.

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # bcrypt.checkpw requires bytes
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    # bcrypt.hashpw returns bytes, we decode to store as string
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
