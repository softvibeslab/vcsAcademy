#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# VCSA DNS Configuration Generator
# ═══════════════════════════════════════════════════════════════
#
# Generates DNS record configuration for various providers
#
# Usage: ./generate_dns_config.sh [server_ip]
#
# Example: ./generate_dns_config.sh 1.2.3.4
# ═══════════════════════════════════════════════════════════════

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
SERVER_IP=${1:-"YOUR_SERVER_IP"}
DOMAIN="vcsa.com"

print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_header "DNS Configuration Generator"

print_info "Domain: $DOMAIN"
print_info "Server IP: $SERVER_IP"
echo ""

# Generate Bind/Named format
print_header "1. BIND/NAMED Configuration"

cat <<EOF
; DNS Configuration for $DOMAIN
; Generated: $(date)

\$TTL 3600
@   IN  SOA ns1.vcsa.com. admin.vcsa.com. (
        $(date +%Y%m%d%H)  ; Serial
        3600       ; Refresh
        1800       ; Retry
        604800     ; Expire
        86400 )    ; Minimum TTL

; Nameservers
@       IN  NS  ns1.vcsa.com.
@       IN  NS  ns2.vcsa.com.

; A Records
@       IN  A   $SERVER_IP
www     IN  A   $SERVER_IP
api     IN  A   $SERVER_IP
app     IN  A   $SERVER_IP

; CNAME Records (optional)
;mail   IN  CNAME mail.provider.com

; MX Records (for email)
@       IN  MX  10 mail.vcsa.com.

; TXT Records
@       IN  TXT "v=spf1 include:google.com ~all"
_dmarc  IN  TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@vcsa.com"
EOF

# Generate Cloudflare format
print_header "2. Cloudflare DNS Configuration"

cat <<EOF
# Cloudflare DNS Configuration for $DOMAIN
# Add these records in Cloudflare DNS Dashboard

Type    Name    Content              TTL    Proxy (CDN)
----    ----    -------              ---    ------------
A       api     $SERVER_IP           Auto   DNS Only
A       www     $SERVER_IP           Auto   Proxied
A       @       $SERVER_IP           Auto   Proxied
CNAME   app     www.vcsa.com         Auto   Proxied

# Optional: Email Configuration
#CNAME  mail    mail.provider.com    Auto   DNS Only
#MX      @       mail.vcsa.com       Auto   10

# TXT Records
TXT     @       "v=spf1 include:google.com ~all"  Auto
TXT     _dmarc  "v=DMARC1; p=quarantine; rua=mailto:dmarc@vcsa.com"  Auto

# Note: Set SSL/TLS to "Full (strict)" in Cloudflare
# Note: Enable "Always Use HTTPS"
EOF

# Generate AWS Route53 format
print_header "3. AWS Route53 Configuration"

cat <<EOF
{
  "Comment": "DNS Configuration for $DOMAIN",
  "Changes": [
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "$DOMAIN",
        "Type": "A",
        "TTL": 3600,
        "ResourceRecords": [
          {
            "Value": "$SERVER_IP"
          }
        ]
      }
    },
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "www.$DOMAIN",
        "Type": "A",
        "TTL": 3600,
        "ResourceRecords": [
          {
            "Value": "$SERVER_IP"
          }
        ]
      }
    },
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "api.$DOMAIN",
        "Type": "A",
        "TTL": 3600,
        "ResourceRecords": [
          {
            "Value": "$SERVER_IP"
          }
        ]
      }
    },
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "app.$DOMAIN",
        "Type": "A",
        "TTL": 3600,
        "ResourceRecords": [
          {
            "Value": "$SERVER_IP"
          }
        ]
      }
    }
  ]
}
EOF

# Generate GoDaddy format
print_header "4. GoDaddy DNS Configuration"

cat <<EOF
# GoDaddy DNS Configuration for $DOMAIN

Type    Name    Value                TTL
----    ----    -----                ---
A       @       $SERVER_IP           1 hour
A       www     $SERVER_IP           1 hour
A       api     $SERVER_IP           1 hour
A       app     $SERVER_IP           1 hour
CNAME   mail    mail.provider.com    1 hour
MX      @       mail.vcsa.com       1 hour  (Priority: 10)
TXT     @       v=spf1 include:google.com ~all  1 hour
TXT     _dmarc  v=DMARC1; p=quarantine; rua=mailto:dmarc@vcsa.com  1 hour
EOF

# Generate Namecheap format
print_header "5. Namecheap DNS Configuration"

cat <<EOF
# Namecheap DNS Configuration for $DOMAIN

Type    Name    Value                TTL
----    ----    -----                ---
A       @       $SERVER_IP           Automatic
A       www     $SERVER_IP           Automatic
A       api     $SERVER_IP           Automatic
A       app     $SERVER_IP           Automatic
CNAME   mail    mail.provider.com    Automatic
MX      @       mail.vcsa.com       Automatic (Priority: 10)
TXT     @       v=spf1 include:google.com ~all  Automatic
TXT     _dmarc  v=DMARC1; p=quarantine; rua=mailto:dmarc@vcsa.com  Automatic
EOF

# Generate verification commands
print_header "6. DNS Verification Commands"

cat <<EOF
# Verify DNS configuration after propagation

# Check A records
dig +short $DOMAIN A
dig +short www.$DOMAIN A
dig +short api.$DOMAIN A
dig +short app.$DOMAIN A

# Check nameservers
dig +short $DOMAIN NS

# Check propagation globally
for server in "8.8.8.8" "1.1.1.1" "208.67.222.222"; do
    echo "Checking with \$server:"
    dig +short @\$server $DOMAIN A
done

# Test all subdomains
for subdomain in "" "www" "api" "app"; do
    echo "Testing \${subdomain:+\$subdomain.}$DOMAIN:"
    dig +short \${subdomain:+\$subdomain.}$DOMAIN A
done
EOF

# Generate Nginx configuration hints
print_header "7. Nginx Server Block Configuration"

cat <<EOF
# Add these server blocks to your Nginx configuration

# API Subdomain
server {
    listen 443 ssl http2;
    server_name api.$DOMAIN;

    ssl_certificate /etc/letsencrypt/live/api.$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.$DOMAIN/privkey.pem;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}

# Frontend Subdomain
server {
    listen 443 ssl http2;
    server_name www.$DOMAIN $DOMAIN;

    ssl_certificate /etc/letsencrypt/live/www.$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.$DOMAIN/privkey.pem;

    root /var/www/vcsa/frontend/build;
    try_files \$uri \$uri/ /index.html;
}
EOF

print_header "Configuration Files Generated"

print_success "DNS configuration files generated for:"
echo "  1. BIND/NAMED"
echo "  2. Cloudflare"
echo "  3. AWS Route53"
echo "  4. GoDaddy"
echo "  5. Namecheap"
echo "  6. Verification commands"
echo "  7. Nginx configuration hints"
echo ""
print_info "Next steps:"
echo "  1. Choose your DNS provider"
echo "  2. Copy the configuration"
echo "  3. Apply DNS records"
echo "  4. Wait for propagation (24-48 hours)"
echo "  5. Run verification: ./verify_dns.sh $DOMAIN"
echo ""

# ═══════════════════════════════════════════════════════════════
# END OF CONFIG GENERATOR
# ═══════════════════════════════════════════════════════════════
