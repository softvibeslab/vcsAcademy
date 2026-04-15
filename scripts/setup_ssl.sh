#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# VCSA SSL Certificate Setup Script (Let's Encrypt + Certbot)
# ═══════════════════════════════════════════════════════════════
#
# This script automates the SSL certificate setup using Let's Encrypt
#
# Usage: sudo ./setup_ssl.sh
#
# Prerequisites:
# - Domain name pointing to server IP
# - Ports 80 and 443 open
# - Root/sudo access
# ═══════════════════════════════════════════════════════════════

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="vcsa.com"
API_DOMAIN="api.vcsa.com"
WWW_DOMAIN="www.vcsa.com"
APP_DOMAIN="app.vcsa.com"
EMAIL="admin@vcsa.com"

# ═══════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════

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

check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

check_domain() {
    print_info "Checking if domain $1 points to this server..."

    DOMAIN_IP=$(dig +short $1 | grep -E '^[0-9]')
    SERVER_IP=$(curl -s https://api.ipify.org)

    if [ "$DOMAIN_IP" = "$SERVER_IP" ]; then
        print_success "$1 points to this server ($SERVER_IP)"
        return 0
    else
        print_warning "$1 does not point to this server"
        print_info "Domain IP: $DOMAIN_IP"
        print_info "Server IP: $SERVER_IP"
        return 1
    fi
}

# ═══════════════════════════════════════════════════════════════
# MAIN INSTALLATION STEPS
# ═══════════════════════════════════════════════════════════════

print_header "VCSA SSL Certificate Setup"

print_info "Configuration:"
echo "  Domain: $DOMAIN"
echo "  API Domain: $API_DOMAIN"
echo "  WWW Domain: $WWW_DOMAIN"
echo "  App Domain: $APP_DOMAIN"
echo "  Email: $EMAIL"
echo ""

# Check root access
check_root

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VERSION=$VERSION_ID
    print_info "Detected OS: $OS $VERSION"
else
    print_error "Cannot detect OS. Exiting."
    exit 1
fi

# Check domain DNS
print_header "Checking DNS Configuration"
check_domain $API_DOMAIN || print_warning "DNS may not be propagated yet"
check_domain $WWW_DOMAIN || print_warning "DNS may not be propagated yet"
echo ""

# Install Certbot
print_header "Installing Certbot"

if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
    print_info "Installing Certbot on Ubuntu/Debian..."
    apt update
    apt install -y certbot python3-certbot-nginx
    print_success "Certbot installed"
elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
    print_info "Installing Certbot on CentOS/RHEL..."
    yum install -y epel-release
    yum install -y certbot python3-certbot-nginx
    print_success "Certbot installed"
else
    print_error "Unsupported OS. Please install Certbot manually."
    exit 1
fi
echo ""

# Check if Nginx is installed
if command -v nginx &> /dev/null; then
    print_success "Nginx is installed"
    NGINX_INSTALLED=true
else
    print_warning "Nginx is not installed. Will use standalone mode."
    NGINX_INSTALLED=false
fi
echo ""

# Create Nginx configuration if Nginx is installed
if [ "$NGINX_INSTALLED" = true ]; then
    print_header "Configuring Nginx"

    NGINX_CONF="/etc/nginx/sites-available/vcsa-api"
    NGINX_ENABLED="/etc/nginx/sites-enabled/vcsa-api"

    # Create sites-available directory if it doesn't exist
    mkdir -p /etc/nginx/sites-available
    mkdir -p /etc/nginx/sites-enabled

    # Create Nginx configuration
    cat > $NGINX_CONF <<EOF
server {
    listen 80;
    server_name $API_DOMAIN $WWW_DOMAIN $DOMAIN;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

    # Create symlink to enable site
    if [ ! -L "$NGINX_ENABLED" ]; then
        ln -s $NGINX_CONF $NGINX_ENABLED
        print_success "Nginx configuration created"
    fi

    # Test Nginx configuration
    nginx -t && systemctl reload nginx
    print_success "Nginx configured and reloaded"
    echo ""
fi

# Generate SSL Certificate
print_header "Generating SSL Certificate"

if [ "$NGINX_INSTALLED" = true ]; then
    print_info "Using Nginx plugin for certificate generation..."
    certbot --nginx -d $API_DOMAIN -d $WWW_DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect
else
    print_info "Using standalone mode for certificate generation..."
    certbot certonly --standalone -d $API_DOMAIN -d $WWW_DOMAIN --non-interactive --agree-tos --email $EMAIL
fi

if [ $? -eq 0 ]; then
    print_success "SSL certificate generated successfully"
else
    print_error "Failed to generate SSL certificate"
    exit 1
fi
echo ""

# Verify certificate installation
print_header "Verifying Certificate Installation"

if [ -f "/etc/letsencrypt/live/$API_DOMAIN/fullchain.pem" ]; then
    print_success "Certificate file exists"
    print_info "Certificate: /etc/letsencrypt/live/$API_DOMAIN/fullchain.pem"
    print_info "Private Key: /etc/letsencrypt/live/$API_DOMAIN/privkey.pem"
else
    print_error "Certificate file not found"
    exit 1
fi
echo ""

# Configure Nginx for SSL
if [ "$NGINX_INSTALLED" = true ]; then
    print_header "Configuring Nginx for SSL"

    cat > $NGINX_CONF <<EOF
# HTTP - Redirect to HTTPS
server {
    listen 80;
    server_name $API_DOMAIN $WWW_DOMAIN $DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

# HTTPS - Main configuration
server {
    listen 443 ssl http2;
    server_name $API_DOMAIN $WWW_DOMAIN $DOMAIN;

    # SSL Certificate
    ssl_certificate /etc/letsencrypt/live/$API_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$API_DOMAIN/privkey.pem;

    # Strong SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;

    # SSL Session
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/vcsa-api-access.log;
    error_log /var/log/nginx/vcsa-api-error.log;

    # Proxy to FastAPI backend
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Health check endpoint (no auth required)
    location /api/health {
        proxy_pass http://localhost:8000/api/health;
        access_log off;
    }
}
EOF

    # Test and reload Nginx
    nginx -t && systemctl reload nginx
    print_success "Nginx SSL configuration completed"
    echo ""
fi

# Setup auto-renewal
print_header "Setting Up Auto-Renewal"

# Certbot creates a systemd timer or cron job automatically
if systemctl list-timers | grep -q certbot.timer; then
    print_success "Certbot timer is active"
    systemctl status certbot.timer --no-pager
else
    print_warning "Certbot timer not found, checking cron job..."
    if crontab -l 2>/dev/null | grep -q certbot; then
        print_success "Certbot cron job found"
    else
        print_warning "No auto-renewal found. Please set up manually."
    fi
fi
echo ""

# Test SSL certificate
print_header "Testing SSL Configuration"

print_info "Testing certificate renewal (dry run)..."
if certbot renew --dry-run 2>/dev/null; then
    print_success "Certificate renewal test passed"
else
    print_error "Certificate renewal test failed"
fi
echo ""

# Display certificate information
print_info "Certificate information:"
openssl x509 -in /etc/letsencrypt/live/$API_DOMAIN/cert.pem -text -noout | grep -E "Subject:|Issuer:|Not Before|Not After"
echo ""

# Final summary
print_header "Setup Complete"

print_success "SSL certificate has been successfully installed!"
echo ""
print_info "Next Steps:"
echo "  1. Test HTTPS access: https://$API_DOMAIN/api/health"
echo "  2. Run SSL Labs test: https://www.ssllabs.com/ssltest/"
echo "  3. Update backend .env: REACT_APP_BACKEND_URL=https://$API_DOMAIN"
echo "  4. Update frontend .env: REACT_APP_BACKEND_URL=https://$API_DOMAIN"
echo ""
print_info "Certificate Location:"
echo "  Certificate: /etc/letsencrypt/live/$API_DOMAIN/fullchain.pem"
echo "  Private Key: /etc/letsencrypt/live/$API_DOMAIN/privkey.pem"
echo ""
print_info "Auto-renewal:"
echo "  Certbot will automatically renew certificates before expiration"
echo "  You can test renewal: sudo certbot renew --dry-run"
echo ""

# Test HTTP access
print_info "Testing HTTPS access..."
if curl -s -o /dev/null -w "%{http_code}" https://$API_DOMAIN/api/health | grep -q "200"; then
    print_success "HTTPS is working correctly!"
else
    print_warning "HTTPS test failed. Please check configuration."
fi

echo ""
print_success "SSL setup completed successfully!"
echo ""

# ═══════════════════════════════════════════════════════════════
# END OF SCRIPT
# ═══════════════════════════════════════════════════════════════
