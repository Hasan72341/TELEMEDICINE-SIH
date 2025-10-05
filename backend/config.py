import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    secret_key: str = os.getenv("SECRET_KEY", "your-super-secret-jwt-key-change-this-in-production-12345")
    algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Database settings (already in database.py but can be centralized here if needed)
    database_host: str = os.getenv("DATABASE_HOST", "localhost")
    database_port: str = os.getenv("DATABASE_PORT", "5433")
    database_name: str = os.getenv("DATABASE_NAME", "telemedicine_db")
    database_user: str = os.getenv("DATABASE_USER", "postgres")
    database_password: str = os.getenv("DATABASE_PASSWORD", "password")

settings = Settings()