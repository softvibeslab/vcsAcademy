#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# VCSA Performance Monitoring Setup Script
# ═══════════════════════════════════════════════════════════════
#
# Automated setup of performance monitoring for VCSA platform
#
# Usage: ./setup_monitoring.sh [backend_dir]
#
# Example: ./setup_monitoring.sh /path/to/backend
# ═══════════════════════════════════════════════════════════════

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKEND_DIR=${1:-"./backend"}
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

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

print_test() {
    echo -e "\n${YELLOW}Testing: $1${NC}"
}

# ═══════════════════════════════════════════════════════════════
# VERIFICATION FUNCTIONS
# ═══════════════════════════════════════════════════════════════

verify_files() {
    print_header "File Verification"

    local files_ok=true

    # Check performance_monitor.py
    if [ -f "backend/performance_monitor.py" ]; then
        print_success "backend/performance_monitor.py exists"

        if grep -q "class PerformanceMetrics" backend/performance_monitor.py; then
            print_success "PerformanceMetrics class defined"
        else
            print_error "PerformanceMetrics class not found"
            files_ok=false
        fi

        if grep -q "class ResponseTimeMiddleware" backend/performance_monitor.py; then
            print_success "ResponseTimeMiddleware class defined"
        else
            print_error "ResponseTimeMiddleware class not found"
            files_ok=false
        fi

        if grep -q "class AlertSystem" backend/performance_monitor.py; then
            print_success "AlertSystem class defined"
        else
            print_error "AlertSystem class not found"
            files_ok=false
        fi
    else
        print_error "backend/performance_monitor.py not found"
        files_ok=false
    fi

    # Check test file
    if [ -f "backend/tests/test_performance_monitor.py" ]; then
        print_success "backend/tests/test_performance_monitor.py exists"
    else
        print_error "backend/tests/test_performance_monitor.py not found"
        files_ok=false
    fi

    # Check guide
    if [ -f "PERFORMANCE_MONITORING_GUIDE.md" ]; then
        print_success "PERFORMANCE_MONITORING_GUIDE.md exists"
    else
        print_error "PERFORMANCE_MONITORING_GUIDE.md not found"
        files_ok=false
    fi

    if [ "$files_ok" = "false" ]; then
        return 1
    else
        return 0
    fi
}

verify_integration() {
    print_header "Server Integration Verification"

    # Check if performance_monitor is imported in server.py
    if grep -q "from performance_monitor import" backend/server.py; then
        print_success "performance_monitor imported in server.py"
    else
        print_warning "performance_monitor not imported in server.py"
        print_info "You need to integrate it manually"
    fi

    # Check if middleware is added
    if grep -q "ResponseTimeMiddleware" backend/server.py; then
        print_success "ResponseTimeMiddleware integrated"
    else
        print_warning "ResponseTimeMiddleware not integrated"
    fi

    # Check if ErrorTrackingMiddleware is added
    if grep -q "ErrorTrackingMiddleware" backend/server.py; then
        print_success "ErrorTrackingMiddleware integrated"
    else
        print_warning "ErrorTrackingMiddleware not integrated"
    fi
}

verify_dependencies() {
    print_header "Dependency Verification"

    # Check Python dependencies
    if [ -f "backend/requirements.txt" ]; then
        if grep -q "aiohttp" backend/requirements.txt; then
            print_success "aiohttp in requirements.txt"
        else
            print_warning "aiohttp not in requirements.txt (needed for Slack alerts)"
        fi

        if grep -q "sendgrid" backend/requirements.txt; then
            print_success "sendgrid in requirements.txt"
        else
            print_info "sendgrid not in requirements.txt (optional for email alerts)"
        fi
    else
        print_error "requirements.txt not found"
    fi

    # Check if modules can be imported
    if python3 -c "import aiohttp" 2>/dev/null; then
        print_success "aiohttp module available"
    else
        print_warning "aiohttp module not available"
        print_info "Install with: pip install aiohttp"
    fi
}

verify_environment() {
    print_header "Environment Configuration"

    local env_file="backend/.env"

    if [ -f "$env_file" ]; then
        print_success ".env file exists"

        # Check Sentry configuration
        if grep -q "SENTRY_DSN" "$env_file"; then
            print_success "SENTRY_DSN configured"
        else
            print_warning "SENTRY_DSN not configured"
            print_info "Add: SENTRY_DSN=https://your-dsn@sentry.io/project-id"
        fi

        # Check alert configuration
        if grep -q "SLACK_WEBHOOK_URL" "$env_file"; then
            print_success "SLACK_WEBHOOK_URL configured"
        else
            print_info "SLACK_WEBHOOK_URL not configured (optional)"
        fi

        if grep -q "ALERT_EMAIL_ENABLED" "$env_file"; then
            print_success "ALERT_EMAIL_ENABLED configured"
        else
            print_info "ALERT_EMAIL_ENABLED not configured (optional)"
        fi
    else
        print_warning ".env file not found"
    fi
}

verify_sentry() {
    print_header "Sentry Integration Verification"

    # Check sentry_config.py
    if [ -f "backend/sentry_config.py" ]; then
        print_success "backend/sentry_config.py exists"

        if grep -q "init_sentry" backend/sentry_config.py; then
            print_success "init_sentry function defined"
        else
            print_error "init_sentry function not found"
        fi
    else
        print_warning "backend/sentry_config.py not found"
    fi

    # Check if Sentry is initialized in server.py
    if grep -q "from sentry_config import init_sentry" backend/server.py; then
        print_success "Sentry imported in server.py"

        if grep -q "init_sentry(" backend/server.py; then
            print_success "Sentry initialized in server.py"
        else
            print_warning "Sentry not initialized"
        fi
    else
        print_warning "Sentry not imported in server.py"
    fi
}

verify_database_collections() {
    print_header "Database Collections Verification"

    print_info "Checking database connection..."

    # This would typically require a running database
    print_info "Create these indexes for optimal performance:"
    echo ""
    echo "db.metrics.createIndex({ \"metric_name\": 1, \"timestamp\": -1 })"
    echo "db.metrics.createIndex({ \"tags.path\": 1 })"
    echo "db.alerts.createIndex({ \"severity\": 1, \"timestamp\": -1 })"
    echo ""
}

run_tests() {
    print_header "Running Tests"

    print_info "Testing performance_monitor module import..."

    if python3 -c "
import sys
sys.path.insert(0, 'backend')
from performance_monitor import PerformanceMetrics, AlertSystem, ALERT_THRESHOLDS
print('✓ Module imports successful')
print(f'✓ Alert thresholds configured: {list(ALERT_THRESHOLDS.keys())}')
    " 2>&1; then
        print_success "Module import test passed"
    else
        print_error "Module import test failed"
        return 1
    fi

    # Test threshold configuration
    print_info "Testing alert thresholds..."

    if python3 -c "
import sys
sys.path.insert(0, 'backend')
from performance_monitor import ALERT_THRESHOLDS

# Verify all thresholds have required levels
for metric, thresholds in ALERT_THRESHOLDS.items():
    assert 'warning' in thresholds, f'{metric} missing warning'
    assert 'critical' in thresholds, f'{metric} missing critical'
    assert 'emergency' in thresholds, f'{metric} missing emergency'

print('✓ All alert thresholds properly configured')
    " 2>&1; then
        print_success "Threshold configuration test passed"
    else
        print_error "Threshold configuration test failed"
        return 1
    fi

    print_info "Run full test suite with: cd backend && pytest tests/test_performance_monitor.py -v"
}

generate_integration_example() {
    print_header "Integration Example"

    cat <<'EOF'
Add this to backend/server.py to integrate performance monitoring:

# ═══════════════════════════════════════════════════════════════
# PERFORMANCE MONITORING
# ═══════════════════════════════════════════════════════════════
PERFORMANCE_MONITORING_ENABLED = os.environ.get('PERFORMANCE_MONITORING_ENABLED', 'true').lower() == 'true'

try:
    from performance_monitor import (
        PerformanceMetrics,
        ResponseTimeMiddleware,
        ErrorTrackingMiddleware,
        AlertSystem,
        PerformanceAnalyzer
    )
    PERFORMANCE_MONITORING_AVAILABLE = True
except ImportError:
    logger.warning("performance_monitor.py not found - Performance monitoring disabled")
    PERFORMANCE_MONITORING_AVAILABLE = False
    PERFORMANCE_MONITORING_ENABLED = False

# Initialize performance monitoring
if PERFORMANCE_MONITORING_ENABLED and PERFORMANCE_MONITORING_AVAILABLE:
    # Create metrics instance
    performance_metrics = PerformanceMetrics(db)
    performance_analyzer = PerformanceAnalyzer(performance_metrics)
    alert_system = AlertSystem(performance_metrics)

    # Add middleware
    app.add_middleware(ResponseTimeMiddleware, metrics=performance_metrics)
    app.add_middleware(ErrorTrackingMiddleware, metrics=performance_metrics)

    logger.info("Performance monitoring enabled")
else:
    logger.warning("Performance monitoring disabled")

# ═══════════════════════════════════════════════════════════════
# PERFORMANCE MONITORING API ENDPOINTS
# ═══════════════════════════════════════════════════════════════

@app.get("/api/admin/metrics")
async def get_metrics(
    request: Request,
    hours: int = 24,
    current_user = Depends(require_admin)
):
    """Get performance metrics"""
    if not PERFORMANCE_MONITORING_ENABLED:
        raise HTTPException(status_code=503, detail="Performance monitoring disabled")

    summary = await performance_analyzer.get_performance_summary(hours=hours)
    return summary

@app.get("/api/admin/slowest-endpoints")
async def get_slowest_endpoints(
    request: Request,
    hours: int = 24,
    limit: int = 10,
    current_user = Depends(require_admin)
):
    """Get slowest endpoints"""
    if not PERFORMANCE_MONITORING_ENABLED:
        raise HTTPException(status_code=503, detail="Performance monitoring disabled")

    slowest = await performance_analyzer.get_slowest_endpoints(hours=hours, limit=limit)
    return {"slowest_endpoints": slowest}

@app.get("/api/health/detailed")
async def health_detailed():
    """Detailed health check with metrics"""
    if not PERFORMANCE_MONITORING_ENABLED:
        return {"status": "healthy", "monitoring": "disabled"}

    summary = await performance_analyzer.get_performance_summary(hours=1)
    return {
        "status": "healthy",
        "monitoring": "enabled",
        "metrics": summary
    }

@app.post("/api/admin/alerts/test")
async def test_alert(
    severity: str,
    message: str,
    current_user = Depends(require_admin)
):
    """Send test alert"""
    if not PERFORMANCE_MONITORING_ENABLED:
        raise HTTPException(status_code=503, detail="Performance monitoring disabled")

    from performance_monitor import AlertSeverity

    await alert_system.send_alert(
        AlertSeverity(severity),
        f"TEST ALERT: {message}",
        {"test": True}
    )

    return {"status": "alert_sent"}
EOF
}

generate_sentry_instructions() {
    print_header "Sentry Setup Instructions"

    cat <<'EOF'
1. Create Sentry Account:
   - Go to https://sentry.io
   - Sign up for free tier (5,000 errors/month)
   - Create new project: "vcsa-backend"
   - Select Python + FastAPI
   - Copy DSN

2. Configure Sentry in backend/.env:

   # Sentry Configuration
   SENTRY_DSN=https://your-dsn@sentry.io/project-id
   SENTRY_ENVIRONMENT=production
   SENTRY_TRACES_SAMPLE_RATE=0.1
   SENTRY_PROFILES_SAMPLE_RATE=0.1

3. Sentry is already integrated in:
   - backend/sentry_config.py
   - backend/server.py (imports and initializes)

4. Test Sentry integration:
   curl http://localhost:8000/api/test/sentry

5. View errors at: https://sentry.io
EOF
}

generate_alerting_instructions() {
    print_header "Alert Configuration Instructions"

    cat <<'EOF'
Email Alerts (SendGrid):
─────────────────────────
1. Get SendGrid API key: https://sendgrid.com
2. Add to backend/.env:

   ALERT_EMAIL_ENABLED=true
   ALERT_EMAIL_TO=ops@vcsa.com
   SENDGRID_API_KEY=SG.your-api-key

Slack Alerts:
────────────
1. Create Slack Incoming Webhook:
   - Go to https://api.slack.com/messaging/webhooks
   - Create new webhook
   - Copy webhook URL

2. Add to backend/.env:
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

Alert Thresholds:
────────────────
Current thresholds (configure in performance_monitor.py):

Response Time (p95):
  Warning: 500ms
  Critical: 1000ms
  Emergency: 2000ms

Error Rate:
  Warning: 1%
  Critical: 5%
  Emergency: 10%

Modify ALERT_THRESHOLDS in backend/performance_monitor.py
EOF
}

# ═══════════════════════════════════════════════════════════════
# MAIN EXECUTION
# ═══════════════════════════════════════════════════════════════

print_header "VCSA Performance Monitoring Setup"

print_info "Project root: $PROJECT_ROOT"
print_info "Backend directory: $BACKEND_DIR"
print_info "Starting verification...\n"

# Run all verifications
verify_files
verify_dependencies
verify_integration
verify_environment
verify_sentry
verify_database_collections
run_tests

# Show examples
generate_integration_example
generate_sentry_instructions
generate_alerting_instructions

# ═══════════════════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════════════════

print_header "Setup Summary"

print_success "Performance monitoring files created"
echo ""
print_info "Next steps:"
echo "  1. Review integration example above"
echo "  2. Add monitoring code to backend/server.py"
echo "  3. Configure Sentry (if not already done)"
echo "  4. Optional: Configure Slack/Email alerts"
echo "  5. Create database indexes for metrics"
echo "  6. Test with: ./scripts/test_monitoring.sh"
echo ""
print_warning "Performance monitoring is DISABLED by default"
print_info "Enable with: PERFORMANCE_MONITORING_ENABLED=true in backend/.env"
echo ""

# ═══════════════════════════════════════════════════════════════
# END OF SETUP SCRIPT
# ═══════════════════════════════════════════════════════════════
