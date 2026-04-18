# 🚀 VPS Deployment Guide for VCSA

**Version**: 1.0.0
**Last Updated**: April 2026
**Status**: Production Ready
**Target OS**: Ubuntu 22.04 LTS with Docker

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start Deployment](#quick-start-deployment)
4. [Manual Setup](#manual-setup)
5. [Configuration](#configuration)
6. [SSL Setup](#ssl-setup)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)
9. [Security Hardening](#security-hardening)
10. [Backup & Recovery](#backup--recovery)

---

## Overview

This guide explains how to deploy VCSA to a new VPS (Virtual Private Server) running Ubuntu with Docker. The deployment includes:

- ✅ Automated Docker installation
- ✅ Docker Compose setup
- ✅ Firewall configuration
- ✅ SSL certificate support
- ✅ Automated deployment script
- ✅ Health checks and monitoring

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      VPS Server                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Nginx      │  │   Backend    │  │  MongoDB     │  │
│  │   :80/:443   │  │   :8000      │  │  :27017      │  │
│  │  (Frontend)  │  │  (FastAPI)   │  │  (Database)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Prerequisites

### Local Machine

- SSH client installed
- Git installed
- rsync installed
- Access to VCSA repository

### VPS Requirements

- **OS**: Ubuntu 22.04 LTS (recommended) or 20.04 LTS
- **RAM**: Minimum 2GB (recommended 4GB)
- **Storage**: Minimum 20GB (recommended 40GB+)
- **CPU**: Minimum 2 cores (recommended 4 cores)
- **Network**: Public IP with SSH access

### VPS Provider Recommendations

- **DigitalOcean**: $24/month (4GB RAM, 2 CPU, 80GB SSD)
- **Linode**: $20/month (4GB RAM, 2 CPU, 80GB SSD)
- **AWS EC2**: t3.medium (~$30/month)
- **Vultr**: $20/month (4GB RAM, 2 CPU, 75GB SSD)

---

## Quick Start Deployment

### 1. Prepare Your VPS

**Create VPS**:
- Choose Ubuntu 22.04 LTS
- Select recommended specifications
- Enable SSH key authentication
- Note the public IP address

### 2. Configure SSH Access

**On your local machine**, generate SSH key if you don't have one:

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

**Copy SSH key to VPS**:

```bash
ssh-copy-id root@YOUR_VPS_IP
```

**Test SSH connection**:

```bash
ssh root@YOUR_VPS_IP
```

### 3. Deploy VCSA

**On your local machine**, navigate to VCSA repository:

```bash
cd /path/to/Vcsa-
```

**Run the deployment script**:

```bash
# Set your VPS IP
export VPS_HOST=YOUR_VPS_IP

# Optional: Set custom SSH port (default: 22)
export VPS_PORT=22

# Optional: Set SSH user (default: root)
export VPS_USER=root

# Run deployment
./scripts/vps-deploy.sh
```

### 4. Configure Environment Variables

**SSH into your VPS**:

```bash
ssh root@YOUR_VPS_IP
cd /opt/vcsavibes
```

**Edit environment file**:

```bash
nano .env
```

**Add required variables**:

```bash
# MongoDB Configuration
MONGO_URL=mongodb://mongo:27017
DB_NAME=vcsa

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this

# Stripe Configuration
STRIPE_API_KEY=sk_test_your_stripe_api_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Google OAuth
GOOGLE_OAUTH_CLIENT_ID=your_oauth_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_oauth_client_secret

# Frontend Configuration
REACT_APP_BACKEND_URL=https://your-domain.com

# Sentry (Optional)
SENTRY_DSN=your-sentry-dsn

# Environment
NODE_ENV=production
```

### 5. Restart Services

```bash
docker-compose restart
```

### 6. Verify Deployment

**Check service status**:

```bash
docker-compose ps
```

**Check logs**:

```bash
docker-compose logs -f
```

**Test API**:

```bash
curl http://localhost:8000/api/health
```

---

## Manual Setup

If you prefer manual setup instead of the automated script:

### 1. Initial Server Setup

```bash
# SSH into your VPS
ssh root@YOUR_VPS_IP

# Update system
apt-get update && apt-get upgrade -y

# Install basic tools
apt-get install -y curl git nano ufw fail2ban htop

# Configure firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 8000/tcp
ufw --force enable
```

### 2. Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 3. Create Project Directory

```bash
mkdir -p /opt/vcsavibes/{logs,backups,ssl}
cd /opt/vcsavibes
```

### 4. Clone Repository

```bash
# Option 1: Using Git (if you have access)
git clone https://github.com/your-org/Vcsa-.git .

# Option 2: Upload from local machine
# On your local machine:
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '__pycache__' \
    --exclude '*.pyc' \
    --exclude 'frontend/build' \
    --exclude 'logs/*' \
    --exclude 'backups/*' \
    ./ root@YOUR_VPS_IP:/opt/vcsavibes/
```

### 5. Configure Environment

```bash
cd /opt/vcsavibes
cp .env.example .env
nano .env
# Add your configuration
```

### 6. Build and Start Services

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

---

## Configuration

### Environment Variables

Create `/opt/vcsavibes/.env`:

```bash
# Database
MONGO_URL=mongodb://mongo:27017
DB_NAME=vcsa

# JWT
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15

# Stripe
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# Google OAuth
GOOGLE_OAUTH_CLIENT_ID=your-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-client-secret

# Frontend
REACT_APP_BACKEND_URL=https://your-domain.com

# Sentry (Optional)
SENTRY_DSN=https://...

# Environment
NODE_ENV=production
DEBUG=false
```

### Docker Compose Override

Create `/opt/vcsavibes/docker-compose.override.yml` for production:

```yaml
version: '3.8'

services:
  backend:
    restart: always
    environment:
      - NODE_ENV=production
    volumes:
      - ./logs:/app/logs

  frontend:
    restart: always

  mongo:
    restart: always
    volumes:
      - mongo-data:/data/db
      - ./backups:/backups

volumes:
  mongo-data:
```

---

## SSL Setup

### Option 1: Let's Encrypt (Free)

```bash
# Install Certbot
apt-get install -y certbot python3-certbot-nginx

# Generate certificate
certbot certonly --standalone \
  -d your-domain.com \
  --email admin@your-domain.com \
  --agree-tos \
  --non-interactive

# Copy certificates
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /opt/vcsavibes/ssl/
cp /etc/letsencrypt/live/your-domain.com/privkey.pem /opt/vcsavibes/ssl/

# Set permissions
chmod 644 /opt/vcsavibes/ssl/*.pem
```

### Option 2: Custom SSL Certificates

```bash
# Copy your certificates
cp your-cert.pem /opt/vcsavibes/ssl/fullchain.pem
cp your-key.pem /opt/vcsavibes/ssl/privkey.pem

# Set permissions
chmod 644 /opt/vcsavibes/ssl/*.pem
```

### Auto-Renewal Setup

```bash
# Test renewal
certbot renew --dry-run

# Setup cron job
crontab -e

# Add this line for daily renewal check
0 0 * * * certbot renew --quiet --post-hook "cd /opt/vcsavibes && docker-compose restart frontend"
```

---

## Monitoring & Maintenance

### Health Checks

**Create health check script** `/opt/vcsavibes/scripts/health-check.sh`:

```bash
#!/bin/bash

# Backend health
if curl -f http://localhost:8000/api/health > /dev/null 2>&1; then
    echo "✅ Backend: OK"
else
    echo "❌ Backend: FAILED"
    # Send alert
fi

# Frontend health
if curl -f http://localhost/ > /dev/null 2>&1; then
    echo "✅ Frontend: OK"
else
    echo "❌ Frontend: FAILED"
    # Send alert
fi

# Database health
if docker-compose exec -T mongo mongo --eval "db.stats()" > /dev/null 2>&1; then
    echo "✅ Database: OK"
else
    echo "❌ Database: FAILED"
    # Send alert
fi
```

**Make it executable**:

```bash
chmod +x /opt/vcsavibes/scripts/health-check.sh
```

**Add to crontab**:

```bash
# Run health check every 5 minutes
*/5 * * * * /opt/vcsavibes/scripts/health-check.sh
```

### Log Management

**View logs**:

```bash
# All logs
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100
```

**Log rotation** is configured in `docker-compose.yml`.

### System Updates

```bash
# Weekly updates
apt-get update && apt-get upgrade -y

# Docker updates
curl -fsSL https://get.docker.com | sh
```

### Backup Strategy

**Automated backup script** `/opt/vcsavibes/scripts/backup.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/opt/vcsavibes/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
docker-compose exec -T mongo mongodump --out /tmp/backup
tar -czf $BACKUP_DIR/mongo_$DATE.tar.gz -C /tmp backup
rm -rf /tmp/backup

# Keep last 7 days
find $BACKUP_DIR -name "mongo_*.tar.gz" -mtime +7 -delete

echo "Backup completed: mongo_$DATE.tar.gz"
```

**Add to crontab**:

```bash
# Daily backup at 2 AM
0 2 * * * /opt/vcsavibes/scripts/backup.sh
```

---

## Troubleshooting

### Common Issues

#### 1. Services Won't Start

```bash
# Check logs
docker-compose logs

# Check disk space
df -h

# Check memory
free -m

# Restart Docker
systemctl restart docker
```

#### 2. Database Connection Failed

```bash
# Check MongoDB status
docker-compose ps mongo

# Check MongoDB logs
docker-compose logs mongo

# Restart MongoDB
docker-compose restart mongo
```

#### 3. High Memory Usage

```bash
# Check memory usage
docker stats

# Add memory limits to docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 1G
```

#### 4. SSL Certificate Issues

```bash
# Check certificate expiration
openssl x509 -in /opt/vcsavibes/ssl/fullchain.pem -noout -dates

# Renew certificate
certbot renew

# Restart services
docker-compose restart frontend
```

#### 5. 502 Bad Gateway

```bash
# Check if backend is running
docker-compose ps backend

# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Emergency Commands

```bash
# Stop all services
docker-compose stop

# Start all services
docker-compose start

# Restart all services
docker-compose restart

# Remove all containers (WARNING: data loss!)
docker-compose down

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## Security Hardening

### 1. SSH Security

```bash
# Disable password authentication
nano /etc/ssh/sshd_config

# Set these values:
PasswordAuthentication no
PubkeyAuthentication yes
PermitRootLogin without-password

# Restart SSH
systemctl restart sshd
```

### 2. Firewall Rules

```bash
# Tighten firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw reload
```

### 3. Fail2Ban Configuration

```bash
# Edit fail2ban jail
nano /etc/fail2ban/jail.local

[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600

# Restart fail2ban
systemctl restart fail2ban
```

### 4. Automatic Security Updates

```bash
# Install unattended-upgrades
apt-get install -y unattended-upgrades

# Configure
dpkg-reconfigure -plow unattended-upgrades
```

### 5. Docker Security

```bash
# Run as non-root user (add to docker-compose.yml)
user: "1000:1000"

# Read-only root filesystem
read_only: true

# Drop capabilities
cap_drop:
  - ALL
cap_add:
  - NET_BIND_SERVICE
```

---

## Backup & Recovery

### Backup Types

1. **Database Backups**: Daily automated
2. **File Backups**: Weekly manual
3. **Configuration Backups**: On change

### Recovery Procedures

#### Database Recovery

```bash
# List backups
ls -lh /opt/vcsavibes/backups/

# Extract backup
tar -xzf /opt/vcsavibes/backups/mongo_20260418_020000.tar.gz -C /tmp

# Restore database
docker-compose exec -T mongo mongorestore /tmp/backup

# Clean up
rm -rf /tmp/backup
```

#### Full System Recovery

```bash
# Stop services
docker-compose down

# Restore from backup
# (Your backup restore commands here)

# Restart services
docker-compose up -d
```

### Offsite Backup

```bash
# Sync to remote storage
rsync -avz -e ssh \
    /opt/vcsavibes/backups/ \
    user@backup-server:/backups/vcsavibes/
```

---

## Performance Optimization

### 1. Enable Nginx Caching

```nginx
# Add to nginx.conf
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=vcsa_cache:10m max_size=1g inactive=60m;

location / {
    proxy_cache vcsa_cache;
    proxy_cache_valid 200 10m;
    proxy_cache_methods GET HEAD;
}
```

### 2. MongoDB Optimization

```yaml
# Add to docker-compose.yml
mongo:
  command: mongod --wiredTigerCacheSizeGB 2
```

### 3. Backend Performance

```bash
# Increase worker processes
# In docker-compose.yml
command: uvicorn server:app --workers 4 --host 0.0.0.0
```

---

## Support & Resources

### Documentation

- Main Repository: https://github.com/your-org/Vcsa-
- API Documentation: http://your-vps-ip:8000/docs
- Operations Guide: `/opt/vcsavibes/docs/`

### Monitoring Tools

- UptimeRobot: https://uptimerobot.com
- Sentry: https://sentry.io
- Datadog: https://www.datadoghq.com

### Emergency Contacts

- DevOps: devops@vcsavibes.com
- Security: security@vcsavibes.com
- Support: support@vcsavibes.com

---

**Last Updated**: April 18, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
