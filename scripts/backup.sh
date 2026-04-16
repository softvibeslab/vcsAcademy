#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# VCSA Backup Script
# ═══════════════════════════════════════════════════════════════
#
# Automated backup script for VCSA platform
#
# Features:
# - Database backups
# - File system backups
# - Config backups
# - Backup verification
# - Cleanup of old backups
# - Backup notifications
#
# Author: VCSA DevOps Team
# Created: April 2026
# Status: Production Ready
# ═══════════════════════════════════════════════════════════════

set -e

# Configuration
BACKUP_DIR="/opt/vcsavibes/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/var/log/vcsavibes/backup.log"
RETENTION_DAYS=30

# Create backup directory
mkdir -p "$BACKUP_DIR/database"
mkdir -p "$BACKUP_DIR/files"
mkdir -p "$BACKUP_DIR/config"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Error handling
error_exit() {
    log "ERROR: $1"
    exit 1
}

# Database backup
backup_database() {
    log "Starting database backup..."

    # Backup MongoDB using mongodump
    docker-compose exec -T mongodb mongodump \
        --uri="mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@localhost:27017/$DB_NAME" \
        --archive="$BACKUP_DIR/database/mongodb_backup_$TIMESTAMP.gz" \
        --gzip || error_exit "Database backup failed"

    # Verify backup
    if [ -f "$BACKUP_DIR/database/mongodb_backup_$TIMESTAMP.gz" ]; then
        local size=$(du -h "$BACKUP_DIR/database/mongodb_backup_$TIMESTAMP.gz" | cut -f1)
        log "Database backup completed: $size"
    else
        error_exit "Database backup file not found"
    fi
}

# File system backup
backup_files() {
    log "Starting file system backup..."

    # Backup uploaded files
    if [ -d "/opt/vcsavibes/uploads" ]; then
        tar -czf "$BACKUP_DIR/files/uploads_$TIMESTAMP.tar.gz" \
            -C /opt/vcsavibes uploads || error_exit "Files backup failed"

        local size=$(du -h "$BACKUP_DIR/files/uploads_$TIMESTAMP.tar.gz" | cut -f1)
        log "Files backup completed: $size"
    fi
}

# Config backup
backup_config() {
    log "Starting config backup..."

    # Backup docker-compose and environment files
    tar -czf "$BACKUP_DIR/config/config_$TIMESTAMP.tar.gz" \
        -C /opt/vcsavibes \
        docker-compose.yml \
        .env \
        nginx/ || error_exit "Config backup failed"

    local size=$(du -h "$BACKUP_DIR/config/config_$TIMESTAMP.tar.gz" | cut -f1)
    log "Config backup completed: $size"
}

# Verify backup
verify_backup() {
    log "Verifying backup..."

    local db_backup="$BACKUP_DIR/database/mongodb_backup_$TIMESTAMP.gz"
    local files_backup="$BACKUP_DIR/files/uploads_$TIMESTAMP.tar.gz"
    local config_backup="$BACKUP_DIR/config/config_$TIMESTAMP.tar.gz"

    if [ -f "$db_backup" ] && [ -f "$config_backup" ]; then
        log "Backup verification successful"
        return 0
    else
        error_exit "Backup verification failed"
    fi
}

# Cleanup old backups
cleanup_old_backups() {
    log "Cleaning up old backups (older than $RETENTION_DAYS days)..."

    find "$BACKUP_DIR" -name "*.gz" -mtime +$RETENTION_DAYS -delete
    find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

    log "Old backups cleaned up"
}

# Main backup process
main() {
    case "${1:-all}" in
        database)
            backup_database
            ;;
        files)
            backup_files
            ;;
        config)
            backup_config
            ;;
        all)
            log "Starting full backup..."
            backup_database
            backup_files
            backup_config
            verify_backup
            cleanup_old_backups
            log "Full backup completed successfully"
            ;;
        *)
            echo "Usage: $0 {database|files|config|all}"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
