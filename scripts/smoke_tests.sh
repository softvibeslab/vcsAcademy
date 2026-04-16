#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# VCSA Production Smoke Tests
# ═══════════════════════════════════════════════════════════════
#
# Automated smoke testing for production deployment verification
#
# Usage: ./smoke_tests.sh [options]
#
# Options:
#   --critical-only      Run only critical tests
#   --verbose           Show detailed output
#   --json-output       Output results in JSON format
#   --endpoint URL      Test specific endpoint
#   --help              Show this help message
#
# Author: VCSA DevOps Team
# Created: April 2026
# Status: Production Ready
# ═══════════════════════════════════════════════════════════════

set -e

# ═══════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
BACKEND_URL="${BACKEND_URL:-http://localhost:8000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
TIMEOUT="${TIMEOUT:-10}"
MAX_RETRIES="${MAX_RETRIES:-3}"

# Test results
PASSED=0
FAILED=0
WARNINGS=0
TOTAL=0

# Arrays to store results
declare -a PASSED_TESTS
declare -a FAILED_TESTS
declare -a WARNING_TESTS

# ═══════════════════════════════════════════════════════════════
# UTILITY FUNCTIONS
# ═══════════════════════════════════════════════════════════════

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

log_test_start() {
    echo -e "\n${BLUE}Testing: $1${NC}"
}

log_test_result() {
    local test_name="$1"
    local result="$2"
    local message="$3"

    TOTAL=$((TOTAL + 1))

    case $result in
        "PASS")
            PASSED=$((PASSED + 1))
            PASSED_TESTS+=("$test_name")
            log_success "$test_name - $message"
            ;;
        "FAIL")
            FAILED=$((FAILED + 1))
            FAILED_TESTS+=("$test_name: $message")
            log_error "$test_name - $message"
            ;;
        "WARN")
            WARNINGS=$((WARNINGS + 1))
            WARNING_TESTS+=("$test_name: $message")
            log_warning "$test_name - $message"
            ;;
    esac
}

# ═══════════════════════════════════════════════════════════════
# TEST FUNCTIONS
# ═══════════════════════════════════════════════════════════════

# Test: Health Check
test_health_check() {
    log_test_start "Health Check Endpoint"

    local response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT \
        "${BACKEND_URL}/api/health" 2>/dev/null || echo "000")

    if [ "$response" = "200" ]; then
        log_test_result "Health Check" "PASS" "HTTP $response"
        return 0
    else
        log_test_result "Health Check" "FAIL" "HTTP $response (expected 200)"
        return 1
    fi
}

# Test: Detailed Health Check
test_detailed_health() {
    log_test_start "Detailed Health Check"

    local response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT \
        "${BACKEND_URL}/api/health/detailed" 2>/dev/null || echo "000")

    if [ "$response" = "200" ]; then
        log_test_result "Detailed Health" "PASS" "HTTP $response"
        return 0
    else
        log_test_result "Detailed Health" "FAIL" "HTTP $response (expected 200)"
        return 1
    fi
}

# Test: API Documentation
test_api_docs() {
    log_test_start "API Documentation"

    local response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT \
        "${BACKEND_URL}/docs" 2>/dev/null || echo "000")

    if [ "$response" = "200" ]; then
        log_test_result "API Documentation" "PASS" "HTTP $response"
        return 0
    else
        log_test_result "API Documentation" "FAIL" "HTTP $response (expected 200)"
        return 1
    fi
}

# Test: Frontend Access
test_frontend() {
    log_test_start "Frontend Access"

    local response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT \
        "${FRONTEND_URL}/" 2>/dev/null || echo "000")

    if [ "$response" = "200" ]; then
        log_test_result "Frontend Access" "PASS" "HTTP $response"
        return 0
    else
        log_test_result "Frontend Access" "WARN" "HTTP $response (expected 200)"
        return 0
    fi
}

# Test: User Authentication (Demo User)
test_authentication() {
    log_test_start "User Authentication"

    local response=$(curl -s -X POST --max-time $TIMEOUT \
        -H "Content-Type: application/json" \
        -d '{"email":"demo@vcsa.com","password":"demo123"}' \
        "${BACKEND_URL}/api/auth/login" 2>/dev/null)

    if echo "$response" | grep -q "access_token"; then
        log_test_result "User Authentication" "PASS" "Login successful"
        return 0
    else
        log_test_result "User Authentication" "FAIL" "Login failed"
        return 1
    fi
}

# Test: User Registration
test_registration() {
    log_test_start "User Registration"

    local timestamp=$(date +%s)
    local random_user="test_${timestamp}@vcsa.com"
    local random_pass="TestPass123_${timestamp}"

    local response=$(curl -s -X POST --max-time $TIMEOUT \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$random_user\",\"password\":\"$random_pass\"}" \
        "${BACKEND_URL}/api/auth/register" 2>/dev/null)

    if echo "$response" | grep -q "access_token\|message"; then
        log_test_result "User Registration" "PASS" "Registration successful"
        return 0
    else
        log_test_result "User Registration" "WARN" "Registration returned unexpected response"
        return 0
    fi
}

# Test: Development Stages
test_development_stages() {
    log_test_start "Development Stages API"

    local response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT \
        "${BACKEND_URL}/api/development/stages" 2>/dev/null || echo "000")

    if [ "$response" = "200" ]; then
        log_test_result "Development Stages" "PASS" "HTTP $response"
        return 0
    else
        log_test_result "Development Stages" "FAIL" "HTTP $response (expected 200)"
        return 1
    fi
}

# Test: Development Tracks
test_development_tracks() {
    log_test_start "Development Tracks API"

    local response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT \
        "${BACKEND_URL}/api/development/tracks" 2>/dev/null || echo "000")

    if [ "$response" = "200" ]; then
        log_test_result "Development Tracks" "PASS" "HTTP $response"
        return 0
    else
        log_test_result "Development Tracks" "FAIL" "HTTP $response (expected 200)"
        return 1
    fi
}

# Test: Deal Breakdowns
test_deal_breakdowns() {
    log_test_start "Deal Breakdowns API"

    local response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT \
        "${BACKEND_URL}/api/development/breakdowns" 2>/dev/null || echo "000")

    if [ "$response" = "200" ]; then
        log_test_result "Deal Breakdowns" "PASS" "HTTP $response"
        return 0
    else
        log_test_result "Deal Breakdowns" "FAIL" "HTTP $response (expected 200)"
        return 1
    fi
}

# Test: Quick Wins
test_quick_wins() {
    log_test_start "Quick Wins API"

    local response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT \
        "${BACKEND_URL}/api/development/quickwins" 2>/dev/null || echo "000")

    if [ "$response" = "200" ]; then
        log_test_result "Quick Wins" "PASS" "HTTP $response"
        return 0
    else
        log_test_result "Quick Wins" "FAIL" "HTTP $response (expected 200)"
        return 1
    fi
}

# Test: Rate Limiting Headers
test_rate_limiting() {
    log_test_start "Rate Limiting Headers"

    local headers=$(curl -s -I --max-time $TIMEOUT \
        "${BACKEND_URL}/api/health" 2>/dev/null)

    if echo "$headers" | grep -q "X-RateLimit"; then
        log_test_result "Rate Limiting" "PASS" "Rate limit headers present"
        return 0
    else
        log_test_result "Rate Limiting" "WARN" "Rate limit headers not found"
        return 0
    fi
}

# Test: Response Time Header
test_response_time_header() {
    log_test_start "Response Time Header"

    local headers=$(curl -s -I --max-time $TIMEOUT \
        "${BACKEND_URL}/api/health" 2>/dev/null)

    if echo "$headers" | grep -q "X-Response-Time"; then
        log_test_result "Response Time Header" "PASS" "Response time header present"
        return 0
    else
        log_test_result "Response Time Header" "WARN" "Response time header not found"
        return 0
    fi
}

# Test: CORS Headers
test_cors_headers() {
    log_test_start "CORS Headers"

    local headers=$(curl -s -I -H "Origin: ${FRONTEND_URL}" --max-time $TIMEOUT \
        "${BACKEND_URL}/api/health" 2>/dev/null)

    if echo "$headers" | grep -q "Access-Control"; then
        log_test_result "CORS Headers" "PASS" "CORS headers present"
        return 0
    else
        log_test_result "CORS Headers" "WARN" "CORS headers not found"
        return 0
    fi
}

# Test: Response Time Performance
test_response_time() {
    log_test_start "Response Time Performance"

    local response_time=$(curl -o /dev/null -s -w '%{time_total}' --max-time $TIMEOUT \
        "${BACKEND_URL}/api/health" 2>/dev/null)

    # Convert to milliseconds
    local response_ms=$(echo "$response_time * 1000" | bc)

    # Check if response time is acceptable (< 1 second)
    if (( $(echo "$response_time < 1.0" | bc -l) )); then
        log_test_result "Response Time" "PASS" "${response_ms}ms"
        return 0
    else
        log_test_result "Response Time" "WARN" "${response_ms}ms (> 1000ms)"
        return 0
    fi
}

# Test: SSL Certificate (HTTPS only)
test_ssl_certificate() {
    if [[ ! "$BACKEND_URL" =~ ^https:// ]]; then
        log_test_result "SSL Certificate" "WARN" "Not using HTTPS"
        return 0
    fi

    log_test_start "SSL Certificate"

    local ssl_check=$(openssl s_client -connect "$(echo $BACKEND_URL | sed 's|https://||'):443" -servername "$(echo $BACKEND_URL | sed 's|https://||')" </dev/null 2>/dev/null | grep "Verify return code" | awk '{print $4}')

    if [ "$ssl_check" = "0" ]; then
        log_test_result "SSL Certificate" "PASS" "Valid SSL certificate"
        return 0
    else
        log_test_result "SSL Certificate" "FAIL" "SSL certificate verification failed"
        return 1
    fi
}

# Test: Database Connectivity
test_database_connectivity() {
    log_test_start "Database Connectivity"

    # This is a simplified check - actual implementation would verify DB connection
    local response=$(curl -s "${BACKEND_URL}/api/health/detailed" 2>/dev/null)

    if echo "$response" | grep -q "database.*healthy\|database.*ok\|status.*ok"; then
        log_test_result "Database Connectivity" "PASS" "Database accessible"
        return 0
    else
        log_test_result "Database Connectivity" "WARN" "Could not verify database connectivity"
        return 0
    fi
}

# ═══════════════════════════════════════════════════════════════
# TEST SUITES
# ═══════════════════════════════════════════════════════════════

run_critical_tests() {
    echo -e "\n${GREEN}═══════════════════════════════════════${NC}"
    echo -e "${GREEN}CRITICAL TESTS${NC}"
    echo -e "${GREEN}═══════════════════════════════════════${NC}"

    test_health_check
    test_detailed_health
    test_authentication
    test_development_stages
    test_development_tracks
}

run_all_tests() {
    echo -e "\n${GREEN}═══════════════════════════════════════${NC}"
    echo -e "${GREEN}ALL SMOKE TESTS${NC}"
    echo -e "${GREEN}═══════════════════════════════════════${NC}"

    # Core Service Tests
    echo -e "\n${BLUE}Core Service Tests${NC}"
    test_health_check
    test_detailed_health
    test_api_docs
    test_frontend

    # Authentication Tests
    echo -e "\n${BLUE}Authentication Tests${NC}"
    test_authentication
    test_registration

    # API Functionality Tests
    echo -e "\n${BLUE}API Functionality Tests${NC}"
    test_development_stages
    test_development_tracks
    test_deal_breakdowns
    test_quick_wins

    # Performance & Security Tests
    echo -e "\n${BLUE}Performance & Security Tests${NC}"
    test_rate_limiting
    test_response_time_header
    test_cors_headers
    test_response_time
    test_ssl_certificate
    test_database_connectivity
}

# ═══════════════════════════════════════════════════════════════
# RESULTS SUMMARY
# ═══════════════════════════════════════════════════════════════

print_summary() {
    echo -e "\n${GREEN}═══════════════════════════════════════${NC}"
    echo -e "${GREEN}TEST SUMMARY${NC}"
    echo -e "${GREEN}═══════════════════════════════════════${NC}"

    echo -e "\n📊 Test Results:"
    echo -e "   Total Tests:  $TOTAL"
    echo -e "   ${GREEN}✓ Passed:${NC}    $PASSED"
    echo -e "   ${YELLOW}⚠ Warnings:${NC}  $WARNINGS"
    echo -e "   ${RED}✗ Failed:${NC}    $FAILED"

    if [ $FAILED -gt 0 ]; then
        echo -e "\n${RED}Failed Tests:${NC}"
        for test in "${FAILED_TESTS[@]}"; do
            echo -e "   ${RED}✗${NC} $test"
        done
    fi

    if [ $WARNINGS -gt 0 ]; then
        echo -e "\n${YELLOW}Warnings:${NC}"
        for test in "${WARNING_TESTS[@]}"; do
            echo -e "   ${YELLOW}⚠${NC} $test"
        done
    fi

    # Determine exit code
    local exit_code=0
    if [ $FAILED -gt 0 ]; then
        exit_code=1
        echo -e "\n${RED}❌ SMOKE TESTS FAILED${NC}"
    elif [ $WARNINGS -gt 0 ]; then
        exit_code=0
        echo -e "\n${YELLOW}⚠️  SMOKE TESTS PASSED WITH WARNINGS${NC}"
    else
        exit_code=0
        echo -e "\n${GREEN}✅ ALL SMOKE TESTS PASSED${NC}"
    fi

    echo -e "${GREEN}═══════════════════════════════════════${NC}\n"

    return $exit_code
}

# ═══════════════════════════════════════════════════════════════
# MAIN SCRIPT
# ═══════════════════════════════════════════════════════════════

print_usage() {
    cat << EOF
Usage: $0 [options]

Options:
  --critical-only      Run only critical tests
  --verbose           Show detailed output
  --json-output       Output results in JSON format
  --endpoint URL      Test specific endpoint
  --help              Show this help message

Environment Variables:
  BACKEND_URL         Backend API URL (default: http://localhost:8000)
  FRONTEND_URL        Frontend URL (default: http://localhost:3000)
  TIMEOUT             Request timeout in seconds (default: 10)
  MAX_RETRIES         Maximum number of retries (default: 3)

Examples:
  # Run all tests
  $0

  # Run critical tests only
  $0 --critical-only

  # Test specific endpoint
  $0 --endpoint https://api.vcsa.com

  # With custom backend URL
  BACKEND_URL=https://api.vcsa.com $0

EOF
}

main() {
    local critical_only=false
    local verbose=false

    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --critical-only)
                critical_only=true
                shift
                ;;
            --verbose)
                verbose=true
                set -x
                shift
                ;;
            --endpoint)
                BACKEND_URL="$2"
                shift 2
                ;;
            --help)
                print_usage
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                print_usage
                exit 1
                ;;
        esac
    done

    echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   VCSA Production Smoke Tests        ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
    echo -e "\n🔍 Testing Endpoint: ${BACKEND_URL}"
    echo -e "🌍 Frontend URL: ${FRONTEND_URL}"

    # Run tests
    if [ "$critical_only" = true ]; then
        run_critical_tests
    else
        run_all_tests
    fi

    # Print summary and exit
    print_summary
    exit $?
}

# Run main function
main "$@"
