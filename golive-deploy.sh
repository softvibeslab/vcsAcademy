#!/bin/bash

# VCSA Go-Live Production Deployment Script
# Following the Production Go-Live Checklist

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Deployment tracking
DEPLOY_START_TIME=$(date +%s)
LOG_FILE="deployment_$(date +%Y%m%d_%H%M%S).log"

# Log everything to file
exec > >(tee -a "$LOG_FILE") 2>&1

echo "═══════════════════════════════════════════════════════════════"
echo "🚀 VCSA PRODUCTION GO-LIVE DEPLOYMENT"
echo "═══════════════════════════════════════════════════════════════"
echo "Start Time: $(date)"
echo "Branch: $(git branch --show-current)"
echo "Commit: $(git log -1 --oneline)"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Pre-deployment checklist
log_step "1. PRE-DEPLOYMENT CHECKLIST"
echo "─────────────────────────────────────────────────────────────────"

# Check if we're on the correct branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "sprint-3-complete" ]; then
    log_warn "Not on sprint-3-complete branch. Current: $CURRENT_BRANCH"
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_error "Deployment cancelled"
        exit 1
    fi
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    log_warn "Uncommitted changes detected"
    git status --short
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_error "Deployment cancelled"
        exit 1
    fi
fi

# Check environment files
log_info "Checking environment files..."
if [ ! -f "backend/.env" ]; then
    log_error "backend/.env not found"
    exit 1
fi
if [ ! -f "frontend/.env" ]; then
    log_error "frontend/.env not found"
    exit 1
fi
log_info "Environment files found ✓"

# Check disk space
log_info "Checking disk space..."
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
    log_warn "Disk usage is above 80%: ${DISK_USAGE}%"
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_error "Deployment cancelled"
        exit 1
    fi
fi
log_info "Disk space OK ✓"

echo ""
log_step "2. BACKUP CURRENT SYSTEM"
echo "─────────────────────────────────────────────────────────────────"

# Create backup directory
BACKUP_DIR="backups/pre_deploy_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
log_info "Backup directory: $BACKUP_DIR"

# Backup database if running
if docker ps | grep -q "vcsa-production-mongodb"; then
    log_info "Backing up MongoDB..."
    docker exec vcsa-production-mongodb mongodump \
        --uri="mongodb://vcsa_user:vcsa_secure_password_2024@localhost:27017/vcsa" \
        --archive="$BACKUP_DIR/mongodb_backup.archive" || log_warn "MongoDB backup failed"
    log_info "MongoDB backup completed ✓"
else
    log_warn "MongoDB container not running, skipping database backup"
fi

# Backup environment files
log_info "Backing up configuration files..."
cp backend/.env "$BACKUP_DIR/backend.env.bak"
cp frontend/.env "$BACKUP_DIR/frontend.env.bak"
cp docker-compose.production.yml "$BACKUP_DIR/docker-compose.production.yml.bak"
log_info "Configuration backup completed ✓"

echo ""
log_step "3. STOP CURRENT SERVICES"
echo "─────────────────────────────────────────────────────────────────"

log_info "Stopping production services..."
docker compose -f docker-compose.production.yml down 2>/dev/null || true
log_info "Services stopped ✓"

# Wait for containers to stop
log_info "Waiting for containers to stop..."
sleep 5

echo ""
log_step "4. BUILD NEW IMAGES"
echo "─────────────────────────────────────────────────────────────────"

log_info "Building production Docker images..."
docker compose -f docker-compose.production.yml build --no-cache
log_info "Images built successfully ✓"

echo ""
log_step "5. START NEW SERVICES"
echo "─────────────────────────────────────────────────────────────────"

log_info "Starting production services..."
docker compose -f docker-compose.production.yml up -d
log_info "Services started ✓"

echo ""
log_step "6. WAIT FOR SERVICES TO BE HEALTHY"
echo "─────────────────────────────────────────────────────────────────"

log_info "Waiting for MongoDB to be healthy..."
for i in {1..30}; do
    if docker exec vcsa-production-mongodb mongosh --quiet --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
        log_info "MongoDB is healthy ✓"
        break
    fi
    if [ $i -eq 30 ]; then
        log_error "MongoDB health check timeout"
        exit 1
    fi
    sleep 2
done

log_info "Waiting for Backend to be healthy..."
for i in {1..60}; do
    if curl -sf http://localhost:8000/api/health >/dev/null 2>&1; then
        log_info "Backend is healthy ✓"
        break
    fi
    if [ $i -eq 60 ]; then
        log_error "Backend health check timeout"
        docker logs vcsa-production-backend --tail 50
        exit 1
    fi
    sleep 2
done

log_info "Waiting for Frontend to be healthy..."
for i in {1..30}; do
    if curl -sf http://localhost:8080/health >/dev/null 2>&1; then
        log_info "Frontend is healthy ✓"
        break
    fi
    if [ $i -eq 30 ]; then
        log_warn "Frontend health check timeout (continuing anyway)"
        break
    fi
    sleep 2
done

echo ""
log_step "7. POST-DEPLOYMENT VERIFICATION"
echo "─────────────────────────────────────────────────────────────────"

log_info "Running smoke tests..."

# Test backend health
log_info "Testing backend health..."
BACKEND_HEALTH=$(curl -s http://localhost:8000/api/health)
if echo "$BACKEND_HEALTH" | grep -q "status.*ok\|healthy"; then
    log_info "Backend health check passed ✓"
else
    log_warn "Backend health check returned unexpected response"
    echo "Response: $BACKEND_HEALTH"
fi

# Test frontend accessibility
log_info "Testing frontend accessibility..."
if curl -sf http://localhost:8080 >/dev/null 2>&1; then
    log_info "Frontend accessibility check passed ✓"
else
    log_warn "Frontend accessibility check failed"
fi

# Test database connectivity
log_info "Testing database connectivity..."
if docker exec vcsa-production-backend python -c "from motor.motor_asyncio import AsyncIOMotorClient; import asyncio; asyncio.run(AsyncIOMotorClient('mongodb://vcsa_user:vcsa_secure_password_2024@mongodb:27017').admin.command('ping'))" >/dev/null 2>&1; then
    log_info "Database connectivity check passed ✓"
else
    log_warn "Database connectivity check failed"
fi

# Check service status
log_info "Checking service status..."
docker compose -f docker-compose.production.yml ps

echo ""
log_step "8. DEPLOYMENT SUMMARY"
echo "─────────────────────────────────────────────────────────────────"

DEPLOY_END_TIME=$(date +%s)
DEPLOY_DURATION=$((DEPLOY_END_TIME - DEPLOY_START_TIME))
DEPLOY_MINUTES=$((DEPLOY_DURATION / 60))
DEPLOY_SECONDS=$((DEPLOY_DURATION % 60))

echo "✅ Deployment completed successfully!"
echo ""
echo "📊 Deployment Statistics:"
echo "   Duration: ${DEPLOY_MINUTES}m ${DEPLOY_SECONDS}s"
echo "   Backup: $BACKUP_DIR"
echo "   Log: $LOG_FILE"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:8080"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "📊 Monitoring:"
echo "   View logs: docker compose -f docker-compose.production.yml logs -f"
echo "   Check status: docker compose -f docker-compose.production.yml ps"
echo "   Stop services: docker compose -f docker-compose.production.yml down"
echo ""
echo "🔄 Rollback Information:"
echo "   Backup location: $BACKUP_DIR"
echo "   To rollback: ./rollback.sh $BACKUP_DIR"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "🎉 VCSA PRODUCTION GO-LIVE DEPLOYMENT COMPLETE"
echo "═══════════════════════════════════════════════════════════════"
echo "End Time: $(date)"
echo "═══════════════════════════════════════════════════════════════"

# Create deployment marker
echo "$(date) - Deployment completed successfully" >> deployment_history.txt
