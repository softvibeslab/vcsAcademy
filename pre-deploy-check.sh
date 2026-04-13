#!/bin/bash

###############################################################################
# VCSA Academy - Pre-Deployment Check Script
# Verifies everything is ready before VPS deployment
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================================${NC}"
echo -e "${BLUE}  VCSA Academy - Pre-Deployment Check${NC}"
echo -e "${BLUE}================================================================${NC}"
echo ""

# Track issues
ISSUES=0
WARNINGS=0

# Function to check requirement
check_requirement() {
    local description=$1
    local command=$2
    local required=$3

    echo -n "Checking $description... "

    if eval $command > /dev/null 2>&1; then
        echo -e "${GREEN}✓ OK${NC}"
        return 0
    else
        if [ "$required" = "required" ]; then
            echo -e "${RED}✗ FAILED${NC}"
            ISSUES=$((ISSUES + 1))
        else
            echo -e "${YELLOW}⚠ WARNING${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
        return 1
    fi
}

# Check local requirements
echo -e "${YELLOW}Local Requirements:${NC}"

check_requirement "Git" "command -v git" "required"
check_requirement "SSH client" "command -v ssh" "required"
check_requirement "rsync" "command -v rsync" "required"
check_requirement "Dockerfile (frontend)" "test -f frontend/Dockerfile" "required"
check_requirement "Dockerfile (backend)" "test -f backend/Dockerfile" "required"
check_requirement "VPS docker-compose" "test -f docker-compose.vps.yml" "required"
check_requirement "Deployment script" "test -f deploy-vps.sh" "required"
check_requirement "Nginx configuration" "test -f nginx/nginx.conf" "required"

echo ""
echo -e "${YELLOW}Environment Variables:${NC}"

# Check environment variables
if [ -z "$VPS_HOST" ]; then
    echo -e "${RED}✗ VPS_HOST not set${NC}"
    echo "  Export with: export VPS_HOST=YOUR_VPS_IP"
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}✓ VPS_HOST is set: $VPS_HOST${NC}"
fi

if [ -z "$VPS_USER" ]; then
    echo -e "${YELLOW}⚠ VPS_USER not set (will default to root)${NC}"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✓ VPS_USER is set: $VPS_USER${NC}"
fi

if [ -z "$VPS_PORT" ]; then
    echo -e "${YELLOW}⚠ VPS_PORT not set (will default to 22)${NC}"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✓ VPS_PORT is set: $VPS_PORT${NC}"
fi

echo ""
echo -e "${YELLOW}VPS Connection:${NC}"

# Check VPS connection if VPS_HOST is set
if [ -n "$VPS_HOST" ]; then
    if check_requirement "SSH connection to VPS" "ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -p ${VPS_PORT:-22} ${VPS_USER:-root}@${VPS_HOST} echo 'Connected'" "required"; then
        # Check VPS resources
        echo ""
        echo -e "${YELLOW}VPS Resources:${NC}"

        RAM=$(ssh -o ConnectTimeout=5 -p ${VPS_PORT:-22} ${VPS_USER:-root}@${VPS_HOST} "free -m | awk '/Mem:/ {print \$2}'" 2>/dev/null || echo "0")
        DISK=$(ssh -o ConnectTimeout=5 -p ${VPS_PORT:-22} ${VPS_USER:-root}@${VPS_HOST} "df -h / | awk 'NR==2 {print \$4}'" 2>/dev/null || echo "N/A")
        CPU=$(ssh -o ConnectTimeout=5 -p ${VPS_PORT:-22} ${VPS_USER:-root}@${VPS_HOST} "nproc" 2>/dev/null || echo "0")

        echo "  RAM: ${RAM}MB"
        echo "  Disk: ${DISK} free"
        echo "  CPU cores: ${CPU}"

        if [ "$RAM" -lt 1024 ]; then
            echo -e "${YELLOW}⚠ Warning: Less than 1GB RAM${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
    fi
else
    echo -e "${YELLOW}⚠ Skip VPS connection check (VPS_HOST not set)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo -e "${YELLOW}Domain Configuration:${NC}"

# Check DNS if VPS_HOST is set
if [ -n "$VPS_HOST" ]; then
    DOMAIN="salesmastersminds.com"

    if command -v dig > /dev/null 2>&1; then
        DNS_IP=$(dig +short $DOMAIN @8.8.8.8 | head -1)
        if [ -n "$DNS_IP" ]; then
            if [ "$DNS_IP" = "$VPS_HOST" ]; then
                echo -e "${GREEN}✓ DNS $DOMAIN points to VPS ($VPS_HOST)${NC}"
            else
                echo -e "${YELLOW}⚠ DNS $DOMAIN points to $DNS_IP (expected: $VPS_HOST)${NC}"
                echo "  You may need to update DNS records"
                WARNINGS=$((WARNINGS + 1))
            fi
        else
            echo -e "${YELLOW}⚠ DNS not configured for $DOMAIN${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        echo -e "${YELLOW}⚠ dig command not available, skipping DNS check${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
fi

echo ""
echo -e "${YELLOW}Files Size Check:${NC}"

# Check if node_modules is excluded
if [ -d "frontend/node_modules" ]; then
    NODE_MODULES_SIZE=$(du -sh frontend/node_modules 2>/dev/null | cut -f1)
    echo -e "${YELLOW}⚠ Warning: frontend/node_modules exists ($NODE_MODULES_SIZE)${NC}"
    echo "  This should be excluded from deployment"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✓ frontend/node_modules not present${NC}"
fi

# Check if __pycache__ is excluded
if find backend -type d -name "__pycache__" 2>/dev/null | grep -q .; then
    echo -e "${YELLOW}⚠ Warning: __pycache__ directories exist in backend${NC}"
    echo "  These should be excluded from deployment"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✓ No __pycache__ directories${NC}"
fi

echo ""
echo -e "${BLUE}================================================================${NC}"
echo -e "${BLUE}  Summary${NC}"
echo -e "${BLUE}================================================================${NC}"

if [ $ISSUES -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready for deployment.${NC}"
    echo ""
    echo "Run: ./deploy-vps.sh"
    exit 0
elif [ $ISSUES -eq 0 ]; then
    echo -e "${YELLOW}⚠ Found $WARNINGS warning(s), but ready for deployment${NC}"
    echo ""
    echo "You can proceed with deployment, but review warnings above."
    echo "Run: ./deploy-vps.sh"
    exit 0
else
    echo -e "${RED}✗ Found $ISSUES issue(s) and $WARNINGS warning(s)${NC}"
    echo ""
    echo "Please fix the required issues before deployment:"
    echo "1. Set VPS_HOST environment variable: export VPS_HOST=YOUR_VPS_IP"
    echo "2. Test SSH connection: ssh root@YOUR_VPS_IP"
    echo "3. Install missing dependencies if needed"
    exit 1
fi
