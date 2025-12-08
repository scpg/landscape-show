@echo off
REM Initial project setup script for Windows
echo 🔧 Setting up Landscape Show development environment...

REM Check prerequisites
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js is required but not installed. Please install it first.
    echo    See docs\GETTING_STARTED.md for installation instructions.
    exit /b 1
)

where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Python is required but not installed. Please install it first.
    echo    See docs\GETTING_STARTED.md for installation instructions.
    exit /b 1
)

where pnpm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ pnpm is required but not installed. Please install it first.
    echo    Run: npm install -g pnpm
    exit /b 1
)

REM Check for uv (recommended) or pip
where uv >nul 2>nul
if %ERRORLEVEL% equ 0 (
    set PYTHON_INSTALLER=uv
    echo ✅ Using uv for Python package management
) else (
    where pip >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        set PYTHON_INSTALLER=pip
        echo ⚠️  Using pip (uv is recommended for better performance)
    ) else (
        echo ❌ Neither uv nor pip found. Please install Python package manager.
        exit /b 1
    )
)

REM Install root dependencies (skip if already installed)
if not exist "node_modules" (
    echo 📦 Installing root-level dependencies...
    call npm install
) else (
    echo ✅ Root dependencies already installed
)

REM Setup backend (skip if already set up)
echo 🐍 Setting up Python backend...
cd backend

if not exist ".venv" (
    if "%PYTHON_INSTALLER%"=="uv" (
        call uv venv
        call .venv\Scripts\activate.bat
        call uv pip install -r requirements.txt
    ) else (
        python -m venv .venv
        call .venv\Scripts\activate.bat
        pip install -r requirements.txt
    )
) else (
    echo ✅ Python virtual environment already exists
    REM Still check if requirements are installed
    call .venv\Scripts\activate.bat
    python -c "import fastapi" >nul 2>&1
    if %ERRORLEVEL% neq 0 (
        echo 📦 Installing missing Python dependencies...
        if "%PYTHON_INSTALLER%"=="uv" (
            call uv pip install -r requirements.txt
        ) else (
            pip install -r requirements.txt
        )
    ) else (
        echo ✅ Python dependencies already installed
    )
)

cd ..

REM Setup frontend (skip if already set up)
echo ⚛️  Setting up React frontend...
cd frontend
if not exist "node_modules" (
    call pnpm install
) else (
    echo ✅ Frontend dependencies already installed
)
cd ..

echo.
echo ✅ Setup complete! 🎉
echo.
echo 📋 Next steps:
echo    1. Run: dev.bat (or 'npm run dev')
echo    2. Open backend: http://localhost:8000
echo    3. Open frontend: http://localhost:5173
echo.
echo 📚 For more info, see docs\GETTING_STARTED.md