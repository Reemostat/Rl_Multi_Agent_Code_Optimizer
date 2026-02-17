#!/bin/bash

echo "🚀 RL Code Agent - Quick Start"
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from rl-code-agent directory"
    exit 1
fi

# Backend setup
echo "📦 Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "  Creating virtual environment..."
    python3 -m venv venv
fi

echo "  Activating virtual environment..."
source venv/bin/activate

echo "  Installing dependencies..."
pip install -q -r requirements.txt

if [ ! -f ".env" ]; then
    echo "  ⚠️  Warning: .env file not found!"
    echo "  Please create backend/.env with your credentials"
fi

echo ""
echo "✅ Backend ready!"
echo ""

# Frontend setup
echo "📦 Setting up frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "  Installing dependencies..."
    npm install
fi

if [ ! -f ".env.local" ]; then
    echo "  ⚠️  Warning: .env.local file not found!"
    echo "  Please create frontend/.env.local with your credentials"
fi

echo ""
echo "✅ Frontend ready!"
echo ""
echo "🎉 Setup complete!"
echo ""
echo "To run:"
echo "  Backend:  cd backend && source venv/bin/activate && uvicorn main:app --reload"
echo "  Frontend: cd frontend && npm run dev"

