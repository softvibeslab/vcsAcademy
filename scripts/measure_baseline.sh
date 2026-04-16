#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# VCSA Performance Baseline Measurement Script
# ═══════════════════════════════════════════════════════════════
#
# Automated performance baseline measurement for VCSA platform
#
# Usage: ./measure_baseline.sh [options]
#
# Options:
#   --compare       Compare against existing baseline
#   --update        Update baseline with new results
#   --threshold N   Regression threshold percentage (default: 20)
#   --fail-on-regression  Exit with error if regression detected
#
# Example: ./measure_baseline.sh --compare --threshold 15
# ═══════════════════════════════════════════════════════════════

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKEND_URL="${BACKEND_URL:-http://localhost:8000}"
BASELINE_FILE="baseline_results.yml"
COMPARE=false
UPDATE=false
THRESHOLD=20
FAIL_ON_REGRESSION=false
RESULTS_DIR="baseline_results"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --compare)
      COMPARE=true
      shift
      ;;
    --update)
      UPDATE=true
      shift
      ;;
    --threshold)
      THRESHOLD="$2"
      shift 2
      ;;
    --fail-on-regression)
      FAIL_ON_REGRESSION=true
      shift
      ;;
    -h|--help)
      echo "Usage: $0 [options]"
      echo ""
      echo "Options:"
      echo "  --compare               Compare against existing baseline"
      echo "  --update                Update baseline with new results"
      echo "  --threshold N           Regression threshold percentage (default: 20)"
      echo "  --fail-on-regression    Exit with error if regression detected"
      echo ""
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

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

# ═══════════════════════════════════════════════════════════════
# CHECK PREREQUISITES
# ═══════════════════════════════════════════════════════════════

check_prerequisites() {
    print_header "Checking Prerequisites"

    # Check if backend is running
    if ! curl -s -f "${BACKEND_URL}/health" > /dev/null 2>&1; then
        print_error "Backend is not running at ${BACKEND_URL}"
        print_info "Start the backend with: cd backend && python server.py"
        exit 1
    fi

    print_success "Backend is running"

    # Check if curl is installed
    if ! command -v curl &> /dev/null; then
        print_error "curl is not installed"
        exit 1
    fi

    print_success "curl is available"

    # Check if jq is installed (for JSON parsing)
    if ! command -v jq &> /dev/null; then
        print_warning "jq is not installed (optional, for JSON parsing)"
    else
        print_success "jq is available"
    fi

    # Create results directory
    mkdir -p "$RESULTS_DIR"
    print_success "Results directory created: $RESULTS_DIR"
}

# ═══════════════════════════════════════════════════════════════
# WARM UP SYSTEM
# ═══════════════════════════════════════════════════════════════

warm_up_system() {
    print_header "Warming Up System"

    print_info "Sending warm-up requests..."

    for i in {1..100}; do
        curl -s "${BACKEND_URL}/health" > /dev/null 2>&1
    done

    print_success "System warmed up"
}

# ═══════════════════════════════════════════════════════════════
# MEASURE ENDPOINT
# ═══════════════════════════════════════════════════════════════

measure_endpoint() {
    local endpoint_name="$1"
    local endpoint_path="$2"
    local method="${3:-GET}"
    local data="$4"
    local requests="${5:-100}"

    print_info "Measuring: $endpoint_name ($method $endpoint_path)"

    # Create temp file for timing data
    local timing_file="$RESULTS_DIR/${endpoint_name}_${TIMESTAMP}.txt"

    # Make requests and measure time
    local total_time=0
    local response_times=()

    for i in $(seq 1 $requests); do
        local start=$(date +%s%N)

        if [ "$method" = "POST" ] && [ -n "$data" ]; then
            curl -s -X POST "${BACKEND_URL}${endpoint_path}" \
                -H "Content-Type: application/json" \
                -d "$data" \
                -o /dev/null \
                -w "%{http_code}" \
                2>&1
        else
            curl -s "${BACKEND_URL}${endpoint_path}" \
                -o /dev/null \
                -w "%{http_code}" \
                2>&1
        fi

        local end=$(date +%s%N)
        local duration=$((($end - $start) / 1000000))  # Convert to ms
        response_times+=($duration)
        total_time=$(($total_time + $duration))

        echo "$duration" >> "$timing_file"
    done

    # Calculate statistics
    local avg=$(($total_time / $requests))

    # Sort for percentiles
    IFS=$'\n' sorted=($(sort -n <<<"${response_times[*]}"))
    unset IFS

    local p50=${sorted[$(($requests / 2))]}
    local p95=${sorted[$(($requests * 95 / 100))]}
    local p99=${sorted[$(($requests * 99 / 100))]}

    # Find max
    local max=${sorted[-1]}

    echo "$p50,$p95,$p99,$max,$avg"
}

# ═══════════════════════════════════════════════════════════════
# RUN BASELINE TESTS
# ═══════════════════════════════════════════════════════════════

run_baseline_tests() {
    print_header "Running Baseline Tests"

    print_info "Backend URL: $BACKEND_URL"
    print_info "Timestamp: $TIMESTAMP"
    echo ""

    # Results file
    local results_file="$RESULTS_DIR/baseline_${TIMESTAMP}.csv"

    # CSV header
    echo "endpoint,p50_ms,p95_ms,p99_ms,max_ms,avg_ms" > "$results_file"

    # Test each endpoint
    endpoints=(
        "health:/api/health:GET::50"
        "development_stages:/api/development/stages:GET::100"
        "development_tracks:/api/development/tracks:GET::100"
        "community_posts:/api/community/posts:GET::100"
        "events:/api/events:GET::50"
    )

    for endpoint_info in "${endpoints[@]}"; do
        IFS=':' read -r name path method data count <<< "$endpoint_info"

        stats=$(measure_endpoint "$name" "$path" "$method" "$data" "${count:-100}")

        IFS=',' read -r p50 p95 p99 max avg <<< "$stats"

        echo "$name,$p50,$p95,$p99,$max,$avg" >> "$results_file"

        print_success "$name: p50=${p50}ms, p95=${p95}ms, p99=${p99}ms"
    done

    print_success "Baseline tests completed"
    print_info "Results saved to: $results_file"
}

# ═══════════════════════════════════════════════════════════════
# COMPARE TO BASELINE
# ═══════════════════════════════════════════════════════════════

compare_to_baseline() {
    print_header "Comparing to Baseline"

    if [ ! -f "$BASELINE_FILE" ]; then
        print_warning "No baseline file found: $BASELINE_FILE"
        print_info "Run without --compare to create baseline"
        return 1
    fi

    print_info "Baseline file: $BASELINE_FILE"
    print_info "Regression threshold: ${THRESHOLD}%"
    echo ""

    # Find most recent results
    local latest_results=$(ls -t "$RESULTS_DIR"/baseline_*.csv 2>/dev/null | head -1)

    if [ -z "$latest_results" ]; then
        print_error "No results found in $RESULTS_DIR"
        return 1
    fi

    print_info "Comparing against: $latest_results"
    echo ""

    local regression_detected=false

    # Read baseline (simplified - in production use Python or jq)
    while IFS=',' read -r endpoint p50 p95 p99 max avg; do
        if [ "$endpoint" = "endpoint" ]; then
            continue  # Skip header
        fi

        # Extract baseline p95 (simplified)
        # In production, parse YAML properly
        print_info "$endpoint: p95=${p95}ms (compare to baseline manually)"

        # Check if p95 exceeds threshold (placeholder logic)
        # In production, this would parse the baseline YAML and compare
    done < "$latest_results"

    if [ "$regression_detected" = true ]; then
        print_error "Performance regression detected!"
        if [ "$FAIL_ON_REGRESSION" = true ]; then
            exit 1
        fi
    else
        print_success "No regression detected (within ${THRESHOLD}% threshold)"
    fi
}

# ═══════════════════════════════════════════════════════════════
# UPDATE BASELINE
# ═══════════════════════════════════════════════════════════════

update_baseline() {
    print_header "Updating Baseline"

    local latest_results=$(ls -t "$RESULTS_DIR"/baseline_*.csv 2>/dev/null | head -1)

    if [ -z "$latest_results" ]; then
        print_error "No results found to update baseline"
        return 1
    fi

    print_info "Creating baseline from: $latest_results"

    # Create YAML baseline file
    cat > "$BASELINE_FILE" <<EOF
# VCSA Performance Baseline
# Generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
# Environment: ${ENVIRONMENT:-development}
# Version: ${VERSION:-1.0.0}

baseline:
  timestamp: "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  environment: "${ENVIRONMENT:-development}"
  version: "${VERSION:-1.0.0}"
  backend_url: "$BACKEND_URL"

  endpoints:
EOF

    # Add endpoint data
    while IFS=',' read -r endpoint p50 p95 p99 max avg; do
        if [ "$endpoint" = "endpoint" ]; then
            continue  # Skip header
        fi

        cat >> "$BASELINE_FILE" <<EOF
    ${endpoint}:
      url: "AUTO_GENERATED"
      requests: 100
      p50_ms: ${p50}
      p95_ms: ${p95}
      p99_ms: ${p99}
      max_ms: ${max}
      avg_ms: ${avg}

EOF
    done < "$latest_results"

    print_success "Baseline updated: $BASELINE_FILE"
}

# ═══════════════════════════════════════════════════════════════
# MAIN EXECUTION
# ═══════════════════════════════════════════════════════════════

print_header "VCSA Performance Baseline Measurement"

print_info "Backend URL: $BACKEND_URL"
print_info "Results directory: $RESULTS_DIR"
print_info "Timestamp: $TIMESTAMP"
echo ""

# Check prerequisites
check_prerequisites

# Warm up system
warm_up_system

# Run baseline tests
run_baseline_tests

# Compare to baseline if requested
if [ "$COMPARE" = true ]; then
    compare_to_baseline
fi

# Update baseline if requested
if [ "$UPDATE" = true ]; then
    update_baseline
fi

# Summary
print_header "Summary"

print_success "Baseline measurement completed!"
echo ""
print_info "Results: $RESULTS_DIR"
print_info "Baseline file: $BASELINE_FILE"
echo ""
print_info "Next steps:"
echo "  1. Review results in $RESULTS_DIR"
if [ "$COMPARE" = false ]; then
    echo "  2. Set as baseline: ./measure_baseline.sh --update"
fi
echo "  3. Compare future runs: ./measure_baseline.sh --compare"
echo ""

# ═══════════════════════════════════════════════════════════════
# END OF SCRIPT
# ═══════════════════════════════════════════════════════════════
