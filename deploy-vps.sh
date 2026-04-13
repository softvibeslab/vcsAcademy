#!/bin/bash

###############################################################################
# VCSA Academy - VPS Deployment Script
# Provider: Hostinger VPS
# Domain: salesmastersminds.com
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
VPS_USER="${VPS_USER:-root}"
VPS_HOST="${VPS_HOST}"
VPS_PORT="${VPS_PORT:-22}"
DOMAIN="salesmastersminds.com"
API_DOMAIN="api.salesmastersminds.com"

# Functions
print_header() {
    echo -e "${GREEN}================================================================${NC}"
    echo -e "${GREEN}  $1${NC}"
    echo -e "${GREEN}================================================================${NC}"
}

print_step() {
    echo -e "${YELLOW}>>> $1${NC}"
}

print_error() {
    echo -e "${RED}ERROR: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Check required variables
check_requirements() {
    print_step "Checking requirements..."

    if [ -z "$VPS_HOST" ]; then
        print_error "VPS_HOST environment variable is required"
        echo "Usage: VPS_HOST=your-vps-ip ./deploy-vps.sh"
        exit 1
    fi

    if ! command -v ssh &> /dev/null; then
        print_error "ssh command not found"
        exit 1
    fi

    if ! command -v rsync &> /dev/null; then
        print_error "rsync command not found"
        exit 1
    fi

    print_success "All requirements met"
}

# Test SSH connection
test_ssh_connection() {
    print_step "Testing SSH connection to ${VPS_USER}@${VPS_HOST}..."

    if ssh -o ConnectTimeout=10 -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} "echo 'Connection successful'" > /dev/null 2>&1; then
        print_success "SSH connection successful"
    else
        print_error "Cannot connect to VPS. Please check:"
        echo "  - VPS IP address is correct"
        echo "  - SSH port is correct (default: 22)"
        echo "  - SSH keys are configured or password auth available"
        exit 1
    fi
}

# Prepare VPS environment
prepare_vps() {
    print_step "Preparing VPS environment..."

    ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
        set -e

        echo "Updating system packages..."
        apt-get update && apt-get upgrade -y

        echo "Installing required packages..."
        apt-get install -y \
            curl \
            wget \
            git \
            ufw \
            fail2ban \
            certbot \
            python3-certbot-nginx \
            docker.io \
            docker-compose \
            nginx

        echo "Configuring firewall..."
        ufw allow 22/tcp comment 'SSH'
        ufw allow 80/tcp comment 'HTTP'
        ufw allow 443/tcp comment 'HTTPS'
        ufw --force enable

        echo "Adding user to docker group..."
        usermod -aG docker $USER || true

        echo "Enabling services..."
        systemctl enable docker
        systemctl enable nginx
        systemctl start docker

        echo "Creating application directory..."
        mkdir -p /var/www/vcsa-academy
        chown -R $USER:$USER /var/www/vcsa-academy

        echo "VPS preparation completed"
ENDSSH

    print_success "VPS environment prepared"
}

# Deploy application files
deploy_files() {
    print_step "Deploying application files to VPS..."

    # Create temporary directory for deployment
    TEMP_DIR=$(mktemp -d)
    echo "Using temporary directory: $TEMP_DIR"

    # Prepare files for deployment
    mkdir -p "$TEMP_DIR/nginx"
    mkdir -p "$TEMP_DIR/backend"

    # Copy necessary files
    cp docker-compose.vps.yml "$TEMP_DIR/docker-compose.yml"
    cp nginx/nginx.conf "$TEMP_DIR/nginx/"
    cp -r frontend "$TEMP_DIR/"
    cp -r backend/* "$TEMP_DIR/backend/"

    # Create .env file template
    cat > "$TEMP_DIR/.env" << 'ENVEOF'
# MongoDB Configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=CHANGE_THIS_PASSWORD_NOW
MONGO_INITDB_DATABASE=vcsa_production

# JWT Configuration
JWT_SECRET=CHANGE_THIS_SECRET_KEY_NOW

# CORS Configuration
CORS_ORIGINS=https://salesmastersminds.com,https://www.salesmastersminds.com

# Sentry (optional)
SENTRY_DSN=
ENVEOF

    # Copy files to VPS
    rsync -avz --delete \
        -e "ssh -p ${VPS_PORT}" \
        "$TEMP_DIR/" \
        ${VPS_USER}@${VPS_HOST}:/var/www/vcsa-academy/

    # Cleanup
    rm -rf "$TEMP_DIR"

    print_success "Application files deployed"
}

# Configure SSL certificates
configure_ssl() {
    print_step "Configuring SSL certificates with Let's Encrypt..."

    ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} << ENDSSH
        set -e

        cd /var/www/vcsa-academy

        # Create nginx ssl directory
        mkdir -p nginx/ssl

        # Stop nginx if running to free up port 80
        systemctl stop nginx || true

        # Obtain SSL certificate
        certbot certonly --standalone \
            -d ${DOMAIN} \
            -d www.${DOMAIN} \
            -d ${API_DOMAIN} \
            --email admin@${DOMAIN} \
            --agree-tos \
            --non-interactive \
            --keep-until-expiring

        # Setup certificate renewal
        (crontab -l 2>/dev/null | grep -q "certbot renew") || \
            (crontab -l 2>/dev/null; echo "0 0,12 * * * certbot renew --quiet && docker-compose -f /var/www/vcsa-academy/docker-compose.yml restart nginx") | crontab -

        echo "SSL certificates configured"
ENDSSH

    print_success "SSL certificates configured"
}

# Setup SSL certificate links
setup_ssl_links() {
    print_step "Setting up SSL certificate links..."

    ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} << ENDSSH
        set -e

        cd /var/www/vcsa-academy

        # Create symbolic links to Let's Encrypt certificates
        ln -sf /etc/letsencrypt/live/${DOMAIN}/fullchain.pem nginx/ssl/fullchain.pem
        ln -sf /etc/letsencrypt/live/${DOMAIN}/privkey.pem nginx/ssl/privkey.pem

        echo "SSL certificate links created"
ENDSSH

    print_success "SSL certificate links created"
}

# Build and start containers
build_and_start() {
    print_step "Building and starting Docker containers..."

    ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} << ENDSSH
        set -e

        cd /var/www/vcsa-academy

        # Build containers
        echo "Building Docker images..."
        docker-compose build

        # Start containers
        echo "Starting containers..."
        docker-compose up -d

        # Wait for containers to be healthy
        echo "Waiting for containers to be ready..."
        sleep 15

        # Check container status
        docker-compose ps

        echo "Containers started successfully"
ENDSSH

    print_success "Docker containers built and started"
}

# Setup database
setup_database() {
    print_step "Setting up production database..."

    ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} << ENDSSH
        set -e

        cd /var/www/vcsa-academy

        # Seed initial data
        echo "Seeding database with initial data..."
        docker-compose exec -T backend python seed_coaching.py || true
        docker-compose exec -T backend python seed_knowledge_hub.py || true

        echo "Database setup completed"
ENDSSH

    print_success "Database setup completed"
}

# Verify deployment
verify_deployment() {
    print_step "Verifying deployment..."

    # Wait for services to be ready
    echo "Waiting for services to start..."
    sleep 20

    # Check frontend
    if curl -s -o /dev/null -w "%{http_code}" "https://${DOMAIN}" | grep -q "200\|301\|302"; then
        print_success "Frontend is accessible at https://${DOMAIN}"
    else
        print_error "Frontend is not accessible"
    fi

    # Check API
    if curl -s -o /dev/null -w "%{http_code}" "https://${API_DOMAIN}/api/health" | grep -q "200"; then
        print_success "API is accessible at https://${API_DOMAIN}"
    else
        print_error "API is not accessible"
    fi

    echo "Checking container status..."
    ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} "docker-compose -f /var/www/vcsa-academy/docker-compose.yml ps"
}

# Main deployment flow
main() {
    print_header "VCSA Academy VPS Deployment"

    check_requirements
    test_ssh_connection

    read -p "Do you want to prepare the VPS environment? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        prepare_vps
    fi

    deploy_files

    read -p "Do you want to configure SSL certificates? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        configure_ssl
        setup_ssl_links
    fi

    build_and_start
    setup_database
    verify_deployment

    print_header "Deployment Completed Successfully"

    echo "Your application is now deployed at:"
    echo "  Frontend: https://${DOMAIN}"
    echo "  API: https://${API_DOMAIN}"
    echo "  API Docs: https://${API_DOMAIN}/api/docs"

    echo ""
    echo "Next steps:"
    echo "  1. Update your domain DNS to point to VPS IP"
    echo "  2. Wait for DNS propagation (can take up to 24-48 hours)"
    echo "  3. Update .env file with secure passwords and secrets"
    echo "  4. Create admin user via API"
    echo "  5. Setup monitoring and backups"

    echo ""
    echo "To manage your deployment:"
    echo "  ssh ${VPS_USER}@${VPS_HOST}"
    echo "  cd /var/www/vcsa-academy"
    echo "  docker-compose ps"
    echo "  docker-compose logs -f"
}

# Run main function
main "$@"
