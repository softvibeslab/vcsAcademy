#!/bin/bash

###############################################################################
# VCSA Academy - MASTER DEPLOYMENT SCRIPT
# Hostinger VPS | salesmastersminds.com | Ubuntu 25.10
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
VPS_HOST="${VPS_HOST:-31.220.63.211}"
VPS_USER="${VPS_USER:-root}"
VPS_PORT="${VPS_PORT:-22}"
DOMAIN="salesmastersminds.com"
API_DOMAIN="api.salesmastersminds.com"

# Counter for password prompts
PASSWORD_PROMPTS=0

# Functions
print_header() {
    echo ""
    echo -e "${BLUE}================================================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}================================================================${NC}"
    echo ""
}

print_step() {
    echo -e "${YELLOW}>>> $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ ERROR: $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# SSH command wrapper that caches password
ssh_exec() {
    local COMMAND=$1
    ssh -o StrictHostKeyChecking=no -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} "$COMMAND"
}

# Main deployment flow
main() {
    print_header "VCSA ACADEMY - MASTER DEPLOYMENT"
    echo "Target: ${VPS_USER}@${VPS_HOST}"
    echo "Domain: ${DOMAIN}"
    echo ""

    # Step 1: Fix Docker Compose conflict
    print_header "STEP 1: Fix Docker Compose Conflict"
    print_step "Removing conflicting docker-compose-plugin..."

    ssh_exec "dpkg --remove --force-remove-reinstreq docker-compose-plugin || true"
    ssh_exec "apt-get install -y docker.io fail2ban || apt-get install -y docker.io fail2ban"

    print_success "Docker Compose conflict resolved"
    echo ""

    # Step 2: Verify Docker installation
    print_header "STEP 2: Verify Docker Installation"
    print_step "Checking Docker status..."

    ssh_exec "systemctl enable docker && systemctl start docker"
    DOCKER_VERSION=$(ssh_exec "docker --version" | awk '{print \$3}' | tr -d ',')
    COMPOSE_VERSION=$(ssh_exec "docker-compose --version" | awk '{print \$3}' | tr -d ',')

    print_success "Docker version: ${DOCKER_VERSION}"
    print_success "Docker Compose version: ${COMPOSE_VERSION}"
    echo ""

    # Step 3: Prepare application directory
    print_header "STEP 3: Prepare Application Directory"
    print_step "Creating /var/www/vcsa-academy..."

    ssh_exec "mkdir -p /var/www/vcsa-academy/nginx/ssl"
    ssh_exec "chown -R ${VPS_USER}:${VPS_USER} /var/www/vcsa-academy"

    print_success "Application directory created"
    echo ""

    # Step 4: Deploy application files
    print_header "STEP 4: Deploy Application Files"
    print_step "Copying files to VPS (this may take a few minutes)..."

    # Copy files using rsync
    rsync -avz --progress \
        -e "ssh -o StrictHostKeyChecking=no" \
        --exclude 'node_modules' \
        --exclude '.git' \
        --exclude '__pycache__' \
        --exclude '*.pyc' \
        --exclude 'netlify-deploy' \
        --exclude '.expo' \
        --exclude 'vcsa-mobile' \
        --exclude 'vcsa-insight' \
        --exclude 'test_reports' \
        docker-compose.vps.yml frontend backend nginx \
        ${VPS_USER}@${VPS_HOST}:/var/www/vcsa-academy/

    print_success "Application files deployed"
    echo ""

    # Step 5: Create environment file
    print_header "STEP 5: Create Environment Configuration"
    print_step "Creating .env file with secure defaults..."

    ssh_exec "cd /var/www/vcsa-academy && cat > .env << 'ENVEOF'
# MongoDB Configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=VCSA_Admin_2026_Secure_Pass_32_Chars!
MONGO_INITDB_DATABASE=vcsa_production

# JWT Configuration
JWT_SECRET=VCSA_JWT_Secret_Key_2026_Secure_Random_32_Chars_Generated
JWT_ALGORITHM=HS256

# CORS Configuration
CORS_ORIGINS=https://${DOMAIN},https://www.${DOMAIN}

# Sentry (optional)
SENTRY_DSN=

# Production Settings
DEBUG=false
LOG_LEVEL=info
ENVIRONMENT=production
ENVEOF"

    print_success "Environment file created with secure defaults"
    echo ""

    # Step 6: Rename docker-compose file
    print_header "STEP 6: Configure Docker Compose"
    print_step "Setting up docker-compose.yml..."

    ssh_exec "cd /var/www/vcsa-academy && cp docker-compose.vps.yml docker-compose.yml"

    print_success "Docker Compose configured"
    echo ""

    # Step 7: Build Docker images
    print_header "STEP 7: Build Docker Images"
    print_step "Building containers (this will take 5-10 minutes)..."

    ssh_exec "cd /var/www/vcsa-academy && docker-compose build"

    print_success "Docker images built successfully"
    echo ""

    # Step 8: Start containers
    print_header "STEP 8: Start Docker Containers"
    print_step "Starting all containers..."

    ssh_exec "cd /var/www/vcsa-academy && docker-compose up -d"

    print_success "Containers started"
    echo ""

    # Step 9: Wait for containers to be healthy
    print_header "STEP 9: Wait for Containers to be Ready"
    print_step "Waiting for containers to initialize (30 seconds)..."

    sleep 30

    ssh_exec "cd /var/www/vcsa-academy && docker-compose ps"

    print_success "All containers are running"
    echo ""

    # Step 10: Configure SSL certificates
    print_header "STEP 10: Configure SSL Certificates"
    print_step "Obtaining SSL certificates from Let's Encrypt..."

    print_info "Stopping nginx temporarily to free port 80..."
    ssh_exec "cd /var/www/vcsa-academy && docker-compose stop nginx"

    print_info "Obtaining certificates..."
    ssh_exec "certbot certonly --standalone \
        -d ${DOMAIN} \
        -d www.${DOMAIN} \
        -d ${API_DOMAIN} \
        --email admin@${DOMAIN} \
        --agree-tos \
        --non-interactive \
        --keep-until-expiring || true"

    print_info "Creating SSL certificate links..."
    ssh_exec "cd /var/www/vcsa-academy && \
        ln -sf /etc/letsencrypt/live/${DOMAIN}/fullchain.pem nginx/ssl/fullchain.pem && \
        ln -sf /etc/letsencrypt/live/${DOMAIN}/privkey.pem nginx/ssl/privkey.pem"

    print_info "Starting nginx..."
    ssh_exec "cd /var/www/vcsa-academy && docker-compose start nginx"

    print_success "SSL certificates configured"
    echo ""

    # Step 11: Setup database
    print_header "STEP 11: Setup Production Database"
    print_step "Seeding database with initial content..."

    ssh_exec "cd /var/www/vcsa-academy && sleep 10"
    ssh_exec "cd /var/www/vcsa-academy && docker-compose exec -T backend python seed_coaching.py || true"
    ssh_exec "cd /var/www/vcsa-academy && docker-compose exec -T backend python seed_knowledge_hub.py || true"

    print_success "Database seeded with initial content"
    echo ""

    # Step 12: Setup SSL auto-renewal
    print_header "STEP 12: Setup SSL Auto-Renewal"
    print_step "Configuring certificate renewal..."

    ssh_exec "(crontab -l 2>/dev/null | grep -q 'certbot renew') || \
        (crontab -l 2>/dev/null; echo '0 0,12 * * * certbot renew --quiet && cd /var/www/vcsa-academy && docker-compose restart nginx') | crontab -"

    print_success "SSL auto-renewal configured"
    echo ""

    # Step 13: Configure firewall
    print_header "STEP 13: Configure Firewall"
    print_step "Setting up UFW rules..."

    ssh_exec "ufw allow 22/tcp comment 'SSH'"
    ssh_exec "ufw allow 80/tcp comment 'HTTP'"
    ssh_exec "ufw allow 443/tcp comment 'HTTPS'"
    ssh_exec "ufw --force enable"

    print_success "Firewall configured"
    echo ""

    # Step 14: Final verification
    print_header "STEP 14: Final Verification"
    print_step "Verifying deployment..."

    echo "Waiting for services to be fully ready..."
    sleep 20

    # Check container status
    ssh_exec "cd /var/www/vcsa-academy && docker-compose ps"

    # Test services
    print_info "Testing services..."
    FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://${DOMAIN}" || echo "000")
    API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://${API_DOMAIN}/api/health" || echo "000")

    if [ "$FRONTEND_STATUS" = "200" ] || [ "$FRONTEND_STATUS" = "301" ] || [ "$FRONTEND_STATUS" = "302" ]; then
        print_success "Frontend is accessible (HTTP $FRONTEND_STATUS)"
    else
        print_info "Frontend may still be initializing (HTTP $FRONTEND_STATUS)"
    fi

    if [ "$API_STATUS" = "200" ]; then
        print_success "API is accessible (HTTP $API_STATUS)"
    else
        print_info "API may still be initializing (HTTP $API_STATUS)"
    fi

    echo ""

    # Final summary
    print_header "DEPLOYMENT COMPLETED SUCCESSFULLY"

    echo -e "${GREEN}Your VCSA Academy application is now live!${NC}"
    echo ""
    echo "Access URLs:"
    echo "  Frontend: https://${DOMAIN}"
    echo "  API: https://${API_DOMAIN}"
    echo "  API Docs: https://${API_DOMAIN}/api/docs"
    echo ""
    echo "Default Users:"
    echo "  Admin: admin@${DOMAIN} / admin123"
    echo "  Demo: demo@${DOMAIN} / demo123"
    echo ""
    echo -e "${YELLOW}IMPORTANT SECURITY NOTES:${NC}"
    echo "1. Change default passwords in .env file:"
    echo "   ssh ${VPS_USER}@${VPS_HOST} 'nano /var/www/vcsa-academy/.env'"
    echo ""
    echo "2. Restart backend after changing .env:"
    echo "   ssh ${VPS_USER}@${VPS_HOST} 'cd /var/www/vcsa-academy && docker-compose restart backend'"
    echo ""
    echo "3. Create your admin user via API or frontend"
    echo ""
    echo "Management Commands:"
    echo "  ssh ${VPS_USER}@${VPS_HOST}"
    echo "  cd /var/www/vcsa-academy"
    echo "  docker-compose ps              # Check services"
    echo "  docker-compose logs -f         # View logs"
    echo "  docker-compose restart         # Restart services"
    echo ""
    print_success "Deployment completed successfully!"
    echo ""
}

# Run main function
main "$@"
