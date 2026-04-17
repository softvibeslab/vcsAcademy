#!/bin/bash

# VCSA Deployment Script
# This script deploys the VCSA application using Docker Compose

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

# Check if .env files exist
check_env_files() {
    log_info "Checking environment files..."

    if [ ! -f "backend/.env" ]; then
        log_warn "backend/.env not found. Creating from .env.example..."
        cp backend/.env.example backend/.env
        log_warn "Please edit backend/.env with your configuration before running the deployment again."
        exit 1
    fi

    if [ ! -f "frontend/.env" ]; then
        log_warn "frontend/.env not found. Creating from .env.example..."
        cp frontend/.env.example frontend/.env
        log_warn "Please edit frontend/.env with your configuration before running the deployment again."
        exit 1
    fi

    log_info "Environment files found."
}

# Build Docker images
build_images() {
    log_info "Building Docker images..."
    docker-compose build --no-cache
    log_info "Docker images built successfully."
}

# Start services
start_services() {
    log_info "Starting services..."
    docker-compose up -d
    log_info "Services started successfully."
}

# Stop services
stop_services() {
    log_info "Stopping services..."
    docker-compose down
    log_info "Services stopped successfully."
}

# Restart services
restart_services() {
    log_info "Restarting services..."
    docker-compose restart
    log_info "Services restarted successfully."
}

# Check service health
check_health() {
    log_info "Checking service health..."
    sleep 10  # Give services time to start

    services=("mongodb" "backend" "frontend")

    for service in "${services[@]}"; do
        if docker-compose ps | grep -q "$service.*Up"; then
            log_info "$service is running."
        else
            log_error "$service is not running!"
            return 1
        fi
    done

    log_info "All services are healthy."
}

# View logs
view_logs() {
    service=$1
    if [ -z "$service" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$service"
    fi
}

# Backup database
backup_database() {
    log_info "Backing up MongoDB..."
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_file="backup/mongodb_backup_$timestamp"

    mkdir -p backup

    docker-compose exec -T mongodb mongodump \
        --uri="mongodb://$MONGO_ROOT_USERNAME:$MONGO_ROOT_PASSWORD@mongodb:27017/$DB_NAME" \
        --archive="$backup_file.archive"

    log_info "Database backed up to $backup_file.archive"
}

# Main menu
show_menu() {
    echo ""
    echo "VCSA Deployment Menu"
    echo "===================="
    echo "1) Deploy (Build & Start)"
    echo "2) Start Services"
    echo "3) Stop Services"
    echo "4) Restart Services"
    echo "5) Check Health"
    echo "6) View Logs"
    echo "7) Backup Database"
    echo "8) Exit"
    echo ""
}

# Main script
main() {
    case "$1" in
        deploy)
            check_env_files
            build_images
            start_services
            check_health
            ;;
        start)
            start_services
            check_health
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services
            check_health
            ;;
        health)
            check_health
            ;;
        logs)
            view_logs "$2"
            ;;
        backup)
            backup_database
            ;;
        *)
            show_menu
            read -p "Select an option: " choice
            case $choice in
                1) main "deploy" ;;
                2) main "start" ;;
                3) main "stop" ;;
                4) main "restart" ;;
                5) main "health" ;;
                6) main "logs" ;;
                7) main "backup" ;;
                8) exit 0 ;;
                *) log_error "Invalid option" ;;
            esac
            ;;
    esac
}

# Run main function
main "$@"
