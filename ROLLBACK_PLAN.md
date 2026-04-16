# 🔄 VCSA Production Rollback Plan

**Purpose**: Comprehensive rollback procedures for production deployment
**Sprint**: Sprint 2 - Task 7 (Deployment + Smoke Tests)
**Priority**: P1 - HIGH
**Severity**: CRITICAL

---

## 📋 ROLLBACK OVERVIEW

### Rollback Philosophy

> "The ability to rollback quickly and safely is more important than the ability to deploy quickly."

**Key Principles**:
1. **Safety First**: Always prioritize system stability over new features
2. **Speed Matters**: Complete rollback in < 5 minutes
3. **Test Everything**: Verify rollback procedure before going live
4. **Document Changes**: Track what changed and why
5. **Communicate**: Keep stakeholders informed during incidents

### Rollback Decision Matrix

| Scenario | Severity | Rollback Time | Notify Team |
|----------|----------|---------------|-------------|
| Critical errors (500+) | 🔴 P0 | Immediate (< 2 min) | ✅ Yes |
| Authentication failures | 🔴 P0 | Immediate (< 2 min) | ✅ Yes |
| Database connection loss | 🔴 P0 | Immediate (< 2 min) | ✅ Yes |
| Performance degradation > 3x | 🟠 P1 | < 5 minutes | ✅ Yes |
| Error rate > 10% | 🟠 P1 | < 5 minutes | ✅ Yes |
| SSL certificate issues | 🟠 P1 | < 5 minutes | ✅ Yes |
| Minor bugs | 🟡 P2 | Next maintenance window | ⚠️ Maybe |
| UI issues | 🟡 P2 | Next maintenance window | ⚠️ Maybe |

---

## 🚨 AUTOMATIC ROLLBACK TRIGGERS

### Critical Triggers (Immediate Rollback)

```python
# ═══════════════════════════════════════════════════════════════
# Automatic Rollback Triggers
# ═══════════════════════════════════════════════════════════════

CRITICAL_TRIGGERS = {
    "service_availability": {
        "health_check_failures": 5,          # 5 consecutive failures
        "downtime_duration": 60,             # 60 seconds
        "critical_endpoints_down": 3,        # 3+ critical endpoints
    },

    "error_rate": {
        "total_error_rate": 0.10,            # 10% error rate
        "5xx_error_rate": 0.05,              # 5% server errors
        "auth_failure_rate": 0.20,           # 20% auth failures
    },

    "database": {
        "connection_failures": 10,           # 10 consecutive failures
        "query_timeout_rate": 0.15,          # 15% timeout rate
        "connection_pool_exhausted": True,   # Pool exhausted
    },

    "performance": {
        "p95_response_time": 3000,           # 3 seconds
        "p99_response_time": 5000,           # 5 seconds
        "memory_usage": 0.95,                # 95% memory
        "cpu_usage": 0.95,                   # 95% CPU
    },

    "security": {
        "ssl_certificate_invalid": True,
        "unauthorized_access_rate": 100,     # 100/min
        "rate_limiting_failure": True,
    },
}
```

### Warning Triggers (Monitor Closely)

```python
WARNING_TRIGGERS = {
    "performance": {
        "p95_response_time": 1000,          # 1 second
        "p99_response_time": 2000,          # 2 seconds
        "error_rate_increase": 2.0,          # 2x normal rate
    },

    "availability": {
        "health_check_flapping": True,       # Intermittent failures
        "endpoint_slow": 3,                  # 3+ slow endpoints
    },

    "database": {
        "slow_query_increase": 2.0,          # 2x normal rate
        "connection_pool_usage": 0.80,       # 80% pool usage
    },
}
```

---

## 🔄 ROLLBACK PROCEDURES

### Procedure 1: Application Rollback (Code Changes)

**Use Case**: Rollback backend/frontend code changes
**Time to Complete**: 3-5 minutes
**Data Loss**: None

```bash
#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Application Rollback Procedure
# ═══════════════════════════════════════════════════════════════

echo "🔄 Application Rollback Initiated"
echo "=================================="

# 1. NOTIFICATION (Immediate)
echo "📢 Sending alert to team..."
# Send alert via Slack/Email
# curl -X POST $SLACK_WEBHOOK_URL -d '{"text":"🚨 ROLLBACK INITIATED"}'

# 2. CREATE BACKUP (Before rollback)
echo "🗄️  Creating safety backup..."
timestamp=$(date +%Y%m%d_%H%M%S)
docker-compose -f docker-compose.production.yml exec mongodb \
  mongodump --uri="$MONGO_URL" --archive="backup/emergency_backup_$timestamp.archive"

# 3. STOP CURRENT SERVICES
echo "🛑 Stopping current services..."
docker-compose -f docker-compose.production.yml down

# 4. RESTORE PREVIOUS IMAGES
echo "🔄 Restoring previous Docker images..."
# Images should be tagged and saved before deployment
docker load < backup/vcsa-backend-previous.tar.gz
docker load < backup/vcsa-frontend-previous.tar.gz

# 5. UPDATE DOCKER COMPOSE (If needed)
echo "📝 Updating docker-compose configuration..."
# Use previous version of docker-compose.production.yml
git checkout HEAD~1 docker-compose.production.yml

# 6. RESTART SERVICES
echo "🚀 Restarting services with previous version..."
docker-compose -f docker-compose.production.yml up -d

# 7. WAIT FOR HEALTHY STATE
echo "⏳ Waiting for services to become healthy..."
sleep 30

# 8. VERIFY ROLLBACK
echo "✅ Verifying rollback..."
./scripts/smoke_tests.sh

# 9. NOTIFICATION (Complete)
echo "📢 Rollback complete. Sending notification..."
# curl -X POST $SLACK_WEBHOOK_URL -d '{"text":"✅ ROLLBACK COMPLETE"}'

echo "✅ Application rollback complete"
echo "=================================="
```

### Procedure 2: Database Rollback (Data Changes)

**Use Case**: Rollback database schema changes or data migrations
**Time to Complete**: 5-10 minutes
**Data Loss**: Potential data loss since last backup

```bash
#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Database Rollback Procedure
# ═══════════════════════════════════════════════════════════════

echo "🔄 Database Rollback Initiated"
echo "==============================="

# 1. NOTIFICATION
echo "📢 Alerting team about database rollback..."
# Send critical alert

# 2. STOP APPLICATION SERVICES
echo "🛑 Stopping application services..."
docker-compose -f docker-compose.production.yml stop backend
docker-compose -f docker-compose.production.yml stop frontend

# 3. CREATE EMERGENCY BACKUP
echo "🗄️  Creating emergency backup..."
timestamp=$(date +%Y%m%d_%H%M%S)
docker-compose -f docker-compose.production.yml exec mongodb \
  mongodump --uri="$MONGO_URL" --archive="backup/emergency_before_rollback_$timestamp.archive"

# 4. SELECT RESTORE POINT
echo "📋 Available backup points:"
ls -lth backup/ | grep mongodb_backup | head -10

read -p "Enter backup filename to restore: " backup_file

# 5. VERIFY BACKUP INTEGRITY
echo "🔍 Verifying backup integrity..."
docker-compose -f docker-compose.production.yml exec mongodb \
  mongorestore --uri="$MONGO_URL" --archive="backup/$backup_file" --dryRun

# 6. CONFIRM RESTORE
read -p "⚠️  WARNING: This will replace current database. Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Rollback cancelled"
    exit 1
fi

# 7. PERFORM RESTORE
echo "🔄 Restoring database..."
docker-compose -f docker-compose.production.yml exec mongodb \
  mongorestore --uri="$MONGO_URL" --archive="backup/$backup_file"

# 8. VERIFY RESTORE
echo "✅ Verifying database restore..."
python backend/verify_database.py

# 9. RESTART APPLICATION
echo "🚀 Restarting application services..."
docker-compose -f docker-compose.production.yml start backend
docker-compose -f docker-compose.production.yml start frontend

# 10. RUN SMOKE TESTS
echo "🧪 Running smoke tests..."
./scripts/smoke_tests.sh

# 11. NOTIFICATION
echo "📢 Database rollback complete. Sending notification..."
# Send alert with details

echo "✅ Database rollback complete"
echo "==============================="
```

### Procedure 3: Configuration Rollback

**Use Case**: Rollback environment variable or configuration changes
**Time to Complete**: 2-3 minutes
**Data Loss**: None

```bash
#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Configuration Rollback Procedure
# ═══════════════════════════════════════════════════════════════

echo "🔄 Configuration Rollback Initiated"
echo "==================================="

# 1. BACKUP CURRENT CONFIGURATION
echo "🗄️  Backing up current configuration..."
cp .env.production backup/env_production_$(date +%Y%m%d_%H%M%S).bak

# 2. SELECT PREVIOUS CONFIGURATION
echo "📋 Available configuration versions:"
ls -lth backup/env_production_*.bak | head -10

read -p "Enter configuration file to restore: " config_file

# 3. VERIFY CONFIGURATION
echo "🔍 Verifying configuration..."
cat "backup/$config_file"

read -p "⚠️  This will replace current configuration. Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Rollback cancelled"
    exit 1
fi

# 4. RESTORE CONFIGURATION
echo "🔄 Restoring configuration..."
cp "backup/$config_file" .env.production

# 5. RESTART SERVICES
echo "🚀 Restarting services with new configuration..."
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d

# 6. VERIFY
echo "✅ Verifying rollback..."
./scripts/smoke_tests.sh

echo "✅ Configuration rollback complete"
echo "==================================="
```

### Procedure 4: Emergency Rollback (Full System)

**Use Case**: Complete system failure or critical security issue
**Time to Complete**: 2-3 minutes
**Data Loss**: Minimal (uses last backup)

```bash
#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Emergency Rollback Procedure
# ═══════════════════════════════════════════════════════════════

echo "🚨 EMERGENCY ROLLBACK INITIATED"
echo "==============================="

# 1. IMMEDIATE NOTIFICATION
echo "📢 SENDING CRITICAL ALERT TO ALL TEAM MEMBERS..."
# Send critical alert via all channels
# curl -X POST $SLACK_WEBHOOK_URL -d '{"text":"🚨 EMERGENCY ROLLBACK IN PROGRESS"}'
# Send SMS to on-call engineer

# 2. IMMEDIATE SERVICE SHUTDOWN
echo "🛑 STOPPING ALL SERVICES IMMEDIATELY..."
docker-compose -f docker-compose.production.yml down --remove-orphans

# 3. RESTORE LAST KNOWN GOOD STATE
echo "🔄 Restoring last known good state..."

# Restore previous images
docker load < backup/vcsa-backend-last-known-good.tar.gz
docker load < backup/vcsa-frontend-last-known-good.tar.gz

# Restore previous configuration
cp backup/env_production_last_known_good.bak .env.production

# Restore previous docker-compose
cp backup/docker-compose.production.last-known-good.yml docker-compose.production.yml

# 4. RESTORE DATABASE (If needed)
read -p "Restore database as well? (yes/no): " restore_db

if [ "$restore_db" == "yes" ]; then
    echo "🗄️  Restoring database..."
    docker-compose -f docker-compose.production.yml exec mongodb \
      mongorestore --uri="$MONGO_URL" --archive="backup/mongodb_last_known_good.archive"
fi

# 5. RESTART SERVICES
echo "🚀 Restarting services..."
docker-compose -f docker-compose.production.yml up -d

# 6. IMMEDIATE VERIFICATION
echo "✅ Verifying system status..."
./scripts/smoke_tests.sh --critical-only

# 7. NOTIFICATION
echo "📢 EMERGENCY ROLLBACK COMPLETE"
# Send completion notification

echo "✅ Emergency rollback complete"
echo "==============================="
```

---

## 🧪 ROLLBACK VERIFICATION

### Smoke Tests for Rollback

```python
# ═══════════════════════════════════════════════════════════════
# Rollback Verification Tests
# ═══════════════════════════════════════════════════════════════

ROLLBACK_VERIFICATION_TESTS = {
    "critical": {
        "service_health": "All services running",
        "database_connectivity": "Database accessible",
        "authentication": "Users can log in",
        "api_response": "API responding to requests",
    },

    "functional": {
        "user_registration": "New users can register",
        "content_access": "Users can access content",
        "progress_tracking": "Progress is tracked",
        "community_features": "Community features working",
    },

    "performance": {
        "response_time_p95": "< 500ms",
        "response_time_p99": "< 1000ms",
        "error_rate": "< 1%",
        "memory_usage": "< 70%",
    },

    "security": {
        "ssl_certificate": "Valid SSL certificate",
        "rate_limiting": "Rate limiting active",
        "authentication": "JWT tokens working",
    },
}
```

### Verification Checklist

```bash
#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Rollback Verification Checklist
# ═══════════════════════════════════════════════════════════════

echo "🧪 Rollback Verification Checklist"
echo "=================================="

# 1. Service Health
echo "✅ Checking service health..."
docker-compose -f docker-compose.production.yml ps | grep -q "Up" && echo "   ✓ Services running" || echo "   ✗ Services not running"

# 2. Database Connectivity
echo "✅ Checking database connectivity..."
python backend/verify_database.py

# 3. Authentication
echo "✅ Testing authentication..."
curl -X POST https://api.vcsa.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@vcsa.com","password":"demo123"}' \
  | grep -q "access_token" && echo "   ✓ Authentication working" || echo "   ✗ Authentication failed"

# 4. API Response
echo "✅ Testing API response..."
curl -f https://api.vcsa.com/api/health && echo "   ✓ API responding" || echo "   ✗ API not responding"

# 5. SSL Certificate
echo "✅ Checking SSL certificate..."
openssl s_client -connect vcsa.com:443 -servername vcsa.com </dev/null 2>/dev/null | \
  grep "Verify return code" | grep -q "0" && echo "   ✓ SSL valid" || echo "   ✗ SSL invalid"

# 6. Performance
echo "✅ Checking performance..."
response_time=$(curl -o /dev/null -s -w '%{time_total}' https://api.vcsa.com/api/health)
echo "   Response time: ${response_time}s"
(( $(echo "$response_time < 1.0" | bc -l) )) && echo "   ✓ Performance acceptable" || echo "   ✗ Performance degraded"

# 7. Error Rate
echo "✅ Checking error rate..."
error_rate=$(curl -s https://api.vcsa.com/api/health/detailed | jq '.error_rate // 0')
echo "   Error rate: $error_rate"
(( $(echo "$error_rate < 0.01" | bc -l) )) && echo "   ✓ Error rate acceptable" || echo "   ✗ Error rate high"

echo "=================================="
```

---

## 📊 ROLLBACK METRICS

### Key Metrics to Track

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Rollback Time | < 5 min | 5-10 min | > 10 min |
| Data Loss | 0 | < 5 min | > 5 min |
| Service Downtime | < 2 min | 2-5 min | > 5 min |
| Verification Time | < 3 min | 3-5 min | > 5 min |

### Post-Rollback Analysis

```python
# ═══════════════════════════════════════════════════════════════
# Post-Rollback Analysis
# ═══════════════════════════════════════════════════════════════

POST_ROLLBACK_ANALYSIS = {
    "timeline": {
        "rollback_initiated": "Timestamp",
        "services_stopped": "Timestamp",
        "backup_restored": "Timestamp",
        "services_restarted": "Timestamp",
        "verification_complete": "Timestamp",
        "total_rollback_time": "Duration",
    },

    "impact": {
        "users_affected": "Count",
        "downtime_duration": "Duration",
        "data_lost": "Yes/No",
        "errors_during_rollback": "Count",
    },

    "root_cause": {
        "what_changed": "Description",
        "why_it_failed": "Root cause",
        "prevention_measures": "Action items",
    },

    "lessons_learned": {
        "what_worked": "Positive outcomes",
        "what_didnt_work": "Areas for improvement",
        "process_improvements": "Changes needed",
    },
}
```

---

## 📞 EMERGENCY CONTACTS

### On-Call Rotation

| Week | On-Call Engineer | Contact |
|------|------------------|---------|
| Week 1 | [Name] | [Phone/Email] |
| Week 2 | [Name] | [Phone/Email] |
| Week 3 | [Name] | [Phone/Email] |
| Week 4 | [Name] | [Phone/Email] |

### Escalation Path

1. **Level 1**: On-Call Engineer (Immediate response)
2. **Level 2**: Tech Lead (10 minutes)
3. **Level 3**: CTO/VP Engineering (30 minutes)
4. **Level 4**: CEO (Critical incidents only)

---

## 📋 PRE-DEPLOYMENT PREPARATION

### Pre-Deployment Rollback Prep

```bash
#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Pre-Deployment Rollback Preparation
# ═══════════════════════════════════════════════════════════════

echo "🔄 Pre-Deployment Rollback Preparation"
echo "======================================"

# 1. Create backup directory
mkdir -p backup/rollback_$(date +%Y%m%d_%H%M%S)

# 2. Backup current Docker images
echo "🗄️  Backing up current Docker images..."
docker save vcsa-production-backend:latest | gzip > backup/vcsa-backend-previous.tar.gz
docker save vcsa-production-frontend:latest | gzip > backup/vcsa-frontend-previous.tar.gz

# 3. Backup database
echo "🗄️  Backing up database..."
./scripts/backup_database.sh

# 4. Backup configuration
echo "🗄️  Backing up configuration..."
cp .env.production backup/env_production_pre-deployment.bak
cp docker-compose.production.yml backup/docker-compose.production.pre-deployment.yml

# 5. Tag current version
echo "🏷️  Tagging current version..."
git tag -f pre-deployment-$(date +%Y%m%d_%H%M%S)

# 6. Test rollback procedure
echo "🧪 Testing rollback procedure..."
# Verify backup files exist
ls -lh backup/*.tar.gz backup/*.bak backup/*.archive

# 7. Document current state
echo "📝 Documenting current state..."
cat > rollback_state.txt << EOF
Rollback State Information
==========================
Timestamp: $(date)
Git Commit: $(git rev-parse HEAD)
Docker Images: $(docker images --format "{{.Repository}}:{{.Tag}}")
Database Backup: $(ls -t backup/mongodb_backup*.archive | head -1)
Configuration Backup: $(ls -t backup/env_production*.bak | head -1)
EOF

echo "======================================"
echo "✅ Rollback preparation complete"
```

---

## 📚 BEST PRACTICES

### Do's and Don'ts

**✅ DO**:
- Test rollback procedure before going live
- Create backups before every deployment
- Tag Docker images with version numbers
- Document every rollback
- Perform post-mortem analysis
- Keep rollback scripts under version control
- Monitor for 30 minutes after rollback

**❌ DON'T**:
- Skip pre-deployment backups
- Deploy without rollback plan
- Ignore rollback triggers
- Rush rollback procedure
- Skip verification after rollback
- Delete old backups immediately
- Rollback during peak hours (unless emergency)

---

**Document Version**: 1.0
**Last Updated**: April 2026
**Maintained By**: DevOps Team
**Status**: ✅ Production Ready
**Next Review**: After each production incident
