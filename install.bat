@echo off
REM Password History Tracker - Installation & Startup Script for Windows
REM Double-click this file to set up the application

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   Password History Tracker - Complete Setup               ║
echo ║   All files are ready! This script gets you running.      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo ✓ Node.js installed: !NODE_VERSION!
) else (
    echo ✗ Node.js not found!
    echo   Download from: https://nodejs.org/ ^(v18+ recommended^)
    echo.
    pause
    exit /b 1
)

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
    echo ✓ npm installed: !NPM_VERSION!
) else (
    echo ✗ npm not found!
    pause
    exit /b 1
)

REM Check MongoDB
where mongod >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ MongoDB installed
) else (
    echo ⚠ MongoDB not found locally
    echo   You can install it or use MongoDB Atlas ^(cloud^)
    echo   Download: https://www.mongodb.com/try/download/community
)

echo.
echo ➜ Step 1: Setting up Backend...
echo.

if exist "backend" (
    cd backend
    
    if not exist "node_modules" (
        echo Installing backend dependencies...
        call npm install
        if !ERRORLEVEL! EQU 0 (
            echo ✓ Backend dependencies installed
        ) else (
            echo ✗ Failed to install backend dependencies
            pause
            exit /b 1
        )
    ) else (
        echo ✓ Backend dependencies already installed
    )
    
    if not exist ".env" (
        echo Creating backend .env file...
        copy .env.example .env >nul
        echo ✓ .env created - please update with your MongoDB URI
    ) else (
        echo ✓ Backend .env already exists
    )
    
    cd ..
) else (
    echo ✗ backend directory not found
    pause
    exit /b 1
)

echo.
echo ➜ Step 2: Setting up Frontend...
echo.

if exist "frontend" (
    cd frontend
    
    if not exist "node_modules" (
        echo Installing frontend dependencies...
        call npm install
        if !ERRORLEVEL! EQU 0 (
            echo ✓ Frontend dependencies installed
        ) else (
            echo ✗ Failed to install frontend dependencies
            pause
            exit /b 1
        )
    ) else (
        echo ✓ Frontend dependencies already installed
    )
    
    if not exist ".env" (
        echo Creating frontend .env file...
        copy .env.example .env >nul
        echo ✓ .env created
    ) else (
        echo ✓ Frontend .env already exists
    )
    
    cd ..
) else (
    echo ✗ frontend directory not found
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   Setup Complete! Next Steps:                             ║
echo ╠════════════════════════════════════════════════════════════╣
echo ║ 1. Start MongoDB:                                         ║
echo ║    mongod                                                  ║
echo ║                                                            ║
echo ║ 2. Start Backend ^(Command Prompt 1^):                    ║
echo ║    cd backend ^&^& npm run dev                             ║
echo ║                                                            ║
echo ║ 3. Start Frontend ^(Command Prompt 2^):                   ║
echo ║    cd frontend ^&^& npm run dev                            ║
echo ║                                                            ║
echo ║ 4. Open browser:                                          ║
echo ║    http://localhost:5173                                  ║
echo ║                                                            ║
echo ║ 5. Create account or test login:                          ║
echo ║    Email: test@example.com                                ║
echo ║    Password: TestPass123!                                 ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📖 For more info, see:
echo    • QUICK_START.md - Fast setup guide
echo    • README.md - Full documentation
echo    • DEPLOYMENT.md - Production deployment
echo.
pause
