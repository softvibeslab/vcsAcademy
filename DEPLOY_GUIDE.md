# 🚀 VCSA Deployment Guide

Complete guide to deploy VCSA (Vacation Club Sales Academy) using Docker Compose.

---

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ Docker installed (v20.10+)
- ✅ Docker Compose installed (v2.0+)
- ✅ Git installed
- ✅ At least 4GB RAM available
- ✅ 10GB disk space available

---

## 🛠️ Quick Start (5 Minutes)

### Step 1: Clone & Configure

```bash
# Clone the repository
git clone <your-repo-url>
cd Vcsa-

# Environment files are already created
# Review and update if needed:
# - backend/.env
# - frontend/.env
# - .env
```

### Step 2: Deploy

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh deploy
```

### Step 3: Access

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **API Health**: http://localhost:8000/api/health
- **MongoDB**: mongodb://localhost:27017

---

## 🔧 Configuration

### Backend Environment (`backend/.env`)

```bash
# Required - Update these for production
MONGO_URL=mongodb://vcsa_user:password@mongodb:27017
DB_NAME=vcsa
JWT_SECRET=your_secure_jwt_secret_here

# Optional - For payments
STRIPE_API_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# Optional - For Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Optional - For error tracking
SENTRY_DSN=https://your-dsn@sentry.io/project
```

### Frontend Environment (`frontend/.env`)

```bash
# Required - Backend URL
REACT_APP_BACKEND_URL=http://backend:8000

# Optional - For payments
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Optional - For analytics
REACT_APP_GA_ID=your_google_analytics_id

# Optional - For error tracking
REACT_APP_SENTRY_DSN=https://your-dsn@sentry.io/project
```

### Docker Compose Environment (`.env`)

```bash
# MongoDB credentials
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=secure_password_here
DB_NAME=vcsa
```

---

## 📦 Deployment Management

### Using the Deploy Script

```bash
# Show menu
./deploy.sh

# Deploy (build + start)
./deploy.sh deploy

# Start services
./deploy.sh start

# Stop services
./deploy.sh stop

# Restart services
./deploy.sh restart

# Check health
./deploy.sh health

# View logs
./deploy.sh logs
./deploy.sh logs backend
./deploy.sh logs frontend
./deploy.sh logs mongodb

# Backup database
./deploy.sh backup
```

### Using Docker Compose Directly

```bash
# Build and start
docker-compose up -d --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart service
docker-compose restart backend

# Check status
docker-compose ps
```

---

## 🏥 Health Checks

### Manual Health Check

```bash
# Frontend health
curl http://localhost/health

# Backend health
curl http://localhost:8000/api/health

# Docker health status
docker-compose ps
```

### Expected Output

**Frontend:**
```
healthy
```

**Backend:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-03-16T12:00:00Z"
}
```

---

## 🗄️ Database Management

### Seed Initial Data

```bash
# Seed coaching sessions
docker-compose exec backend python seed_coaching.py

# Seed knowledge hub resources
docker-compose exec backend python seed_knowledge_hub.py
```

### Backup Database

```bash
# Using deploy script
./deploy.sh backup

# Manual backup
docker-compose exec mongodb mongodump \
  --uri="mongodb://admin:password@mongodb:27017/vcsa" \
  --archive=/backup/backup_$(date +%Y%m%d).archive
```

### Restore Database

```bash
docker-compose exec mongodb mongorestore \
  --uri="mongodb://admin:password@mongodb:27017/vcsa" \
  --archive=/backup/backup_20240316.archive
```

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Update JWT_SECRET to a strong random value
- [ ] Configure HTTPS/SSL certificate
- [ ] Set up firewall rules
- [ ] Enable Sentry for error tracking
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Review and update security headers
- [ ] Configure rate limiting
- [ ] Set up monitoring alerts

---

## 🐛 Troubleshooting

### Services Won't Start

```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Check port conflicts
netstat -tuln | grep -E ':(80|8000|27017)'

# Rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

### Database Connection Issues

```bash
# Check MongoDB is running
docker-compose exec mongodb mongosh \
  --eval "db.adminCommand('ping')"

# Check backend can reach MongoDB
docker-compose exec backend python -c "
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
async def test():
    client = AsyncIOMotorClient('mongodb://mongodb:27017')
    print(await client.admin.command('ping'))
asyncio.run(test())
"
```

### Frontend Can't Reach Backend

```bash
# Check backend is accessible from frontend
docker-compose exec frontend curl http://backend:8000/api/health

# Check nginx configuration
docker-compose exec frontend cat /etc/nginx/nginx.conf
```

### Reset Everything

```bash
# Stop and remove all containers, volumes, and networks
docker-compose down -v

# Remove images
docker rmi vcsa-frontend vcsa-backend

# Rebuild from scratch
./deploy.sh deploy
```

---

## 📊 Monitoring

### View Resource Usage

```bash
# Docker stats
docker stats

# Disk usage
docker system df

# Container size
docker ps -s
```

### View Logs in Real-time

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 🌐 Production Deployment

### Domain Configuration

1. **Update DNS** to point to your server
2. **Update APP_URL** in `backend/.env`
3. **Update CORS_ORIGINS** in `backend/.env`
4. **Configure SSL/HTTPS** (use Let's Encrypt with nginx)

### SSL Certificate Setup

```bash
# Install certbot
apt-get install certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d yourdomain.com

# Auto-renewal (added to crontab)
certbot renew --dry-run
```

### Update nginx for HTTPS

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # ... rest of config
}
```

---

## 🔄 Updates & Maintenance

### Update Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Or use deploy script
./deploy.sh restart
```

### View Logs After Update

```bash
docker-compose logs -f --tail=100 backend
docker-compose logs -f --tail=100 frontend
```

---

## 📞 Support

For issues or questions:
- Check logs: `./deploy.sh logs`
- Check health: `./deploy.sh health`
- Review this guide
- Check application documentation in `/docs`

---

## ✅ Deployment Checklist

- [ ] Prerequisites installed
- [ ] Environment files configured
- [ ] Ports 80, 8000, 27017 available
- [ ] Database seeded with initial data
- [ ] Health checks passing
- [ ] HTTPS configured (production)
- [ ] Backups scheduled
- [ ] Monitoring configured
- [ ] Error tracking enabled (Sentry)

---

**Status:** ✅ Ready for deployment

**Last Updated:** 2024-03-16

**Version:** 1.0.0
