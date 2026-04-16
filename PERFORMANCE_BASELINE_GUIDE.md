# 📊 VCSA Performance Baseline Guide

**Purpose**: Establish performance baseline for production deployment
**Sprint**: Sprint 2 - Task 6 (Performance Baseline)
**Priority**: P1 - HIGH
**Estimated Time**: 6 hours

---

## 📋 BASELINE OVERVIEW

A performance baseline establishes the expected performance metrics for your application. This guide covers:
- Baseline measurement procedures
- Load testing scenarios
- Performance benchmarks
- Acceptance criteria
- Regression detection

---

## 🎯 BASELINE OBJECTIVES

### Why Establish a Baseline?

1. **Set Expectations**: Know what "good performance" looks like
2. **Detect Regression**: Identify when performance degrades
3. **Capacity Planning**: Understand resource requirements
4. **SLA Compliance**: Meet service level agreements
5. **Optimization Target**: Have measurable improvement goals

### Key Metrics to Baseline

| Category | Metrics | Target |
|----------|---------|--------|
| Response Time | p50, p95, p99 | <200ms, <500ms, <1000ms |
| Throughput | Requests per second | >100 req/s |
| Error Rate | Percentage | <1% |
| Resource Usage | CPU, Memory, Disk | <70% |
| Database | Query time, connections | <100ms avg |

---

## 📝 STEP 1: BASELINE MEASUREMENT

### Step 1.1: Prepare Environment

Ensure baseline testing environment:
- Production-like configuration
- Realistic data volumes
- No background tasks
- Isolated from other traffic

```bash
# Disable background tasks
CRON_JOBS_ENABLED=false

# Set baseline mode
BASELINE_MODE=true
```

### Step 1.2: Warm Up the System

Run warm-up requests before measuring:

```bash
# Warm up requests (ignore first 100)
for i in {1..100}; do
  curl -s http://localhost:8000/api/health > /dev/null
done
```

### Step 1.3: Measure Endpoints

Test each endpoint category:

```python
# Endpoints to baseline
ENDPOINTS = {
    "health": {
        "url": "/api/health",
        "method": "GET",
        "expected_p95": 20,  # ms
        "expected_p99": 50,
    },
    "auth": {
        "url": "/api/auth/login",
        "method": "POST",
        "payload": {"email": "test@example.com", "password": "test123"},
        "expected_p95": 200,
        "expected_p99": 500,
    },
    "development": {
        "url": "/api/development/stages",
        "method": "GET",
        "expected_p95": 300,
        "expected_p99": 750,
    },
    "community": {
        "url": "/api/community/posts",
        "method": "GET",
        "expected_p95": 250,
        "expected_p99": 600,
    },
}
```

---

## 📝 STEP 2: LOAD TESTING

### Step 2.1: Configure Load Test

Use Locust for load testing:

```python
from locust import HttpUser, task, between

class VCSAUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        """Login before starting tasks"""
        response = self.client.post("/api/auth/login", json={
            "email": "test@example.com",
            "password": "test123"
        })

    @task(3)
    def view_stages(self):
        """View development stages - high frequency"""
        self.client.get("/api/development/stages")

    @task(2)
    def view_tracks(self):
        """View training tracks"""
        self.client.get("/api/development/tracks")

    @task(2)
    def view_community(self):
        """View community posts"""
        self.client.get("/api/community/posts")

    @task(1)
    def view_events(self):
        """View events - low frequency"""
        self.client.get("/api/events")
```

### Step 2.2: Run Load Test

```bash
# Install Locust
pip install locust

# Run load test
locust -f locustfile.py --headless \
  --users 100 \
  --spawn-rate 10 \
  --run-time 5m \
  --host http://localhost:8000 \
  --csv baseline_results
```

### Step 2.3: Load Test Scenarios

| Scenario | Users | Duration | Purpose |
|----------|-------|----------|---------|
| Smoke Test | 10 | 1 min | Verify functionality |
| Normal Load | 50 | 5 min | Typical day traffic |
| Peak Load | 100 | 5 min | Peak hour traffic |
| Stress Test | 200 | 2 min | Find breaking point |
| Endurance | 50 | 30 min | Check for memory leaks |

---

## 📝 STEP 3: BASELINE RESULTS

### Step 3.1: Document Results

Create baseline document:

```yaml
# baseline_results.yml
baseline:
  timestamp: "2026-04-26T10:00:00Z"
  environment: "staging"
  version: "1.0.0"

  endpoints:
    health:
      url: "/api/health"
      requests: 1000
      p50_ms: 5
      p95_ms: 15
      p99_ms: 30
      max_ms: 50
      rps: 200
      error_rate: 0.0

    auth_login:
      url: "/api/auth/login"
      requests: 500
      p50_ms: 80
      p95_ms: 180
      p99_ms: 450
      max_ms: 800
      rps: 100
      error_rate: 0.2

    development_stages:
      url: "/api/development/stages"
      requests: 1000
      p50_ms: 120
      p95_ms: 280
      p99_ms: 650
      max_ms: 900
      rps: 200
      error_rate: 0.5

  system:
    cpu_percent: 45
    memory_percent: 55
    disk_io_percent: 20
    network_io_mbps: 100

  database:
    avg_query_time_ms: 45
    connections: 25
    slow_queries: 0
```

### Step 3.2: Establish Acceptance Criteria

Define baseline thresholds:

```python
BASELINE_THRESHOLDS = {
    "response_time": {
        "health": {"p95": 20, "p99": 50},
        "auth": {"p95": 200, "p99": 500},
        "development": {"p95": 300, "p99": 750},
        "community": {"p95": 250, "p99": 600},
    },
    "throughput": {
        "min_rps": 100,  # Minimum requests per second
    },
    "error_rate": {
        "max_percent": 1.0,  # Maximum error rate
    },
    "resources": {
        "cpu_max_percent": 70,
        "memory_max_percent": 70,
    },
}
```

---

## 📝 STEP 4: REGRESSION DETECTION

### Step 4.1: Compare Against Baseline

Automated baseline comparison:

```python
def compare_to_baseline(current_metrics, baseline_file):
    """Compare current metrics to baseline"""

    with open(baseline_file) as f:
        baseline = yaml.safe_load(f)

    regression_detected = False

    for endpoint in current_metrics["endpoints"]:
        base = baseline["endpoints"][endpoint]

        # Check p95 response time
        current_p95 = current_metrics["endpoints"][endpoint]["p95_ms"]
        baseline_p95 = base["p95_ms"]

        if current_p95 > baseline_p95 * 1.2:  # 20% degradation threshold
            print(f"⚠️  REGRESSION: {endpoint} p95 degraded by "
                  f"{((current_p95 / baseline_p95) - 1) * 100:.1f}%")
            regression_detected = True

        # Check error rate
        current_error_rate = current_metrics["endpoints"][endpoint]["error_rate"]
        baseline_error_rate = base["error_rate"]

        if current_error_rate > baseline_error_rate * 2:
            print(f"⚠️  REGRESSION: {endpoint} error rate increased from "
                  f"{baseline_error_rate}% to {current_error_rate}%")
            regression_detected = True

    return not regression_detected
```

### Step 4.2: Automated Regression Testing

Add to CI/CD pipeline:

```yaml
# .github/workflows/performance_regression.yml
name: Performance Regression Test

on:
  pull_request:
    branches: [main]

jobs:
  baseline_test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.10'

      - name: Install dependencies
        run: |
          pip install -r backend/requirements.txt
          pip install locust

      - name: Start backend
        run: |
          cd backend
          python server.py &
          sleep 10

      - name: Run baseline tests
        run: |
          python scripts/measure_baseline.py \
            --compare \
            --threshold 20 \
            --fail-on-regression

      - name: Upload results
        uses: actions/upload-artifact@v2
        with:
          name: baseline-results
          path: baseline_results.yml
```

---

## 📝 STEP 5: STRESS TESTING

### Step 5.1: Find Breaking Point

Gradually increase load until system fails:

```bash
# Stress test script
for users in 50 100 150 200 250 300; do
  echo "Testing with $users concurrent users..."

  locust -f locustfile.py --headless \
    --users $users \
    --spawn-rate 10 \
    --run-time 2m \
    --host http://localhost:8000 \
    --csv stress_${users}_users \
    --html report_${users}_users.html

  # Check if system failed
  if [ $? -ne 0 ]; then
    echo "System failed at $users users"
    break
  fi
done
```

### Step 5.2: Document Limits

Record system capacity limits:

```yaml
# capacity_limits.yml
capacity_limits:
  max_concurrent_users: 250
  max_requests_per_second: 500
  breaking_point:
    users: 300
    reason: "Database connection pool exhausted"
    symptoms:
      - "Response time > 10s"
      - "503 Service Unavailable errors"
      - "Database timeouts"

  bottlenecks:
    - component: "Database"
      limit: "Connection pool (100 connections)"
      solution: "Increase pool size or add connection pooling"

    - component: "API Server"
      limit: "CPU (4 cores)"
      solution: "Scale horizontally or upgrade instance"
```

---

## 📝 STEP 6: MONITORING BASELINE

### Step 6.1: Baseline Dashboard Queries

Create Grafana dashboard queries:

```promql
# Response time p95
histogram_quantile(0.95,
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le)
)

# Request rate
sum(rate(http_requests_total[5m]))

# Error rate
sum(rate(http_requests_total{status=~"5.."}[5m])) /
sum(rate(http_requests_total[5m])) * 100
```

### Step 6.2: Alert on Regression

Configure regression alerts:

```yaml
# regression_alerts.yml
alerts:
  - name: PerformanceRegression
    condition: >
      p95_response_time > baseline_p95 * 1.2
    duration: 5m
    severity: warning

  - name: SeverePerformanceRegression
    condition: >
      p95_response_time > baseline_p95 * 1.5
    duration: 2m
    severity: critical

  - name: ErrorRateRegression
    condition: >
      error_rate > baseline_error_rate * 2
    duration: 5m
    severity: critical
```

---

## 📝 STEP 7: OPTIMIZATION TRACKING

### Step 7.1: Before/After Comparison

Document optimization impact:

```yaml
# optimization_log.yml
optimizations:
  - date: "2026-04-26"
    description: "Added database index on users.email"
    endpoint: "/api/auth/login"

    before:
      p95_ms: 450
      p99_ms: 1200
      db_queries: 5

    after:
      p95_ms: 180
      p99_ms: 450
      db_queries: 2

    improvement:
      p95_percent: 60
      p99_percent: 62.5
      db_queries_percent: 60
```

### Step 7.2: Performance Budget

Set performance budgets:

```yaml
# performance_budget.yml
performance_budget:
  endpoints:
    "/api/health":
      p95_ms: 20
      p99_ms: 50
      max_size_kb: 1

    "/api/auth/login":
      p95_ms: 200
      p99_ms: 500
      max_db_queries: 3

    "/api/development/stages":
      p95_ms: 300
      p99_ms: 750
      max_db_queries: 5

  budget_alerts:
    enabled: true
    threshold: 90  # Alert at 90% of budget
```

---

## ✅ BASELINE CHECKLIST

### Measurement
- [ ] Environment prepared (production-like)
- [ ] Warm-up requests completed
- [ ] All endpoints measured
- [ ] Load test scenarios executed
- [ ] Stress test completed
- [ ] Results documented

### Analysis
- [ ] Baseline values established
- [ ] Acceptance criteria defined
- [ ] Bottlenecks identified
- [ ] Capacity limits documented
- [ ] Performance budget set

### Automation
- [ ] Baseline comparison script created
- [ ] Regression detection automated
- [ ] CI/CD integration added
- [ ] Alerts configured
- [ ] Dashboard created

### Documentation
- [ ] Baseline results documented
- [ ] Optimization log created
- [ ] Performance budget defined
- [ ] Procedures documented

---

## 🛠️ TROUBLESHOOTING

### Issue 1: Inconsistent Results

**Symptoms**: Results vary significantly between runs

**Solutions**:
1. Ensure warm-up requests completed
2. Run tests multiple times and average
3. Check for background processes
4. Verify consistent test data
5. Use isolated environment

### Issue 2: Cannot Reach Baseline Targets

**Symptoms**: Performance below baseline expectations

**Solutions**:
1. Profile slow endpoints
2. Check database query plans
3. Verify indexes are used
4. Add caching where appropriate
5. Consider scaling resources

### Issue 3: System Crashes Under Load

**Symptoms**: System fails during stress test

**Solutions**:
1. Check resource limits (ulimit)
2. Increase connection pool sizes
3. Add rate limiting
4. Implement circuit breakers
5. Scale horizontally

---

## 📊 BASELINE BEST PRACTICES

1. **Test in Production-like Environment**
   - Use production data volumes
   - Match production configuration
   - Test on similar hardware

2. **Run Baseline Regularly**
   - Weekly in staging
   - Before each release
   - After major changes

3. **Automate Comparison**
   - Integrate with CI/CD
   - Alert on regression
   - Track trends over time

4. **Document Everything**
   - Keep baseline results
   - Note optimization changes
   - Track configuration changes

5. **Set Realistic Targets**
   - Base on actual requirements
   - Consider SLA needs
   - Account for growth

---

## 📊 BASELINE METRICS REFERENCE

### Response Time Targets

| Endpoint Type | p50 | p95 | p99 |
|---------------|-----|-----|-----|
| Health Check | <10ms | <20ms | <50ms |
| Auth | <100ms | <200ms | <500ms |
| Read Operations | <150ms | <300ms | <750ms |
| Write Operations | <200ms | <400ms | <1000ms |
| Complex Queries | <300ms | <600ms | <1500ms |

### Throughput Targets

| Metric | Target |
|--------|--------|
| Requests per Second | >100 |
| Concurrent Users | >50 |
| Peak Load | 5x normal |

### Resource Targets

| Resource | Target |
|----------|--------|
| CPU Usage | <70% |
| Memory Usage | <70% |
| Disk I/O | <80% |
| Network | <70% |

---

**Document Created**: April 26, 2026
**Last Updated**: April 26, 2026
**Status**: ✅ READY FOR IMPLEMENTATION
**Owner**: DevOps Team
