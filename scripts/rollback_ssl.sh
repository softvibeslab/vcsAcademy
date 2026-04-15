#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# VCSA SSL Rollback Script
# ═══════════════════════════════════════════════════════════════
#
# Reverts SSL configuration if something goes wrong
#
# Usage: sudo ./rollback_ssl.sh
#
# WARNING: This will remove SSL certificates and revert to HTTP
# ═══════════════════════════════════════════════════════════════

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DOMAIN="api.vcsa.com"
BACKUP_DIR="/root/vcsa-ssl-backup-$(date +%Y%m%d_%H%M%S)"

print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"
}

print_warning() {
    echo -e "${YELLOW}⚠ WARNING: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_header "SSL Rollback Script"

print_warning "This will revert SSL configuration and remove certificates"
print_warning "Create backup before proceeding..."

# Create backup directory
mkdir -p $BACKUP_DIR
print_success "Backup directory created: $BACKUP_DIR"

# Backup current Nginx configuration
if [ -f /etc/nginx/sites-available/vcsa-api ]; then
    cp /etc/nginx/sites-available/vcsa-api $BACKUP_DIR/vcsa-api.conf
    print_success "Nginx configuration backed up"
fi

# Backup certificates
if [ -d /etc/letsencrypt/live/$DOMAIN ]; then
    cp -r /etc/letsencrypt/live/$DOMAIN $BACKUP_DIR/
    print_success "SSL certificates backed up"
fi

# Create HTTP-only Nginx configuration
cat > /etc/nginx/sites-available/vcsa-api <<EOF
server {
    listen 80;
    server_name $DOMAIN www.vcsa.com vcsa.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

print_success "Nginx reverted to HTTP-only configuration"

# Test Nginx configuration
if nginx -t 2>/dev/null; then
    print_success "Nginx configuration is valid"

    # Reload Nginx
    systemctl reload nginx
    print_success "Nginx reloaded"

else
    print_error "Nginx configuration test failed"
    print_error "Restoring from backup..."

    if [ -f $BACKUP_DIR/vcsa-api.conf ]; then
        cp $BACKUP_DIR/vcsa-api.conf /etc/nginx/sites-available/vcsa-api
        systemctl reload nginx
        print_success "Configuration restored from backup"
    fi
fi

# Remove SSL certificates (optional - commented out by default)
# read -p "Remove SSL certificates? (y/N): " -n 1 -r
# echo
# if [[ $REPLY =~ ^[Yy]$ ]]; then
#     certbot delete --cert-name $DOMAIN --non-interactive
#     print_success "SSL certificates removed"
# fi

print_header "Rollback Complete"

echo -e "${GREEN}✓ SSL configuration has been reverted to HTTP${NC}\n"
echo "Backup location: $BACKUP_DIR"
echo ""
echo "To restore SSL later:"
echo "  1. Restore Nginx config: cp $BACKUP_DIR/vcsa-api.conf /etc/nginx/sites-available/vcsa-api"
echo "  2. Reload Nginx: systemctl reload nginx"
echo "  3. Run setup script: ./setup_ssl.sh"
echo ""

# ═══════════════════════════════════════════════════════════════
# END OF ROLLBACK SCRIPT
# ═══════════════════════════════════════════════════════════════
