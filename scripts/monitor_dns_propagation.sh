#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# VCSA DNS Propagation Monitor
# ═══════════════════════════════════════════════════════════════
#
# Monitors DNS propagation across global DNS servers
#
# Usage: ./monitor_dns_propagation.sh [domain] [expected_ip]
#
# Example: ./monitor_dns_propagation.sh vcsa.com 1.2.3.4
# ═══════════════════════════════════════════════════════════════

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DOMAIN=${1:-"vcsa.com"}
EXPECTED_IP=${2:-""}

# Global DNS servers to check
declare -A DNS_SERVERS=(
    ["Google USA"]="8.8.8.8"
    ["Google Europe"]="8.8.4.4"
    ["Cloudflare"]="1.1.1.1"
    ["OpenDNS"]="208.67.222.222"
    ["Quad9"]="9.9.9.9"
    ["Verisign"]="64.6.64.6"
)

print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"
}

check_dns() {
    local server_name=$1
    local server_ip=$2

    echo -n "Checking $server_name ($server_ip)... "

    RESULT=$(dig +short @$server_ip $DOMAIN A 2>/dev/null)

    if [ -z "$RESULT" ]; then
        echo -e "${RED}✗ NOT RESOLVING${NC}"
        return 1
    else
        if [ -n "$EXPECTED_IP" ]; then
            if [ "$RESULT" = "$EXPECTED_IP" ]; then
                echo -e "${GREEN}✓ PROPAGATED ($RESULT)${NC}"
                return 0
            else
                echo -e "${YELLOW}⚠ WRONG IP ($RESULT, expected $EXPECTED_IP)${NC}"
                return 2
            fi
        else
            echo -e "${GREEN}✓ PROPAGATED ($RESULT)${NC}"
            return 0
        fi
    fi
}

print_header "DNS Propagation Monitor for $DOMAIN"

if [ -n "$EXPECTED_IP" ]; then
    echo "Expected IP: $EXPECTED_IP"
fi

echo ""
echo "Checking propagation across $((${#DNS_SERVERS[@]})) global DNS servers..."
echo ""

TOTAL_COUNT=${#DNS_SERVERS[@]}
PROPAGATED_COUNT=0

for server in "${!DNS_SERVERS[@]}"; do
    if check_dns "$server" "${DNS_SERVERS[$server]}"; then
        ((PROPAGATED_COUNT++))
    fi
done

PROPAGATION_PERCENTAGE=$((PROPAGATED_COUNT * 100 / TOTAL_COUNT))

echo ""
echo -e "${BLUE}Propagation Status:${NC} $PROPAGATED_COUNT/$TOTAL_COUNT ($PROPAGATION_PERCENTAGE%)"

if [ $PROPAGATED_COUNT -eq $TOTAL_COUNT ]; then
    echo -e "${GREEN}✓ DNS FULLY PROPAGATED${NC}\n"
    echo "Next steps:"
    echo "  1. Configure SSL certificates"
    echo "  2. Update application URLs to use HTTPS"
    echo "  3. Test all subdomains"
    exit 0
elif [ $PROPAGATION_COUNT -gt $((TOTAL_COUNT / 2)) ]; then
    echo -e "${YELLOW}⚠ DNS MOSTLY PROPAGATED ($PROPAGATION_PERCENTAGE%)${NC}\n"
    echo "Some DNS servers haven't updated yet. This is normal during propagation."
    echo "Wait a bit longer and check again."
    exit 0
else
    echo -e "${RED}✗ DNS NOT FULLY PROPAGATED ($PROPAGATION_PERCENTAGE%)${NC}\n"
    echo "DNS is still propagating. This can take 24-48 hours."
    echo "Run this script again in a few hours."
    exit 1
fi

# ═══════════════════════════════════════════════════════════════
# END OF MONITOR SCRIPT
# ═══════════════════════════════════════════════════════════════
