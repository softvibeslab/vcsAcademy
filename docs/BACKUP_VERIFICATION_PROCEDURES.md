# 💾 Backup Verification Procedures

**Version**: 1.0.0
**Last Updated**: April 2026
**Status**: Production Ready
**Audience**: Operations Team, SREs, DevOps Engineers

---

## 📋 Table of Contents

1. [Backup Overview](#backup-overview)
2. [Backup Strategy](#backup-strategy)
3. [Backup Creation](#backup-creation)
4. [Backup Verification](#backup-verification)
5. [Restore Procedures](#restore-procedures)
6. [Backup Storage](#backup-storage)
7. [Backup Monitoring](#backup-monitoring)
8. [Disaster Recovery Testing](#disaster-recovery-testing)

---

## Backup Overview

### Backup Philosophy

**3-2-1 Backup Rule**:
- **3** copies of data (production + 2 backups)
- **2** different storage types (local + cloud)
- **1** off-site backup (cloud storage)

### Backup Scope

**Data Categories**:

```yaml
Database Backups:
  - MongoDB databases (all collections)
  - User data and authentication
  - Content and progress data
  - Community and events data

File System Backups:
  - User uploads (avatars, files)
  - Generated content
  - Static assets (if custom)

Configuration Backups:
  - Environment variables (.env files)
  - Docker Compose configuration
  - Nginx configuration
  - SSL certificates
  - Application configuration

Code Backups:
  - Git repository (GitHub)
  - Deployment scripts
  - Custom configurations
```

---

## Backup Strategy

### Backup Schedule

```yaml
MongoDB Database:
  - Incremental: Every 6 hours (4 times daily)
  - Full backup: Daily at 2:00 AM UTC
  - Retention: 30 days (daily), 12 weeks (weekly), 12 months (monthly)

File System:
  - Incremental: Daily at 3:00 AM UTC
  - Full backup: Weekly on Sunday at 4:00 AM UTC
  - Retention: 30 days

Configuration:
  - On change: Automatic backup before updates
  - Scheduled: Daily at 5:00 AM UTC
  - Retention: 90 days

Code:
  - Git: Every commit (GitHub)
  - Releases: Tagged releases archived
  - Retention: Permanent
```

### Backup Locations

```yaml
Primary Storage (Local):
  - Path: /opt/vcsavibes/backups/
  - Retention: 7 days
  - Purpose: Fast restore for recent issues

Secondary Storage (Cloud - S3):
  - Service: AWS S3 / DigitalOcean Spaces
  - Path: s3://vcsavibes-backups/production/
  - Retention: 30 days (daily), 12 weeks (weekly)
  - Purpose: Regional redundancy

Tertiary Storage (Cloud - Glacier):
  - Service: AWS Glacier / B2 Cloud Storage
  - Path: glacier://vcsavibes-backups/archive/
  - Retention: 12 months (monthly), 7 years (yearly)
  - Purpose: Long-term archival
```

### Backup Types

**1. Full Backup**

```bash
# Full database backup
docker-compose exec -T mongodb mongodump \
    --uri="mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@localhost:27017/$DB_NAME" \
    --archive=/backup/mongodb_full_$TIMESTAMP.gz \
    --gzip

# Full file system backup
tar -czf /backup/files_full_$TIMESTAMP.tar.gz \
    -C /opt/vcsavibes uploads/

# Full configuration backup
tar -czf /backup/config_full_$TIMESTAMP.tar.gz \
    -C /opt/vcsavibes \
    docker-compose.yml \
    .env \
    nginx/ \
    ssl/
```

**2. Incremental Backup**

```bash
# Incremental database backup (using oplog)
docker-compose exec -T mongodb mongodump \
    --uri="mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@localhost:27017/$DB_NAME" \
    --archive=/backup/mongodb_inc_$TIMESTAMP.gz \
    --gzip \
    --oplog

# Incremental file backup (files modified in last 24h)
find /opt/vcsavibes/uploads -mtime -1 -print0 | \
    tar -czf /backup/files_inc_$TIMESTAMP.tar.gz \
    --null -T -
```

---

## Backup Creation

### Automated Backups

**Cron Job Configuration**:

```bash
# Edit crontab
crontab -e

# Add backup jobs
# MongoDB full backup - daily at 2:00 AM UTC
0 2 * * * /opt/vcsavibes/scripts/backup.sh database full >> /var/log/vcsavibes/backup.log 2>&1

# MongoDB incremental backup - every 6 hours
0 */6 * * * /opt/vcsavibes/scripts/backup.sh database incremental >> /var/log/vcsavibes/backup.log 2>&1

# File system backup - daily at 3:00 AM UTC
0 3 * * * /opt/vcsavibes/scripts/backup.sh files >> /var/log/vcsavibes/backup.log 2>&1

# Configuration backup - daily at 5:00 AM UTC
0 5 * * * /opt/vcsavibes/scripts/backup.sh config >> /var/log/vcsavibes/backup.log 2>&1

# Backup cleanup - daily at 6:00 AM UTC
0 6 * * * /opt/vcsavibes/scripts/backup.sh cleanup >> /var/log/vcsavibes/backup.log 2>&1
```

**Backup Script**:

```bash
#!/bin/bash
# /opt/vcsavibes/scripts/backup.sh

set -e

# Configuration
BACKUP_DIR="/opt/vcsavibes/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/var/log/vcsavibes/backup.log"

# Functions
backup_database_full() {
    echo "[$(date)] Starting full database backup..." >> "$LOG_FILE"
    docker-compose exec -T mongodb mongodump \
        --uri="mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@localhost:27017/$DB_NAME" \
        --archive="$BACKUP_DIR/database/mongodb_full_$TIMESTAMP.gz" \
        --gzip
    echo "[$(date)] Full database backup completed" >> "$LOG_FILE"
}

backup_database_incremental() {
    echo "[$(date)] Starting incremental database backup..." >> "$LOG_FILE"
    docker-compose exec -T mongodb mongodump \
        --uri="mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@localhost:27017/$DB_NAME" \
        --archive="$BACKUP_DIR/database/mongodb_inc_$TIMESTAMP.gz" \
        --gzip \
        --oplog
    echo "[$(date)] Incremental database backup completed" >> "$LOG_FILE"
}

backup_files() {
    echo "[$(date)] Starting file system backup..." >> "$LOG_FILE"
    tar -czf "$BACKUP_DIR/files/uploads_$TIMESTAMP.tar.gz" \
        -C /opt/vcsavibes uploads/
    echo "[$(date)] File system backup completed" >> "$LOG_FILE"
}

backup_config() {
    echo "[$(date)] Starting configuration backup..." >> "$LOG_FILE"
    tar -czf "$BACKUP_DIR/config/config_$TIMESTAMP.tar.gz" \
        -C /opt/vcsavibes \
        docker-compose.yml \
        .env \
        nginx/ \
        ssl/
    echo "[$(date)] Configuration backup completed" >> "$LOG_FILE"
}

cleanup_old_backups() {
    echo "[$(date)] Cleaning up old backups..." >> "$LOG_FILE"
    # Remove backups older than 30 days
    find "$BACKUP_DIR" -name "*.gz" -mtime +30 -delete
    # Remove backups older than 90 days from config
    find "$BACKUP_DIR/config" -name "*.tar.gz" -mtime +90 -delete
    echo "[$(date)] Backup cleanup completed" >> "$LOG_FILE"
}

# Main script
case "$1" in
    database)
        case "$2" in
            full) backup_database_full ;;
            incremental) backup_database_incremental ;;
        esac
        ;;
    files) backup_files ;;
    config) backup_config ;;
    cleanup) cleanup_old_backups ;;
    *)
        echo "Usage: $0 {database|files|config|cleanup}"
        exit 1
        ;;
esac
```

### Manual Backups

**Pre-Deployment Backup**:

```bash
# Always backup before deployment
/opt/vcsavibes/scripts/deploy.sh backup

# Manual backup before major changes
cd /opt/vcsavibes
./scripts/backup.sh database full
./scripts/backup.sh files
./scripts/backup.sh config
```

**On-Demand Backup**:

```bash
# Quick database backup
docker-compose exec mongodb mongodump \
    --uri="mongodb://admin:password@localhost:27017/vcsa" \
    --archive=/tmp/quick_backup.gz \
    --gzip

# Copy to local machine
scp admin@app.vcsavibes.com:/tmp/quick_backup.gz ./backups/
```

---

## Backup Verification

### Automated Verification

**Daily Verification Script**:

```bash
#!/bin/bash
# /opt/vcsavibes/scripts/verify_backup.sh

set -e

BACKUP_DIR="/opt/vcsavibes/backups"
LOG_FILE="/var/log/vcsavibes/backup_verify.log"
ALERT_WEBHOOK="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

verify_backup_exists() {
    local backup_file=$1
    if [ ! -f "$backup_file" ]; then
        echo "[$(date)] ERROR: Backup file not found: $backup_file" >> "$LOG_FILE"
        # Send alert
        curl -X POST "$ALERT_WEBHOOK" \
            -d "{\"text\": \"🚨 Backup verification failed: $backup_file not found\"}"
        return 1
    fi
    echo "[$(date)] Backup file exists: $backup_file" >> "$LOG_FILE"
    return 0
}

verify_backup_size() {
    local backup_file=$1
    local min_size=$2
    local actual_size=$(stat -f%z "$backup_file" 2>/dev/null || stat -c%s "$backup_file" 2>/dev/null)

    if [ "$actual_size" -lt "$min_size" ]; then
        echo "[$(date)] ERROR: Backup too small: $backup_file ($actual_size bytes)" >> "$LOG_FILE"
        curl -X POST "$ALERT_WEBHOOK" \
            -d "{\"text\": \"🚨 Backup verification failed: $backup_file too small\"}"
        return 1
    fi
    echo "[$(date)] Backup size OK: $backup_file ($actual_size bytes)" >> "$LOG_FILE"
    return 0
}

verify_database_backup() {
    local backup_file=$1
    echo "[$(date)] Verifying database backup: $backup_file" >> "$LOG_FILE"

    # Test integrity
    if ! docker-compose exec -T mongodb mongorestore \
        --uri="mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@localhost:27017/" \
        --archive="$backup_file" \
        --gzip \
        --dryRun; then
        echo "[$(date)] ERROR: Database backup corrupted: $backup_file" >> "$LOG_FILE"
        curl -X POST "$ALERT_WEBHOOK" \
            -d "{\"text\": \"🚨 Database backup corrupted: $backup_file\"}"
        return 1
    fi

    echo "[$(date)] Database backup verified: $backup_file" >> "$LOG_FILE"
    return 0
}

verify_file_backup() {
    local backup_file=$1
    echo "[$(date)] Verifying file backup: $backup_file" >> "$LOG_FILE"

    # Test integrity
    if ! tar -tzf "$backup_file" > /dev/null 2>&1; then
        echo "[$(date)] ERROR: File backup corrupted: $backup_file" >> "$LOG_FILE"
        curl -X POST "$ALERT_WEBHOOK" \
            -d "{\"text\": \"🚨 File backup corrupted: $backup_file\"}"
        return 1
    fi

    echo "[$(date)] File backup verified: $backup_file" >> "$LOG_FILE"
    return 0
}

# Main verification
echo "[$(date)] Starting backup verification..." >> "$LOG_FILE"

# Verify latest backups
LATEST_DB_BACKUP=$(ls -t "$BACKUP_DIR/database"/mongodb_*.gz 2>/dev/null | head -1)
LATEST_FILE_BACKUP=$(ls -t "$BACKUP_DIR/files"/uploads_*.tar.gz 2>/dev/null | head -1)

if [ -n "$LATEST_DB_BACKUP" ]; then
    verify_backup_exists "$LATEST_DB_BACKUP"
    verify_backup_size "$LATEST_DB_BACKUP" 1000  # Min 1KB
    verify_database_backup "$LATEST_DB_BACKUP"
fi

if [ -n "$LATEST_FILE_BACKUP" ]; then
    verify_backup_exists "$LATEST_FILE_BACKUP"
    verify_backup_size "$LATEST_FILE_BACKUP" 100
    verify_file_backup "$LATEST_FILE_BACKUP"
fi

echo "[$(date)] Backup verification completed" >> "$LOG_FILE"
```

**Cron Job for Verification**:

```bash
# Add to crontab
# Run verification daily at 7:00 AM UTC
0 7 * * * /opt/vcsavibes/scripts/verify_backup.sh
```

### Manual Verification

**Verification Checklist**:

```bash
# 1. Check backup exists
ls -lh /opt/vcsavibes/backups/database/
ls -lh /opt/vcsavibes/backups/files/
ls -lh /opt/vcsavibes/backups/config/

# 2. Check backup age (should be < 24 hours)
find /opt/vcsavibes/backups/ -name "*.gz" -mtime -1

# 3. Check backup size (should be > 0 and growing)
du -sh /opt/vcsavibes/backups/database/*
du -sh /opt/vcsavibes/backups/files/*

# 4. Verify backup integrity
# Database backup
docker-compose exec -T mongodb mongorestore \
    --uri="mongodb://admin:password@localhost:27017/" \
    --archive=/opt/vcsavibes/backups/database/mongodb_full_latest.gz \
    --gzip \
    --dryRun

# File backup
tar -tzf /opt/vcsavibes/backups/files/uploads_latest.tar.gz | head -20

# 5. Check backup logs
tail -50 /var/log/vcsavibes/backup.log
tail -50 /var/log/vcsavibes/backup_verify.log
```

---

## Restore Procedures

### Database Restore

**Full Database Restore**:

```bash
#!/bin/bash
# /opt/vcsavibes/scripts/restore_database.sh

BACKUP_FILE=$1
DB_NAME="vcsa"
MONGO_URI="mongodb://admin:password@localhost:27017/"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

# Stop application
echo "Stopping application..."
docker-compose stop backend frontend

# Restore database
echo "Restoring database from $BACKUP_FILE..."
docker-compose exec -T mongodb mongorestore \
    --uri="$MONGO_URI" \
    --drop \
    --archive="$BACKUP_FILE" \
    --gzip

# Restart application
echo "Restarting application..."
docker-compose start backend frontend

# Verify
echo "Verifying restore..."
docker-compose exec backend python -c "
import motor.motor_asyncio
import asyncio

async def verify():
    client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://admin:password@mongodb:27017/')
    db = client.vcsa
    count = await db.users.count_documents({})
    print(f'Users count: {count}')
    client.close()

asyncio.run(verify())
"

echo "Database restore completed"
```

**Point-in-Time Restore** (if using oplog):

```bash
# Restore to specific point in time
docker-compose exec -T mongodb mongorestore \
    --uri="mongodb://admin:password@localhost:27017/" \
    --drop \
    --archive=/opt/vcsavibes/backups/database/mongodb_inc_20260416.gz \
    --gzip \
    --oplogReplay
```

### File System Restore

**Restore Files**:

```bash
#!/bin/bash
# /opt/vcsavibes/scripts/restore_files.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

# Backup current files
echo "Backing up current files..."
tar -czf /tmp/uploads_pre_restore.tar.gz -C /opt/vcsavibes uploads/

# Restore files
echo "Restoring files from $BACKUP_FILE..."
tar -xzf "$BACKUP_FILE" -C /opt/vcsavibes/

# Verify
echo "Verifying restore..."
ls -lh /opt/vcsavibes/uploads/

echo "File restore completed"
```

### Configuration Restore

**Restore Configuration**:

```bash
#!/bin/bash
# /opt/vcsavibes/scripts/restore_config.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

# Backup current configuration
echo "Backing up current configuration..."
tar -czf /tmp/config_pre_restore.tar.gz \
    -C /opt/vcsavibes \
    docker-compose.yml \
    .env \
    nginx/ \
    ssl/

# Restore configuration
echo "Restoring configuration from $BACKUP_FILE..."
tar -xzf "$BACKUP_FILE" -C /opt/vcsavibes/

# Restart services
echo "Restarting services..."
docker-compose down
docker-compose up -d

echo "Configuration restore completed"
```

---

## Backup Storage

### Local Storage

**Directory Structure**:

```bash
/opt/vcsavibes/backups/
├── database/
│   ├── mongodb_full_20260416_020000.gz
│   ├── mongodb_inc_20260416_060000.gz
│   ├── mongodb_inc_20260416_120000.gz
│   └── mongodb_inc_20260416_180000.gz
├── files/
│   ├── uploads_20260416_030000.tar.gz
│   └── uploads_weekly_20260415_040000.tar.gz
├── config/
│   └── config_20260416_050000.tar.gz
└── logs/
    └── backup_20260416.log
```

**Permissions**:

```bash
# Set proper permissions
chown -R root:root /opt/vcsavibes/backups
chmod 700 /opt/vcsavibes/backups
chmod 600 /opt/vcsavibes/backups/*/*
```

### Cloud Storage (S3)

**S3 Sync Script**:

```bash
#!/bin/bash
# /opt/vcsavibes/scripts/sync_backup_s3.sh

S3_BUCKET="s3://vcsavibes-backups/production/"
LOCAL_BACKUP_DIR="/opt/vcsavibes/backups"

# Sync to S3
echo "Syncing backups to S3..."
aws s3 sync "$LOCAL_BACKUP_DIR" "$S3_BUCKET" \
    --storage-class STANDARD_IA \
    --exclude "*" \
    --include "*.gz" \
    --include "*.tar.gz"

# Set lifecycle rules
# Transition to Glacier after 30 days
# Delete after 90 days

echo "S3 sync completed"
```

**Cron Job for S3 Sync**:

```bash
# Add to crontab
# Sync to S3 daily at 8:00 AM UTC
0 8 * * * /opt/vcsavibes/scripts/sync_backup_s3.sh
```

---

## Backup Monitoring

### Backup Health Checks

**Monitoring Metrics**:

```yaml
Backup Success Rate:
  - Target: > 99%
  - Measure: Successful backups / Total backups
  - Alert if: < 95% for 24 hours

Backup Freshness:
  - Database: < 6 hours old
  - Files: < 24 hours old
  - Config: < 24 hours old
  - Alert if: Backup older than threshold

Backup Size:
  - Database: > 100 MB (typical)
  - Files: Variable
  - Alert if: Size drops > 50% (possible failure)

Backup Duration:
  - Database backup: < 5 minutes
  - File backup: < 10 minutes
  - Alert if: Backup takes > 2x normal time
```

**Monitoring Dashboard**:

```yaml
Backup Status Panel:
  - Last successful backup (timestamp)
  - Backup success rate (24h, 7d, 30d)
  - Backup size trend
  - Backup duration trend
  - Next scheduled backup
  - Backup storage usage

Alerts:
  - Backup failed (P2)
  - Backup missing (P2)
  - Backup corrupted (P1)
  - Backup too old (P2)
  - Storage full (P1)
```

### Backup Alerts

**Slack Notifications**:

```bash
# Backup success notification
curl -X POST "$SLACK_WEBHOOK" \
  -d '{
    "text": "✅ Backup completed successfully",
    "attachments": [{
      "color": "good",
      "fields": [
        {"title": "Type", "value": "Database Full"},
        {"title": "File", "value": "mongodb_full_20260416.gz"},
        {"title": "Size", "value": "1.2 GB"},
        {"title": "Duration", "value": "3m 45s"}
      ]
    }]
  }'

# Backup failure notification
curl -X POST "$SLACK_WEBHOOK" \
  -d '{
    "text": "🚨 Backup failed!",
    "attachments": [{
      "color": "danger",
      "fields": [
        {"title": "Type", "value": "Database Full"},
        {"title": "Error", "value": "Connection timeout"},
        {"title": "Time", "value": "2026-04-16 02:00:00 UTC"}
      ]
    }]
  }'
```

---

## Disaster Recovery Testing

### Monthly Restore Test

**Test Procedure**:

```bash
#!/bin/bash
# /opt/vcsavibes/scripts/test_restore.sh

TEST_DATE=$(date +%Y%m%d)
TEST_DB_NAME="vcsa_restore_test"
TEST_BACKUP_DIR="/tmp/restore_test_$TEST_DATE"

# Create test directory
mkdir -p "$TEST_BACKUP_DIR"

echo "[$(date)] Starting restore test..." | tee -a "$TEST_BACKUP_DIR/test.log"

# 1. Get latest backup
LATEST_BACKUP=$(ls -t /opt/vcsavibes/backups/database/mongodb_full_*.gz 2>/dev/null | head -1)
echo "[$(date)] Using backup: $LATEST_BACKUP" | tee -a "$TEST_BACKUP_DIR/test.log"

# 2. Restore to test database
echo "[$(date)] Restoring to test database..." | tee -a "$TEST_BACKUP_DIR/test.log"
docker-compose exec -T mongodb mongorestore \
    --uri="mongodb://admin:password@localhost:27017/$TEST_DB_NAME" \
    --archive="$LATEST_BACKUP" \
    --gzip

# 3. Verify data integrity
echo "[$(date)] Verifying data integrity..." | tee -a "$TEST_BACKUP_DIR/test.log"
docker-compose exec backend python -c "
import motor.motor_asyncio
import asyncio

async def verify():
    client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://admin:password@mongodb:27017/')
    db = client.vcsa_restore_test

    users_count = await db.users.count_documents({})
    progress_count = await db.user_progress.count_documents({})

    print(f'Users: {users_count}')
    print(f'User Progress: {progress_count}')

    if users_count == 0:
        print('ERROR: No users found!')
        exit(1)

    client.close()

asyncio.run(verify())
" 2>&1 | tee -a "$TEST_BACKUP_DIR/test.log"

# 4. Cleanup test database
echo "[$(date)] Cleaning up test database..." | tee -a "$TEST_BACKUP_DIR/test.log"
docker-compose exec -T mongodb mongosh \
    --eval "db.getSiblingDB('$TEST_DB_NAME').dropDatabase()"

echo "[$(date)] Restore test completed successfully" | tee -a "$TEST_BACKUP_DIR/test.log"

# Send notification
curl -X POST "$SLACK_WEBHOOK" \
  -d "{\"text\": \"✅ Monthly restore test completed successfully\n\nLogs: $TEST_BACKUP_DIR/test.log\"}"
```

**Cron Job for Monthly Test**:

```bash
# Add to crontab
# Run restore test on 1st of month at 3:00 AM UTC
0 3 1 * * /opt/vcsavibes/scripts/test_restore.sh
```

### Quarterly Disaster Recovery Drill

**Full Disaster Recovery Test**:

```yaml
Scenario: Complete server failure
Objective: Restore all services from backup
Duration: < 2 hours
Frequency: Quarterly

Test Steps:
1. Simulate server failure (stop all services)
2. Provision new server (or use test environment)
3. Restore database from latest backup
4. Restore file system from backup
5. Restore configuration from backup
6. Deploy application code
7. Verify all services operational
8. Run smoke tests
9. Document any issues
10. Update procedures as needed

Success Criteria:
- All services restored within 2 hours
- All data verified
- No data loss
- All tests passing
```

---

## Backup Best Practices

### Do's and Don'ts

**DO**:
- ✅ Test backups regularly (monthly minimum)
- ✅ Monitor backup success rates
- ✅ Use encryption for backups
- ✅ Store backups off-site (cloud)
- ✅ Document restore procedures
- ✅ Keep multiple backup generations
- ✅ Verify backup integrity
- ✅ Alert on backup failures

**DON'T**:
- ❌ Assume backups work without testing
- ❌ Store backups only locally
- ❌ Keep backups indefinitely without cleanup
- ❌ Forget to backup configuration
- ❌ Ignore backup failures
- ❌ Store unencrypted backups
- ❌ Skip verification
- ❌ Forget to document procedures

### Backup Maintenance

**Monthly Tasks**:
- Review backup logs
- Check backup success rates
- Verify backup integrity
- Test restore procedure
- Update documentation

**Quarterly Tasks**:
- Conduct full disaster recovery test
- Review backup strategy
- Optimize backup performance
- Update retention policies
- Team training

---

## Runbook Maintenance

**Update Frequency**: Monthly
**Last Updated**: April 2026
**Next Review**: May 2026

**Owner**: Operations Manager
**Approvals**: Director of Operations

---

**Maintained by**: VCSA Operations Team
**Contact**: operations@vcsavibes.com
**Emergency**: +1 (555) 123-4567
