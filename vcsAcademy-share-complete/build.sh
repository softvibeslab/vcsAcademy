#!/bin/bash

# VCSA Build Script
# This script builds the frontend and backend for deployment

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    log_info "Node.js version: $(node --version)"
}

# Check if Python is installed
check_python() {
    if ! command -v python3 &> /dev/null; then
        log_error "Python 3 is not installed. Please install Python 3 first."
        exit 1
    fi
    log_info "Python version: $(python3 --version)"
}

# Install frontend dependencies
install_frontend_deps() {
    log_info "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    log_info "Frontend dependencies installed."
}

# Build frontend
build_frontend() {
    log_info "Building frontend..."
    cd frontend

    # Check if .env exists
    if [ ! -f ".env" ]; then
        log_warn ".env file not found. Creating from .env.example..."
        cp .env.example .env
        log_warn "Please edit .env with your configuration."
    fi

    # Build
    npm run build
    cd ..
    log_info "Frontend built successfully."
}

# Install backend dependencies
install_backend_deps() {
    log_info "Installing backend dependencies..."
    cd backend

    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        log_info "Creating Python virtual environment..."
        python3 -m venv venv
    fi

    # Activate virtual environment
    source venv/bin/activate

    # Install dependencies
    pip install -r requirements.txt

    cd ..
    log_info "Backend dependencies installed."
}

# Run backend tests
test_backend() {
    log_info "Running backend tests..."
    cd backend
    source venv/bin/activate
    python -m pytest tests/ -v || true
    cd ..
    log_info "Backend tests completed."
}

# Run frontend tests
test_frontend() {
    log_info "Running frontend tests..."
    cd frontend
    npm test -- --watchAll=false || true
    cd ..
    log_info "Frontend tests completed."
}

# Build Docker images
build_docker() {
    log_info "Building Docker images..."
    docker-compose build
    log_info "Docker images built successfully."
}

# Clean build artifacts
clean() {
    log_info "Cleaning build artifacts..."
    rm -rf frontend/build
    rm -rf frontend/node_modules
    rm -rf backend/__pycache__
    rm -rf backend/.pytest_cache
    log_info "Build artifacts cleaned."
}

# Main menu
show_menu() {
    echo ""
    echo "VCSA Build Menu"
    echo "=============="
    echo "1) Install All Dependencies"
    echo "2) Build Frontend"
    echo "3) Install Backend Dependencies"
    echo "4) Run All Tests"
    echo "5) Build Docker Images"
    echo "6) Clean Build Artifacts"
    echo "7) Full Build (Deps + Build + Tests)"
    echo "8) Exit"
    echo ""
}

# Full build
full_build() {
    check_node
    check_python
    install_frontend_deps
    build_frontend
    install_backend_deps
    test_backend
    test_frontend
}

# Main script
main() {
    case "$1" in
        deps)
            check_node
            check_python
            install_frontend_deps
            install_backend_deps
            ;;
        frontend)
            check_node
            build_frontend
            ;;
        backend)
            check_python
            install_backend_deps
            ;;
        test)
            test_backend
            test_frontend
            ;;
        docker)
            build_docker
            ;;
        clean)
            clean
            ;;
        full)
            full_build
            ;;
        *)
            show_menu
            read -p "Select an option: " choice
            case $choice in
                1) main "deps" ;;
                2) main "frontend" ;;
                3) main "backend" ;;
                4) main "test" ;;
                5) main "docker" ;;
                6) main "clean" ;;
                7) main "full" ;;
                8) exit 0 ;;
                *) log_error "Invalid option" ;;
            esac
            ;;
    esac
}

# Run main function
main "$@"
