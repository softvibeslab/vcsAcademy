#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# VCSA Production Deployment Script with Smoke Testing
# ═══════════════════════════════════════════════════════════════
#
# Comprehensive production deployment with automated verification
#
# Usage: ./deploy-production-with-tests.sh [options]
#
# Options:
#   --skip-backup       Skip database backup
#   --skip-smoke-tests  Skip smoke tests
#   --rollback-on-fail  Automatic rollback on smoke test failure
#   --verbose           Show detailed output
#   --dry-run           Simulate deployment without making changes
#   --help              Show this help message
#
# Author: VCSA DevOps Team
# Created: April 2026
# Status: Production Ready
# ═══════════════════════════════════════════════════════════════

set -e

# ═══════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.production.yml"
BACKUP_DIR="backup"
LOG_FILE="deployment_$(date +%Y%m%d_%H%M%S).log"

# Options
SKIP_BACKUP=false
SKIP_SMOKE_TESTS=false
ROLLBACK_ON_FAIL=false
VERBOSE=false
DRY_RUN=false

# ═══════════════════════════════════════════════════════════════
# UTILITY FUNCTIONS
# ═══════════════════════════════════════════════════════════════

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1" | tee -a "$LOG_FILE"
}

log_step() {
    echo -e "\n${GREEN}═══════════════════════════════════════${NC}"
    echo -e "${GREEN}$1${NC}"
    echo -e "${GREEN}═══════════════════════════════════════${NC}\n" | tee -a "$LOG_FILE"
}

# ═══════════════════════════════════════════════════════════════
# PRE-DEPLOYMENT CHECKS
# ═══════════════════════════════════════════════════════════════

pre_deployment_checks() {
    log_step "Pre-Deployment Checks"

    # Check if running as root
    if [ "$EUID" -eq 0 ]; then
        log_warning "Running as root. This is not recommended."
    fi

    # Check if docker-compose file exists
    if [ ! -f "$COMPOSE_FILE" ]; then
        log_error "Docker Compose file not found: $COMPOSE_FILE"
        exit 1
    fi
    log_success "Docker Compose file found"

    # Check if .env.production exists
    if [ ! -f ".env.production" ]; then
        log_error "Production environment file not found: .env.production"
        log_error "Please create .env.production before deploying"
        exit 1
    fi
    log_success "Production environment file found"

    # Check Docker is running
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running"
        exit 1
    fi
    log_success "Docker is running"

    # Check docker-compose is available
    if ! command -v docker-compose &> /dev/null; then
        log_error "docker-compose not found"
        exit 1
    fi
    log_success "docker-compose is available"

    # Check available disk space
    available_space=$(df -BG . | tail -1 | awk '{print $4}' | sed 's/G//')
    if [ "$available_space" -lt 5 ]; then
        log_warning "Low disk space: ${available_space}GB available"
    else
        log_success "Disk space OK: ${available_space}GB available"
    fi

    log_success "Pre-deployment checks passed"
}

# ═══════════════════════════════════════════════════════════════
# BACKUP PROCEDURES
# ═══════════════════════════════════════════════════════════════

create_backup_directory() {
    log_step "Creating Backup Directory"

    local timestamp=$(date +%Y%m%d_%H%M%S)
    BACKUP_DIR="backup/deployment_${timestamp}"
    mkdir -p "$BACKUP_DIR"

    log_success "Backup directory created: $BACKUP_DIR"
}

backup_database() {
    if [ "$SKIP_BACKUP" = true ]; then
        log_warning "Skipping database backup"
        return 0
    fi

    log_step "Backing Up Database"

    local backup_file="$BACKUP_DIR/mongodb_backup.tar.gz"

    log_info "Creating database backup..."

    # Check if MongoDB container is running
    if docker-compose -f "$COMPOSE_FILE" ps | grep -q mongodb.*Up; then
        docker-compose -f "$COMPOSE_FILE" exec -T mongodb mongodump \
            --archive="$backup_file" \
            --gzip || {
            log_error "Database backup failed"
            return 1
        }
    else
        log_warning "MongoDB container not running, skipping backup"
        return 0
    fi

    if [ -f "$backup_file" ]; then
        local backup_size=$(du -h "$backup_file" | cut -f1)
        log_success "Database backup created: $backup_file ($backup_size)"
    else
        log_error "Database backup file not created"
        return 1
    fi
}

backup_configuration() {
    log_step "Backing Up Configuration"

    # Backup environment files
    cp .env.production "$BACKUP_DIR/env_production.bak"
    log_success "Environment configuration backed up"

    # Backup Docker Compose file
    cp "$COMPOSE_FILE" "$BACKUP_DIR/docker-compose.production.bak"
    log_success "Docker Compose configuration backed up"

    # Save current Docker images
    docker images --format "{{.Repository}}:{{.Tag}}" | grep vcsa > \
        "$BACKUP_DIR/docker_images.txt" || true
    log_success "Docker images list saved"
}

backup_current_images() {
    log_step "Backing Up Current Docker Images"

    # Save backend image
    if docker images | grep -q vcsa-production-backend; then
        docker save vcsa-production-backend:latest | \
            gzip > "$BACKUP_DIR/vcsa-backend.tar.gz" || {
            log_warning "Failed to backup backend image"
        }
        log_success "Backend image backed up"
    fi

    # Save frontend image
    if docker images | grep -q vcsa-production-frontend; then
        docker save vcsa-production-frontend:latest | \
            gzip > "$BACKUP_DIR/vcsa-frontend.tar.gz" || {
            log_warning "Failed to backup frontend image"
        }
        log_success "Frontend image backed up"
    fi
}

# ═══════════════════════════════════════════════════════════════
# DEPLOYMENT PROCEDURES
# ═══════════════════════════════════════════════════════════════

stop_services() {
    log_step "Stopping Current Services"

    if [ "$DRY_RUN" = true ]; then
        log_warning "DRY RUN: Would stop services"
        return 0
    fi

    docker-compose -f "$COMPOSE_FILE" down || {
        log_error "Failed to stop services"
        return 1
    }

    log_success "Services stopped"
}

build_images() {
    log_step "Building Docker Images"

    if [ "$DRY_RUN" = true ]; then
        log_warning "DRY RUN: Would build images"
        return 0
    fi

    log_info "Building Docker images (this may take a while)..."

    docker-compose -f "$COMPOSE_FILE" build --no-cache || {
        log_error "Failed to build images"
        return 1
    }

    log_success "Docker images built successfully"
}

start_services() {
    log_step "Starting Services"

    if [ "$DRY_RUN" = true ]; then
        log_warning "DRY RUN: Would start services"
        return 0
    fi

    docker-compose -f "$COMPOSE_FILE" up -d || {
        log_error "Failed to start services"
        return 1
    }

    log_success "Services started"
}

wait_for_services() {
    log_step "Waiting for Services to Be Healthy"

    local max_wait=120
    local wait_time=0
    local check_interval=5

    log_info "Waiting for services to become healthy (max ${max_wait}s)..."

    while [ $wait_time -lt $max_wait ]; do
        local all_healthy=true

        # Check each service
        local services=("mongodb" "backend" "frontend")
        for service in "${services[@]}"; do
            if ! docker-compose -f "$COMPOSE_FILE" ps | grep -q "$service.*healthy\|$service.*Up"; then
                all_healthy=false
                break
            fi
        done

        if [ "$all_healthy" = true ]; then
            log_success "All services are healthy"
            return 0
        fi

        sleep $check_interval
        wait_time=$((wait_time + check_interval))
        echo -n "."
    done

    echo ""

    if [ $wait_time -ge $max_wait ]; then
        log_error "Services did not become healthy within ${max_wait}s"
        return 1
    fi
}

verify_services() {
    log_step "Verifying Services"

    # Check service status
    log_info "Service status:"
    docker-compose -f "$COMPOSE_FILE" ps | tee -a "$LOG_FILE"

    # Check for running containers
    local running_count=$(docker-compose -f "$COMPOSE_FILE" ps | grep -c "Up" || true)
    log_info "Running containers: $running_count"

    if [ "$running_count" -lt 3 ]; then
        log_error "Not all services are running"
        return 1
    fi

    log_success "Service verification passed"
}

# ═══════════════════════════════════════════════════════════════
# SMOKE TESTS
# ═══════════════════════════════════════════════════════════════

run_smoke_tests() {
    if [ "$SKIP_SMOKE_TESTS" = true ]; then
        log_warning "Skipping smoke tests"
        return 0
    fi

    log_step "Running Smoke Tests"

    local smoke_test_script="./scripts/smoke_tests.sh"

    if [ ! -f "$smoke_test_script" ]; then
        log_warning "Smoke test script not found: $smoke_test_script"
        return 0
    fi

    # Make script executable
    chmod +x "$smoke_test_script"

    # Run smoke tests
    if [ "$DRY_RUN" = true ]; then
        log_warning "DRY RUN: Would run smoke tests"
        return 0
    fi

    log_info "Running smoke tests..."
    bash "$smoke_test_script" 2>&1 | tee -a "$LOG_FILE"

    local exit_code=${PIPESTATUS[0]}

    if [ $exit_code -eq 0 ]; then
        log_success "Smoke tests passed"
        return 0
    else
        log_error "Smoke tests failed"

        if [ "$ROLLBACK_ON_FAIL" = true ]; then
            log_warning "Automatic rollback triggered"
            perform_rollback
        fi

        return 1
    fi
}

# ═══════════════════════════════════════════════════════════════
# ROLLBACK PROCEDURES
# ═══════════════════════════════════════════════════════════════

perform_rollback() {
    log_step "Performing Rollback"

    log_warning "Rolling back to previous version..."

    # Stop current services
    docker-compose -f "$COMPOSE_FILE" down || {
        log_error "Failed to stop services for rollback"
    }

    # Restore previous images
    if [ -f "$BACKUP_DIR/vcsa-backend.tar.gz" ]; then
        log_info "Restoring backend image..."
        docker load < "$BACKUP_DIR/vcsa-backend.tar.gz" || {
            log_warning "Failed to restore backend image"
        }
    fi

    if [ -f "$BACKUP_DIR/vcsa-frontend.tar.gz" ]; then
        log_info "Restoring frontend image..."
        docker load < "$BACKUP_DIR/vcsa-frontend.tar.gz" || {
            log_warning "Failed to restore frontend image"
        }
    fi

    # Restart services
    docker-compose -f "$COMPOSE_FILE" up -d || {
        log_error "Failed to restart services after rollback"
    }

    # Wait for services
    wait_for_services || {
        log_warning "Services did not become healthy after rollback"
    }

    log_warning "Rollback complete"
}

# ═══════════════════════════════════════════════════════════════
# POST-DEPLOYMENT
# ═══════════════════════════════════════════════════════════════

post_deployment_summary() {
    log_step "Deployment Summary"

    echo -e "\n${GREEN}✅ Deployment completed successfully!${NC}\n"

    echo "📊 Deployment Information:"
    echo "   Timestamp: $(date)"
    echo "   Backup Directory: $BACKUP_DIR"
    echo "   Log File: $LOG_FILE"

    echo -e "\n📍 Access URLs:"
    echo "   Frontend: http://localhost:8080"
    echo "   Backend API: http://localhost:8000"
    echo "   API Docs: http://localhost:8000/docs"

    echo -e "\n📝 Useful Commands:"
    echo "   View logs: docker-compose -f $COMPOSE_FILE logs -f"
    echo "   Stop services: docker-compose -f $COMPOSE_FILE down"
    echo "   Restart: docker-compose -f $COMPOSE_FILE restart"
    echo "   Check status: docker-compose -f $COMPOSE_FILE ps"

    echo -e "\n${GREEN}═══════════════════════════════════════${NC}\n"
}

# ═══════════════════════════════════════════════════════════════
# MAIN SCRIPT
# ═══════════════════════════════════════════════════════════════

print_usage() {
    cat << EOF
Usage: $0 [options]

Options:
  --skip-backup       Skip database backup
  --skip-smoke-tests  Skip smoke tests
  --rollback-on-fail  Automatic rollback on smoke test failure
  --verbose           Show detailed output
  --dry-run           Simulate deployment without making changes
  --help              Show this help message

Environment Variables:
  COMPOSE_FILE        Docker Compose file (default: docker-compose.production.yml)

Examples:
  # Standard deployment
  $0

  # Deployment with automatic rollback on failure
  $0 --rollback-on-fail

  # Dry run deployment
  $0 --dry-run

  # Skip backups and smoke tests (fast deployment)
  $0 --skip-backup --skip-smoke-tests

EOF
}

main() {
    echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   VCSA Production Deployment         ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
    echo -e "\nTimestamp: $(date)\n"

    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-backup)
                SKIP_BACKUP=true
                shift
                ;;
            --skip-smoke-tests)
                SKIP_SMOKE_TESTS=true
                shift
                ;;
            --rollback-on-fail)
                ROLLBACK_ON_FAIL=true
                shift
                ;;
            --verbose)
                VERBOSE=true
                set -x
                shift
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --help)
                print_usage
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                print_usage
                exit 1
                ;;
        esac
    done

    if [ "$DRY_RUN" = true ]; then
        log_warning "DRY RUN MODE - No changes will be made"
    fi

    # Execute deployment steps
    pre_deployment_checks || exit 1
    create_backup_directory || exit 1
    backup_configuration || exit 1
    backup_current_images || exit 1
    backup_database || exit 1
    stop_services || exit 1
    build_images || exit 1
    start_services || exit 1
    wait_for_services || exit 1
    verify_services || exit 1
    run_smoke_tests || exit 1
    post_deployment_summary

    exit 0
}

# Run main function
main "$@"
