@echo off
REM Development startup script for Windows
echo 🚀 Starting Landscape Show development environment...

REM Quick prerequisite check (without detailed error messages for speed)
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js not found. Please run setup.bat first.
    exit /b 1
)

where pnpm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ pnpm not found. Please install: npm install -g pnpm
    exit /b 1
)

where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Python not found. Please install Python 3.12+ first.
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing root dependencies...
    call npm install
)

if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    call pnpm install
    cd ..
)

if not exist "backend\.venv" (
    echo 🐍 Setting up Python virtual environment...
    echo 💡 Tip: Run setup.bat for a complete setup with dependency checking
    where uv >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        cd backend
        call uv venv
        call uv pip install -r requirements.txt
        cd ..
    ) else (
        cd backend
        python -m venv .venv
        call .venv\Scripts\activate.bat
        pip install -r requirements.txt
        cd ..
    )
)

echo ✅ Starting both backend and frontend...
echo    Backend will be available at: http://localhost:8000
echo    Frontend will be available at: http://localhost:5173
echo.
echo 💡 Press Ctrl+C to stop both services

REM Set PYTHONPATH and start both services
set PYTHONPATH=%cd%\backend
call npm run dev