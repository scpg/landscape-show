#!/bin/bash
# Initial project setup script for Unix/Linux/macOS
set -e

echo "🔧 Setting up Landscape Show development environment..."

# Check prerequisites
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is required but not installed. Please install it first."
        echo "   See docs/GETTING_STARTED.md for installation instructions."
        exit 1
    fi
}

echo "🔍 Checking prerequisites..."
check_command node
check_command python3
check_command pnpm

# Check for uv (recommended) or pip
if command -v uv &> /dev/null; then
    PYTHON_INSTALLER="uv"
    echo "✅ Using uv for Python package management"
elif command -v pip &> /dev/null; then
    PYTHON_INSTALLER="pip"
    echo "⚠️  Using pip (uv is recommended for better performance)"
else
    echo "❌ Neither uv nor pip found. Please install Python package manager."
    exit 1
fi

# Install root dependencies (skip if already installed)
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root-level dependencies..."
    npm install
else
    echo "✅ Root dependencies already installed"
fi

# Setup backend (skip if already set up)
echo "🐍 Setting up Python backend..."
cd backend

if [ ! -d ".venv" ]; then
    if [ "$PYTHON_INSTALLER" = "uv" ]; then
        uv venv
        source .venv/bin/activate
        uv pip install -r requirements.txt
    else
        python3 -m venv .venv
        source .venv/bin/activate
        pip install -r requirements.txt
    fi
else
    echo "✅ Python virtual environment already exists"
    # Still check if requirements are installed
    source .venv/bin/activate
    if ! python -c "import fastapi" 2>/dev/null; then
        echo "📦 Installing missing Python dependencies..."
        if [ "$PYTHON_INSTALLER" = "uv" ]; then
            uv pip install -r requirements.txt
        else
            pip install -r requirements.txt
        fi
    else
        echo "✅ Python dependencies already installed"
    fi
fi

cd ..

# Setup frontend (skip if already set up)
echo "⚛️  Setting up React frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    pnpm install
else
    echo "✅ Frontend dependencies already installed"
fi
cd ..

echo ""
echo "✅ Setup complete! 🎉"
echo ""
echo "📋 Next steps:"
echo "   1. Run: ./dev.sh (or 'npm run dev')"
echo "   2. Open backend: http://localhost:8000"
echo "   3. Open frontend: http://localhost:5173"
echo ""
echo "📚 For more info, see docs/GETTING_STARTED.md"