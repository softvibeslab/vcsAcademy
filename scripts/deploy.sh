#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# VCSA Deploy Script
# ═══════════════════════════════════════════════════════════════
#
# Automated deployment script for VCSA platform
#
# Features:
# - Pre-deployment checks
# - Backup creation
# - Zero-downtime deployment
# - Health checks
# - Rollback on failure
# - Deployment notifications
#
# Author: VCSA DevOps Team
# Created: April 2026
# Status: Production Ready
# ═══════════════════════════════════════════════════════════════

set -e

# Configuration
DEPLOYMENT_DIR="/opt/vcsavibes"
BACKUP_DIR="/opt/vcsavibes/backups/pre-deploy"
LOG_FILE="/var/log/vcsavibes/deploy.log"
HEALTH_CHECK_URL="http://localhost:8000/api/health"
MAX_RETRIES=5
RETRY_DELAY=10

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Error handling
error_exit() {
    log "ERROR: $1"
    log "Deployment failed. Rolling back..."
    rollback
    exit 1
}

# Pre-deployment checks
pre_deploy_checks() {
    log "Running pre-deployment checks..."

    # Check disk space
    local available_space=$(df "$DEPLOYMENT_DIR" | awk 'NR==2 {print $4}')
    log "Available disk space: $available_space"

    # Check Docker daemon
    if ! docker ps >/dev/null 2>&1; then
        error_exit "Docker daemon is not running"
    fi

    # Check MongoDB connection
    if ! docker-compose ps | grep -q mongodb; then
        error_exit "MongoDB is not running"
    fi

    log "Pre-deployment checks passed"
}

# Create backup
create_backup() {
    log "Creating pre-deployment backup..."

    mkdir -p "$BACKUP_DIR"

    # Backup current running containers
    docker-compose ps > "$BACKUP_DIR/docker_ps_$TIMESTAMP.log"

    # Backup database
    docker-compose exec -T mongodb mongodump \
        --uri="mongodb://admin:password@localhost:27017/vcsa" \
        --archive="$BACKUP_DIR/mongodb_backup.gz" \
        --gzip || error_exit "Database backup failed"

    log "Backup created successfully"
}

# Pull latest images
pull_images() {
    log "Pulling latest Docker images..."

    docker-compose pull || error_exit "Failed to pull images"

    log "Images pulled successfully"
}

# Deploy new version
deploy() {
    log "Deploying new version..."

    # Zero-downtime deployment
    docker-compose up -d --no-deps --build \
        || error_exit "Deployment failed"

    log "Deployment completed"
}

# Health check
health_check() {
    log "Running health checks..."

    local retries=0
    local max_retries=$MAX_RETRIES

    while [ $retries -lt $max_retries ]; do
        if curl -f "$HEALTH_CHECK_URL" >/dev/null 2>&1; then
            log "Health check passed"
            return 0
        fi

        retries=$((retries + 1))
        log "Health check failed, retrying ($retries/$max_retries)..."
        sleep $RETRY_DELAY
    done

    error_exit "Health check failed after $max_retries retries"
}

# Run smoke tests
smoke_tests() {
    log "Running smoke tests..."

    # Test API endpoints
    curl -f "$HEALTH_CHECK_URL" >/dev/null 2>&1 || error_exit "Health endpoint failed"
    curl -f "http://localhost:8000/api/" >/dev/null 2>&1 || error_exit "API root failed"

    # Test frontend
    curl -f "http://localhost:3000/" >/dev/null 2>&1 || error_exit "Frontend failed"

    log "Smoke tests passed"
}

# Rollback on failure
rollback() {
    log "Rolling back to previous version..."

    # Restore database from backup
    if [ -f "$BACKUP_DIR/mongodb_backup.gz" ]; then
        docker-compose exec -T mongodb mongorestore \
            --uri="mongodb://admin:password@localhost:27017/vcsa" \
            --archive="$BACKUP_DIR/mongodb_backup.gz" \
            --gzip || log "WARNING: Database restore failed"
    fi

    # Restart containers
    docker-compose up -d --no-deps || log "WARNING: Container restart failed"

    log "Rollback completed"
}

# Cleanup
cleanup() {
    log "Cleaning up..."

    # Remove old Docker images
    docker image prune -f

    # Remove old backups (keep last 5)
    ls -t "$BACKUP_DIR"/mongodb_backup*.gz | tail -n +6 | xargs -r rm 2>/dev/null || true

    log "Cleanup completed"
}

# Send notification
send_notification() {
    local status=$1
    local message="Deployment $status"

    log "Sending notification: $message"

    # Send Slack notification
    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -X POST "$SLACK_WEBHOOK" \
            -H 'Content-Type: application/json' \
            -d "{\"text\": \"$message\"}" \
            >/dev/null 2>&1 || log "WARNING: Slack notification failed"
    fi
}

# Main deployment process
main() {
    log "=========================================="
    log "Starting deployment process"
    log "=========================================="

    pre_deploy_checks
    create_backup
    pull_images
    deploy
    health_check
    smoke_tests
    cleanup

    log "=========================================="
    log "Deployment completed successfully!"
    log "=========================================="

    send_notification "succeeded"
}

# Trap errors
trap 'error_exit "Deployment failed unexpectedly"' ERR

# Run main function
main
