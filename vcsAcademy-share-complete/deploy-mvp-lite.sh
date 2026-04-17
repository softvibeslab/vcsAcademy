#!/bin/bash

# VCSA MVP Lite - Quick Deploy Script
# This script helps you quickly test and deploy the MVP Lite system

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Main menu
show_menu() {
    clear
    print_header "VCSA MVP Lite - Deployment Menu"
    echo ""
    echo "1. 📋 Check System Requirements"
    echo "2. 🔧 Setup Environment"
    echo "3. 🚀 Start Development Servers"
    echo "4. 🧪 Test API Endpoints"
    echo "5. 🏗️  Build for Production"
    echo "6. 📦 Deploy to Production"
    echo "7. 📊 View System Status"
    echo "8. 🧹 Clean/Reset System"
    echo "0. Exit"
    echo ""
    read -p "Select an option: " choice
    return $choice
}

# Check requirements
check_requirements() {
    print_header "Checking System Requirements"

    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v)
        print_success "Node.js installed: $NODE_VERSION"
    else
        print_error "Node.js not found. Install from https://nodejs.org/"
        return 1
    fi

    # Check Python
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version)
        print_success "Python installed: $PYTHON_VERSION"
    else
        print_error "Python not found. Install from https://python.org/"
        return 1
    fi

    # Check MongoDB
    if command -v mongosh &> /dev/null || command -v mongo &> /dev/null; then
        print_success "MongoDB installed"
    else
        print_warning "MongoDB not found. Install from https://www.mongodb.com/try"
        echo "  Or use Docker: docker-compose up -d mongodb"
    fi

    # Check Docker
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker -v)
        print_success "Docker installed: $DOCKER_VERSION"
    else
        print_warning "Docker not found (optional)"
    fi

    # Check yarn/npm
    if command -v yarn &> /dev/null; then
        YARN_VERSION=$(yarn -v)
        print_success "Yarn installed: $YARN_VERSION"
    elif command -v npm &> /dev/null; then
        NPM_VERSION=$(npm -v)
        print_success "NPM installed: $NPM_VERSION"
    else
        print_error "No package manager found. Install yarn or npm"
        return 1
    fi

    echo ""
    read -p "Press Enter to continue..."
}

# Setup environment
setup_environment() {
    print_header "Setting Up Environment"

    # Backend .env
    if [ ! -f "backend/.env" ]; then
        echo "Creating backend/.env..."
        cat > backend/.env << EOF
# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017
DB_NAME=vcsa

# JWT Secret (generate a secure random string)
JWT_SECRET=$(openssl rand -hex 32)

# Stripe API Key (test mode)
STRIPE_API_KEY=sk_test_your_stripe_key_here

# Environment
ENVIRONMENT=development

# Sentry (optional)
# SENTRY_DSN=your_sentry_dsn_here
EOF
        print_success "Created backend/.env"
    else
        print_success "backend/.env already exists"
    fi

    # Frontend .env
    if [ ! -f "frontend/.env" ]; then
        echo "Creating frontend/.env..."
        cat > frontend/.env << EOF
# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8000
EOF
        print_success "Created frontend/.env"
    else
        print_success "frontend/.env already exists"
    fi

    echo ""
    echo "Environment files created. Please review:"
    echo "  - backend/.env"
    echo "  - frontend/.env"
    echo ""
    read -p "Press Enter to continue..."
}

# Start development servers
start_dev_servers() {
    print_header "Starting Development Servers"

    # Check if MongoDB is running
    if ! pgrep -x "mongod" > /dev/null; then
        echo "MongoDB is not running. Starting with Docker..."
        docker-compose up -d mongodb
        sleep 3
    fi

    # Start backend
    echo "Starting backend server..."
    cd backend
    pip install -r requirements.txt > /dev/null 2>&1
    uvicorn server:app --reload --host 0.0.0.0 --port 8000 > /tmp/vcsa_backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    print_success "Backend started (PID: $BACKEND_PID)"
    echo "  Logs: tail -f /tmp/vcsa_backend.log"

    # Start frontend
    echo "Starting frontend server..."
    cd frontend
    if command -v yarn &> /dev/null; then
        yarn install > /dev/null 2>&1
        yarn start > /tmp/vcsa_frontend.log 2>&1 &
    else
        npm install > /dev/null 2>&1
        npm start > /tmp/vcsa_frontend.log 2>&1 &
    fi
    FRONTEND_PID=$!
    cd ..
    print_success "Frontend started (PID: $FRONTEND_PID)"
    echo "  Logs: tail -f /tmp/vcsa_frontend.log"

    # Save PIDs for cleanup
    echo $BACKEND_PID > /tmp/vcsa_backend.pid
    echo $FRONTEND_PID > /tmp/vcsa_frontend.pid

    echo ""
    print_success "Development servers started!"
    echo ""
    echo "Frontend: http://localhost:3000"
    echo "Backend API: http://localhost:8000"
    echo "API Docs: http://localhost:8000/docs"
    echo ""
    echo "To stop servers, run: ./deploy-mvp-lite.sh and select option 8"
    echo ""
    read -p "Press Enter to continue..."
}

# Test API endpoints
test_api() {
    print_header "Testing API Endpoints"

    # Check if backend is running
    if ! curl -s http://localhost:8000/api/health > /dev/null; then
        print_error "Backend is not running. Start it first (option 3)"
        read -p "Press Enter to continue..."
        return 1
    fi

    echo "Testing health endpoint..."
    curl -s http://localhost:8000/api/health | python3 -m json.tool
    echo ""

    # Get demo token
    echo "Getting demo user token..."
    TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{"email": "demo@vcsa.com", "password": "demo123"}' \
        | python3 -c "import sys, json; print(json.load(sys.stdin).get('access_token', ''))")

    if [ -z "$TOKEN" ]; then
        print_error "Could not get token. Check demo user exists."
        read -p "Press Enter to continue..."
        return 1
    fi

    print_success "Got token: ${TOKEN:0:20}..."

    echo ""
    echo "Testing Strategy endpoint..."
    curl -s http://localhost:8000/api/dashboard/strategy \
        -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
    echo ""

    echo "Testing Performance endpoint..."
    curl -s http://localhost:8000/api/dashboard/performance \
        -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
    echo ""

    print_success "API tests completed!"
    read -p "Press Enter to continue..."
}

# Build for production
build_production() {
    print_header "Building for Production"

    # Frontend
    echo "Building frontend..."
    cd frontend
    if command -v yarn &> /dev/null; then
        yarn build
    else
        npm run build
    fi
    cd ..
    print_success "Frontend built successfully!"

    # Check build size
    BUILD_SIZE=$(du -sh frontend/build | cut -f1)
    echo "Build size: $BUILD_SIZE"

    echo ""
    print_success "Production build complete!"
    echo "  Location: frontend/build/"
    echo ""
    read -p "Press Enter to continue..."
}

# Deploy to production
deploy_production() {
    print_header "Deploy to Production"

    echo "⚠️  WARNING: This will deploy to production!"
    echo ""
    echo "Make sure you have:"
    echo "  1. Updated .env files with production values"
    echo "  2. Built production assets (option 5)"
    echo "  3. Tested everything locally"
    echo "  4. Backed up your database"
    echo ""
    read -p "Continue? (yes/no): " confirm

    if [ "$confirm" != "yes" ]; then
        echo "Deployment cancelled."
        read -p "Press Enter to continue..."
        return 0
    fi

    # TODO: Add actual deployment logic here
    # This could be:
    # - Docker deployment
    # - AWS S3 + EC2
    # - DigitalOcean
    # - Heroku
    # - etc.

    echo "Deployment logic not implemented yet."
    echo "Please deploy manually based on your hosting provider."
    echo ""
    echo "Files to deploy:"
    echo "  - Frontend: frontend/build/"
    echo "  - Backend: backend/ (all files)"
    echo "  - Environment: .env files (configure for production)"
    echo ""
    read -p "Press Enter to continue..."
}

# View system status
view_status() {
    print_header "System Status"

    # Backend status
    if curl -s http://localhost:8000/api/health > /dev/null; then
        print_success "Backend: Running"
        echo "  URL: http://localhost:8000"
        echo "  Docs: http://localhost:8000/docs"
    else
        print_error "Backend: Not running"
    fi

    # Frontend status
    if curl -s http://localhost:3000 > /dev/null; then
        print_success "Frontend: Running"
        echo "  URL: http://localhost:3000"
    else
        print_error "Frontend: Not running"
    fi

    # MongoDB status
    if pgrep -x "mongod" > /dev/null || docker ps | grep -q mongo; then
        print_success "MongoDB: Running"
    else
        print_error "MongoDB: Not running"
    fi

    echo ""
    echo "Process IDs:"
    if [ -f /tmp/vcsa_backend.pid ]; then
        BACKEND_PID=$(cat /tmp/vcsa_backend.pid)
        if ps -p $BACKEND_PID > /dev/null; then
            echo "  Backend PID: $BACKEND_PID"
        fi
    fi

    if [ -f /tmp/vcsa_frontend.pid ]; then
        FRONTEND_PID=$(cat /tmp/vcsa_frontend.pid)
        if ps -p $FRONTEND_PID > /dev/null; then
            echo "  Frontend PID: $FRONTEND_PID"
        fi
    fi

    echo ""
    read -p "Press Enter to continue..."
}

# Clean/reset system
clean_system() {
    print_header "Clean/Reset System"

    echo "This will stop all servers and clean temporary files."
    read -p "Continue? (yes/no): " confirm

    if [ "$confirm" != "yes" ]; then
        echo "Cancelled."
        read -p "Press Enter to continue..."
        return 0
    fi

    # Stop backend
    if [ -f /tmp/vcsa_backend.pid ]; then
        BACKEND_PID=$(cat /tmp/vcsa_backend.pid)
        if ps -p $BACKEND_PID > /dev/null; then
            kill $BACKEND_PID
            print_success "Stopped backend (PID: $BACKEND_PID)"
        fi
        rm /tmp/vcsa_backend.pid
    fi

    # Stop frontend
    if [ -f /tmp/vcsa_frontend.pid ]; then
        FRONTEND_PID=$(cat /tmp/vcsa_frontend.pid)
        if ps -p $FRONTEND_PID > /dev/null; then
            kill $FRONTEND_PID
            print_success "Stopped frontend (PID: $FRONTEND_PID)"
        fi
        rm /tmp/vcsa_frontend.pid
    fi

    # Clean logs
    rm -f /tmp/vcsa_backend.log /tmp/vcsa_frontend.log
    print_success "Cleaned log files"

    echo ""
    print_success "System cleaned!"
    read -p "Press Enter to continue..."
}

# Main loop
while true; do
    show_menu
    case $choice in
        1) check_requirements ;;
        2) setup_environment ;;
        3) start_dev_servers ;;
        4) test_api ;;
        5) build_production ;;
        6) deploy_production ;;
        7) view_status ;;
        8) clean_system ;;
        0) echo "Goodbye!"; exit 0 ;;
        *) echo "Invalid option"; sleep 1 ;;
    esac
done
