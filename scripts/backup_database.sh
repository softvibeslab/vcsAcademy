#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# VCSA MongoDB Backup Script
# ═══════════════════════════════════════════════════════════════
#
# Automated backup script for MongoDB database
#
# Usage: ./backup_database.sh [database_name]
#
# Example: ./backup_database.sh vcsa_production
# ═══════════════════════════════════════════════════════════════

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DB_NAME=${1:-"vcsa_production"}
BACKUP_DIR="/backups/mongodb/$(date +%Y%m%d)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
MONGO_URL=${MONGO_URL:-"mongodb://localhost:27017"}

print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"
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

print_header "MongoDB Database Backup"

# Check if mongodump is installed
if ! command -v mongodump &> /dev/null; then
    print_error "mongodump not found. Please install MongoDB tools:"
    echo "  Ubuntu/Debian: sudo apt install mongo-tools"
    echo "  CentOS/RHEL: sudo yum install mongo-tools"
    echo "  macOS: brew install mongodump"
    exit 1
fi

print_success "mongodump found"

# Create backup directory
print_info "Creating backup directory: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"
print_success "Backup directory created"

# Create backup filename
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.archive"
print_info "Backup file: $BACKUP_FILE"

# Perform backup
print_info "Starting backup for database: $DB_NAME"
print_info "This may take several minutes for large databases..."

if mongodump --uri="$MONGO_URL" \
            --db="$DB_NAME" \
            --archive="$BACKUP_FILE" \
            --gzip; then
    print_success "Backup completed successfully"
else
    print_error "Backup failed"
    exit 1
fi

# Get backup size
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
print_success "Backup size: $BACKUP_SIZE"

# Create backup manifest
cat > "${BACKUP_DIR}/manifest.txt" <<EOF
Backup Manifest
===============
Database: $DB_NAME
Timestamp: $TIMESTAMP
Date: $(date)
Backup File: $(basename "$BACKUP_FILE")
Size: $BACKUP_SIZE
MongoDB URL: ${MONGO_URL:0:30}...
Collections:
$(mongosh "$MONGO_URL/$DB_NAME" --quiet --eval "db.getCollectionNames()" 2>/dev/null | grep -v "warning")
EOF

print_success "Backup manifest created"

# List recent backups
print_header "Recent Backups"
ls -lh "$BACKUP_DIR" 2>/dev/null || print_info "No backups found in this directory"

# Cleanup old backups (keep last 7 days)
print_info "Cleaning up old backups (keeping last 7 days)..."
find /backups/mongodb/ -type d -mtime +7 -exec rm -rf {} + 2>/dev/null || print_info "No old backups to clean"

print_header "Backup Complete"

print_success "Database backup completed successfully!"
echo ""
print_info "Backup location: $BACKUP_DIR"
print_info "Backup file: $(basename "$BACKUP_FILE")"
echo ""
print_info "To restore from this backup:"
echo "  ./restore_database.sh $DB_NAME $BACKUP_FILE"
echo ""
print_info "Backup verification:"
echo "  mongodump --uri=\"$MONGO_URL\" --db=$DB_NAME --dry-run"
echo ""

# ═══════════════════════════════════════════════════════════════
# END OF BACKUP SCRIPT
# ═══════════════════════════════════════════════════════════════
