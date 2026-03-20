# Production Deployment

Complete guide for deploying VCSA to production environments.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Deployment Checklist](#deployment-checklist)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Deployment Methods](#deployment-methods)
- [Post-Deployment](#post-deployment)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Required Services

- **Domain Name**: Registered domain with DNS configured
- **MongoDB Database**: MongoDB Atlas or self-hosted instance
- **SSL Certificate**: For HTTPS (recommended: Let's Encrypt)
- **Email Service**: SMTP credentials for transactional emails (optional)
- **Payment Processor**: Stripe account for subscriptions

### Server Requirements

**Minimum**:
- CPU: 2 cores
- RAM: 4GB
- Storage: 20GB SSD

**Recommended**:
- CPU: 4+ cores
- RAM: 8GB+
- Storage: 50GB+ SSD

**Software**:
- Ubuntu 20.04+ / Debian 11+
- Docker 20.10+
- Docker Compose 2.0+
- Nginx (reverse proxy)
- Git

---

## ✅ Deployment Checklist

### Pre-Deployment

- [ ] Update all environment variables
- [ ] Configure MongoDB connection
- [ ] Set up Stripe API keys
- [ ] Configure Google OAuth
- [ ] Set up SSL certificates
- [ ] Configure email service (SMTP)
- [ ] Set up Sentry for error tracking
- [ ] Review security settings
- [ ] Backup existing data (if updating)

### Post-Deployment

- [ ] Verify all services are running
- [ ] Test authentication flow
- [ ] Test payment processing
- [ ] Verify email sending
- [ ] Set up monitoring
- [ ] Configure automated backups
- [ ] Update DNS records
- [ ] Test on mobile devices
- [ ] Verify SEO metadata

---

## 🔐 Environment Configuration

### Backend Environment Variables

Create `/backend/.env.production`:

```bash
# Database
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/vcsa?retryWrites=true&w=majority
DB_NAME=vcsa_production

# Security
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_ALGORITHM=HS256
JWT_EXPIRATION_DAYS=7

# API Keys
STRIPE_API_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
GOOGLE_OAUTH_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=your_google_client_secret

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=noreply@yourdomain.com

# Sentry (Error Tracking)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1
SENTRY_PROFILES_SAMPLE_RATE=0.1

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Application
APP_NAME=VCSA
APP_URL=https://yourdomain.com
```

### Frontend Environment Variables

Create `/frontend/.env.production`:

```bash
REACT_APP_BACKEND_URL=https://api.yourdomain.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
REACT_APP_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
REACT_APP_ENVIRONMENT=production
```

---

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (M10+ recommended for production)
   - Choose region closest to your users

2. **Configure Security**:
   - Create database user (username + password)
   - Whitelist IP addresses (or use 0.0.0.0/0 for all)
   - Enable SCRAM authentication

3. **Connect**:
   - Get connection string
   - Update `MONGO_URL` in backend `.env`

4. **Index Creation**:
   ```javascript
   // Connect via MongoDB Compass or Atlas UI
   db.users.createIndex({ "email": 1 }, { unique: true })
   db.user_progress.createIndex({ "user_id": 1 }, { unique: true })
   db.posts.createIndex({ "created_at": -1 })
   db.events.createIndex({ "date": 1 })
   ```

### Self-Hosted MongoDB

```bash
# Install MongoDB
sudo apt-get install -y mongodb-org

# Start service
sudo systemctl start mongod
sudo systemctl enable mongod

# Create admin user
mongo
> use admin
> db.createUser({
    user: "admin",
    pwd: "secure_password",
    roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
  })

# Enable authentication
sudo nano /etc/mongod.conf
# Set: security.authorization: enabled

# Restart
sudo systemctl restart mongod
```

---

## 🚀 Deployment Methods

### Method 1: Docker Compose (Recommended)

**File**: `docker-compose.prod.yml`

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_BACKEND_URL=${API_URL}
    restart: unless-stopped
    networks:
      - vcsa-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    ports:
      - "8000:8000"
    environment:
      - MONGO_URL=${MONGO_URL}
      - JWT_SECRET=${JWT_SECRET}
      - STRIPE_API_KEY=${STRIPE_API_KEY}
    restart: unless-stopped
    networks:
      - vcsa-network
    depends_on:
      - mongodb

  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped
    networks:
      - vcsa-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
    networks:
      - vcsa-network

volumes:
  mongodb_data:

networks:
  vcsa-network:
    driver: bridge
```

**Deploy**:
```bash
# Build and start
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop
docker-compose -f docker-compose.prod.yml down
```

---

### Method 2: Cloud Platforms

#### AWS Deployment

**Services**:
- **ECS/EKS**: Container orchestration
- **RDS**: Managed MongoDB (via DocumentDB)
- **ALB/ELB**: Load balancer
- **Route 53**: DNS management
- **ACM**: SSL certificates

**Steps**:
1. Push Docker images to ECR
2. Create ECS task definitions
3. Set up ALB with SSL
4. Configure auto-scaling
5. Set up CloudWatch alarms

#### Google Cloud Platform

**Services**:
- **Cloud Run**: Container hosting
- **Cloud SQL**: Managed database
- **Cloud Load Balancing**: Traffic management
- **Cloud DNS**: DNS management

**Steps**:
1. Build and push to GCR
2. Deploy to Cloud Run
3. Configure load balancer
4. Set up Cloud CDN

#### Azure

**Services**:
- **Azure Container Instances**
- **Azure Cosmos DB**
- **Application Gateway**
- **Azure Front Door**

---

### Method 3: Traditional VPS

**Server Setup**:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx
sudo apt install -y nginx certbot python3-certbot-nginx

# Clone repository
cd /var/www
sudo git clone https://github.com/your-repo/vcsa.git
cd vcsa

# Configure environment
sudo cp backend/.env.example backend/.env.production
sudo nano backend/.env.production
sudo cp frontend/.env.example frontend/.env.production
sudo nano frontend/.env.production

# Deploy
docker-compose -f docker-compose.prod.yml up -d --build
```

**Nginx Configuration**: `/etc/nginx/sites-available/vcsa`

```nginx
upstream frontend {
    server localhost:3000;
}

upstream backend {
    server localhost:8000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check
    location /health {
        proxy_pass http://backend/api/health;
        access_log off;
    }
}
```

**SSL with Let's Encrypt**:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🔍 Post-Deployment

### Verify Services

```bash
# Check service status
docker-compose ps

# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Health check
curl https://yourdomain.com/health
curl https://api.yourdomain.com/api/health
```

### Database Seed

```bash
# Run seed scripts
docker-compose exec backend python seed_coaching.py
docker-compose exec backend python seed_knowledge_hub.py
```

### Create Admin User

```bash
# Via API
curl -X POST https://api.yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yourdomain.com",
    "password": "secure_password",
    "name": "Admin User"
  }'

# Via MongoDB shell
docker-compose exec mongodb mongo
> use vcsa_production
> db.users.updateOne(
    { "email": "admin@yourdomain.com" },
    { $set: { "role": "admin" } }
  )
```

---

## 📊 Monitoring

### Application Monitoring

**Sentry** (Error Tracking):
- Already integrated in backend
- Configure `SENTRY_DSN` in environment
- Monitor errors at: https://sentry.io

**Metrics to Track**:
- Error rate
- Response time
- Database query time
- User activity
- Payment success rate

### Server Monitoring

**Tools**:
- **Uptime Robot**: https://uptimerobot.com (free)
- **Pingdom**: https://www.pingdom.com
- **Datadog**: https://www.datadoghq.com (paid)

**What to Monitor**:
- Server uptime
- CPU usage
- Memory usage
- Disk space
- Network traffic

### Database Monitoring

**MongoDB Atlas** (if using):
- Built-in metrics dashboard
- Slow query monitoring
- Performance advisor

**Self-Hosted**:
- MongoDB Ops Manager
- Custom monitoring scripts

### Log Aggregation

```bash
# View real-time logs
docker-compose logs -f

# Export logs
docker-compose logs > logs.txt

# Rotate logs (add to docker-compose.yml)
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

## 🔧 Troubleshooting

### Common Issues

**Issue**: Frontend can't connect to backend

**Solution**:
1. Verify `REACT_APP_BACKEND_URL` in frontend `.env`
2. Check CORS settings in backend
3. Verify backend is running: `curl http://localhost:8000/api/health`

**Issue**: MongoDB connection failed

**Solution**:
1. Verify `MONGO_URL` is correct
2. Check firewall rules
3. Verify MongoDB credentials
4. Check MongoDB logs: `docker-compose logs mongodb`

**Issue**: High memory usage

**Solution**:
1. Check for memory leaks in application code
2. Limit Docker container memory:
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             memory: 2G
   ```
3. Add swap space

**Issue**: Slow performance

**Solution**:
1. Add database indexes
2. Enable CDN for static assets
3. Use compression (gzip)
4. Optimize images
5. Enable caching

**Issue**: SSL certificate errors

**Solution**:
1. Renew certificate: `sudo certbot renew`
2. Verify certificate path in nginx config
3. Check certificate expiration: `sudo certbot certificates`

---

## 🔄 Updates & Maintenance

### Zero-Downtime Deployment

```bash
# Pull latest code
git pull origin main

# Build new images
docker-compose -f docker-compose.prod.yml build

# Deploy with rolling restart
docker-compose -f docker-compose.prod.yml up -d --no-deps --build backend
docker-compose -f docker-compose.prod.yml up -d --no-deps --build frontend
```

### Database Backups

```bash
# Automated backup (add to crontab)
0 2 * * * /path/to/backup-script.sh

# Manual backup
docker-compose exec mongodb mongodump --uri="mongodb://user:pass@localhost:27017/vcsa_production" --archive=/backup/backup-$(date +%Y%m%d).gz

# Restore
docker-compose exec mongodb mongorestore --uri="mongodb://user:pass@localhost:27017/vcsa_production" --archive=/backup/backup-20260320.gz
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Stripe API Docs](https://stripe.com/docs/api)
