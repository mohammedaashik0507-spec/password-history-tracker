#!/bin/bash

# Password History Tracker - Quick Start Script
# This script sets up both backend and frontend for development

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Password History Tracker - Quick Start Setup             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}➜${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        echo "Please install Node.js from https://nodejs.org/"
        exit 1
    fi
    print_success "Node.js $(node -v)"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    print_success "npm $(npm -v)"
    
    # Check MongoDB
    if ! command -v mongod &> /dev/null; then
        print_warning "MongoDB is not installed or not in PATH"
        echo "   Please install MongoDB from https://www.mongodb.com/try/download/community"
        echo "   Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas"
    else
        print_success "MongoDB installed"
    fi
    
    echo ""
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    if [ ! -d "backend" ]; then
        print_error "backend directory not found"
        exit 1
    fi
    
    cd backend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_status "Installing backend dependencies..."
        npm install
        print_success "Backend dependencies installed"
    else
        print_success "Backend dependencies already installed"
    fi
    
    # Create .env if it doesn't exist
    if [ ! -f ".env" ]; then
        print_status "Creating .env file..."
        cp .env.example .env
        print_success ".env file created"
        print_warning "Please update .env file with your MongoDB URI"
    else
        print_success ".env file already exists"
    fi
    
    cd ..
    echo ""
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    if [ ! -d "frontend" ]; then
        print_error "frontend directory not found"
        exit 1
    fi
    
    cd frontend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
        print_success "Frontend dependencies installed"
    else
        print_success "Frontend dependencies already installed"
    fi
    
    # Create .env if it doesn't exist
    if [ ! -f ".env" ]; then
        print_status "Creating .env file..."
        cp .env.example .env
        print_success ".env file created"
    else
        print_success ".env file already exists"
    fi
    
    cd ..
    echo ""
}

# Start development servers
start_servers() {
    print_status "Starting development servers..."
    echo ""
    
    print_success "Backend will start on: http://localhost:5000"
    print_success "Frontend will start on: http://localhost:5173"
    echo ""
    
    print_warning "Starting backend server..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    sleep 2
    
    print_warning "Starting frontend server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║   Servers Started Successfully!                            ║"
    echo "╠════════════════════════════════════════════════════════════╣"
    echo "│ Backend:  http://localhost:5000                            │"
    echo "│ Frontend: http://localhost:5173                            │"
    echo "│ API Docs: http://localhost:5000/api                        │"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    
    # Handle signals
    trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT INT TERM
    
    # Wait for processes
    wait
}

# Main execution
main() {
    check_prerequisites
    setup_backend
    setup_frontend
    
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║   Setup Complete! Ready to start servers                  ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    
    read -p "Do you want to start the development servers now? (y/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        start_servers
    else
        echo ""
        print_status "To start servers manually, run:"
        echo "  Backend:  cd backend && npm run dev"
        echo "  Frontend: cd frontend && npm run dev"
        echo ""
    fi
}

# Run main function
main
