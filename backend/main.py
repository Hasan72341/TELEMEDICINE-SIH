from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from Database import models, schemas
from Routers import crud, auth
from database import SessionLocal, engine, Base
from utils import setup_database, get_database_info
from oauth2 import get_current_user, get_current_doctor
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Auto-configure database on startup
logger.info("🔧 Initializing database...")
db_success = setup_database()

if not db_success:
    logger.error("❌ Failed to initialize database. Please check your PostgreSQL connection.")
    # You can choose to exit here or continue with a warning
    # import sys
    # sys.exit(1)

# Create FastAPI app
app = FastAPI(
    title="Telemedicine API",
    description="A comprehensive telemedicine backend API with PostgreSQL and OAuth2 authentication",
    version="1.0.0"
)

# Include routers
app.include_router(auth.router, prefix="/auth")

# Dependency: Get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Root endpoint to test server
@app.get("/")
def read_root():
    db_info = get_database_info()
    return {
        "message": "Telemedicine API is running!",
        "database": "PostgreSQL",
        "database_host": db_info["host"],
        "database_name": db_info["database"],
        "status": "✅ Connected"
    }

# Database info endpoint
@app.get("/db-info")
def get_db_info():
    """Get database configuration information"""
    return get_database_info()

# Protected endpoint examples
@app.get("/users/me", response_model=schemas.UserResponse)
def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    """Get current user information (protected endpoint)"""
    return current_user

@app.get("/doctors/me", response_model=schemas.DoctorResponse)
def get_current_doctor_info(current_doctor: models.Doctor = Depends(get_current_doctor)):
    """Get current doctor information (protected endpoint)"""
    return current_doctor

# Legacy endpoints (consider deprecating in favor of auth endpoints)
@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, user=user)

@app.post("/doctors/", response_model=schemas.DoctorResponse)
def create_doctor(doctor: schemas.DoctorCreate, db: Session = Depends(get_db)):
    return crud.create_doctor(db=db, doctor=doctor)
