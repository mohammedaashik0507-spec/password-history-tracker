@echo off
REM Password History Tracker - Start Servers Script for Windows
REM This script starts both backend and frontend development servers

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   Password History Tracker - Starting Servers             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if backend directory exists
if not exist "backend" (
    echo ✗ backend directory not found
    echo Please run this script from the root project directory
    pause
    exit /b 1
)

REM Check if frontend directory exists
if not exist "frontend" (
    echo ✗ frontend directory not found
    echo Please run this script from the root project directory
    pause
    exit /b 1
)

echo ⚠  IMPORTANT: Make sure MongoDB is running before starting!
echo.
echo    If you haven't started MongoDB yet:
echo    1. Open a new Command Prompt
echo    2. Run: mongod
echo.

REM Start backend server
echo ➜ Starting Backend Server...
echo   Location: http://localhost:5000
echo.
start cmd /k "cd backend && npm run dev"

REM Wait a moment before starting frontend
timeout /t 2 /nobreak

REM Start frontend server
echo ➜ Starting Frontend Server...
echo   Location: http://localhost:5173
echo.
start cmd /k "cd frontend && npm run dev"

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   Servers Started!                                         ║
echo ╠════════════════════════════════════════════════════════════╣
echo ║ Backend:  http://localhost:5000                            ║
echo ║ Frontend: http://localhost:5173                            ║
echo ║ Docs:     http://localhost:5000/api                        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Two new Command Prompt windows will open for each server.
echo Keep them open while developing.
echo.
echo 💡 Tips:
echo   • Access app at: http://localhost:5173
echo   • API base: http://localhost:5000/api
echo   • Test email: test@example.com
echo   • Test password: TestPass123!
echo.
echo Press any key to close this window...
pause >nul
