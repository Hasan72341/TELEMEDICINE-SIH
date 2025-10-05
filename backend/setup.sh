#!/bin/bash

# Telemedicine Backend Setup Script
echo "🏥 Starting Telemedicine Backend Setup..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Start PostgreSQL using Docker Compose
echo "🐘 Starting PostgreSQL database..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Test database connection and setup
echo "🔧 Setting up database tables..."
python -c "from utils import setup_database; setup_database()"

if [ $? -eq 0 ]; then
    echo "✅ Database setup completed successfully!"
    echo ""
    echo "🚀 Your telemedicine backend is ready!"
    echo ""
    echo "To start the FastAPI server:"
    echo "  uvicorn main:app --reload"
    echo ""
    echo "API will be available at:"
    echo "  • http://localhost:8000"
    echo "  • API docs: http://localhost:8000/docs"
    echo ""
    echo "Database info:"
    echo "  • Host: localhost:5433"
    echo "  • Database: telemedicine_db"
    echo "  • User: postgres"
else
    echo "❌ Database setup failed. Please check your configuration."
fi