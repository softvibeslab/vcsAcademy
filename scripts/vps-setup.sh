#!/bin/bash

################################################################################
# VPS Initial Setup Script for Ubuntu
################################################################################
# This script prepares a fresh Ubuntu VPS for VCSA deployment
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    log_error "Please run as root"
    exit 1
fi

log_info "Starting VPS setup for VCSA..."

# Update system
log_info "Updating system packages..."
apt-get update -qq
apt-get upgrade -y -qq

# Install basic utilities
log_info "Installing basic utilities..."
apt-get install -y \
    curl \
    wget \
    git \
    nano \
    vim \
    htop \
    net-tools \
    tree \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release

# Install Docker
log_info "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker $USER
    rm get-docker.sh
    log_success "Docker installed"
else
    log_info "Docker already installed"
fi

# Install Docker Compose
log_info "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
    curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" \
        -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    log_success "Docker Compose installed"
else
    log_info "Docker Compose already installed"
fi

# Configure firewall
log_info "Configuring firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw allow 8000/tcp comment 'Backend API'
ufw --force enable
log_success "Firewall configured"

# Install and configure fail2ban
log_info "Installing fail2ban..."
apt-get install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban

# Create fail2ban jail configuration
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 7200

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
EOF

systemctl restart fail2ban
log_success "fail2ban configured"

# Install monitoring tools
log_info "Installing monitoring tools..."
apt-get install -y \
    sysstat \
    iotop \
    nethogs \
    ncdu

systemctl enable sysstat
systemctl start sysstat

# Create project directory
log_info "Creating project directory..."
mkdir -p /opt/vcsavibes/{logs,backups,ssl,scripts}
log_success "Project directory created"

# Set up automatic security updates
log_info "Configuring automatic security updates..."
apt-get install -y unattended-upgrades
cat > /etc/apt/apt.conf.d/50unattended-upgrades << 'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}";
    "${distro_id}:${distro_codename}-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Automatic-Reboot-Time "02:00";
EOF

cat > /etc/apt/apt.conf.d/20auto-upgrades << 'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
APT::Periodic::Unattended-Upgrade "1";
EOF

log_success "Automatic updates configured"

# Configure system limits
log_info "Configuring system limits..."
cat >> /etc/sysctl.conf << 'EOF'

# VCSA Optimization
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 8192
net.ipv4.ip_local_port_range = 1024 65535
fs.file-max = 2097152
EOF

sysctl -p

# Configure limits for containers
cat > /etc/security/limits.conf << 'EOF'
* soft nofile 65536
* hard nofile 65536
* soft nproc 65536
* hard nproc 65536
EOF

log_success "System limits configured"

# Install Certbot for SSL
log_info "Installing Certbot..."
apt-get install -y certbot python3-certbot-nginx
log_success "Certbot installed"

# Create backup script
log_info "Creating backup script..."
cat > /opt/vcsavibes/scripts/backup.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/opt/vcsavibes/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Database backup
echo "Starting database backup..."
docker-compose -f /opt/vcsavibes/docker-compose.yml exec -T mongo mongodump --out /tmp/backup 2>/dev/null || true
if [ -d /tmp/backup ]; then
    tar -czf $BACKUP_DIR/mongo_$DATE.tar.gz -C /tmp backup 2>/dev/null || true
    rm -rf /tmp/backup
    echo "Database backup completed: mongo_$DATE.tar.gz"
else
    echo "Warning: Database backup failed - container may not be running yet"
fi

# Clean old backups
find $BACKUP_DIR -name "mongo_*.tar.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true

echo "Backup completed. Keeping last $RETENTION_DAYS days."
EOF

chmod +x /opt/vcsavibes/scripts/backup.sh

# Setup backup cron job
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/vcsavibes/scripts/backup.sh >> /opt/vcsavibes/logs/backup.log 2>&1") | crontab -

log_success "Backup script created and scheduled"

# Create health check script
log_info "Creating health check script..."
cat > /opt/vcsavibes/scripts/health-check.sh << 'EOF'
#!/bin/bash

LOG_FILE="/opt/vcsavibes/logs/health-check.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting health check..." >> $LOG_FILE

# Backend health check
if curl -f -s http://localhost:8000/api/health > /dev/null 2>&1; then
    echo "[$DATE] Backend: OK" >> $LOG_FILE
else
    echo "[$DATE] Backend: FAILED" >> $LOG_FILE
fi

# Frontend health check
if curl -f -s http://localhost/ > /dev/null 2>&1; then
    echo "[$DATE] Frontend: OK" >> $LOG_FILE
else
    echo "[$DATE] Frontend: FAILED" >> $LOG_FILE
fi

# Database health check
if docker ps | grep -q mongo; then
    echo "[$DATE] Database: OK" >> $LOG_FILE
else
    echo "[$DATE] Database: FAILED" >> $LOG_FILE
fi

echo "[$DATE] Health check completed" >> $LOG_FILE
EOF

chmod +x /opt/vcsavibes/scripts/health-check.sh

# Setup health check cron job (every 5 minutes)
(crontab -l 2>/dev/null; echo "*/5 * * * * /opt/vcsavibes/scripts/health-check.sh") | crontab -

log_success "Health check script created and scheduled"

# Create log rotation configuration
log_info "Configuring log rotation..."
cat > /etc/logrotate.d/vcsavibes << 'EOF'
/opt/vcsavibes/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 root root
    sharedscripts
}
EOF

log_success "Log rotation configured"

# Display installation summary
cat << 'EOF'

╔══════════════════════════════════════════════════════════╗
║         VPS Setup Complete ✅                            ║
╚══════════════════════════════════════════════════════════╝

📊 Installed Components:
   ✅ Docker
   ✅ Docker Compose
   ✅ Firewall (UFW)
   ✅ Fail2ban
   ✅ Certbot
   ✅ Automatic Updates
   ✅ Backup Scripts
   ✅ Health Monitoring

📁 Directory Structure:
   /opt/vcsavibes/
   ├── logs/           # Application logs
   ├── backups/        # Database backups
   ├── ssl/            # SSL certificates
   └── scripts/        # Management scripts

🔧 Firewall Rules:
   SSH (22):     ✅ Allowed
   HTTP (80):    ✅ Allowed
   HTTPS (443):  ✅ Allowed
   API (8000):   ✅ Allowed

📅 Scheduled Tasks:
   - Health checks: Every 5 minutes
   - Backups: Daily at 2:00 AM
   - Security updates: Automatic

🎯 Next Steps:
   1. Deploy VCSA code: ./scripts/vps-deploy.sh
   2. Configure SSL: certbot certonly --standalone -d your-domain.com
   3. Set up domain: Point DNS to this VPS

EOF

log_success "VPS setup completed successfully!"
