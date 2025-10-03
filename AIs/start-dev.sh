#!/bin/bash

# Development startup script for AI backend

echo "🚀 Starting AI Backend in Development Mode..."

# Load development environment
export ENVIRONMENT=development

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

# Start the FastAPI server
echo "🏃 Starting FastAPI server on http://0.0.0.0:8006"
python main.py