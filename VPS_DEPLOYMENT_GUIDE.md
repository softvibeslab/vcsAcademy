# 🚀 VPS Deployment Guide - VCSA Academy

**Target**: Hostinger VPS with Ubuntu 20.04/22.04
**Domain**: salesmastersminds.com
**Method**: Docker Compose with Nginx Reverse Proxy
**SSL**: Let's Encrypt with auto-renewal

---

## 📋 **PRE-DEPLOYMENT CHECKLIST**

### **VPS Requirements**
- [ ] VPS creado en Hostinger (mínimo 2GB RAM, 40GB SSD)
- [ ] Ubuntu 20.04 o 22.04 instalado
- [ ] IP address del VPS
- [ ] SSH access habilitado
- [ ] Dominio configurado: salesmastersminds.com

### **Domain Configuration**
- [ ] DNS A record apuntando a VPS IP:
  ```
  A salesmastersminds.com -> YOUR_VPS_IP
  A www.salesmastersminds.com -> YOUR_VPS_IP
  A api.salesmastersminds.com -> YOUR_VPS_IP
  ```
- [ ] DNS propagación completada (puede tardar 24-48 horas)

### **Local Requirements**
- [ ] Git clonado localmente
- [ ] SSH client instalado
- [ ] rsync instalado

---

## 🔧 **STEP 1: Preparar Local Environment**

### **1.1 Clone Repository**
```bash
git clone https://github.com/softvibeslab/vcsAcademy.git
cd vcsAcademy
git checkout feat/mobile-pwa-ux-improvements
```

### **1.2 Install Required Tools**
```bash
# macOS
brew install rsync ssh

# Ubuntu/Debian
sudo apt-get install rsync openssh-client

# Windows (Git Bash)
# Comes with Git for Windows
```

### **1.3 Generate SSH Key (si no tienes)**
```bash
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Copy public key to VPS
ssh-copy-id root@YOUR_VPS_IP
# Or manual:
cat ~/.ssh/id_rsa.pub | ssh root@YOUR_VPS_IP "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

---

## 🔐 **STEP 2: Connect to VPS**

### **2.1 Test SSH Connection**
```bash
# Replace with your VPS IP
ssh root@YOUR_VPS_IP

# If using different port:
ssh -p PORT root@YOUR_VPS_IP
```

### **2.2 Update System**
```bash
# Once connected to VPS
apt-get update && apt-get upgrade -y
```

---

## 🚀 **STEP 3: Automated Deployment**

### **3.1 Run Deployment Script**
```bash
# From your local machine
cd vcsAcademy

# Set environment variables
export VPS_HOST=YOUR_VPS_IP
export VPS_USER=root  # or your sudo user
export VPS_PORT=22    # change if using different SSH port

# Make script executable
chmod +x deploy-vps.sh

# Run deployment
./deploy-vps.sh
```

### **3.2 What the Script Does**
1. ✅ Checks requirements (SSH, rsync)
2. ✅ Tests VPS connection
3. ✅ Prepares VPS environment (installs Docker, Nginx, etc.)
4. ✅ Deploys application files via rsync
5. ✅ Configures SSL certificates with Let's Encrypt
6. ✅ Builds and starts Docker containers
7. ✅ Sets up production database
8. ✅ Verifies deployment

---

## 🛠️ **STEP 4: Manual Deployment (Alternative)**

If you prefer manual deployment or need troubleshooting:

### **4.1 Prepare VPS Environment**
```bash
# Connect to VPS
ssh root@YOUR_VPS_IP

# Update system
apt-get update && apt-get upgrade -y

# Install required packages
apt-get install -y curl wget git ufw fail2ban certbot python3-certbot-nginx docker.io docker-compose nginx

# Configure firewall
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw --force enable

# Create app directory
mkdir -p /var/www/vcsa-academy
```

### **4.2 Deploy Files**
```bash
# From your local machine
cd vcsAcademy

# Copy files to VPS
rsync -avz \
  -e "ssh" \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'netlify-deploy' \
  --exclude '__pycache__' \
  docker-compose.vps.yml frontend backend nginx \
  root@YOUR_VPS_IP:/var/www/vcsa-academy/
```

### **4.3 Configure Environment Variables**
```bash
# On VPS
ssh root@YOUR_VPS_IP
cd /var/www/vcsa-academy

# Create .env file
cp .env.vps.example .env

# Edit with secure values
nano .env

# IMPORTANT: Change these values:
# - MONGO_ROOT_PASSWORD (generate secure password)
# - JWT_SECRET (generate with: openssl rand -base64 32)
```

### **4.4 Setup SSL Certificates**
```bash
# On VPS
cd /var/www/vcsa-academy

# Stop nginx to free port 80
systemctl stop nginx

# Obtain SSL certificate
certbot certonly --standalone \
  -d salesmastersminds.com \
  -d www.salesmastersminds.com \
  -d api.salesmastersminds.com \
  --email admin@salesmastersminds.com \
  --agree-tos \
  --non-interactive

# Create SSL directory and links
mkdir -p nginx/ssl
ln -sf /etc/letsencrypt/live/salesmastersminds.com/fullchain.pem nginx/ssl/fullchain.pem
ln -sf /etc/letsencrypt/live/salesmastersminds.com/privkey.pem nginx/ssl/privkey.pem

# Setup auto-renewal
(crontab -l 2>/dev/null; echo "0 0,12 * * * certbot renew --quiet && docker-compose restart nginx") | crontab -
```

### **4.5 Start Application**
```bash
# On VPS
cd /var/www/vcsa-academy

# Rename docker-compose file
cp docker-compose.vps.yml docker-compose.yml

# Build and start containers
docker-compose build
docker-compose up -d

# Check container status
docker-compose ps

# View logs
docker-compose logs -f
```

### **4.6 Seed Database**
```bash
# On VPS
cd /var/www/vcsa-academy

# Seed coaching content
docker-compose exec -T backend python seed_coaching.py

# Seed knowledge hub
docker-compose exec -T backend python seed_knowledge_hub.py
```

---

## ✅ **STEP 5: Verify Deployment**

### **5.1 Check Services**
```bash
# On VPS
docker-compose ps

# Expected output: All services "Up" and "healthy"
# vcsa-frontend    Up      0.0.0.0:80->80/tcp
# vcsa-backend     Up      0.0.0.0:8000->8000/tcp
# vcsa-mongodb     Up      27017/tcp
# vcsa-nginx       Up      0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
```

### **5.2 Test Application**
```bash
# Test frontend (from your local machine)
curl -I https://salesmastersminds.com

# Expected: HTTP/1.1 200 OK or 301/302 redirect

# Test API
curl -I https://api.salesmastersminds.com/api/health

# Expected: HTTP/1.1 200 OK
```

### **5.3 Check SSL**
```bash
# Test SSL certificate
openssl s_client -connect salesmastersminds.com:443 -servername salesmastersminds.com

# Check certificate expiry
certbot certificates
```

---

## 🔍 **STEP 6: Post-Deployment Setup**

### **6.1 Create Admin User**
```bash
# On VPS
cd /var/www/vcsa-academy

# Access backend container
docker-compose exec backend python

# Or use API endpoint
curl -X POST https://api.salesmastersminds.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@salesmastersminds.com",
    "password": "SECURE_PASSWORD",
    "role": "admin"
  }'
```

### **6.2 Setup Monitoring**
```bash
# Install monitoring tools (optional)
apt-get install -y htop iotop

# Check system resources
htop

# View Docker stats
docker stats
```

### **6.3 Setup Backup**
```bash
# Create backup script
cat > /usr/local/bin/vcsa-backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/vcsa"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup MongoDB
docker-compose exec mongodb mongodump --archive=/data/db/backup_$DATE.gz

# Copy to backup directory
docker cp vcsa-mongodb:/data/db/backup_$DATE.gz $BACKUP_DIR/

# Keep last 7 days
find $BACKUP_DIR -name "backup_*.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /usr/local/bin/vcsa-backup.sh

# Setup cron job for daily backups at 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/vcsa-backup.sh") | crontab -
```

### **6.4 Configure Log Rotation**
```bash
# Create logrotate config
cat > /etc/logrotate.d/vcsa << 'EOF'
/var/www/vcsa-academy/nginx/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        docker-compose -f /var/www/vcsa-academy/docker-compose.yml exec nginx nginx -s reload
    endscript
}
EOF
```

---

## 📊 **STEP 7: Access Your Application**

### **URLs**
```
Frontend: https://salesmastersminds.com
API: https://api.salesmastersminds.com
API Docs: https://api.salesmastersminds.com/api/docs
```

### **Default Users**
```
Admin: admin@salesmastersminds.com / admin123
Demo: demo@salesmastersminds.com / demo123
```

---

## 🛡️ **SECURITY CHECKLIST**

### **Immediate**
- [ ] Change default passwords
- [ ] Update .env with secure JWT_SECRET
- [ ] Enable firewall (ufw)
- [ ] Configure fail2ban
- [ ] Setup SSL certificates

### **Important**
- [ ] Disable root SSH login
- [ ] Use SSH keys only
- [ ] Change SSH port from 22
- [ ] Setup automated backups
- [ ] Configure monitoring

### **Advanced**
- [ ] Setup intrusion detection
- [ ] Configure WAF (Web Application Firewall)
- [ ] Enable DDoS protection
- [ ] Setup security scanning
- [ ] Configure rate limiting

---

## 🔧 **MAINTENANCE COMMANDS**

### **View Logs**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f nginx

# Nginx access logs
tail -f /var/www/vcsa-academy/nginx/logs/access.log

# Nginx error logs
tail -f /var/www/vcsa-academy/nginx/logs/error.log
```

### **Restart Services**
```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart nginx
```

### **Update Application**
```bash
# Pull latest changes
cd /var/www/vcsa-academy
git pull

# Rebuild and restart
docker-compose build
docker-compose up -d
```

### **Database Operations**
```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh

# Backup database
docker-compose exec mongodb mongodump --archive=/data/db/backup.gz

# Restore database
docker-compose exec mongodb mongorestore --archive=/data/db/backup.gz
```

---

## 🐛 **TROUBLESHOOTING**

### **Containers not starting**
```bash
# Check container logs
docker-compose ps
docker-compose logs SERVICE_NAME

# Check disk space
df -h

# Check memory
free -h
```

### **SSL certificate issues**
```bash
# Renew certificates manually
certbot renew

# Check certificate status
certbot certificates

# Restart nginx after renewal
docker-compose restart nginx
```

### **API not accessible**
```bash
# Check nginx configuration
docker-compose exec nginx nginx -t

# Check backend health
docker-compose exec backend curl http://localhost:8000/api/health

# Check environment variables
docker-compose exec backend env | grep MONGO
```

### **Database connection issues**
```bash
# Check MongoDB is running
docker-compose ps mongodb

# Access MongoDB
docker-compose exec mongodb mongosh

# Check MongoDB logs
docker-compose logs mongodb
```

---

## 📞 **SUPPORT**

If you encounter issues:
1. Check logs: `docker-compose logs -f`
2. Verify DNS propagation: `dig salesmastersminds.com`
3. Test SSL: `openssl s_client -connect salesmastersminds.com:443`
4. Check firewall: `ufw status`
5. Review container status: `docker-compose ps`

---

## 🎉 **DEPLOYMENT COMPLETE**

Your VCSA Academy application is now live at:
- **Frontend**: https://salesmastersminds.com
- **API**: https://api.salesmastersminds.com

**Next Steps**:
1. Update DNS to point to VPS IP
2. Wait for DNS propagation (24-48 hours)
3. Create admin user via API
4. Setup monitoring and backups
5. Configure custom domain settings

---

**Generated: 2026-04-12**
**VCSA Academy - Production Deployment Guide**
