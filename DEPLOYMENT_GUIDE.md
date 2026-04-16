# 🚀 VCSA Production Deployment Guide

**Purpose**: Comprehensive guide for deploying VCSA platform to production
**Sprint**: Sprint 2 - Task 7 (Deployment + Smoke Tests)
**Priority**: P1 - HIGH
**Estimated Time**: 8 hours

---

## 📋 DEPLOYMENT OVERVIEW

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     VCSA Production Stack                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Frontend   │───▶│   Backend    │───▶│   MongoDB    │      │
│  │   (React)    │    │   (FastAPI)  │    │   (Atlas)    │      │
│  │   Port 80    │    │   Port 8000  │    │   Port 27017 │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Infrastructure & Monitoring                  │   │
│  │  • Rate Limiting (Redis/In-Memory)                        │   │
│  │  • Performance Monitoring (Sentry)                        │   │
│  │  • SSL/TLS (Let's Encrypt)                                │   │
│  │  • Custom Domain (vcsa.com)                               │   │
│  │  • CDN (Cloudflare)                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Prerequisites Checklist

Before deploying to production, ensure:

- [ ] ✅ SSL certificate installed and valid
- [ ] ✅ Custom domain configured and propagating
- [ ] ✅ MongoDB Atlas cluster configured
- [ ] ✅ Environment variables configured
- [ ] ✅ Rate limiting enabled
- [ ] ✅ Performance monitoring enabled
- [ ] ✅ Sentry DSN configured
- [ ] ✅ Database indexes created
- [ ] ✅ Backup strategy configured
- [ ] ✅ Rollback plan documented

---

## 🔧 ENVIRONMENT CONFIGURATION

### Production Environment Variables

Create `.env.production` in project root:

```bash
# ═══════════════════════════════════════════════════════════════
# VCSA Production Environment Configuration
# ═══════════════════════════════════════════════════════════════

# Database Configuration
MONGO_URL=mongodb+srv://admin:PASSWORD@vcsa-cluster.mongodb.net/vcsa_production
DB_NAME=vcsa_production
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=CHANGE_ME

# Backend Configuration
NODE_ENV=production
BACKEND_URL=https://api.vcsa.com
FRONTEND_URL=https://vcsa.com

# Authentication
JWT_SECRET=CHANGE_ME_SUPER_SECRET
JWT_ALGORITHM=HS256
JWT_EXPIRATION=86400

# OAuth (Google)
GOOGLE_CLIENT_ID=CHANGE_ME
GOOGLE_CLIENT_SECRET=CHANGE_ME
OAUTH_REDIRECT_URI=https://vcsa.com/auth/callback

# Stripe
STRIPE_API_KEY=sk_live_CHANGE_ME
STRIPE_WEBHOOK_SECRET=whsec_CHANGE_ME
STRIPE_PRICE_ID=price_CHANGE_ME

# Sentry (Error Tracking)
SENTRY_DSN=https://CHANGE_ME@sentry.io/CHANGE_ME
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1

# Performance Monitoring
PERFORMANCE_MONITORING_ENABLED=true
ALERT_EMAIL_ENABLED=true
ALERT_EMAIL_TO=ops@vcsa.com
SENDGRID_API_KEY=SG.CHANGE_ME
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/CHANGE_ME

# Rate Limiting
RATE_LIMIT_ENABLED=true
REDIS_URL=redis://localhost:6379/0

# Frontend Configuration
REACT_APP_BACKEND_URL=https://api.vcsa.com
REACT_APP_STRIPE_PRICE_ID=price_CHANGE_ME

# Domain Configuration
DOMAIN=vcsa.com
API_DOMAIN=api.vcsa.com

# SSL Configuration
SSL_ENABLED=true
SSL_EMAIL=admin@vcsa.com
```

### Security Checklist

```bash
# 🔒 Security Verification Checklist

1. Passwords & Secrets
   [ ] All passwords changed from defaults
   [ ] JWT secret is strong (32+ characters)
   [ ] Database passwords are unique
   [ ] API keys are production keys (not test keys)

2. SSL/TLS
   [ ] SSL certificate valid and not expired
   [ ] HTTPS enforced on all endpoints
   [ ] HSTS enabled
   [ ] SSL configuration tested

3. Database
   [ ] IP whitelist configured
   [ ] Database users have minimal permissions
   [ ] SCRAM-SHA-256 authentication enabled
   [ ] TLS/SSL enabled for connections

4. API Security
   [ ] Rate limiting enabled
   [ ] CORS properly configured
   [ ] Authentication required on all sensitive endpoints
   [ ] Input validation enabled

5. Monitoring
   [ ] Sentry error tracking enabled
   [ ] Performance monitoring enabled
   [ ] Alert notifications configured
   [ ] Log aggregation configured
```

---

## 🚀 DEPLOYMENT PROCEDURE

### Phase 1: Pre-Deployment Checks (30 min)

```bash
#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Pre-Deployment Verification
# ═══════════════════════════════════════════════════════════════

# 1. Verify environment files
echo "✅ Checking environment files..."
[ -f .env.production ] && echo "   ✓ Production env file exists" || echo "   ✗ Missing .env.production"

# 2. Verify SSL certificate
echo "✅ Checking SSL certificate..."
openssl s_client -connect vcsa.com:443 -servername vcsa.com </dev/null 2>/dev/null | grep "Verify return code" | grep -q "0" && echo "   ✓ SSL certificate valid" || echo "   ✗ SSL certificate invalid"

# 3. Verify DNS propagation
echo "✅ Checking DNS propagation..."
dig +short vcsa.com | grep -q "YOUR_SERVER_IP" && echo "   ✓ DNS propagated" || echo "   ✗ DNS not propagated"

# 4. Verify MongoDB connectivity
echo "✅ Checking MongoDB connectivity..."
python backend/verify_database.py

# 5. Run local tests
echo "✅ Running test suite..."
cd backend && pytest -v --tb=short

# 6. Check for syntax errors
echo "✅ Checking syntax..."
flake8 backend/server.py
flake8 backend/phase1_routes.py

# 7. Verify code formatting
echo "✅ Checking code formatting..."
black --check backend/server.py
black --check backend/phase1_routes.py
```

### Phase 2: Database Migration (15 min)

```bash
#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Database Migration
# ═══════════════════════════════════════════════════════════════

# 1. Create backup before migration
echo "🗄️  Creating pre-migration backup..."
./scripts/backup_database.sh

# 2. Run database migrations
echo "🔄 Running database migrations..."
cd backend
python -c "
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

async def migrate():
    client = AsyncIOMotorClient('$MONGO_URL')
    db = client.vcsa_production

    # Create indexes
    print('Creating indexes...')
    await db.users.create_index('email', unique=True)
    await db.user_progress.create_index('user_id')
    await db.posts.create_index([('created_at', -1)])

    print('✅ Migration complete')

asyncio.run(migrate())
"

# 3. Verify migration
echo "✅ Verifying migration..."
python backend/verify_database.py
```

### Phase 3: Build & Deploy (20 min)

```bash
#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Build & Deploy
# ═══════════════════════════════════════════════════════════════

# 1. Set environment
export $(cat .env.production | grep -v '^#' | xargs)

# 2. Build Docker images
echo "🔨 Building Docker images..."
docker-compose -f docker-compose.production.yml build --no-cache

# 3. Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.production.yml down

# 4. Start new containers
echo "🚀 Starting new containers..."
docker-compose -f docker-compose.production.yml up -d

# 5. Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 30

# 6. Verify services are running
echo "✅ Verifying services..."
docker-compose -f docker-compose.production.yml ps
```

### Phase 4: Smoke Testing (15 min)

```bash
#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Smoke Testing
# ═══════════════════════════════════════════════════════════════

# Run automated smoke tests
./scripts/smoke_tests.sh

# Verify critical endpoints
echo "🧪 Testing critical endpoints..."

# Health check
curl -f https://api.vcsa.com/api/health || echo "   ✗ Health check failed"

# API documentation
curl -f https://api.vcsa.com/docs || echo "   ✗ API docs unavailable"

# Frontend
curl -f https://vcsa.com || echo "   ✗ Frontend unavailable"

# Authentication test
curl -X POST https://api.vcsa.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@vcsa.com","password":"demo123"}' \
  || echo "   ✗ Authentication failed"

echo "✅ Smoke tests complete"
```

### Phase 5: Post-Deployment Verification (10 min)

```bash
#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Post-Deployment Verification
# ═══════════════════════════════════════════════════════════════

# 1. Check service health
echo "✅ Checking service health..."
docker-compose -f docker-compose.production.yml ps

# 2. Verify database connectivity
echo "✅ Verifying database connectivity..."
python backend/verify_database.py

# 3. Check monitoring
echo "✅ Verifying monitoring..."
curl -f https://api.vcsa.com/api/health/detailed

# 4. Verify SSL
echo "✅ Verifying SSL..."
curl -I https://vcsa.com 2>&1 | grep "SSL"

# 5. Check rate limiting
echo "✅ Verifying rate limiting..."
curl -I https://api.vcsa.com/api/health | grep "X-RateLimit"

# 6. Test authentication flow
echo "✅ Testing authentication..."
cd backend/tests
python test_auth_flow.py

# 7. Run performance baseline
echo "✅ Running performance baseline..."
./scripts/measure_baseline.sh
```

---

## 🧪 SMOKE TEST COVERAGE

### Critical Endpoints to Test

```python
# ═══════════════════════════════════════════════════════════════
# Smoke Test Coverage
# ═══════════════════════════════════════════════════════════════

SMOKE_TESTS = {
    "Health & Status": [
        "GET /api/health",
        "GET /api/health/detailed",
    ],

    "Authentication": [
        "POST /api/auth/register",
        "POST /api/auth/login",
        "GET /api/auth/me",
        "POST /api/auth/logout",
    ],

    "Core API": [
        "GET /api/development/stages",
        "GET /api/development/tracks",
        "GET /api/development/progress",
    ],

    "Database": [
        "MongoDB connectivity",
        "Collection access",
        "Index verification",
    ],

    "Security": [
        "Rate limiting headers",
        "CORS headers",
        "HTTPS enforcement",
    ],

    "Monitoring": [
        "Sentry error tracking",
        "Performance metrics",
        "Alert system",
    ],
}
```

### Smoke Test Criteria

- ✅ All health checks return 200
- ✅ Critical endpoints respond < 1s
- ✅ Database connectivity verified
- ✅ Authentication flow working
- ✅ SSL certificate valid
- ✅ Rate limiting active
- ✅ Monitoring enabled

---

## 🔄 ROLLBACK PROCEDURE

### Automatic Rollback Triggers

```python
# ═══════════════════════════════════════════════════════════════
# Rollback Triggers
# ═══════════════════════════════════════════════════════════════

ROLLBACK_TRIGGERS = {
    "Critical Errors": [
        "Error rate > 10%",
        "Database connection failures",
        "Authentication failures",
    ],

    "Performance Issues": [
        "p95 response time > 2x baseline",
        "p99 response time > 3x baseline",
        "Memory usage > 95%",
        "CPU usage > 95%",
    ],

    "Security Issues": [
        "SSL certificate invalid",
        "Unauthorized access attempts",
        "Rate limiting failure",
    ],

    "Service Availability": [
        "Service downtime > 5 min",
        "Health check failures",
        "Critical endpoints unavailable",
    ],
}
```

### Rollback Steps

```bash
#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Rollback Procedure
# ═══════════════════════════════════════════════════════════════

echo "🔄 Initiating rollback procedure..."

# 1. Stop current deployment
echo "🛑 Stopping current deployment..."
docker-compose -f docker-compose.production.yml down

# 2. Restore previous images
echo "🔄 Restoring previous Docker images..."
docker load < backup/vcsa-backend-previous.tar
docker load < backup/vcsa-frontend-previous.tar

# 3. Restore database if needed
echo "🗄️  Restoring database..."
./scripts/restore_database.sh backup/mongodb_backup_pre-deployment

# 4. Restart services
echo "🚀 Restarting services..."
docker-compose -f docker-compose.production.yml up -d

# 5. Verify rollback
echo "✅ Verifying rollback..."
./scripts/smoke_tests.sh

# 6. Notify team
echo "📢 Rollback complete. Notify team..."
# Send alert to team

echo "✅ Rollback complete"
```

---

## 📊 DEPLOYMENT MONITORING

### Real-Time Monitoring

```bash
# ═══════════════════════════════════════════════════════════════
# Real-Time Monitoring Commands
# ═══════════════════════════════════════════════════════════════

# View logs
docker-compose -f docker-compose.production.yml logs -f

# View service status
docker-compose -f docker-compose.production.yml ps

# Check resource usage
docker stats vcsa-production-backend vcsa-production-frontend

# View performance metrics
curl https://api.vcsa.com/api/admin/metrics

# Check error rate
curl https://api.vcsa.com/api/health/detailed
```

### Alert Thresholds

| Metric | Warning | Critical | Emergency |
|--------|---------|----------|-----------|
| Response Time (p95) | 500ms | 1000ms | 2000ms |
| Response Time (p99) | 1000ms | 2000ms | 5000ms |
| Error Rate | 1% | 5% | 10% |
| Memory Usage | 70% | 85% | 95% |
| CPU Usage | 70% | 85% | 95% |

---

## ✅ DEPLOYMENT CHECKLIST

### Pre-Deployment (Day Before)

- [ ] Review all changes since last deployment
- [ ] Run full test suite locally
- [ ] Create database backup
- [ ] Verify SSL certificate validity
- [ ] Verify DNS propagation
- [ ] Test environment variables
- [ ] Prepare rollback plan
- [ ] Notify stakeholders

### During Deployment (Deployment Window)

- [ ] Follow deployment procedure exactly
- [ ] Monitor logs for errors
- [ ] Run smoke tests
- [ ] Verify health checks
- [ ] Check performance metrics
- [ ] Test critical user flows
- [ ] Verify monitoring active

### Post-Deployment (30 min after)

- [ ] Run smoke tests again
- [ ] Check error rates in Sentry
- [ ] Verify performance baseline
- [ ] Test authentication flow
- [ ] Test payment flow
- [ ] Check database metrics
- [ ] Monitor for 30 minutes
- [ ] Document any issues

---

## 🚨 TROUBLESHOOTING

### Common Issues

#### 1. Database Connection Failed

```bash
# Check MongoDB connectivity
docker-compose -f docker-compose.production.yml exec backend \
  python -c "from motor.motor_asyncio import AsyncIOMotorClient; print('Connected')"

# Verify environment variables
docker-compose -f docker-compose.production.yml exec backend env | grep MONGO

# Check database logs
docker-compose -f docker-compose.production.yml logs mongodb
```

#### 2. SSL Certificate Issues

```bash
# Verify SSL certificate
openssl s_client -connect vcsa.com:443 -servername vcsa.com

# Check certificate expiration
echo | openssl s_client -connect vcsa.com:443 2>/dev/null | \
  openssl x509 -noout -dates

# Restart nginx/certbot
docker-compose -f docker-compose.production.yml restart frontend
```

#### 3. High Memory Usage

```bash
# Check memory usage
docker stats vcsa-production-backend vcsa-production-frontend

# Check for memory leaks
docker-compose -f docker-compose.production.yml exec backend \
  python -c "import psutil; print(psutil.virtual_memory())"

# Restart services
docker-compose -f docker-compose.production.yml restart
```

#### 4. Slow Response Times

```bash
# Check performance metrics
curl https://api.vcsa.com/api/admin/slowest-endpoints

# Run performance baseline
./scripts/measure_baseline.sh

# Check database queries
docker-compose -f docker-compose.production.yml logs backend | grep "SLOW"
```

---

## 📞 CONTACT & SUPPORT

### Emergency Contacts

| Role | Name | Contact |
|------|------|---------|
| Tech Lead | [Name] | [Email/Phone] |
| DevOps | [Name] | [Email/Phone] |
| Backend Lead | [Name] | [Email/Phone] |

### Useful Commands

```bash
# Quick status check
./deploy-production.sh status

# View logs
./deploy-production.sh logs [service]

# Restart service
./deploy-production.sh restart [service]

# Full redeployment
./deploy-production.sh deploy

# Emergency rollback
./scripts/rollback.sh emergency
```

---

**Document Version**: 1.0
**Last Updated**: April 2026
**Maintained By**: DevOps Team
**Status**: ✅ Production Ready
