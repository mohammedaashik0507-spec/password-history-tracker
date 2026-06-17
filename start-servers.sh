#!/bin/bash
# Password History Tracker - Start Servers Script

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Password History Tracker - Starting Servers             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if directories exist
if [ ! -d "backend" ]; then
    echo "✗ backend directory not found"
    echo "Please run this script from the root project directory"
    exit 1
fi

if [ ! -d "frontend" ]; then
    echo "✗ frontend directory not found"
    echo "Please run this script from the root project directory"
    exit 1
fi

echo "⚠  IMPORTANT: Make sure MongoDB is running before starting!"
echo ""
echo "   If you haven't started MongoDB yet:"
echo "   1. Open a new terminal"
echo "   2. Run: mongod"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}➜${NC} Starting Backend Server..."
echo "   Location: http://localhost:5000"
echo ""

cd backend
npm run dev &
BACKEND_PID=$!

sleep 2

echo -e "${BLUE}➜${NC} Starting Frontend Server..."
echo "   Location: http://localhost:5173"
echo ""

cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Servers Started!                                         ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║ Backend:  http://localhost:5000                            ║"
echo "║ Frontend: http://localhost:5173                            ║"
echo "║ Docs:     http://localhost:5000/api                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "💡 Tips:"
echo "   • Access app at: http://localhost:5173"
echo "   • API base: http://localhost:5000/api"
echo "   • Test email: test@example.com"
echo "   • Test password: TestPass123!"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Handle cleanup
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Servers stopped'; exit 0" INT TERM

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
