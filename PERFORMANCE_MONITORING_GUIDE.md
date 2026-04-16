# 📊 VCSA Performance Monitoring Guide

**Purpose**: Complete performance monitoring implementation for VCSA platform
**Sprint**: Sprint 2 - Task 5 (Performance Monitoring Setup)
**Priority**: P1 - HIGH
**Estimated Time**: 6 hours

---

## 📋 MONITORING OVERVIEW

Performance monitoring is critical for production systems. This guide covers:
- Application Performance Monitoring (APM)
- Database query monitoring
- Response time tracking
- Error rate monitoring
- Alerting and thresholds
- Monitoring dashboard

---

## 🎯 MONITORING ARCHITECTURE

### Monitoring Stack

```
┌─────────────────────────────────────────────────────────────┐
│                     VCSA Platform                           │
├─────────────────────────────────────────────────────────────┤
│  FastAPI Backend  │  MongoDB  │  Redis  │  Nginx          │
└────────┬───────────┴───────────┴────────┴──────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              Performance Monitoring Layer                   │
├─────────────────────────────────────────────────────────────┤
│  Sentry (APM)  │  MongoDB Profiler  │  Custom Metrics      │
└────────┬───────────┴──────────────────┴────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Alerting Layer                            │
├─────────────────────────────────────────────────────────────┤
│  Email Alerts  │  Slack Notifications  │  Dashboard        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 STEP 1: SENTRY APM SETUP

### Step 1.1: Create Sentry Account

1. Go to https://sentry.io
2. Sign up for free tier (5,000 errors/month)
3. Create new project: "vcsa-backend"
4. Select Python + FastAPI as platform
5. Copy DSN to `.env`

### Step 1.2: Configure Sentry Environment Variables

Add to `backend/.env`:

```bash
# Sentry Configuration
SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1  # 10% of transactions
SENTRY_PROFILES_SAMPLE_RATE=0.1  # 10% for profiling
```

### Step 1.3: Verify Sentry Integration

Sentry is already integrated in `backend/sentry_config.py`. Verify:

```python
# backend/server.py should have:
from sentry_config import init_sentry

sentry_enabled = init_sentry(
    dsn=os.environ.get('SENTRY_DSN'),
    environment=os.environ.get('SENTRY_ENVIRONMENT', 'production'),
    traces_sample_rate=float(os.environ.get('SENTRY_TRACES_SAMPLE_RATE', '0.1')),
    profiles_sample_rate=float(os.environ.get('SENTRY_PROFILES_SAMPLE_RATE', '0.1')),
)
```

### Step 1.4: Test Sentry Error Tracking

```python
# Test endpoint to verify Sentry
@app.get("/api/test/sentry")
async def test_sentry():
    division_by_zero = 1 / 0  # This will be captured by Sentry
```

---

## 📝 STEP 2: DATABASE QUERY MONITORING

### Step 2.1: Enable MongoDB Profiler

```python
# Enable profiling in MongoDB
db = client[os.environ['DB_NAME']]

# Set profiling level (2 = log all operations)
db.command({'profile': 2, 'slowms': 100})  # Log queries > 100ms
```

### Step 2.2: Query Performance Metrics

Track the following metrics:
- Query execution time
- Number of documents scanned
- Index usage
- Slow query count

```python
async def log_query_performance(collection, operation, duration, doc_count):
    """Log query performance metrics"""
    metrics = {
        "collection": collection,
        "operation": operation,
        "duration_ms": duration,
        "documents_scanned": doc_count,
        "timestamp": datetime.utcnow(),
    }

    # Store in metrics collection
    await db.performance_metrics.insert_one(metrics)
```

### Step 2.3: Slow Query Alerts

Create alert for slow queries:

```python
# Alert if query takes > 1 second
SLOW_QUERY_THRESHOLD_MS = 1000

async def check_slow_queries():
    """Check for slow queries in last hour"""
    slow_queries = await db.performance_metrics.find({
        "duration_ms": {"$gt": SLOW_QUERY_THRESHOLD_MS},
        "timestamp": {"$gte": datetime.utcnow() - timedelta(hours=1)}
    }).to_list(None)

    if len(slow_queries) > 10:
        # Trigger alert
        send_alert("High number of slow queries detected")
```

---

## 📝 STEP 3: RESPONSE TIME TRACKING

### Step 3.1: Middleware for Response Time

```python
import time

class ResponseTimeMiddleware(BaseHTTPMiddleware):
    """Track response times for all requests"""

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()

        # Process request
        response = await call_next(request)

        # Calculate duration
        duration_ms = (time.time() - start_time) * 1000

        # Log response time
        logger.info(f"{request.method} {request.url.path} - {duration_ms:.2f}ms")

        # Add header
        response.headers["X-Response-Time"] = f"{duration_ms:.2f}ms"

        # Store metric
        await store_metric("response_time", {
            "path": request.url.path,
            "method": request.method,
            "duration_ms": duration_ms,
            "status_code": response.status_code,
        })

        return response
```

### Step 3.2: Response Time Metrics

Track percentiles:
- p50 (median)
- p95
- p99
- max

```python
async def calculate_response_time_percentiles():
    """Calculate response time percentiles for last hour"""
    pipeline = [
        {"$match": {
            "metric_name": "response_time",
            "timestamp": {"$gte": datetime.utcnow() - timedelta(hours=1)}
        }},
        {"$group": {
            "_id": "$path",
            "p50": {"$avg": "$value.duration_ms"},
            "p95": {"$max": "$value.duration_ms"},
            "count": {"$sum": 1}
        }}
    ]

    results = await db.metrics.aggregate(pipeline).to_list(None)
    return results
```

### Step 3.3: Performance Thresholds

Define acceptable response times:

| Endpoint Type | p50 Target | p95 Target | p99 Target |
|---------------|------------|------------|------------|
| Health Check | <10ms | <20ms | <50ms |
| Auth | <100ms | <200ms | <500ms |
| Development API | <200ms | <400ms | <1000ms |
| Community | <150ms | <300ms | <750ms |
| Admin | <250ms | <500ms | <1250ms |

---

## 📝 STEP 4: ERROR RATE MONITORING

### Step 4.1: Error Tracking Middleware

```python
class ErrorTrackingMiddleware(BaseHTTPMiddleware):
    """Track error rates"""

    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)

            # Track 4xx and 5xx errors
            if response.status_code >= 400:
                await store_metric("error", {
                    "path": request.url.path,
                    "method": request.method,
                    "status_code": response.status_code,
                    "timestamp": datetime.utcnow(),
                })

            return response

        except Exception as e:
            # Log unhandled errors
            await store_metric("exception", {
                "path": request.url.path,
                "exception_type": type(e).__name__,
                "message": str(e),
                "timestamp": datetime.utcnow(),
            })
            raise
```

### Step 4.2: Error Rate Calculation

```python
async def calculate_error_rate():
    """Calculate error rate for last hour"""
    total_requests = await db.metrics.count_documents({
        "metric_name": "response_time",
        "timestamp": {"$gte": datetime.utcnow() - timedelta(hours=1)}
    })

    error_requests = await db.metrics.count_documents({
        "metric_name": "error",
        "timestamp": {"$gte": datetime.utcnow() - timedelta(hours=1)}
    })

    if total_requests > 0:
        error_rate = (error_requests / total_requests) * 100
        return error_rate

    return 0
```

### Step 4.3: Error Rate Thresholds

Alert on error rates:

| Error Rate | Action |
|------------|--------|
| <1% | Normal |
| 1-5% | Warning |
| 5-10% | Critical |
| >10% | Emergency |

---

## 📝 STEP 5: ALERTING THRESHOLDS

### Step 5.1: Alert Configuration

Create alert rules in `backend/alerts.py`:

```python
ALERT_THRESHOLDS = {
    "response_time_p95": {
        "warning": 500,  # ms
        "critical": 1000,
        "emergency": 2000,
    },
    "error_rate": {
        "warning": 1,  # %
        "critical": 5,
        "emergency": 10,
    },
    "slow_query_rate": {
        "warning": 10,  # count/hour
        "critical": 50,
        "emergency": 100,
    },
    "memory_usage": {
        "warning": 70,  # %
        "critical": 85,
        "emergency": 95,
    },
    "cpu_usage": {
        "warning": 70,  # %
        "critical": 85,
        "emergency": 95,
    },
}
```

### Step 5.2: Alert Handlers

```python
async def send_alert(severity: str, message: str, metadata: dict = None):
    """Send alert to multiple channels"""

    alert = {
        "severity": severity,
        "message": message,
        "metadata": metadata or {},
        "timestamp": datetime.utcnow(),
    }

    # Log to database
    await db.alerts.insert_one(alert)

    # Send notifications
    await send_email_alert(alert)
    await send_slack_alert(alert)

    # Send to Sentry
    if severity in ["critical", "emergency"]:
        capture_exception(Exception(f"[{severity.upper()}] {message}"))
```

### Step 5.3: Email Alerts

```python
import sendgrid
from sendgrid.helpers.mail import Mail

async def send_email_alert(alert: dict):
    """Send email alert"""

    if alert["severity"] not in ["critical", "emergency"]:
        return  # Only email for critical/emergency

    message = Mail(
        from_email="alerts@vcsa.com",
        to_emails="ops@vcsa.com",
        subject=f"[{alert['severity'].upper()}] {alert['message']}",
        html_content=f"""
        <h2>{alert['severity'].upper()} Alert</h2>
        <p>{alert['message']}</p>
        <pre>{alert.get('metadata', {})}</pre>
        """
    )

    sg = sendgrid.SendGridAPIClient(api_key=os.environ.get('SENDGRID_API_KEY'))
    await sg.send(message)
```

### Step 5.4: Slack Alerts

```python
import aiohttp

async def send_slack_alert(alert: dict):
    """Send Slack webhook alert"""

    webhook_url = os.environ.get('SLACK_WEBHOOK_URL')
    if not webhook_url:
        return

    colors = {
        "warning": "#warning",
        "critical": "#FF0000",
        "emergency": "#FF0000",
    }

    payload = {
        "attachments": [{
            "color": colors.get(alert["severity"], "#00FF00"),
            "title": f"{alert['severity'].upper()} Alert",
            "text": alert['message'],
            "fields": [
                {"title": "Severity", "value": alert["severity"], "short": True},
                {"title": "Time", "value": str(alert["timestamp"]), "short": True},
            ],
        }]
    }

    async with aiohttp.ClientSession() as session:
        await session.post(webhook_url, json=payload)
```

---

## 📝 STEP 6: MONITORING DASHBOARD

### Step 6.1: Metrics API Endpoint

```python
@app.get("/api/admin/metrics")
async def get_metrics(
    request: Request,
    hours: int = 24,
    current_user = Depends(require_admin)
):
    """Get performance metrics for dashboard"""

    start_time = datetime.utcnow() - timedelta(hours=hours)

    # Response times
    response_times = await db.metrics.aggregate([
        {"$match": {
            "metric_name": "response_time",
            "timestamp": {"$gte": start_time}
        }},
        {"$group": {
            "_id": "$path",
            "avg_duration": {"$avg": "$value.duration_ms"},
            "p95_duration": {"$max": "$value.duration_ms"},
            "count": {"$sum": 1}
        }}
    ]).to_list(None)

    # Error rate
    error_rate = await calculate_error_rate()

    # Request count
    request_count = await db.metrics.count_documents({
        "metric_name": "response_time",
        "timestamp": {"$gte": start_time}
    })

    return {
        "response_times": response_times,
        "error_rate": error_rate,
        "request_count": request_count,
        "period_hours": hours,
    }
```

### Step 6.2: Health Check with Metrics

```python
@app.get("/api/health/detailed")
async def health_detailed():
    """Detailed health check with metrics"""

    health = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "checks": {},
    }

    # Database health
    try:
        await db.command('ping')
        health["checks"]["database"] = {"status": "healthy"}
    except Exception as e:
        health["status"] = "unhealthy"
        health["checks"]["database"] = {"status": "unhealthy", "error": str(e)}

    # Redis health (if configured)
    redis_available = os.environ.get('REDIS_URL')
    if redis_available:
        try:
            redis_client = await aioredis.from_url(redis_available)
            await redis_client.ping()
            health["checks"]["redis"] = {"status": "healthy"}
        except Exception as e:
            health["status"] = "degraded"
            health["checks"]["redis"] = {"status": "unhealthy", "error": str(e)}

    # Get recent metrics
    last_hour = datetime.utcnow() - timedelta(hours=1)
    avg_response_time = await db.metrics.aggregate([
        {"$match": {
            "metric_name": "response_time",
            "timestamp": {"$gte": last_hour}
        }},
        {"$group": {
            "_id": None,
            "avg": {"$avg": "$value.duration_ms"}
        }}
    ]).to_list(None)

    if avg_response_time:
        health["metrics"] = {
            "avg_response_time_ms": avg_response_time[0]["avg"],
        }

    return health
```

### Step 6.3: Dashboard Metrics

Display on dashboard:
- Requests per minute
- Average response time
- P95 response time
- Error rate
- Database query time
- Memory usage
- CPU usage
- Active users

---

## 📝 STEP 7: MONITORING PROCEDURES

### Step 7.1: Daily Monitoring Checklist

Every day, check:
- [ ] Error rate overnight
- [ ] Response time trends
- [ ] Slow query log
- [ ] Memory usage trend
- [ ] CPU usage trend
- [ ] Disk space
- [ ] Sentry error reports

### Step 7.2: Weekly Monitoring Tasks

Every week:
- [ ] Review performance trends
- [ ] Check for anomalies
- [ ] Optimize slow queries
- [ ] Review alert thresholds
- [ ] Update dashboard
- [ ] Generate performance report

### Step 7.3: On-Call Procedures

When alerted:
1. Acknowledge alert
2. Check dashboard
3. Identify root cause
4. Implement fix or mitigation
5. Verify resolution
6. Document incident

---

## ✅ MONITORING CHECKLIST

### Setup
- [ ] Sentry account created
- [ ] Sentry DSN configured
- [ ] MongoDB profiler enabled
- [ ] Response time middleware added
- [ ] Error tracking middleware added
- [ ] Alert thresholds configured
- [ ] Email alerts setup
- [ ] Slack alerts setup
- [ ] Metrics API endpoint created
- [ ] Dashboard configured

### Testing
- [ ] Sentry error tracking verified
- [ ] Response time tracking verified
- [ ] Error rate calculation verified
- [ ] Alert triggering verified
- [ ] Dashboard metrics verified
- [ ] Health check verified

### Documentation
- [ ] Monitoring procedures documented
- [ ] On-call procedures documented
- [ ] Alert runbook created
- [ ] Dashboard user guide created

---

## 🛠️ TROUBLESHOOTING

### Issue 1: High Response Times

**Symptoms**: P95 response time > 500ms

**Solutions**:
1. Check database query performance
2. Verify indexes are being used
3. Check for N+1 queries
4. Add caching where appropriate
5. Scale up database resources

### Issue 2: High Error Rate

**Symptoms**: Error rate > 5%

**Solutions**:
1. Check Sentry for error patterns
2. Review recent deployments
3. Check database connectivity
4. Verify third-party service status
5. Check for rate limiting issues

### Issue 3: Memory Leaks

**Symptoms**: Memory usage increasing over time

**Solutions**:
1. Profile memory usage
2. Check for unclosed connections
3. Review caching strategies
4. Check for large object retention
5. Restart services periodically

### Issue 4: Slow Database Queries

**Symptoms**: Queries > 1 second

**Solutions**:
1. Check query execution plan
2. Add missing indexes
3. Optimize query structure
4. Use projection to limit fields
5. Consider sharding

---

## 📊 MONITORING BEST PRACTICES

1. **Set Realistic Thresholds**
   - Base on actual usage patterns
   - Adjust over time
   - Different thresholds for different endpoints

2. **Avoid Alert Fatigue**
   - Only alert on actionable issues
   - Use proper severity levels
   - Aggregate similar alerts

3. **Monitor the Right Metrics**
   - Focus on user-facing metrics
   - Monitor business metrics too
   - Don't over-monitor

4. **Regular Review**
   - Review thresholds monthly
   - Update dashboards quarterly
   - Audit monitoring setup annually

5. **Document Everything**
   - Document all procedures
   - Keep runbooks up to date
   - Share knowledge with team

---

## 📊 MONITORING METRICS REFERENCE

### Application Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| Response Time (p50) | Median response time | <200ms |
| Response Time (p95) | 95th percentile | <500ms |
| Response Time (p99) | 99th percentile | <1000ms |
| Error Rate | % of requests failing | <1% |
| Request Rate | Requests per second | Varies |
| Active Users | Concurrent users | Varies |

### Database Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| Query Time | Average query duration | <100ms |
| Slow Queries | Queries > 1s | <10/hour |
| Connection Pool | Active connections | <80% |
| Index Hit Rate | Queries using indexes | >95% |
| Memory Usage | Database memory | <80% |

### System Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| CPU Usage | Processor utilization | <70% |
| Memory Usage | RAM utilization | <70% |
| Disk Usage | Storage utilization | <80% |
| Network I/O | Network traffic | Varies |

---

**Document Created**: April 24, 2026
**Last Updated**: April 24, 2026
**Status**: ✅ READY FOR IMPLEMENTATION
**Owner**: DevOps Team
