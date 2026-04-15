#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# VCSA Environment Update Script - HTTPS
# ═══════════════════════════════════════════════════════════════
#
# Updates environment variables to use HTTPS after SSL setup
#
# Usage: ./update_env_https.sh
# ═══════════════════════════════════════════════════════════════

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
API_DOMAIN="api.vcsa.com"
WWW_DOMAIN="www.vcsa.com"
PROJECT_ROOT="/rogervibes/vcs/Vcsa-"

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

print_header "Environment Variables Update for HTTPS"

# Update backend .env
if [ -f "$PROJECT_ROOT/backend/.env" ]; then
    print_info "Updating backend/.env..."

    # Backup existing .env
    cp "$PROJECT_ROOT/backend/.env" "$PROJECT_ROOT/backend/.env.backup"

    # Update or add REACT_APP_BACKEND_URL
    if grep -q "REACT_APP_BACKEND_URL=" "$PROJECT_ROOT/backend/.env"; then
        sed -i "s|REACT_APP_BACKEND_URL=.*|REACT_APP_BACKEND_URL=https://$API_DOMAIN|g" "$PROJECT_ROOT/backend/.env"
    else
        echo "REACT_APP_BACKEND_URL=https://$API_DOMAIN" >> "$PROJECT_ROOT/backend/.env"
    fi

    # Update or add FRONTEND_URL
    if grep -q "FRONTEND_URL=" "$PROJECT_ROOT/backend/.env"; then
        sed -i "s|FRONTEND_URL=.*|FRONTEND_URL=https://$WWW_DOMAIN|g" "$PROJECT_ROOT/backend/.env"
    else
        echo "FRONTEND_URL=https://$WWW_DOMAIN" >> "$PROJECT_ROOT/backend/.env"
    fi

    # Update environment
    if grep -q "ENVIRONMENT=" "$PROJECT_ROOT/backend/.env"; then
        sed -i 's/ENVIRONMENT=.*/ENVIRONMENT=production/g' "$PROJECT_ROOT/backend/.env"
    else
        echo "ENVIRONMENT=production" >> "$PROJECT_ROOT/backend/.env"
    fi

    # Update DEBUG
    if grep -q "DEBUG=" "$PROJECT_ROOT/backend/.env"; then
        sed -i 's/DEBUG=.*/DEBUG=False/g' "$PROJECT_ROOT/backend/.env"
    else
        echo "DEBUG=False" >> "$PROJECT_ROOT/backend/.env"
    fi

    print_success "Backend .env updated"

else
    print_info "backend/.env not found, skipping..."
fi

# Update frontend .env
if [ -f "$PROJECT_ROOT/frontend/.env" ]; then
    print_info "Updating frontend/.env..."

    # Backup existing .env
    cp "$PROJECT_ROOT/frontend/.env" "$PROJECT_ROOT/frontend/.env.backup"

    # Update REACT_APP_BACKEND_URL
    if grep -q "REACT_APP_BACKEND_URL=" "$PROJECT_ROOT/frontend/.env"; then
        sed -i "s|REACT_APP_BACKEND_URL=.*|REACT_APP_BACKEND_URL=https://$API_DOMAIN|g" "$PROJECT_ROOT/frontend/.env"
    else
        echo "REACT_APP_BACKEND_URL=https://$API_DOMAIN" >> "$PROJECT_ROOT/frontend/.env"
    fi

    print_success "Frontend .env updated"

else
    print_info "frontend/.env not found, skipping..."
fi

# Create .env.production for frontend
print_info "Creating frontend .env.production..."

cat > "$PROJECT_ROOT/frontend/.env.production" <<EOF
# Production Environment Variables
REACT_APP_BACKEND_URL=https://$API_DOMAIN
REACT_APP_FRONTEND_URL=https://$WWW_DOMAIN

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_SENTRY=true

# API Configuration
REACT_APP_API_TIMEOUT=30000
REACT_APP_API_RETRY_ATTEMPTS=3
EOF

print_success "Frontend .env.production created"

# Create production .env.example
print_info "Creating .env.example with HTTPS defaults..."

cat > "$PROJECT_ROOT/.env.production.example" <<EOF
# Production Environment Variables Template
# Update these values for your production environment

# API Configuration
REACT_APP_BACKEND_URL=https://$API_DOMAIN
FRONTEND_URL=https://$WWW_DOMAIN

# Environment
ENVIRONMENT=production
DEBUG=False

# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=vcsa_production

# Security
SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here

# Stripe
STRIPE_API_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID=your_price_id

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# CORS
ALLOWED_ORIGINS=https://$WWW_DOMAIN,https://$API_DOMAIN

# Monitoring (Optional)
SENTRY_DSN=your-sentry-dsn
SENTRY_ENVIRONMENT=production
EOF

print_success "Production .env.example created"

print_header "Environment Update Complete"

echo ""
print_success "All environment files have been updated to use HTTPS"
echo ""
print_info "Next steps:"
echo "  1. Review the updated .env files"
echo "  2. Update any missing values in .env.production.example"
echo "  3. Restart backend and frontend services"
echo "  4. Test HTTPS connectivity"
echo ""
print_info "Backup files created:"
echo "  - backend/.env.backup"
echo "  - frontend/.env.backup"
echo ""

# ═══════════════════════════════════════════════════════════════
# END OF SCRIPT
# ═══════════════════════════════════════════════════════════════
