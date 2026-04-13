#!/bin/bash

# VCSA MVP Lite - Quick Setup & Test Script
# This script sets up the environment and runs all tests

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}${BOLD}========================================${NC}"
    echo -e "${BLUE}${BOLD}$1${NC}"
    echo -e "${BLUE}${BOLD}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

clear
print_header "VCSA MVP Lite - Setup & Test Suite"
echo ""

# Check prerequisites
print_header "1. Checking Prerequisites"

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    print_success "Python: $PYTHON_VERSION"
else
    print_error "Python not found. Install from https://python.org/"
    exit 1
fi

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_success "Node.js: $NODE_VERSION"
else
    print_error "Node.js not found. Install from https://nodejs.org/"
    exit 1
fi

# Check MongoDB
if pgrep -x "mongod" > /dev/null || docker ps | grep -q mongo; then
    print_success "MongoDB: Running"
else
    print_info "MongoDB not running. Starting with Docker..."
    docker-compose up -d mongodb
    sleep 5
fi

echo ""

# Setup Backend
print_header "2. Setting Up Backend"

cd backend

# Create .env if not exists
if [ ! -f .env ]; then
    print_info "Creating .env file..."
    cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=vcsa
JWT_SECRET=$(openssl rand -hex 32)
STRIPE_API_KEY=sk_test_placeholder
ENVIRONMENT=development
EOF
    print_success "Created .env file"
else
    print_success ".env file already exists"
fi

# Install Python dependencies
print_info "Installing Python dependencies..."
pip install -q -r requirements.txt
print_success "Dependencies installed"

# Seed database
print_info "Seeding database with demo data..."
python3 seed_mvp_lite.py
print_success "Database seeded"

# Start backend server
print_info "Starting backend server..."
uvicorn server:app --reload --host 0.0.0.0 --port 8000 > /tmp/vcsa_backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > /tmp/vcsa_backend.pid
print_success "Backend server started (PID: $BACKEND_PID)"

# Wait for backend to be ready
print_info "Waiting for backend to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
        print_success "Backend is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Backend failed to start. Check logs: tail -f /tmp/vcsa_backend.log"
        exit 1
    fi
    sleep 1
done

cd ..
echo ""

# Setup Frontend
print_header "3. Setting Up Frontend"

cd frontend

# Create .env if not exists
if [ ! -f .env ]; then
    print_info "Creating .env file..."
    cat > .env << EOF
REACT_APP_BACKEND_URL=http://localhost:8000
EOF
    print_success "Created .env file"
else
    print_success ".env file already exists"
fi

# Install dependencies
print_info "Installing Node dependencies..."
if command -v yarn &> /dev/null; then
    yarn install --silent
else
    npm install --silent
fi
print_success "Dependencies installed"

cd ..
echo ""

# Run Tests
print_header "4. Running API Tests"

cd backend
print_info "Running test suite..."
python3 test_mvp_lite.py
cd ..
echo ""

# Summary
print_header "Setup Complete!"
echo ""
echo -e "${GREEN}All systems ready!${NC}"
echo ""
echo "🌐 Frontend: ${BLUE}http://localhost:3000${NC}"
echo "🔧 Backend API: ${BLUE}http://localhost:8000${NC}"
echo "📚 API Docs: ${BLUE}http://localhost:8000/docs${NC}"
echo ""
echo "🔐 Demo Credentials:"
echo "   Email: ${YELLOW}demo@vcsa.com${NC}"
echo "   Password: ${YELLOW}demo123${NC}"
echo ""
echo "📊 To start frontend:"
echo "   cd frontend && yarn start"
echo ""
echo "🧪 To re-run tests:"
echo "   cd backend && python3 test_mvp_lite.py"
echo ""
echo "🛑 To stop servers:"
echo "   kill \$(cat /tmp/vcsa_backend.pid)"
echo ""
echo "📖 Documentation:"
echo "   - MVP_LITE_README.md (Quick Start)"
echo "   - MVP_LITE_COMPLETE.md (Full Guide)"
echo "   - BACKEND_INTEGRATION_GUIDE.md (API Docs)"
echo ""
