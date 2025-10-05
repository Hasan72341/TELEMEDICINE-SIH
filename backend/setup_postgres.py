#!/usr/bin/env python3
"""
PostgreSQL Setup Script for Telemedicine Backend
This script helps set up PostgreSQL for the telemedicine backend application.
"""

import os
import subprocess
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import platform

def check_postgres_installed():
    """Check if PostgreSQL is installed"""
    try:
        result = subprocess.run(['psql', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ PostgreSQL is installed: {result.stdout.strip()}")
            return True
        else:
            print("❌ PostgreSQL is not installed")
            return False
    except FileNotFoundError:
        print("❌ PostgreSQL is not installed")
        return False

def check_postgres_running():
    """Check if PostgreSQL service is running"""
    try:
        # Try to connect to PostgreSQL
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            user="postgres",
            password="",
            database="postgres"
        )
        conn.close()
        print("✅ PostgreSQL is running")
        return True
    except psycopg2.Error:
        print("❌ PostgreSQL is not running or connection failed")
        return False

def get_installation_instructions():
    """Get PostgreSQL installation instructions based on OS"""
    system = platform.system()
    
    if system == "Darwin":  # macOS
        return """
🍺 To install PostgreSQL on macOS:

Method 1 - Using Homebrew (Recommended):
  brew install postgresql@15
  brew services start postgresql@15
  
Method 2 - Using Postgres.app:
  1. Download from https://postgresapp.com/
  2. Install and start the app
  
Method 3 - Using Docker:
  docker run --name postgres-telemedicine \\
    -e POSTGRES_PASSWORD=password \\
    -e POSTGRES_DB=telemedicine_db \\
    -p 5432:5432 \\
    -d postgres:15

After installation, create a user:
  createuser -s postgres
  psql -U postgres -c "ALTER USER postgres PASSWORD 'password';"
"""
    
    elif system == "Linux":
        return """
🐧 To install PostgreSQL on Linux:

Ubuntu/Debian:
  sudo apt update
  sudo apt install postgresql postgresql-contrib
  sudo systemctl start postgresql
  sudo systemctl enable postgresql

CentOS/RHEL/Fedora:
  sudo yum install postgresql postgresql-server
  sudo postgresql-setup initdb
  sudo systemctl start postgresql
  sudo systemctl enable postgresql

Docker (Universal):
  docker run --name postgres-telemedicine \\
    -e POSTGRES_PASSWORD=password \\
    -e POSTGRES_DB=telemedicine_db \\
    -p 5432:5432 \\
    -d postgres:15

After installation:
  sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';"
"""
    
    elif system == "Windows":
        return """
🪟 To install PostgreSQL on Windows:

Method 1 - Official Installer:
  1. Download from https://www.postgresql.org/download/windows/
  2. Run the installer
  3. Set password to 'password' during installation
  
Method 2 - Using Docker:
  docker run --name postgres-telemedicine ^
    -e POSTGRES_PASSWORD=password ^
    -e POSTGRES_DB=telemedicine_db ^
    -p 5432:5432 ^
    -d postgres:15
"""
    
    else:
        return """
❓ Unknown operating system. Please install PostgreSQL manually:
  - Visit: https://www.postgresql.org/download/
  - Or use Docker:
    docker run --name postgres-telemedicine \\
      -e POSTGRES_PASSWORD=password \\
      -e POSTGRES_DB=telemedicine_db \\
      -p 5432:5432 \\
      -d postgres:15
"""

def create_database_and_user():
    """Create database and user for the application"""
    try:
        # Connect as superuser
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            user="postgres",
            password="password",
            database="postgres"
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'telemedicine_db'")
        if not cursor.fetchone():
            cursor.execute("CREATE DATABASE telemedicine_db")
            print("✅ Created database 'telemedicine_db'")
        else:
            print("✅ Database 'telemedicine_db' already exists")
        
        cursor.close()
        conn.close()
        return True
        
    except psycopg2.Error as e:
        print(f"❌ Failed to create database: {e}")
        return False

def test_connection():
    """Test connection to the application database"""
    try:
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            user="postgres",
            password="password",
            database="telemedicine_db"
        )
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()[0]
        print(f"✅ Successfully connected to telemedicine_db")
        print(f"   PostgreSQL version: {version}")
        cursor.close()
        conn.close()
        return True
        
    except psycopg2.Error as e:
        print(f"❌ Failed to connect to telemedicine_db: {e}")
        return False

def main():
    print("🏥 Telemedicine Backend - PostgreSQL Setup")
    print("=" * 50)
    
    # Check if PostgreSQL is installed
    if not check_postgres_installed():
        print("\n📦 PostgreSQL Installation Required:")
        print(get_installation_instructions())
        print("\n🔄 After installation, run this script again.")
        return False
    
    # Check if PostgreSQL is running
    if not check_postgres_running():
        print("\n🚀 PostgreSQL needs to be started:")
        system = platform.system()
        if system == "Darwin":
            print("  brew services start postgresql@15")
            print("  # or if using Postgres.app, just start the app")
        elif system == "Linux":
            print("  sudo systemctl start postgresql")
        print("\n🔄 After starting PostgreSQL, run this script again.")
        return False
    
    # Create database
    print("\n🗄️  Setting up database...")
    if not create_database_and_user():
        return False
    
    # Test connection
    print("\n🔌 Testing connection...")
    if not test_connection():
        return False
    
    print("\n✅ PostgreSQL setup complete!")
    print("\n🚀 You can now start your FastAPI application:")
    print("  uvicorn main:app --reload")
    print("\n📊 Access your API at: http://localhost:8000")
    print("📖 API docs at: http://localhost:8000/docs")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)