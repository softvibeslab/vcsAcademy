# 📊 Monitoring Procedures

**Version**: 1.0.0
**Last Updated**: April 2026
**Status**: Production Ready
**Audience**: Operations Team, SREs, DevOps Engineers

---

## 📋 Table of Contents

1. [Monitoring Overview](#monitoring-overview)
2. [Monitoring Stack](#monitoring-stack)
3. [Application Monitoring](#application-monitoring)
4. [Infrastructure Monitoring](#infrastructure-monitoring)
5. [Business Metrics](#business-metrics)
6. [Alert Configuration](#alert-configuration)
7. [Dashboard Management](#dashboard-management)
8. [Response Procedures](#response-procedures)

---

## Monitoring Overview

### Monitoring Philosophy

**Three Pillars of Monitoring**:

1. **Infrastructure Monitoring** - Server health, resource usage, network
2. **Application Monitoring** - Application performance, errors, transactions
3. **Business Monitoring** - User behavior, conversions, revenue impact

### Monitoring Goals

- **MTTD** (Mean Time To Detect): < 5 minutes for critical issues
- **MTTR** (Mean Time To Resolve): < 30 minutes for P1 incidents
- **Visibility**: 100% of critical systems monitored
- **Proactive Detection**: Detect issues before users do

---

## Monitoring Stack

### Tool Categories

| Category | Tool | Purpose |
|----------|------|---------|
| **APM** | Datadog/New Relic | Application performance monitoring |
| **Error Tracking** | Sentry | Error aggregation and alerting |
| **Uptime Monitoring** | UptimeRobot/Pingdom | Endpoint availability |
| **Log Aggregation** | ELK Stack / CloudWatch | Log collection and analysis |
| **Infrastructure** | Datadog/Grafana | Server metrics, Docker stats |
| **Synthetic Monitoring** | Playwright/Puppeteer | User journey testing |
| **Business Intelligence** | Custom Dashboard | Business metrics |

### Tool Integration

```yaml
Primary Tools:
  - Datadog: Infrastructure + APM
  - Sentry: Error tracking
  - UptimeRobot: Uptime monitoring
  - CloudWatch: Log aggregation (AWS)

Secondary Tools:
  - PagerDuty: Alert escalation
  - Slack: Team notifications
  - Status Page: Public status
  - Custom Dashboard: Business metrics
```

---

## Application Monitoring

### 1. Application Performance Monitoring (APM)

**Tool**: Datadog APM / New Relic

**Key Metrics**:

```yaml
Response Times:
  - p50 (median): < 500ms
  - p95: < 1s
  - p99: < 2s
  - Error threshold: > 5% triggers alert

Throughput:
  - Requests per minute (RPM)
  - Requests per second (RPS)
  - Peak traffic patterns
  - Trend analysis

Database Performance:
  - Query execution time
  - Connection pool usage
  - Slow queries (> 1s)
  - Database index usage

External API Calls:
  - Stripe API response time
  - Google Auth API response time
  - Third-party service health
```

**Endpoint Monitoring**:

```bash
# Critical Endpoints (monitor every 1 minute)
GET  /api/health                    # Health check
GET  /api/health/detailed           # Detailed health
POST /api/auth/login                # Authentication
GET  /api/development/progress      # User progress
POST /api/development/content/*/complete  # Content completion

# Important Endpoints (monitor every 5 minutes)
GET  /api/development/stages        # Development stages
GET  /api/development/tracks        # Training tracks
GET  /api/development/breakdowns    # Deal breakdowns
GET  /api/development/quickwins     # Quick wins
```

**Transaction Tracing**:

```yaml
Critical Transactions:
  - User Login Flow
  - Content Completion Flow
  - Progress Update Flow
  - Payment Processing Flow

Trace Configuration:
  - Sample rate: 100% for critical flows
  - Sample rate: 10% for normal flows
  - Include: Database queries, HTTP requests, errors
```

### 2. Error Monitoring

**Tool**: Sentry

**Error Configuration**:

```yaml
Error Rate Thresholds:
  - Warning: > 1% error rate
  - Critical: > 5% error rate
  - Severe: > 20% error rate

Issue Priority:
  - P1: Error rate > 20% or authentication failure
  - P2: Error rate > 5% or payment failure
  - P3: Error rate > 1% or non-critical feature
  - P4: Cosmetic issues, edge cases

Alert Rules:
  - New error spike detected
  - Error rate exceeds threshold
  - Same error occurs > 100 times in 5 minutes
  - Critical error (500, database, payment)
```

**Error Categories**:

```yaml
Critical Errors (P1):
  - 500 Internal Server Error
  - Database connection failures
  - Payment processing failures
  - Authentication service failures

High Priority (P2):
  - 400 Bad Request (spike)
  - 403 Forbidden (unexpected)
  - Timeout errors
  - Third-party API failures

Medium Priority (P3):
  - 404 Not Found (unexpected)
  - Validation errors (spike)
  - Rate limiting errors

Low Priority (P4):
  - Client-side JavaScript errors
  - UI rendering issues
  - Minor feature bugs
```

**Sentry Dashboard Configuration**:

```bash
# Key Filters
- Environment: production, staging
- Level: error, critical
- Frequency: Last 15 minutes, 1 hour, 24 hours
- Tags: user_id, endpoint, error_type

# Saved Searches
"Critical Production Errors":
  - environment:production
  - level:error OR level:critical
  - timestamp:>now-15m

"Payment Failures":
  - transaction:/api/stripe/*
  - level:error

"Database Issues":
  - type:MongoError
  - level:error
```

### 3. Uptime Monitoring

**Tool**: UptimeRobot / Pingdom

**Monitored Endpoints**:

```yaml
Critical (check every 30 seconds):
  - https://app.vcsavibes.com/                    # Frontend
  - https://app.vcsavibes.com/api/health          # Backend health
  - https://app.vcsavibes.com/api/health/detailed # Detailed health

Important (check every 1 minute):
  - https://staging.vcsavibes.com/                 # Staging frontend
  - https://staging.vcsavibes.com/api/health       # Staging backend

Secondary (check every 5 minutes):
  - https://status.vcsavibes.com/                  # Status page
  - https://docs.vcsavibes.com/                    # Documentation
```

**Uptime Alert Configuration**:

```yaml
Alert Conditions:
  - Down time: > 30 seconds
  - HTTP status: 4xx, 5xx
  - Response time: > 5 seconds
  - Content mismatch: Critical keywords missing

Notification Channels:
  - Primary: Slack (#alerts)
  - Secondary: Email (ops@vcsavibes.com)
  - Tertiary: SMS (on-call engineer)
  - Escalation: PagerDuty (after 5 minutes)
```

---

## Infrastructure Monitoring

### 1. Server Health Monitoring

**Tool**: Datadog / Grafana + Prometheus

**Key Metrics**:

```yaml
CPU Metrics:
  - Overall CPU usage: < 70% (warning), < 90% (critical)
  - Per-core CPU usage
  - CPU load average (1m, 5m, 15m)
  - Process CPU usage (top 10)

Memory Metrics:
  - Total memory usage: < 80% (warning), < 95% (critical)
  - Swap usage: < 50%
  - Per-container memory usage
  - Memory leak detection

Disk Metrics:
  - Disk usage: < 80% (warning), < 90% (critical)
  - Disk I/O (read/write operations)
  - Disk throughput (MB/s)
  - Inode usage

Network Metrics:
  - Network traffic (in/out)
  - Network errors (dropped packets)
  - Connection count
  - Network latency
```

**Alert Thresholds**:

```yaml
CPU Alerts:
  - Warning: CPU > 70% for 5 minutes
  - Critical: CPU > 90% for 2 minutes

Memory Alerts:
  - Warning: Memory > 80% for 5 minutes
  - Critical: Memory > 95% for 2 minutes

Disk Alerts:
  - Warning: Disk > 80% for any mount
  - Critical: Disk > 90% for any mount
  - Immediate: Disk > 95% (immediate action needed)

Load Average Alerts:
  - Warning: Load > CPU core count * 0.7
  - Critical: Load > CPU core count * 0.9
```

### 2. Docker Container Monitoring

**Tool**: Datadog Docker Agent / cAdvisor

**Container Metrics**:

```yaml
Container Health:
  - Container status (running, exited, dead)
  - Container restart count
  - Container uptime
  - Container resource limits

Resource Usage:
  - CPU usage per container
  - Memory usage per container
  - Network I/O per container
  - Disk I/O per container

Container-specific Metrics:
  backend:
    - Request rate
    - Response time
    - Error rate
    - Database connection pool

  frontend:
    - Build time
    - Serve time
    - Static asset requests
    - CDN hit rate

  mongodb:
    - Query performance
    - Connection count
    - Replication lag (if applicable)
    - Database size
```

**Container Health Checks**:

```bash
# Docker health check configuration
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s

# Manual health check
docker inspect --format='{{.State.Health.Status}}' backend

# Check all container health
docker ps --format "table {{.Names}}\t{{.Status}}"
```

**Container Alerts**:

```yaml
Container Down Alerts:
  - Condition: Container status != "running"
  - Severity: P1 (backend, mongodb), P2 (frontend)
  - Notification: Immediate Slack + SMS

Container Restart Alerts:
  - Warning: > 3 restarts in 10 minutes
  - Critical: > 5 restarts in 10 minutes
  - Notification: Slack + email

Resource Limit Alerts:
  - Warning: Container hits CPU limit
  - Critical: Container hits memory limit (OOM killer)
  - Notification: Slack + investigate
```

### 3. Database Monitoring

**Tool**: Datadog MongoDB Integration / MongoDB Atlas Metrics

**Database Metrics**:

```yaml
Performance Metrics:
  - Query execution time (p50, p95, p99)
  - Slow queries (> 1s threshold)
  - Query throughput (operations/sec)
  - Document count and size

Connection Metrics:
  - Active connections
  - Connection pool usage
  - Connection wait time
  - Connection errors

Replication Metrics (if applicable):
  - Replication lag
  - Replication status
  - Node health

Storage Metrics:
  - Database size
  - Collection size
  - Index size
  - Storage efficiency
```

**Database Health Checks**:

```bash
# MongoDB connection check
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Database stats
docker-compose exec mongodb mongosh --eval "db.stats()"

# Collection stats
docker-compose exec mongodb mongosh --eval "db.users.stats()"

# Slow query analysis
docker-compose exec mongodb mongosh --eval "db.setProfilingLevel(1, {slowms: 1000})"
docker-compose exec mongodb mongosh --eval "db.system.profile.find().limit(10).sort({ts: -1})"
```

**Database Alerts**:

```yaml
Performance Alerts:
  - Warning: Slow query rate > 10/min
  - Critical: Slow query rate > 50/min
  - Critical: Query time > 5s

Connection Alerts:
  - Warning: Connections > 80% of pool
  - Critical: Connections > 95% of pool
  - Critical: Connection errors > 5%

Storage Alerts:
  - Warning: Database size > 80% of allocated
  - Critical: Database size > 90% of allocated
  - Warning: Index size > 50% of data size
```

---

## Business Metrics

### 1. User Behavior Metrics

**Tool**: Custom Dashboard (Google Analytics + Backend Analytics)

**Key Metrics**:

```yaml
User Engagement:
  - Daily Active Users (DAU)
  - Weekly Active Users (WAU)
  - Monthly Active Users (MAU)
  - Session duration
  - Page views per session

Content Engagement:
  - Video completion rate
  - Module completion rate
  - Track progress rate
  - Bookmark usage
  - Quick win application rate

Training Progress:
  - Users per stage (Stage 1-4)
  - Average readiness score
  - Badge completion rate
  - Training streak days
```

### 2. Conversion Metrics

**Tool**: Stripe Analytics + Custom Dashboard

**Key Metrics**:

```yaml
Funnel Metrics:
  - Sign-up conversion rate
  - Activation rate (first login)
  - Free to paid conversion
  - Churn rate

Revenue Metrics:
  - MRR (Monthly Recurring Revenue)
  - ARPU (Average Revenue Per User)
  - LTV (Lifetime Value)
  - CAC (Customer Acquisition Cost)

Payment Health:
  - Payment success rate: > 98%
  - Payment failure rate: < 2%
  - Refund rate: < 1%
  - Chargeback rate: < 0.5%
```

**Business Alerts**:

```yaml
Critical Business Alerts:
  - Payment success rate < 95%
  - Conversion rate drops > 50%
  - New registrations drop > 50%
  - Active users drop > 30%

Warning Business Alerts:
  - Payment success rate < 98%
  - High churn rate detected
  - Unusual traffic patterns
```

---

## Alert Configuration

### Alert Routing Matrix

| Severity | Response Time | Notification Channels | Escalation |
|----------|---------------|----------------------|------------|
| **P1 - Critical** | 15 min | Slack + SMS + PagerDuty | Immediate |
| **P2 - High** | 1 hour | Slack + Email + PagerDuty | After 30 min |
| **P3 - Medium** | 4 hours | Slack + Email | After 2 hours |
| **P4 - Low** | 24 hours | Email | After 8 hours |

### Alert Rules Configuration

**Datadog Alert Rules**:

```yaml
Infrastructure Alerts:
  - name: "High CPU Usage"
    query: "avg:last_5m:avg:system.cpu.user{host:vcsa-prod} > 0.7"
    priority: P2
    message: "CPU usage above 70% for 5 minutes"

  - name: "High Memory Usage"
    query: "avg:last_5m:avg:system.mem.used{host:vcsa-prod} > 0.8"
    priority: P2
    message: "Memory usage above 80% for 5 minutes"

  - name: "Disk Space Critical"
    query: "avg:last_1m:avg:system.disk.in_use{host:vcsa-prod} > 0.9"
    priority: P1
    message: "Disk usage above 90% - IMMEDIATE ACTION REQUIRED"

Application Alerts:
  - name: "High Error Rate"
    query: "sum:last_5m:nginx.http.status.5xx{host:vcsa-prod} > 20"
    priority: P1
    message: "Error rate above 20% - CRITICAL"

  - name: "Slow Response Time"
    query: "avg:last_5m:nginx.http.response_time{host:vcsa-prod} > 3"
    priority: P2
    message: "Response time above 3 seconds"

Database Alerts:
  - name: "MongoDB Slow Queries"
    query: "sum:last_5m:mongodb.queries.slow{host:vcsa-prod} > 10"
    priority: P2
    message: "More than 10 slow queries in 5 minutes"

  - name: "MongoDB Connection Pool Exhausted"
    query: "avg:last_1m:mongodb.connections.pool{host:vcsa-prod} > 0.95"
    priority: P1
    message: "MongoDB connection pool 95% full - CRITICAL"
```

**Sentry Alert Rules**:

```yaml
Error Rate Alerts:
  - name: "Critical Error Spike"
    condition: "New issue detected"
    level: "error OR critical"
    environment: "production"
    frequency: "Within 5 minutes"
    priority: P1
    action: "Create issue + Slack + SMS"

  - name: "High Error Rate"
    condition: "Error rate > 5%"
    environment: "production"
    frequency: "For 5 minutes"
    priority: P2
    action: "Slack + Email"
```

**UptimeRobot Alert Rules**:

```yaml
Uptime Alerts:
  - name: "Application Down"
    monitor: "VCSA Production"
    condition: "Down for 30 seconds"
    priority: P1
    notification: "Slack + SMS + PagerDuty"

  - name: "API Health Check Failed"
    monitor: "VCSA API Health"
    condition: "Down for 1 minute"
    priority: P1
    notification: "Slack + SMS"

  - name: "Staging Environment Down"
    monitor: "VCSA Staging"
    condition: "Down for 5 minutes"
    priority: P3
    notification: "Slack"
```

### Alert Suppression & Maintenance Windows

**Scheduled Maintenance**:

```bash
# Suppress alerts during maintenance
# Via Datadog UI
1. Navigate to Monitors
2. Select "Mute All"
3. Set duration: 2 hours
4. Add reason: "Scheduled maintenance - database upgrade"

# Via API
curl -X POST "https://api.datadoghq.com/api/v1/monitor/mute_all" \
  -H "DD-API-KEY: ${DD_API_KEY}" \
  -H "DD-APPLICATION-KEY: ${DD_APP_KEY}" \
  -d '{"scope": "env:production", "end": 1234567890}'
```

**Alert Snoozing**:

```yaml
Valid Snooze Reasons:
  - Scheduled maintenance
  - Known issue being investigated
  - Testing in progress
  - Deployment window

Snooze Limits:
  - Max snooze: 4 hours for P1/P2
  - Max snooze: 24 hours for P3/P4
  - Require justification
  - Auto-notify team
```

---

## Dashboard Management

### Primary Dashboards

**1. Operations Overview Dashboard**

```yaml
Purpose: Real-time system health overview
Audience: Operations team, on-call engineers
Refresh Rate: 30 seconds
Layout:
  - Top row: System status, active incidents, error rate
  - Middle row: Resource usage (CPU, memory, disk)
  - Bottom row: Request rate, response time, uptime

Widgets:
  - System health status (green/yellow/red)
  - Active incident count
  - Error rate (last 15 min, 1 hour, 24 hours)
  - CPU usage (current, avg, max)
  - Memory usage (current, avg, max)
  - Disk usage (all mounts)
  - Request rate (RPS)
  - Response time (p50, p95, p99)
  - Uptime percentage (24 hours, 7 days, 30 days)
  - Active user count
```

**2. Application Performance Dashboard**

```yaml
Purpose: Application performance metrics
Audience: Developers, SREs
Refresh Rate: 1 minute
Layout:
  - Top row: Key performance indicators
  - Middle row: Endpoint performance
  - Bottom row: Database performance

Widgets:
  - Request volume (RPS)
  - Error rate (%)
  - Response time (p50, p95, p99)
  - Throughput (requests/min)
  - Endpoint performance (top 10)
  - Slowest endpoints (top 10)
  - Highest error rate endpoints (top 10)
  - Database query performance
  - External API performance
  - Cache hit rate
```

**3. Infrastructure Dashboard**

```yaml
Purpose: Infrastructure health monitoring
Audience: DevOps, SREs
Refresh Rate: 1 minute
Layout:
  - Top row: Server health
  - Middle row: Container health
  - Bottom row: Database health

Widgets:
  - CPU usage (all hosts)
  - Memory usage (all hosts)
  - Disk usage (all mounts)
  - Network I/O
  - Container status (all containers)
  - Container resource usage
  - Docker stats
  - MongoDB metrics
  - Backup status
  - Security alerts
```

**4. Business Metrics Dashboard**

```yaml
Purpose: Business performance tracking
Audience: Product, Management
Refresh Rate: 5 minutes
Layout:
  - Top row: Key business metrics
  - Middle row: User engagement
  - Bottom row: Revenue metrics

Widgets:
  - Daily active users
  - Weekly active users
  - Monthly active users
  - New registrations (today, week, month)
  - Content completion rate
  - Average readiness score
  - Training streak days
  - MRR (Monthly Recurring Revenue)
  - Payment success rate
  - Conversion funnel
```

**5. Incident Response Dashboard**

```yaml
Purpose: Incident management and response
Audience: On-call engineers, response team
Refresh Rate: Real-time
Layout:
  - Top row: Active incidents (P1-P4)
  - Middle row: Incident timeline
  - Bottom row: Response metrics

Widgets:
  - Active incidents by severity
  - Incident count (last 24 hours, 7 days)
  - Mean time to detect (MTTD)
  - Mean time to resolve (MTTR)
  - Current on-call engineer
  - Incident escalation status
  - Recent incidents (last 10)
  - Error rate spike alerts
  - Response time graph
```

### Dashboard Access Control

```yaml
Access Levels:
  Viewer:
    - View all dashboards
    - No edit permissions
    - No alert configuration
    - Dashboard sharing enabled

  Editor:
    - View and edit dashboards
    - Create custom dashboards
    - Configure alerts
    - Dashboard sharing enabled

  Admin:
    - Full dashboard management
    - User access management
    - Alert configuration
    - System configuration
```

---

## Response Procedures

### Monitoring Alert Response

**Standard Response Flow**:

```
1. ALERT RECEIVED
   ├── Check alert severity
   ├── Acknowledge alert
   └── Notify relevant team

2. INVESTIGATION
   ├── Check dashboard for context
   ├── Review recent changes
   ├── Check logs for errors
   └ Identify root cause

3. RESOLUTION
   ├── Implement fix or workaround
   ├── Monitor for improvement
   └── Verify system recovery

4. POST-ALERT
   ├── Document incident
   ├── Update monitoring if needed
   └── Create follow-up tasks
```

**Severity-Specific Response**:

```yaml
P1 - Critical (15 min response):
  0-5 min:
    - Acknowledge alert
    - Check dashboard
    - Notify on-call team

  5-15 min:
    - Investigate issue
    - Identify root cause
    - Implement workaround

  15-30 min:
    - Implement permanent fix
    - Monitor recovery
    - Update status page

P2 - High (1 hour response):
  0-15 min:
    - Acknowledge alert
    - Check dashboard
    - Assess impact

  15-30 min:
    - Investigate issue
    - Plan fix

  30-60 min:
    - Implement fix
    - Verify recovery

P3 - Medium (4 hour response):
  0-30 min:
    - Acknowledge alert
    - Add to backlog

  30 min - 4 hours:
    - Investigate when available
    - Plan fix
    - Implement when prioritized

P4 - Low (24 hour response):
  0-1 hour:
    - Acknowledge alert
    - Document in backlog

  1-24 hours:
    - Review during backlog grooming
    - Schedule fix
```

### False Positive Management

**Common False Positives**:

```yaml
Known False Positives:
  - Maintenance windows (scheduled)
  - Load testing (planned)
  - Deployment spikes (expected)
  - Third-party API issues (external)

Handling Procedure:
  1. Verify if false positive
  2. Document reason
  3. Update alert threshold if needed
  4. Snooze alert temporarily
  5. Plan permanent fix
```

### Alert Tuning

**Alert Tuning Process**:

```yaml
When to Tune:
  - False positive rate > 20%
  - Alert fatigue reported
  - Alert doesn't reflect actual issues
  - System changes cause outdated thresholds

Tuning Steps:
  1. Analyze alert history (30 days)
  2. Calculate optimal threshold (p95 of normal)
  3. Test new threshold (7 days)
  4. Validate effectiveness
  5. Document changes
  6. Train team on new thresholds

Tuning Example:
  Original: CPU > 50% (too sensitive)
  Analysis: Normal usage = 40-60%, alert triggers frequently
  New: CPU > 70% for 5 minutes (matches actual issues)
  Result: False positives reduced by 80%
```

---

## Monitoring Best Practices

### Do's and Don'ts

**DO**:
- ✅ Monitor everything critical to business
- ✅ Set up alerts before deploying to production
- ✅ Regularly review and tune alert thresholds
- ✅ Document all monitoring procedures
- ✅ Conduct monitoring drills quarterly
- ✅ Keep dashboards simple and actionable
- ✅ Use meaningful names for alerts and dashboards
- ✅ Include runbook links in alert descriptions

**DON'T**:
- ❌ Alert on everything (alert fatigue)
- ❌ Ignore false positives (tune them)
- ❌ Set alerts without investigation procedures
- ❌ Create duplicate alerts
- ❌ Use vague alert names
- ❌ Skip alert documentation
- ❌ Forget to update monitoring after changes
- ❌ Monitor without actionability

### Monitoring Maintenance

**Monthly Tasks**:
- Review all alert rules
- Check for stale alerts
- Validate alert thresholds
- Test alert notifications
- Update documentation

**Quarterly Tasks**:
- Conduct monitoring audit
- Review tool performance
- Evaluate new monitoring tools
- Optimize dashboard performance
- Team training on monitoring

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
