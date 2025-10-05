import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from dotenv import load_dotenv
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_database_if_not_exists():
    """
    Create PostgreSQL database if it doesn't exist
    """
    load_dotenv()
    
    # Get database configuration
    host = os.getenv("DATABASE_HOST", "localhost")
    port = os.getenv("DATABASE_PORT", "5432")
    user = os.getenv("DATABASE_USER", "postgres")
    password = os.getenv("DATABASE_PASSWORD", "password")
    database = os.getenv("DATABASE_NAME", "telemedicine_db")
    
    try:
        # Connect to PostgreSQL server (not to a specific database)
        connection = psycopg2.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database="postgres"  # Connect to default postgres database
        )
        connection.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = connection.cursor()
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (database,))
        exists = cursor.fetchone()
        
        if not exists:
            # Create database
            cursor.execute(f'CREATE DATABASE "{database}"')
            logger.info(f"✅ Database '{database}' created successfully")
        else:
            logger.info(f"✅ Database '{database}' already exists")
            
        cursor.close()
        connection.close()
        return True
        
    except psycopg2.Error as e:
        logger.error(f"❌ Error creating database: {e}")
        return False
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
        return False

def test_database_connection():
    """
    Test connection to the PostgreSQL database
    """
    load_dotenv()
    
    host = os.getenv("DATABASE_HOST", "localhost")
    port = os.getenv("DATABASE_PORT", "5432")
    user = os.getenv("DATABASE_USER", "postgres")
    password = os.getenv("DATABASE_PASSWORD", "password")
    database = os.getenv("DATABASE_NAME", "telemedicine_db")
    
    database_url = f"postgresql://{user}:{password}@{host}:{port}/{database}"
    
    try:
        engine = create_engine(database_url)
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            logger.info(f"✅ Connected to PostgreSQL: {version}")
            return True
    except OperationalError as e:
        logger.error(f"❌ Database connection failed: {e}")
        return False
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
        return False

def setup_database():
    """
    Complete database setup: create database, test connection, and create tables
    """
    logger.info("🚀 Starting database setup...")
    
    # Check if auto-create is enabled
    auto_create = os.getenv("AUTO_CREATE_DB", "true").lower() == "true"
    
    if auto_create:
        # Create database if it doesn't exist
        if not create_database_if_not_exists():
            logger.error("❌ Failed to create database")
            return False
    
    # Test database connection
    if not test_database_connection():
        logger.error("❌ Failed to connect to database")
        return False
    
    # Import here to avoid circular imports
    from database import engine, Base
    from Database import models  # Import models to register them with Base
    
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully")
        
        # Verify tables were created
        with engine.connect() as connection:
            result = connection.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """))
            tables = result.fetchall()
            if tables:
                table_names = [table[0] for table in tables]
                logger.info(f"✅ Created tables: {', '.join(table_names)}")
            else:
                logger.warning("⚠️ No tables found after creation")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Failed to create tables: {e}")
        return False

def get_database_info():
    """
    Get information about the current database setup
    """
    load_dotenv()
    
    info = {
        "host": os.getenv("DATABASE_HOST", "localhost"),
        "port": os.getenv("DATABASE_PORT", "5432"),
        "database": os.getenv("DATABASE_NAME", "telemedicine_db"),
        "user": os.getenv("DATABASE_USER", "postgres"),
        "auto_create": os.getenv("AUTO_CREATE_DB", "true").lower() == "true"
    }
    
    return info


from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)


def hash(password: str):
    # Use only first 72 bytes for bcrypt compatibility
    if isinstance(password, str):
        password_bytes = password.encode('utf-8')[:72]
        password = password_bytes.decode('utf-8', errors='ignore')
    return pwd_context.hash(password)


def verify(plain_password, hashed_password):
    # Use only first 72 bytes for bcrypt compatibility
    if isinstance(plain_password, str):
        password_bytes = plain_password.encode('utf-8')[:72]
        plain_password = password_bytes.decode('utf-8', errors='ignore')
    return pwd_context.verify(plain_password, hashed_password)