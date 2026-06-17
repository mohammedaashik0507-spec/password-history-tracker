#!/bin/bash
# Password History Tracker - Installation & Startup Script for Windows

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Password History Tracker - Complete Setup               ║"
echo "║   All files are ready! This script gets you running.      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" &> /dev/null
}

# Colors for Windows compatibility (will fallback to plain if not supported)
if command_exists tput; then
    GREEN=$(tput setaf 2)
    BLUE=$(tput setaf 4)
    RED=$(tput setaf 1)
    YELLOW=$(tput setaf 3)
    NC=$(tput sgr0)
else
    GREEN=""
    BLUE=""
    RED=""
    YELLOW=""
    NC=""
fi

echo "${BLUE}➜${NC} Step 1: Checking Prerequisites..."
echo ""

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node -v)
    echo "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
else
    echo "${RED}✗${NC} Node.js not found!"
    echo "   Download from: https://nodejs.org/ (v18+ recommended)"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm -v)
    echo "${GREEN}✓${NC} npm installed: $NPM_VERSION"
else
    echo "${RED}✗${NC} npm not found!"
    exit 1
fi

# Check MongoDB
if command_exists mongod; then
    MONGO_VERSION=$(mongod --version | head -1)
    echo "${GREEN}✓${NC} MongoDB installed"
else
    echo "${YELLOW}⚠${NC}  MongoDB not found locally"
    echo "   You can install it or use MongoDB Atlas (cloud)"
    echo "   Download: https://www.mongodb.com/try/download/community"
fi

echo ""
echo "${BLUE}➜${NC} Step 2: Setting up Backend..."
echo ""

if [ -d "backend" ]; then
    cd backend
    
    # Install dependencies
    if [ ! -d "node_modules" ]; then
        echo "${YELLOW}Installing backend dependencies...${NC}"
        npm install
        if [ $? -eq 0 ]; then
            echo "${GREEN}✓${NC} Backend dependencies installed"
        else
            echo "${RED}✗${NC} Failed to install backend dependencies"
            exit 1
        fi
    else
        echo "${GREEN}✓${NC} Backend dependencies already installed"
    fi
    
    # Create .env if needed
    if [ ! -f ".env" ]; then
        echo "${YELLOW}Creating backend .env file...${NC}"
        cp .env.example .env
        echo "${GREEN}✓${NC} .env created - please update with your MongoDB URI"
    else
        echo "${GREEN}✓${NC} Backend .env already exists"
    fi
    
    cd ..
else
    echo "${RED}✗${NC} backend directory not found"
    exit 1
fi

echo ""
echo "${BLUE}➜${NC} Step 3: Setting up Frontend..."
echo ""

if [ -d "frontend" ]; then
    cd frontend
    
    # Install dependencies
    if [ ! -d "node_modules" ]; then
        echo "${YELLOW}Installing frontend dependencies...${NC}"
        npm install
        if [ $? -eq 0 ]; then
            echo "${GREEN}✓${NC} Frontend dependencies installed"
        else
            echo "${RED}✗${NC} Failed to install frontend dependencies"
            exit 1
        fi
    else
        echo "${GREEN}✓${NC} Frontend dependencies already installed"
    fi
    
    # Create .env if needed
    if [ ! -f ".env" ]; then
        echo "${YELLOW}Creating frontend .env file...${NC}"
        cp .env.example .env
        echo "${GREEN}✓${NC} .env created"
    else
        echo "${GREEN}✓${NC} Frontend .env already exists"
    fi
    
    cd ..
else
    echo "${RED}✗${NC} frontend directory not found"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Setup Complete! Next Steps:                             ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "│ 1. Start MongoDB:                                         │"
echo "│    mongod                                                  │"
echo "│                                                            │"
echo "│ 2. Start Backend (Terminal 1):                            │"
echo "│    cd backend && npm run dev                              │"
echo "│                                                            │"
echo "│ 3. Start Frontend (Terminal 2):                           │"
echo "│    cd frontend && npm run dev                             │"
echo "│                                                            │"
echo "│ 4. Open browser:                                          │"
echo "│    http://localhost:5173                                  │"
echo "│                                                            │"
echo "│ 5. Create account or test login:                          │"
echo "│    Email: test@example.com                                │"
echo "│    Password: TestPass123!                                 │"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📖 For more info, see:"
echo "   • QUICK_START.md - Fast setup guide"
echo "   • README.md - Full documentation"
echo "   • DEPLOYMENT.md - Production deployment"
