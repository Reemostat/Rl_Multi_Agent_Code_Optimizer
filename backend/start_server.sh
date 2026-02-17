#!/bin/bash
# Backend Server Startup Script
# This script starts the backend server on the dedicated port

cd "$(dirname "$0")"

# Load environment variables from .env if it exists
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Get port from environment or use default
PORT=${BACKEND_PORT:-8000}

echo "🚀 Starting RL Code Agent Backend Server..."
echo "📍 Port: $PORT"
echo "🌐 URL: http://localhost:$PORT"
echo "📚 API Docs: http://localhost:$PORT/docs"
echo ""

# Activate virtual environment if it exists
if [ -d "../venv" ]; then
    source ../venv/bin/activate
elif [ -d "venv" ]; then
    source venv/bin/activate
fi

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port $PORT

