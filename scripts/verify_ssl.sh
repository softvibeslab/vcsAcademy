#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# VCSA SSL Verification Script
# ═══════════════════════════════════════════════════════════════
#
# Verifies SSL certificate installation and configuration
#
# Usage: ./verify_ssl.sh [domain]
#
# Examples:
#   ./verify_ssl.sh api.vcsa.com
#   ./verify_ssl.sh www.vcsa.com
# ═══════════════════════════════════════════════════════════════

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DOMAIN=${1:-"api.vcsa.com"}
PORT=443

PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

# Helper functions
print_pass() {
    echo -e "${GREEN}✓ PASS${NC}: $1"
    ((PASS_COUNT++))
}

print_fail() {
    echo -e "${RED}✗ FAIL${NC}: $1"
    ((FAIL_COUNT++))
}

print_warn() {
    echo -e "${YELLOW}⚠ WARN${NC}: $1"
    ((WARN_COUNT++))
}

print_info() {
    echo -e "${BLUE}ℹ INFO${NC}: $1"
}

print_header() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo ""
}

# ═══════════════════════════════════════════════════════════════
# VERIFICATION TESTS
# ═══════════════════════════════════════════════════════════════

print_header "SSL Certificate Verification for $DOMAIN"

# Test 1: DNS Resolution
print_info "Test 1: DNS Resolution"

if host "$DOMAIN" > /dev/null 2>&1; then
    IP=$(dig +short $DOMAIN | grep -E '^[0-9]')
    print_pass "Domain $DOMAIN resolves to $IP"
else
    print_fail "Domain $DOMAIN does not resolve"
fi

# Test 2: SSL Connection
print_info "Test 2: SSL Connection"

if timeout 5 openssl s_client -connect "$DOMAIN:$PORT" -servername "$DOMAIN" > /dev/null 2>&1 <<< "Q"; then
    print_pass "SSL connection successful to $DOMAIN:$PORT"
else
    print_fail "Cannot establish SSL connection to $DOMAIN:$PORT"
fi

# Test 3: Certificate Validity
print_info "Test 3: Certificate Validity"

CERT_INFO=$(openssl s_client -connect "$DOMAIN:$PORT" -servername "$DOMAIN" 2>/dev/null <<< "Q" | openssl x509 -noout -dates 2>/dev/null)

if [ -n "$CERT_INFO" ]; then
    NOT_BEFORE=$(echo "$CERT_INFO" | grep "notBefore" | cut -d= -f2)
    NOT_AFTER=$(echo "$CERT_INFO" | grep "notAfter" | cut -d= -f2)
    print_pass "Certificate validity period:"
    echo "  - Not Before: $NOT_BEFORE"
    echo "  - Not After:  $NOT_AFTER"

    # Check if certificate is expired
    EXPIRE_DATE=$(date -d "$NOT_AFTER" +%s)
    CURRENT_DATE=$(date +%s)

    if [ $EXPIRE_DATE -lt $CURRENT_DATE ]; then
        print_fail "Certificate has expired!"
    else
        DAYS_LEFT=$(( ($EXPIRE_DATE - $CURRENT_DATE) / 86400 ))
        if [ $DAYS_LEFT -lt 30 ]; then
            print_warn "Certificate expires in $DAYS_LEFT days (less than 30)"
        else
            print_pass "Certificate expires in $DAYS_LEFT days"
        fi
    fi
else
    print_fail "Cannot retrieve certificate information"
fi

# Test 4: Certificate Chain
print_info "Test 4: Certificate Chain"

VERIFY_OUTPUT=$(openssl s_client -connect "$DOMAIN:$PORT" -servername "$DOMAIN" 2>/dev/null <<< "Q" | grep "Verify return code")

if echo "$VERIFY_OUTPUT" | grep -q "0 (ok)"; then
    print_pass "Certificate chain is valid"
else
    print_fail "Certificate chain verification failed"
fi

# Test 5: HTTPS Connection
print_info "Test 5: HTTPS Connection"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/api/health" 2>/dev/null)

if [ -n "$HTTP_CODE" ]; then
    if [ "$HTTP_CODE" = "200" ]; then
        print_pass "HTTPS connection successful (HTTP $HTTP_CODE)"
    else
        print_warn "HTTPS connection returned HTTP $HTTP_CODE (expected 200)"
    fi
else
    print_fail "Cannot connect via HTTPS"
fi

# Test 6: Security Headers
print_info "Test 6: Security Headers"

HEADERS=$(curl -s -I "https://$DOMAIN/api/health" 2>/dev/null)

# Check HSTS
if echo "$HEADERS" | grep -qi "strict-transport-security"; then
    print_pass "HSTS header present"
else
    print_warn "HSTS header missing"
fi

# Check X-Frame-Options
if echo "$HEADERS" | grep -qi "x-frame-options"; then
    print_pass "X-Frame-Options header present"
else
    print_warn "X-Frame-Options header missing"
fi

# Check X-Content-Type-Options
if echo "$HEADERS" | grep -qi "x-content-type-options"; then
    print_pass "X-Content-Type-Options header present"
else
    print_warn "X-Content-Type-Options header missing"
fi

# Check Server Token
if echo "$HEADERS" | grep -qi "Server:"; then
    SERVER_HEADER=$(echo "$HEADERS" | grep -i "Server:" | cut -d: -f2)
    if echo "$SERVER_HEADER" | grep -qvi "nginx"; then
        print_pass "Server header does not reveal version"
    else
        print_warn "Server header reveals version: $SERVER_HEADER"
    fi
else
    print_pass "Server header not present (good)"
fi

# Test 7: TLS Version
print_info "Test 7: TLS Version"

TLS_VERSION=$(openssl s_client -connect "$DOMAIN:$PORT" -servername "$DOMAIN" 2>/dev/null <<< "Q" | grep "Protocol" | grep -oP "TLSv[\d\.]+")

if [ -n "$TLS_VERSION" ]; then
    if [[ "$TLS_VERSION" == "TLSv1.2" ]] || [[ "$TLS_VERSION" == "TLSv1.3" ]]; then
        print_pass "Using secure TLS version: $TLS_VERSION"
    else
        print_fail "Using insecure TLS version: $TLS_VERSION"
    fi
else
    print_warn "Cannot determine TLS version"
fi

# Test 8: Cipher Suite
print_info "Test 8: Cipher Suite"

CIPHER=$(openssl s_client -connect "$DOMAIN:$PORT" -servername "$DOMAIN" -cipher 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384' 2>/dev/null <<< "Q" | grep "Cipher" | grep -oP ": \K.*")

if [ -n "$CIPHER" ]; then
    print_pass "Using secure cipher: $CIPHER"
else
    print_warn "Cannot determine cipher suite"
fi

# Test 9: OCSP Stapling
print_info "Test 9: OCSP Stapling"

OCSP_RESPONSE=$(openssl s_client -connect "$DOMAIN:$PORT" -servername "$DOMAIN" -status 2>/dev/null | grep "OCSP response")

if [ -n "$OCSP_RESPONSE" ]; then
    print_pass "OCSP stapling is enabled"
else
    print_warn "OCSP stapling may not be enabled"
fi

# Test 10: HTTP to HTTPS Redirect
print_info "Test 10: HTTP to HTTPS Redirect"

REDIRECT_CHECK=$(curl -s -I "http://$DOMAIN" 2>/dev/null | grep -i "Location")

if echo "$REDIRECT_CHECK" | grep -qi "https"; then
    print_pass "HTTP redirects to HTTPS"
else
    print_warn "HTTP does not redirect to HTTPS"
fi

# ═══════════════════════════════════════════════════════════════
# FINAL SUMMARY
# ═══════════════════════════════════════════════════════════════

print_header "Verification Summary"

echo -e "${GREEN}Passed${NC}: $PASS_COUNT"
echo -e "${YELLOW}Warnings${NC}: $WARN_COUNT"
echo -e "${RED}Failed${NC}: $FAIL_COUNT"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    print_pass "All critical tests passed! SSL is configured correctly."
    echo ""
    print_info "Recommended next steps:"
    echo "  1. Run SSL Labs test: https://www.ssllabs.com/ssltest/"
    echo "  2. Check HTTP Security Headers: https://securityheaders.com/"
    echo "  3. Test in browser: https://$DOMAIN"
    exit 0
else
    print_fail "Some tests failed. Please review and fix the issues."
    exit 1
fi
