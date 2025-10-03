#!/bin/bash

# Production startup script for AI backend

echo "🚀 Starting AI Backend in Production Mode..."

# Load production environment
export ENVIRONMENT=production

# Activate virtual environment if it exists
if [ -d "env" ]; then
    source env/bin/activate
    echo "✅ Virtual environment activated"
fi

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "📦 Installing dependencies..."
    pip install -r requirements.txt
fi

# Start the FastAPI server with gunicorn for production
if command -v gunicorn &> /dev/null; then
    echo "🏃 Starting with Gunicorn (Production)"
    gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8006
else
    echo "🏃 Starting with Uvicorn (Gunicorn not found)"
    python main.py
fi