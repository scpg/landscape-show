@echo off
REM Docker-based testing script for Windows
REM Wrapper for the bash script

echo 🐳 Docker-Based Script Testing (Windows)
echo ========================================

REM Check if Docker is available
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Docker is not installed or not running
    echo Please install Docker Desktop and ensure it's running
    exit /b 1
)

REM Check if WSL/bash is available for the main script
where bash >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Bash is not available
    echo Please install WSL or Git Bash to run Docker tests
    echo Alternatively, use Docker Desktop directly with the commands in test-docker.sh
    exit /b 1
)

echo ✅ Docker and bash environment ready

REM Run the main bash script
bash scripts/test-docker.sh %*