# 🚀 DEPLOY VPS - QUICK START

**VCSA Academy Deployment to Hostinger VPS**
**Domain**: salesmastersminds.com

---

## ⚡ **QUICK DEPLOY (5 minutes)**

### **Prerequisites**
- ✅ VPS IP address
- ✅ SSH access to VPS
- ✅ Domain configured: salesmastersminds.com

### **One-Command Deployment**
```bash
# Set your VPS credentials
export VPS_HOST="YOUR_VPS_IP_ADDRESS"
export VPS_USER="root"  # or your sudo user
export VPS_PORT="22"     # change if using custom SSH port

# Run deployment
chmod +x deploy-vps.sh
./deploy-vps.sh
```

**That's it!** The script will:
- ✅ Prepare VPS environment
- ✅ Install Docker & dependencies
- ✅ Configure SSL certificates
- ✅ Deploy application
- ✅ Start all services

---

## 📋 **STEP-BY-STEP (if needed)**

### **1. Prepare Local**
```bash
cd vcsAcademy
git checkout feat/mobile-pwa-ux-improvements
```

### **2. Test SSH Connection**
```bash
ssh root@YOUR_VPS_IP
# If successful, exit and continue
exit
```

### **3. Run Deployment Script**
```bash
export VPS_HOST="YOUR_VPS_IP"
./deploy-vps.sh
```

### **4. Verify Deployment**
```bash
# Check website
curl -I https://salesmastersminds.com

# Check API
curl -I https://api.salesmastersminds.com/api/health
```

---

## 🔧 **MANUAL DEPLOYMENT**

If automated script fails, see: [VPS_DEPLOYMENT_GUIDE.md](VPS_DEPLOYMENT_GUIDE.md)

```bash
# 1. Connect to VPS
ssh root@YOUR_VPS_IP

# 2. Install dependencies
apt-get update && apt-get install -y docker.io docker-compose nginx certbot

# 3. Copy files (from local)
rsync -avz --exclude 'node_modules' \
  docker-compose.vps.yml frontend backend nginx \
  root@YOUR_VPS_IP:/var/www/vcsa-academy/

# 4. Configure SSL
certbot certonly --standalone -d salesmastersminds.com

# 5. Start services
cd /var/www/vcsa-academy
docker-compose up -d
```

---

## ✅ **POST-DEPLOYMENT**

### **Access URLs**
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

### **Management Commands**
```bash
# SSH to VPS
ssh root@YOUR_VPS_IP

# Check services
cd /var/www/vcsa-academy
docker-compose ps

# View logs
docker-compose logs -f

# Restart services
docker-compose restart
```

---

## 🔐 **SECURITY (IMPORTANT!)**

### **Change These Immediately**
```bash
# SSH to VPS
ssh root@YOUR_VPS_IP
cd /var/www/vcsa-academy

# Edit environment variables
nano .env

# UPDATE THESE:
# - MONGO_ROOT_PASSWORD (generate strong password)
# - JWT_SECRET (use: openssl rand -base64 32)

# Restart backend
docker-compose restart backend
```

### **Setup Firewall**
```bash
# On VPS
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw --force enable
```

---

## 🐛 **TROUBLESHOOTING**

### **Containers not starting?**
```bash
docker-compose ps
docker-compose logs -f
```

### **SSL certificate error?**
```bash
certbot renew
docker-compose restart nginx
```

### **API not responding?**
```bash
docker-compose restart backend
docker-compose logs backend
```

### **Check system resources**
```bash
htop
df -h
free -h
```

---

## 📊 **MONITORING**

### **Check Services Health**
```bash
# All services
docker-compose ps

# Service logs
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f nginx

# Nginx logs
tail -f /var/www/vcsa-academy/nginx/logs/access.log
```

### **Backup Database**
```bash
# Backup MongoDB
docker-compose exec mongodb mongodump --archive=/data/db/backup.gz

# Copy backup locally
docker cp vcsa-mongodb:/data/db/backup.gz ./backup_$(date +%Y%m%d).gz
```

---

## 🎯 **NEXT STEPS**

1. ✅ **DNS Configuration**
   - A records pointing to VPS IP
   - Wait for propagation (24-48 hours)

2. ✅ **Update Security**
   - Change default passwords
   - Setup SSH key authentication
   - Configure fail2ban

3. ✅ **Setup Monitoring**
   - Install monitoring tools
   - Configure log rotation
   - Setup automated backups

4. ✅ **Create Admin User**
   - Via API endpoint
   - Or directly in database

---

## 📞 **SUPPORT**

**Full Guide**: [VPS_DEPLOYMENT_GUIDE.md](VPS_DEPLOYMENT_GUIDE.md)

**Common Issues**:
- DNS propagation: Use `dig salesmastersminds.com` to check
- SSL errors: Check with `openssl s_client -connect salesmastersminds.com:443`
- Container issues: Check `docker-compose ps` and `docker-compose logs`

**Emergency Commands**:
```bash
# Stop all services
docker-compose down

# Start all services
docker-compose up -d

# Rebuild containers
docker-compose build
docker-compose up -d
```

---

## 🎉 **DEPLOYMENT COMPLETE**

Your application is live at:
- **https://salesmastersminds.com**
- **https://api.salesmastersminds.com**

**Generated**: 2026-04-12
**VCSA Academy - Production Ready**
