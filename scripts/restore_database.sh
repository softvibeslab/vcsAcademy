#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# VCSA MongoDB Restore Script
# ═══════════════════════════════════════════════════════════════
#
# Restore MongoDB database from backup
#
# Usage: ./restore_database.sh [database_name] [backup_file]
#
# Example: ./restore_database.sh vcsa_production /backups/mongodb/20260417/vcsa_production_20260417_120000.archive
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
BACKUP_FILE=${2:-""}
MONGO_URL=${MONGO_URL:-"mongodb://localhost:27027"}

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

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_header "MongoDB Database Restore"

# Check arguments
if [ -z "$BACKUP_FILE" ]; then
    print_error "Backup file not specified"
    echo "Usage: $0 [database_name] [backup_file]"
    echo ""
    echo "Available backups:"
    ls -lh /backups/mongodb/*/ 2>/dev/null | grep -E '\.archive$' || print_info "No backups found"
    exit 1
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    print_error "Backup file not found: $BACKUP_FILE"
    exit 1
fi

print_success "Backup file found: $BACKUP_FILE"

# Check if mongorestore is installed
if ! command -v mongorestore &> /dev/null; then
    print_error "mongorestore not found. Please install MongoDB tools"
    exit 1
fi

print_success "mongorestore found"

# Display backup info
print_info "Backup Information:"
echo "  Database: $DB_NAME"
echo "  Backup File: $(basename "$BACKUP_FILE")"
echo "  Size: $(du -h "$BACKUP_FILE" | cut -f1)"
echo ""

# Confirm restore
print_warning "WARNING: This will REPLACE the existing database!"
echo ""
read -p "Are you sure you want to proceed? (type 'yes' to confirm): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    print_error "Restore cancelled by user"
    exit 1
fi

# Create backup of current database before restore (safety measure)
print_info "Creating safety backup of current database..."
SAFETY_BACKUP="/backups/mongodb/safety_before_restore_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$SAFETY_BACKUP"
if mongodump --uri="$MONGO_URL" --db="$DB_NAME" --archive="$SAFETY_BACKUP/safety.archive" --gzip; then
    print_success "Safety backup created: $SAFETY_BACKUP"
else
    print_error "Failed to create safety backup"
    read -p "Continue anyway? (type 'yes' to confirm): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        print_error "Restore cancelled"
        exit 1
    fi
fi

# Perform restore
print_info "Starting database restore..."
print_info "This may take several minutes for large databases..."

if mongorestore --uri="$MONGO_URL" \
               --db="$DB_NAME" \
               --archive="$BACKUP_FILE" \
               --gzip \
               --drop; then
    print_success "Database restored successfully"
else
    print_error "Restore failed"
    print_warning "Safety backup is available at: $SAFETY_BACKUP"
    exit 1
fi

# Verify restore
print_info "Verifying restore..."
DOCUMENT_COUNT=$(mongosh "$MONGO_URL/$DB_NAME" --quiet --eval "db.getCollectionNames().length()" 2>/dev/null | grep -v "warning" || echo "0")
print_success "Database contains $DOCUMENT_COUNT collections"

print_header "Restore Complete"

print_success "Database restore completed successfully!"
echo ""
print_info "Restored database: $DB_NAME"
print_info "From backup: $(basename "$BACKUP_FILE")"
print_info "Safety backup: $SAFETY_BACKUP"
echo ""
print_info "Next steps:"
echo "  1. Verify data integrity"
echo "  2. Test application connectivity"
echo "  3. Run smoke tests"
echo "  4. Monitor database performance"
echo ""

# ═══════════════════════════════════════════════════════════════
# END OF RESTORE SCRIPT
# ═══════════════════════════════════════════════════════════════
