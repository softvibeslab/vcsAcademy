# 🔧 Troubleshooting Guides

**Version**: 1.0.0
**Last Updated**: April 2026
**Status**: Production Ready
**Audience**: Operations Team, SREs, DevOps Engineers

---

## 📋 Table of Contents

1. [Troubleshooting Overview](#troubleshooting-overview)
2. [Common Issues](#common-issues)
3. [Application Issues](#application-issues)
4. [Database Issues](#database-issues)
5. [Infrastructure Issues](#infrastructure-issues)
6. [Performance Issues](#performance-issues)
7. [Security Issues](#security-issues)
8. [Third-Party Issues](#third-party-issues)

---

## Troubleshooting Overview

### Troubleshooting Methodology

**Systematic Approach**:

```
1. IDENTIFY THE PROBLEM
   ├── What is broken?
   ├── Who is affected?
   ├── When did it start?
   └── What changed recently?

2. GATHER INFORMATION
   ├── Check logs
   ├── Check metrics
   ├── Check monitoring
   └── User reports

3. FORM HYPOTHESIS
   ├── Root cause analysis
   ├── Check recent changes
   ├── Review known issues
   └── Consult documentation

4. TEST HYPOTHESIS
   ├── Reproduce issue
   ├── Test fix
   ├── Verify solution
   └── Monitor results

5. IMPLEMENT FIX
   ├── Deploy fix
   ├── Verify resolution
   ├── Monitor for recurrence
   └── Document incident
```

### Troubleshooting Tools

**Essential Commands**:

```bash
# System Information
docker-compose ps              # Container status
docker stats --no-stream      # Resource usage
df -h                         # Disk usage
free -h                       # Memory usage
top                           # CPU usage

# Logs
docker-compose logs backend --tail=100    # Backend logs
docker-compose logs frontend --tail=100   # Frontend logs
docker-compose logs mongodb --tail=100    # MongoDB logs
tail -f /var/log/vcsavibes/*.log          # Application logs

# Network
curl -I https://app.vcsavibes.com         # HTTP response
netstat -tlnp                          # Open ports
ss -tlnp                               # Open ports (alternative)

# Database
docker-compose exec mongodb mongosh      # MongoDB shell
docker-compose exec mongodb mongosh --eval "db.stats()"  # DB stats
```

---

## Common Issues

### Issue: Application Won't Start

**Symptoms**:
- Container exits immediately
- 502/503 errors
- Health check fails

**Diagnosis**:

```bash
# Check container status
docker-compose ps

# Check container logs
docker-compose logs backend
docker-compose logs frontend

# Check for errors in logs
docker-compose logs backend | grep -i error
docker-compose logs backend | grep -i exception
```

**Common Causes & Solutions**:

```yaml
Cause 1: Port already in use
  Check: lsof -i :8000
  Fix: Kill process using port or change port

Cause 2: Database connection failed
  Check: docker-compose ps mongodb
  Fix: Start MongoDB, check connection string

Cause 3: Missing environment variables
  Check: docker-compose exec backend env | grep -i mongo
  Fix: Add missing variables to .env file

Cause 4: Disk space full
  Check: df -h
  Fix: Clean up disk space, Docker prune

Cause 5: Memory limit reached
  Check: docker stats
  Fix: Increase memory limit in docker-compose.yml
```

**Resolution Steps**:

```bash
# 1. Check container status
docker-compose ps

# 2. Check logs for errors
docker-compose logs backend --tail=50

# 3. Restart container
docker-compose restart backend

# 4. If restart fails, recreate
docker-compose up -d --force-recreate backend

# 5. Verify health
curl https://app.vcsavibes.com/api/health
```

### Issue: High CPU Usage

**Symptoms**:
- Slow response times
- CPU > 80%
- Container throttling

**Diagnosis**:

```bash
# Check CPU usage
docker stats --no-stream

# Check process CPU usage
docker-compose exec backend top

# Check database queries
docker-compose exec mongodb mongosh --eval "db.currentOp()"
```

**Common Causes & Solutions**:

```yaml
Cause 1: Infinite loop in code
  Check: Code review, recent changes
  Fix: Fix infinite loop, rollback change

Cause 2: Slow database queries
  Check: db.currentOp(), slow query log
  Fix: Add indexes, optimize queries

Cause 3: Too many requests
  Check: Request rate, traffic spike
  Fix: Scale horizontally, add rate limiting

Cause 4: Inefficient code
  Check: APM for slow endpoints
  Fix: Optimize code, add caching

Cause 5: Background job issues
  Check: Background job status
  Fix: Fix job logic, add concurrency limits
```

**Resolution Steps**:

```bash
# 1. Identify high CPU process
docker stats --no-stream

# 2. Check recent changes
git log --oneline -10

# 3. Check for slow queries
docker-compose exec mongodb mongosh --eval "db.setProfilingLevel(1, {slowms: 1000})"
docker-compose exec mongodb mongosh --eval "db.system.profile.find().limit(10).sort({ts: -1})"

# 4. If recent deployment caused issue, rollback
git revert <commit-sha>
docker-compose up -d --build backend

# 5. Scale if needed
docker-compose up -d --scale backend=2
```

---

## Application Issues

### Issue: Authentication Failures

**Symptoms**:
- Users can't login
- "Invalid credentials" errors
- Session expires immediately

**Diagnosis**:

```bash
# Check authentication logs
docker-compose logs backend | grep -i auth

# Check JWT configuration
docker-compose exec backend env | grep -i jwt

# Check user database
docker-compose exec mongodb mongosh --eval "db.users.countDocuments({})"
```

**Common Causes & Solutions**:

```yaml
Cause 1: JWT secret mismatch
  Check: JWT_SECRET environment variable
  Fix: Ensure consistent JWT secret across all instances

Cause 2: Database connection issue
  Check: MongoDB connection
  Fix: Fix MongoDB connection string

Cause 3: User database corrupted
  Check: User count, recent user creation
  Fix: Restore from backup

Cause 4: Session store issue
  Check: Redis/mongo session store
  Fix: Restart session store

Cause 5: OAuth provider issue
  Check: Google OAuth status
  Fix: Check OAuth credentials, API status
```

**Resolution Steps**:

```bash
# 1. Check authentication endpoint
curl -X POST https://app.vcsavibes.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@vcsa.com","password":"demo123"}'

# 2. Check backend logs
docker-compose logs backend | grep -i "login\|auth"

# 3. Verify JWT configuration
docker-compose exec backend env | grep JWT

# 4. Test with demo user
docker-compose exec backend python -c "
from server import authenticate_user
print(authenticate_user('demo@vcsa.com', 'demo123'))
"

# 5. If JWT secret changed, logout all users
docker-compose exec mongodb mongosh --eval "
db.sessions.deleteMany({})
"
```

### Issue: Payment Processing Failures

**Symptoms**:
- Payments fail
- Webhook errors
- Subscription not activated

**Diagnosis**:

```bash
# Check payment logs
docker-compose logs backend | grep -i stripe

# Check Stripe API key
docker-compose exec backend env | grep STRIPE

# Test Stripe connection
curl https://api.stripe.com/v1/charges -u sk_test_...
```

**Common Causes & Solutions**:

```yaml
Cause 1: Stripe API key invalid
  Check: STRIPE_API_KEY environment variable
  Fix: Update API key in .env file

Cause 2: Webhook endpoint not accessible
  Check: Webhook URL in Stripe dashboard
  Fix: Update webhook URL, firewall rules

Cause 3: Webhook signature mismatch
  Check: Stripe webhook secret
  Fix: Update STRIPE_WEBHOOK_SECRET

Cause 4: Payment logic error
  Check: Recent code changes
  Fix: Fix bug, rollback if needed

Cause 5: Stripe API down
  Check: Stripe status page
  Fix: Wait for Stripe to resolve
```

**Resolution Steps**:

```bash
# 1. Check Stripe status
curl https://status.stripe.com/

# 2. Check webhook delivery
# In Stripe Dashboard: Developers > Webhooks > Find webhook > Check recent deliveries

# 3. Test webhook endpoint
curl -X POST https://app.vcsavibes.com/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "test"}'

# 4. Check backend logs for webhook errors
docker-compose logs backend | grep -i webhook

# 5. If webhook signature issue, update secret
docker-compose exec backend bash -c 'echo $STRIPE_WEBHOOK_SECRET'
# Update in Stripe Dashboard
```

---

## Database Issues

### Issue: Database Connection Failed

**Symptoms**:
- "Cannot connect to MongoDB" errors
- Connection timeout
- Application crashes

**Diagnosis**:

```bash
# Check MongoDB container
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb --tail=100

# Test MongoDB connection
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

**Common Causes & Solutions**:

```yaml
Cause 1: MongoDB container not running
  Check: docker-compose ps mongodb
  Fix: Start MongoDB container

Cause 2: Wrong connection string
  Check: MONGO_URL environment variable
  Fix: Update connection string

Cause 3: MongoDB crashed
  Check: MongoDB logs for errors
  Fix: Fix issue, restart MongoDB

Cause 4: Network issue
  Check: Docker network
  Fix: Fix Docker network configuration

Cause 5: MongoDB authentication failed
  Check: Username/password
  Fix: Update credentials
```

**Resolution Steps**:

```bash
# 1. Check MongoDB status
docker-compose ps mongodb

# 2. If not running, start it
docker-compose start mongodb

# 3. If crashed, check logs
docker-compose logs mongodb --tail=100

# 4. Restart MongoDB
docker-compose restart mongodb

# 5. Verify connection
docker-compose exec mongodb mongosh --eval "db.stats()"

# 6. Check connection string
docker-compose exec backend env | grep MONGO_URL
```

### Issue: Slow Database Queries

**Symptoms**:
- Slow page loads
- Database timeout errors
- High database CPU

**Diagnosis**:

```bash
# Enable query profiling
docker-compose exec mongodb mongosh --eval "db.setProfilingLevel(1, {slowms: 1000})"

# Check slow queries
docker-compose exec mongodb mongosh --eval "db.system.profile.find().limit(10).sort({ts: -1})"

# Check current operations
docker-compose exec mongodb mongosh --eval "db.currentOp({'active': true})"
```

**Common Causes & Solutions**:

```yaml
Cause 1: Missing indexes
  Check: Query execution plan
  Fix: Add appropriate indexes

Cause 2: Large result sets
  Check: Query result size
  Fix: Add pagination, limit results

Cause 3: Inefficient query
  Check: Query structure
  Fix: Optimize query, use projections

Cause 4: Database size too large
  Check: Database size
  Fix: Archive old data, add indexes

Cause 5: Lock contention
  Check: Current operations
  Fix: Optimize write operations
```

**Resolution Steps**:

```bash
# 1. Enable profiling
docker-compose exec mongodb mongosh --eval "db.setProfilingLevel(1, {slowms: 1000})"

# 2. Find slow queries
docker-compose exec mongodb mongosh --eval "db.system.profile.find().limit(10).sort({ts: -1})"

# 3. Check indexes
docker-compose exec mongodb mongosh --eval "db.users.getIndexes()"

# 4. Add missing indexes
docker-compose exec mongodb mongosh --eval "
db.users.createIndex({email: 1})
db.user_progress.createIndex({user_id: 1})
"

# 5. Check query plan
docker-compose exec mongodb mongosh --eval "
db.users.find({email: 'test@example.com'}).explain('executionStats')
"
```

---

## Infrastructure Issues

### Issue: Disk Space Full

**Symptoms**:
- "No space left on device"
- Containers fail to start
- Write errors

**Diagnosis**:

```bash
# Check disk space
df -h

# Find large files
du -sh /opt/vcsavibes/* | sort -h

# Check Docker space
docker system df
```

**Common Causes & Solutions**:

```yaml
Cause 1: Docker images taking space
  Check: docker system df
  Fix: docker system prune -a

Cause 2: Log files too large
  Check: ls -lh /var/log/vcsavibes/
  Fix: Rotate logs, clean old logs

Cause 3: Database grew too large
  Check: MongoDB size
  Fix: Archive old data, compact database

Cause 4: Backup files not cleaned
  Check: Backup directory size
  Fix: Clean old backups

Cause 5: Upload files accumulated
  Check: Upload directory size
  Fix: Move to object storage, clean old files
```

**Resolution Steps**:

```bash
# 1. Check disk space
df -h

# 2. Clean Docker
docker system prune -a --volumes

# 3. Clean old logs
find /var/log/vcsavibes/ -name "*.log" -mtime +7 -delete

# 4. Clean old backups
find /opt/vcsavibes/backups/ -name "*.gz" -mtime +30 -delete

# 5. Compact MongoDB
docker-compose exec mongodb mongosh --eval "db.runCommand({compact: 'users'})"

# 6. Monitor disk usage
watch -n 60 df -h
```

### Issue: Memory Exhaustion

**Symptoms**:
- OOM killer kills containers
- Container restarts
- Swap usage high

**Diagnosis**:

```bash
# Check memory usage
free -h

# Check container memory
docker stats --no-stream

# Check OOM killer
dmesg | grep -i oom
```

**Common Causes & Solutions**:

```yaml
Cause 1: Memory leak
  Check: Container memory growth
  Fix: Fix memory leak, restart container

Cause 2: Memory limit too low
  Check: Docker memory limit
  Fix: Increase memory limit

Cause 3: Too many containers
  Check: Running containers
  Fix: Stop unused containers

Cause 4: Large database in memory
  Check: MongoDB memory usage
  Fix: Add physical memory, scale database

Cause 5: Application caching too much
  Check: Application cache
  Fix: Reduce cache size, add TTL
```

**Resolution Steps**:

```bash
# 1. Check memory usage
free -h
docker stats --no-stream

# 2. Check for OOM
dmesg | grep -i oom

# 3. Restart containers if memory leak
docker-compose restart backend

# 4. Increase memory limit in docker-compose.yml
# services:
#   backend:
#     mem_limit: 2g

# 5. Clear system cache
sync; echo 3 > /proc/sys/vm/drop_caches

# 6. Monitor memory
watch -n 60 free -h
```

---

## Performance Issues

### Issue: Slow Response Times

**Symptoms**:
- Page loads > 3 seconds
- API timeouts
- Poor user experience

**Diagnosis**:

```bash
# Check response time
curl -w "@-" -o /dev/null -s "https://app.vcsavibes.com/api/health" <<EOF
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
   time_pretransfer:  %{time_pretransfer}\n
      time_redirect:  %{time_redirect}\n
 time_starttransfer:  %{time_starttransfer}\n
                    ----------\n
         time_total:  %{time_total}\n
EOF

# Check APM metrics
# Visit: Datadog/New Relic dashboard
```

**Common Causes & Solutions**:

```yaml
Cause 1: Slow database queries
  Check: Database query performance
  Fix: Add indexes, optimize queries

Cause 2: Network latency
  Check: Network latency
  Fix: Use CDN, optimize network

Cause 3: Inefficient code
  Check: APM for slow endpoints
  Fix: Optimize code, add caching

Cause 4: Third-party API slow
  Check: Third-party API response time
  Fix: Add timeouts, caching, fallback

Cause 5: Resource contention
  Check: CPU, memory, disk I/O
  Fix: Scale resources
```

**Resolution Steps**:

```bash
# 1. Measure response time
curl -w "%{time_total}\n" -o /dev/null -s https://app.vcsavibes.com/api/health

# 2. Check APM for slow endpoints
# Visit: APM Dashboard

# 3. Check database queries
docker-compose exec mongodb mongosh --eval "db.system.profile.find().limit(10).sort({ts: -1})"

# 4. Add caching if needed
# Check cache hit rate, add Redis if needed

# 5. Scale if needed
docker-compose up -d --scale backend=2

# 6. Monitor response time
watch -n 60 'curl -w "%{time_total}\n" -o /dev/null -s https://app.vcsavibes.com/api/health'
```

---

## Security Issues

### Issue: Unauthorized Access

**Symptoms**:
- Suspicious activity
- Failed login attempts
- Data breaches

**Diagnosis**:

```bash
# Check auth logs
docker-compose logs backend | grep -i "failed login"

# Check access logs
tail -100 /var/log/nginx/access.log

# Check active sessions
docker-compose exec mongodb mongosh --eval "db.sessions.countDocuments({})"
```

**Common Causes & Solutions**:

```yaml
Cause 1: Brute force attack
  Check: Many failed logins from same IP
  Fix: Block IP, add rate limiting

Cause 2: Compromised credentials
  Check: Leaked credentials
  Fix: Force password reset, revoke sessions

Cause 3: Session hijacking
  Check: Unusual session activity
  Fix: Invalidate sessions, improve session security

Cause 4: API vulnerability
  Check: API security scan
  Fix: Fix vulnerability, update dependencies

Cause 5: Missing authentication
  Check: Public endpoints
  Fix: Add authentication, secure endpoints
```

**Resolution Steps**:

```bash
# 1. Check for suspicious activity
docker-compose logs backend | grep -i "failed login" | tail -50

# 2. Block suspicious IPs
# In nginx.conf or firewall:
# deny 1.2.3.4;

# 3. Revoke all sessions
docker-compose exec mongodb mongosh --eval "db.sessions.deleteMany({})"

# 4. Force password reset
docker-compose exec mongodb mongosh --eval "
db.users.updateMany({}, {\$set: {require_password_reset: true}})
"

# 5. Add rate limiting
# In nginx.conf:
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;

# 6. Run security scan
docker run --rm -v /opt/vcsavibes:/app trivy image --severity HIGH,CRITICAL vcsavibes/backend
```

---

## Third-Party Issues

### Issue: Stripe API Down

**Symptoms**:
- Payment processing fails
- Webhooks not delivered
- Stripe API errors

**Diagnosis**:

```bash
# Check Stripe status
curl https://status.stripe.com/

# Test Stripe API
curl https://api.stripe.com/v1/charges -u sk_test_...

# Check Stripe dashboard for incidents
```

**Resolution Steps**:

```bash
# 1. Check Stripe status page
curl https://status.stripe.com/

# 2. Subscribe to Stripe status updates

# 3. Implement retry logic for failed payments

# 4. Communicate with users about payment issues

# 5. Queue failed payments for retry when Stripe is back
```

### Issue: Google OAuth Down

**Symptoms**:
- Google login fails
- OAuth errors
- User can't authenticate

**Diagnosis**:

```bash
# Check Google status
curl https://status.cloud.google.com/

# Test OAuth endpoint
curl https://accounts.google.com/.well-known/openid-configuration
```

**Resolution Steps**:

```bash
# 1. Check Google status page
curl https://status.cloud.google.com/

# 2. Verify OAuth credentials
docker-compose exec backend env | grep GOOGLE

# 3. Test OAuth flow manually
# Visit: https://accounts.google.com/.well-known/openid-configuration

# 4. Fallback to email/password login

# 5. Communicate with users about login issues
```

---

## Escalation Procedures

### When to Escalate

```yaml
Immediate Escalation (P1):
  - Complete system outage
  - Data breach
  - Security compromise
  - Payment processing down
  Escalate to: CTO, VP Engineering

Escalate Within 30 Minutes (P2):
  - Major feature broken
  - Performance degradation
  - Partial outage
  Escalate to: Engineering Manager

Escalate Within 2 Hours (P3):
  - Minor feature broken
  - Performance issues
  Escalate to: Team Lead

Plan for Next Day (P4):
  - Cosmetic issues
  - Documentation errors
  Escalate to: Product Owner
```

### Escalation Contacts

| Role | Name | Contact |
|------|------|----------|
| On-Call Engineer | [Name] | +1 (555) 123-4567 |
| Engineering Manager | [Name] | +1 (555) 234-5678 |
| CTO | [Name] | +1 (555) 345-6789 |
| VP Engineering | [Name] | +1 (555) 456-7890 |

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
