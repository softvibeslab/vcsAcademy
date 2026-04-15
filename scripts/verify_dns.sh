#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# VCSA DNS Verification Script
# ═══════════════════════════════════════════════════════════════
#
# Verifies DNS configuration for VCSA platform
#
# Usage: ./verify_dns.sh [domain]
#
# Examples:
#   ./verify_dns.sh vcsa.com
#   ./verify_dns.sh api.vcsa.com
# ═══════════════════════════════════════════════════════════════

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DOMAIN=${1:-"vcsa.com"}
SERVER_IP=${2:-""}

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
# DNS VERIFICATION TESTS
# ═══════════════════════════════════════════════════════════════

print_header "DNS Configuration Verification for $DOMAIN"

# Test 1: Domain Existence
print_info "Test 1: Domain Existence"

if dig +short $DOMAIN | grep -qE '^[0-9]'; then
    DOMAIN_IP=$(dig +short $DOMAIN | head -n1)
    print_pass "Domain $DOMAIN exists and resolves to $DOMAIN_IP"
else
    print_fail "Domain $DOMAIN does not resolve"
fi

# Test 2: Root Domain A Record
print_info "Test 2: Root Domain A Record"

A_RECORD=$(dig +short $DOMAIN A)
if [ -n "$A_RECORD" ]; then
    print_pass "Root domain A record exists: $A_RECORD"
    if [ -n "$SERVER_IP" ]; then
        if [ "$A_RECORD" = "$SERVER_IP" ]; then
            print_pass "A record matches expected IP: $SERVER_IP"
        else
            print_warn "A record ($A_RECORD) doesn't match expected IP ($SERVER_IP)"
        fi
    fi
else
    print_fail "Root domain A record missing"
fi

# Test 3: WWW Subdomain A Record
print_info "Test 3: WWW Subdomain A Record"

WWW_RECORD=$(dig +short www.$DOMAIN A)
if [ -n "$WWW_RECORD" ]; then
    print_pass "WWW subdomain A record exists: $WWW_RECORD"
    if [ -n "$SERVER_IP" ]; then
        if [ "$WWW_RECORD" = "$SERVER_IP" ]; then
            print_pass "WWW A record matches expected IP: $SERVER_IP"
        fi
    fi
else
    print_warn "WWW subdomain A record missing"
fi

# Test 4: API Subdomain A Record
print_info "Test 4: API Subdomain A Record"

API_RECORD=$(dig +short api.$DOMAIN A)
if [ -n "$API_RECORD" ]; then
    print_pass "API subdomain A record exists: $API_RECORD"
    if [ -n "$SERVER_IP" ]; then
        if [ "$API_RECORD" = "$SERVER_IP" ]; then
            print_pass "API A record matches expected IP: $SERVER_IP"
        fi
    fi
else
    print_fail "API subdomain A record missing (REQUIRED)"
fi

# Test 5: App Subdomain A Record
print_info "Test 5: App Subdomain A Record"

APP_RECORD=$(dig +short app.$DOMAIN A)
if [ -n "$APP_RECORD" ]; then
    print_pass "App subdomain A record exists: $APP_RECORD"
    if [ -n "$SERVER_IP" ]; then
        if [ "$APP_RECORD" = "$SERVER_IP" ]; then
            print_pass "App A record matches expected IP: $SERVER_IP"
        fi
    fi
else
    print_warn "App subdomain A record missing"
fi

# Test 6: MX Records (Email)
print_info "Test 6: MX Records (Email Configuration)"

MX_RECORDS=$(dig +short $DOMAIN MX)
if [ -n "$MX_RECORDS" ]; then
    print_pass "MX records exist:"
    echo "$MX_RECORDS" | while read -r mx; do
        echo "  - $mx"
    done
else
    print_warn "No MX records found (email not configured)"
fi

# Test 7: SPF Record (Email Security)
print_info "Test 7: SPF Record (Email Security)"

SPF_RECORD=$(dig +short $DOMAIN TXT | grep -i "spf1")
if [ -n "$SPF_RECORD" ]; then
    print_pass "SPF record exists: $SPF_RECORD"
else
    print_warn "SPF record missing (recommended for email)"
fi

# Test 8: DMARC Record (Email Security)
print_info "Test 8: DMARC Record (Email Security)"

DMARC_RECORD=$(dig +short _dmarc.$DOMAIN TXT)
if [ -n "$DMARC_RECORD" ]; then
    print_pass "DMARC record exists: $DMARC_RECORD"
else
    print_warn "DMARC record missing (recommended for email)"
fi

# Test 9: Nameservers
print_info "Test 9: Nameserver Configuration"

NS_RECORDS=$(dig +short $DOMAIN NS)
if [ -n "$NS_RECORDS" ]; then
    print_pass "Nameservers configured:"
    echo "$NS_RECORDS" | while read -r ns; do
        echo "  - $ns"
    done
else
    print_fail "No nameservers found"
fi

# Test 10: DNSSEC (Optional)
print_info "Test 10: DNSSEC Configuration"

DNSSEC_TEST=$(dig +dnssec $DOMAIN DNSKEY 2>&1)
if echo "$DNSSEC_TEST" | grep -q "DNSKEY"; then
    print_pass "DNSSEC is enabled for $DOMAIN"
else
    print_warn "DNSSEC not enabled (optional but recommended)"
fi

# Test 11: DNS Propagation (Global)
print_info "Test 11: DNS Propagation Check"

declare -a DNS_SERVERS=(
    "8.8.8.8:Google (USA)"
    "1.1.1.1:Cloudflare (Global)"
    "208.67.222.222:OpenDNS (USA)"
)

PROPAGATION_COUNT=0
for server in "${DNS_SERVERS[@]}"; do
    DNS_IP=$(echo $server | cut -d: -f1)
    DNS_NAME=$(echo $server | cut -d: -f2)

    RESULT=$(dig +short @$DNS_IP $DOMAIN A)
    if [ -n "$RESULT" ]; then
        echo "  ✓ $DNS_NAME: $RESULT"
        ((PROPAGATION_COUNT++))
    else
        echo "  ✗ $DNS_NAME: Not propagated"
    fi
done

if [ $PROPAGATION_COUNT -eq ${#DNS_SERVERS[@]} ]; then
    print_pass "DNS propagated to all checked servers"
else
    print_warn "DNS not fully propagated ($PROPAGATION_COUNT/${#DNS_SERVERS[@]} servers)"
fi

# Test 12: Reverse DNS (Optional)
print_info "Test 12: Reverse DNS Lookup"

if [ -n "$SERVER_IP" ]; then
    REVERSE_DNS=$(dig +short -x $SERVER_IP)
    if [ -n "$REVERSE_DNS" ]; then
        print_pass "Reverse DNS exists: $REVERSE_DNS"
    else
        print_warn "No reverse DNS record (PTR record)"
    fi
fi

# Test 13: SOA Record (Start of Authority)
print_info "Test 13: SOA Record"

SOA_RECORD=$(dig +short $DOMAIN SOA)
if [ -n "$SOA_RECORD" ]; then
    print_pass "SOA record exists"
    SOA_EMAIL=$(echo "$SOA_RECORD" | awk '{print $2}' | sed 's/\.$//')
    echo "  Admin email: $SOA_EMAIL"
else
    print_fail "SOA record missing"
fi

# Test 14: CNAME Records (if any)
print_info "Test 14: CNAME Records"

CNAME_RECORDS=$(dig +short $DOMAIN ANY | grep -i "CNAME")
if [ -n "$CNAME_RECORDS" ]; then
    print_pass "CNAME records found:"
    echo "$CNAME_RECORDS" | while read -r cname; do
        echo "  - $cname"
    done
else
    print_info "No CNAME records (normal for root domain)"
fi

# Test 15: TTL Values
print_info "Test 15: TTL Values"

TTL=$(dig $DOMAIN A | grep "ANSWER SECTION" -A 1 | awk '{print $2}')
if [ -n "$TTL" ]; then
    if [ $TTL -le 3600 ]; then
        print_pass "TTL is optimal: $TTL seconds ($(($TTL/60)) minutes)"
    elif [ $TTL -le 86400 ]; then
        print_warn "TTL is acceptable but could be lower: $TTL seconds ($(($TTL/3600)) hours)"
    else
        print_warn "TTL is high: $TTL seconds ($(($TTL/86400)) days)"
    fi
fi

# ═══════════════════════════════════════════════════════════════
# FINAL SUMMARY
# ═══════════════════════════════════════════════════════════════

print_header "DNS Verification Summary"

echo -e "${GREEN}Passed${NC}: $PASS_COUNT"
echo -e "${YELLOW}Warnings${NC}: $WARN_COUNT"
echo -e "${RED}Failed${NC}: $FAIL_COUNT"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    print_pass "All critical DNS tests passed!"
    echo ""
    print_info "Next steps:"
    echo "  1. Wait for DNS propagation (24-48 hours)"
    echo "  2. Configure SSL certificates"
    echo "  3. Setup CDN (Cloudflare/AWS)"
    echo "  4. Test all subdomains via HTTPS"
    exit 0
else
    print_fail "Some DNS tests failed. Please review and fix issues."
    echo ""
    print_info "Common issues:"
    echo "  - Missing A records for subdomains"
    echo "  - Incorrect IP addresses"
    echo "  - DNS not fully propagated"
    exit 1
fi

# ═══════════════════════════════════════════════════════════════
# END OF VERIFICATION SCRIPT
# ═══════════════════════════════════════════════════════════════
