#!/bin/bash
# Development startup script for Unix/Linux/macOS
set -e

echo "🚀 Starting Landscape Show development environment..."

# Quick prerequisite check (without detailed error messages for speed)
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please run ./setup.sh first."
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm not found. Please install: npm install -g pnpm"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ Python not found. Please install Python 3.12+ first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && pnpm install && cd ..
fi

if [ ! -d "backend/.venv" ]; then
    echo "🐍 Setting up Python virtual environment..."
    echo "💡 Tip: Run ./setup.sh for a complete setup with dependency checking"
    if command -v uv &> /dev/null; then
        cd backend && uv venv && uv pip install -r requirements.txt && cd ..
    else
        cd backend && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && cd ..
    fi
fi

echo "✅ Starting both backend and frontend..."
echo "   Backend will be available at: http://localhost:8000"
echo "   Frontend will be available at: http://localhost:5173"
echo ""
echo "💡 Press Ctrl+C to stop both services"

# Set PYTHONPATH and start both services
export PYTHONPATH=$(pwd)/backend
npm run dev