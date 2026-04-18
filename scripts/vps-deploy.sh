#!/bin/bash

################################################################################
# VPS Deployment Script for VCSA
################################################################################
# This script deploys VCSA to a new VPS with Docker on Ubuntu
################################################################################

set -e  # Exit on error
set -o pipefail  # Exit on pipe failure

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
VPS_HOST="${VPS_HOST:-}"
VPS_USER="${VPS_USER:-root}"
VPS_PORT="${VPS_PORT:-22}"
PROJECT_NAME="vcsavibes"
REMOTE_DIR="/opt/${PROJECT_NAME}"
BRANCH="${BRANCH:-sprint-4-planning}"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    log_info "Checking local requirements..."

    # Check if SSH is available
    if ! command -v ssh &> /dev/null; then
        log_error "SSH is not installed. Install with: sudo apt-get install openssh-client"
        exit 1
    fi

    # Check if rsync is available
    if ! command -v rsync &> /dev/null; then
        log_error "rsync is not installed. Install with: sudo apt-get install rsync"
        exit 1
    fi

    # Check if VPS_HOST is set
    if [ -z "$VPS_HOST" ]; then
        log_error "VPS_HOST environment variable is not set"
        echo "Usage: VPS_HOST=your.vps.ip ./scripts/vps-deploy.sh"
        exit 1
    fi

    log_success "All requirements met"
}

test_ssh_connection() {
    log_info "Testing SSH connection to ${VPS_USER}@${VPS_HOST}:${VPS_PORT}..."

    if ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} "echo 'SSH connection successful'" > /dev/null 2>&1; then
        log_success "SSH connection successful"
    else
        log_error "Cannot connect to VPS via SSH"
        echo "Please ensure:"
        echo "  - VPS is accessible at ${VPS_HOST}:${VPS_PORT}"
        echo "  - SSH keys are properly configured"
        echo "  - Firewall allows SSH connections"
        exit 1
    fi
}

setup_vps() {
    log_info "Setting up VPS environment..."

    ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
set -e

# Update system
echo "Updating system packages..."
apt-get update -qq
apt-get upgrade -y -qq

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker $USER
    rm get-docker.sh
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Create project directory
mkdir -p /opt/vcsavibes
mkdir -p /opt/vcsavibes/logs
mkdir -p /opt/vcsavibes/backups
mkdir -p /opt/vcsavibes/ssl

# Set up firewall (UFW)
echo "Configuring firewall..."
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 8000/tcp

# Install monitoring tools
echo "Installing monitoring tools..."
apt-get install -y htop nano fail2ban ufw

# Configure fail2ban
systemctl enable fail2ban
systemctl start fail2ban

echo "VPS setup complete"
ENDSSH

    log_success "VPS setup complete"
}

deploy_code() {
    log_info "Deploying code to VPS..."

    # Create remote directory structure
    ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} "mkdir -p ${REMOTE_DIR}/{logs,backups,ssl}"

    # Copy files using rsync
    log_info "Transferring files..."
    rsync -avz --progress \
        --exclude 'node_modules' \
        --exclude '.git' \
        --exclude '__pycache__' \
        --exclude '*.pyc' \
        --exclude '.pytest_cache' \
        --exclude 'frontend/build' \
        --exclude 'logs/*' \
        --exclude 'backups/*' \
        --exclude '.env' \
        -e "ssh -p ${VPS_PORT}" \
        ./ ${VPS_USER}@${VPS_HOST}:${REMOTE_DIR}/

    # Copy environment template if it doesn't exist
    ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} << ENDSSH
cd ${REMOTE_DIR}
if [ ! -f .env ]; then
    echo "Creating .env from template..."
    cp .env.example .env 2>/dev/null || echo "# VCSA Environment Variables" > .env
fi
ENDSSH

    log_success "Code deployment complete"
}

setup_environment() {
    log_info "Setting up environment variables..."

    cat << EOF

═══════════════════════════════════════════════════════
⚠️  ACTION REQUIRED: Configure Environment Variables
═══════════════════════════════════════════════════════

Please SSH into your VPS and configure the environment:

    ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST}
    cd ${REMOTE_DIR}
    nano .env

Required variables:
    - MONGO_URL: MongoDB connection string
    - DB_NAME: Database name (vcsa)
    - JWT_SECRET: Secret key for JWT tokens
    - STRIPE_API_KEY: Stripe API key
    - STRIPE_WEBHOOK_SECRET: Stripe webhook secret
    - GOOGLE_OAUTH_CLIENT_ID: Google OAuth client ID
    - GOOGLE_OAUTH_CLIENT_SECRET: Google OAuth client secret
    - SENTRY_DSN: Sentry DSN (optional)

═══════════════════════════════════════════════════════

EOF

    read -p "Press Enter after configuring .env file..."
}

install_dependencies() {
    log_info "Installing dependencies..."

    ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} << ENDSSH
cd ${REMOTE_DIR}

# Build Docker images
echo "Building Docker images..."
docker-compose build --no-cache

# Pull latest images
echo "Pulling latest images..."
docker-compose pull

ENDSSH

    log_success "Dependencies installed"
}

setup_ssl() {
    log_info "Setting up SSL certificates..."

    read -p "Do you want to set up SSL with Let's Encrypt? (y/n): " setup_ssl

    if [ "$setup_ssl" = "y" ]; then
        read -p "Enter your domain name: " domain_name

        ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} << ENDSSH
cd ${REMOTE_DIR}

# Install certbot
apt-get install -y certbot python3-certbot-nginx

# Generate SSL certificate
certbot certonly --standalone -d ${domain_name} --email admin@${domain_name} --agree-tos --non-interactive

# Copy certificates to SSL directory
cp /etc/letsencrypt/live/${domain_name}/fullchain.pem ${REMOTE_DIR}/ssl/
cp /etc/letsencrypt/live/${domain_name}/privkey.pem ${REMOTE_DIR}/ssl/
chmod 644 ${REMOTE_DIR}/ssl/*.pem

ENDSSH

        log_success "SSL certificates installed"
    else
        log_warning "Skipping SSL setup. You can configure it later."
    fi
}

start_services() {
    log_info "Starting services..."

    ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} << ENDSSH
cd ${REMOTE_DIR}

# Stop any existing containers
docker-compose down 2>/dev/null || true

# Start services
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 15

# Check service status
echo "Checking service status..."
docker-compose ps

ENDSSH

    log_success "Services started"
}

verify_deployment() {
    log_info "Verifying deployment..."

    # Check if services are running
    ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} << ENDSSH
cd ${REMOTE_DIR}

# Check container status
echo "Container Status:"
docker-compose ps

# Check logs
echo -e "\nRecent Logs:"
docker-compose logs --tail=20

# Health check
echo -e "\nPerforming health check..."
sleep 5

if curl -f http://localhost:8000/api/health > /dev/null 2>&1; then
    echo "✅ Backend health check: OK"
else
    echo "❌ Backend health check: FAILED"
fi

if curl -f http://localhost/ > /dev/null 2>&1; then
    echo "✅ Frontend health check: OK"
else
    echo "❌ Frontend health check: FAILED"
fi

ENDSSH

    log_success "Deployment verification complete"
}

display_access_info() {
    cat << EOF

═══════════════════════════════════════════════════════
✅ DEPLOYMENT SUCCESSFUL
═══════════════════════════════════════════════════════

🌐 Access Information:
    Frontend:  http://${VPS_HOST}
    Backend:   http://${VPS_HOST}:8000
    API Docs:  http://${VPS_HOST}:8000/docs

📊 Monitoring:
    Logs: ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} "cd ${REMOTE_DIR} && docker-compose logs -f"
    Status: ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} "cd ${REMOTE_DIR} && docker-compose ps"

🔧 Management:
    Stop: ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} "cd ${REMOTE_DIR} && docker-compose stop"
    Start: ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} "cd ${REMOTE_DIR} && docker-compose start"
    Restart: ssh -p ${VPS_PORT} ${VPS_USER}@${VPS_HOST} "cd ${REMOTE_DIR} && docker-compose restart"

💚 Next Steps:
    1. Configure SSL certificates
    2. Set up domain name
    3. Configure monitoring
    4. Set up backups

═══════════════════════════════════════════════════════

EOF
}

# Main deployment flow
main() {
    cat << "EOF"

╔══════════════════════════════════════════════════════════╗
║        VCSA VPS Deployment Script                         ║
║        Deploy to Ubuntu VPS with Docker                   ║
╚══════════════════════════════════════════════════════════╝

EOF

    check_requirements
    test_ssh_connection

    echo "This will deploy VCSA to your VPS at ${VPS_HOST}"
    read -p "Continue? (y/n): " confirm

    if [ "$confirm" != "y" ]; then
        log_info "Deployment cancelled"
        exit 0
    fi

    setup_vps
    deploy_code
    setup_environment
    install_dependencies
    setup_ssl
    start_services
    verify_deployment
    display_access_info
}

# Run main function
main "$@"
