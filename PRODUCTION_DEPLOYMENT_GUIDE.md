# 🚀 Guía de Deployment en Producción - VCSA

**Vacation Club Sales Academy**
**Versión**: 1.0.0
**Fecha**: Abril 2026

---

## 📋 Índice

1. [Prerrequisitos](#prerrequisitos)
2. [Opciones de Deployment](#opciones-de-deployment)
3. [Preparación del Ambiente](#preparación-del-ambiente)
4. [Deployment - Opción Cloud](#deployment-opción-cloud)
5. [Deployment - Opción VPS](#deployment-opción-vps)
6. [Post-Deployment](#post-deployment)
7. [Monitoreo y Mantenimiento](#monitoreo-y-mantenimiento)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Prerrequisitos

### Requisitos Técnicos Mínimos

#### Hardware (VPS/Dedicated Server)
- **CPU**: 4 cores mínimo (8 recomendado)
- **RAM**: 8GB mínimo (16GB recomendado)
- **Storage**: 100GB SSD mínimo
- **Network**: 100 Mbps mínimo

#### Software
- **OS**: Ubuntu 22.04 LTS o superior
- **Docker**: 24.0+
- **Docker Compose**: 2.20+
- **Nginx**: 1.24+
- **Git**: 2.40+

#### Dominio y DNS
- **Dominio**: Registrado y apuntando al server
- **DNS Records**: A record configurado
- **SSL**: Certificado (Let's Encrypt recomendado)

### Cuentas de Servicios

#### Requeridas
- [ ] **Dominio**: Comprado y configurado
- [ ] **MongoDB Atlas**: Account creado (o deployment local)
- [ ] **Stripe**: Account con API keys
- [ ] **Google OAuth**: Client ID y Secret (opcional)
- [ ] **Email Service**: SendGrid/Mailgun (para emails)

#### Opcionales
- [ ] **Sentry**: Para error tracking
- [ ] **Ollama**: Si se usa AI local
- [ ] **CDN**: Cloudflare (recomendado)

---

## 🌐 Opciones de Deployment

### Comparativa de Opciones

| Opción | Costo Mensual | Dificultad | Escalabilidad | Performance |
|--------|---------------|------------|---------------|-------------|
| **VPS** | $40-80 | Media | Manual | Alta |
| **Cloud (AWS/GCP)** | $120-850+ | Alta | Auto | Muy Alta |
| **Managed Services** | $300-1000+ | Baja | Auto | Premium |

### Recomendación

**Para MVP/Start**: VPS (DigitalOcean/Linode)
- Costo-efectivo
- Control completo
- Suficiente para < 1000 usuarios

**Para Producción Enterprise**: Cloud Services
- Auto-scaling
- Alta disponibilidad
- Soporte 24/7

---

## 🔧 Preparación del Ambiente

### Paso 1: Preparar Servidor

#### 1.1 Conectar al Servidor
```bash
# SSH al servidor
ssh root@your-server-ip

# Actualizar sistema
apt update && apt upgrade -y

# Instalar dependencias básicas
apt install -y curl git nginx ufw fail2ban
```

#### 1.2 Configurar Firewall
```bash
# Permitir SSH
ufw allow 22/tcp

# Permitir HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Habilitar firewall
ufw enable

# Ver status
ufw status
```

#### 1.3 Instalar Docker
```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker --version
docker-compose --version
```

### Paso 2: Configurar MongoDB

#### Opción A: MongoDB Atlas (Recomendado)

1. **Crear Cluster**
   - Ir a https://www.mongodb.com/cloud/atlas
   - Crear account free tier (512MB)
   - Crear cluster (M0 sandbox gratis)

2. **Configurar Acceso**
   ```bash
   # Whitelist IP del servidor
   # Network Access → Add IP Address → Add from Browser
   # O agregar IP manual: 0.0.0.0/0 (todas las IPs)
   ```

3. **Obtener Connection String**
   - Database → Connect → Connect your application
   - Copiar connection string

#### Opción B: MongoDB Local

```bash
# Crear volumen para MongoDB
mkdir -p /data/mongodb

# En docker-compose.yml
services:
  mongodb:
    image: mongo:7
    container_name: vcsa_mongodb
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
      MONGO_INITDB_DATABASE: vcsa
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    ports:
      - "27017:27017"

volumes:
  mongodb_data:
```

### Paso 3: Configurar Environment Variables

```bash
# Crear directorio del proyecto
mkdir -p /var/www/vcsa
cd /var/www/vcsa

# Crear .env
cat > .env << 'EOF'
# MongoDB
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/vcsa?retryWrites=true&w=majority
DB_NAME=vcsa

# Backend
BACKEND_PORT=8000
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Frontend
REACT_APP_BACKEND_URL=https://api.your-domain.com

# Stripe
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# JWT Secret (generar uno único)
JWT_SECRET=$(openssl rand -hex 32)

# Ollama AI (si se usa local)
OLLAMA_API_URL=http://host.docker.internal:11434/api/generate
OLLAMA_MODEL=llama3.1

# Sentry (opcional)
SENTRY_DSN=https://...

# Email (opcional)
SENDGRID_API_KEY=SG....
EOF

# Proteger archivo
chmod 600 .env
```

---

## ☁️ Deployment - Opción Cloud

### AWS Deployment

#### 1. Crear Infraestructura con Terraform

```hcl
# main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC
resource "aws_vpc" "vcsa_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "vcsa-vpc"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "vcsa_cluster" {
  name = "vcsa-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# RDS MongoDB (o usar Atlas)
resource "aws_db_instance" "vcsa_mongodb" {
  identifier     = "vcsa-mongodb"
  engine         = "mongo"
  engine_version = "7.0"
  instance_class = "db.t3.medium"

  allocated_storage     = 20
  storage_encrypted     = true
  storage_type          = "gp2"

  db_name  = "vcsa"
  username = var.db_username
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.vcsa_sg.id]
  skip_final_snapshot    = false

  tags = {
    Name = "vcsa-mongodb"
  }
}

# Application Load Balancer
resource "aws_lb" "vcsa_alb" {
  name               = "vcsa-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.vcsa_sg.id]
  subnets           = aws_subnet.vcsa_subnets[*].id

  enable_deletion_protection = false

  tags = {
    Name = "vcsa-alb"
  }
}
```

#### 2. Deploy con ECS

```bash
# Build y push images
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Backend
docker build -t vcsa-backend ./backend
docker tag vcsa-backend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/vcsa-backend:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/vcsa-backend:latest

# Frontend
docker build -t vcsa-frontend ./frontend
docker tag vcsa-frontend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/vcsa-frontend:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/vcsa-frontend:latest
```

---

## 🖥️ Deployment - Opción VPS

### Paso 1: Clonar Repositorio

```bash
# Clonar repositorio
cd /var/www
git clone https://github.com/your-org/vcsa.git
cd vcsa

# Crear branches de producción
git checkout -b production
```

### Paso 2: Configurar Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # Frontend (Nginx serving static files)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    container_name: vcsa_frontend
    restart: always
    ports:
      - "3000:80"
    environment:
      - REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}
    volumes:
      - frontend_cache:/var/www/html/cache
    networks:
      - vcsa_network

  # Backend (FastAPI)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: vcsa_backend
    restart: always
    ports:
      - "8000:8000"
    environment:
      - MONGO_URL=${MONGO_URL}
      - DB_NAME=${DB_NAME}
      - JWT_SECRET=${JWT_SECRET}
      - STRIPE_API_KEY=${STRIPE_API_KEY}
      - ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
    volumes:
      - backend_uploads:/app/uploads
    networks:
      - vcsa_network
    depends_on:
      - mongodb

  # MongoDB (local option)
  mongodb:
    image: mongo:7
    container_name: vcsa_mongodb
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
      MONGO_INITDB_DATABASE: vcsa
    volumes:
      - mongodb_data:/data/db
      - ./scripts/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    ports:
      - "27017:27017"
    networks:
      - vcsa_network

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: vcsa_nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./nginx/logs:/var/log/nginx
    networks:
      - vcsa_network
    depends_on:
      - frontend
      - backend

volumes:
  frontend_cache:
  backend_uploads:
  mongodb_data:

networks:
  vcsa_network:
    driver: bridge
```

### Paso 3: Configurar Nginx

```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:80;
    }

    upstream backend {
        server backend:8000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

    # Frontend
    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com www.your-domain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # Cache static assets
            location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
                proxy_pass http://frontend;
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }

        # Backend API
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;

            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # CORS
            add_header Access-Control-Allow-Origin $http_origin always;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
            add_header Access-Control-Allow-Credentials true always;

            if ($request_method = OPTIONS) {
                return 204;
            }
        }

        # Health check
        location /health {
            proxy_pass http://backend/api/health;
            access_log off;
        }
    }
}
```

### Paso 4: Generar SSL Certificate

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Generate certificate
certbot --nginx -d your-domain.com -d www.your-domain.com

# Copy certificates to nginx folder
mkdir -p nginx/ssl
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/

# Set up auto-renewal
certbot renew --dry-run
```

### Paso 5: Build y Deploy

```bash
# Build frontend
cd frontend
npm ci
npm run build
cd ..

# Build backend
cd backend
pip install -r requirements.txt
cd ..

# Start services
docker-compose -f docker-compose.prod.yml up -d --build

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Verify services
docker ps
```

---

## ✅ Post-Deployment

### Paso 1: Seed Database

```bash
# Ejecutar seed scripts
docker-compose -f docker-compose.prod.yml exec backend python seed_coaching.py
docker-compose -f docker-compose.prod.yml exec backend python seed_knowledge_hub.py
docker-compose -f docker-compose.prod.yml exec backend python seed_branding.py

# Verificar datos
docker-compose -f docker-compose.prod.yml exec backend python -c "
from server import db
import asyncio

async def check_data():
    users = await db.users.count_documents({})
    courses = await db.courses.count_documents({})
    print(f'Users: {users}')
    print(f'Courses: {courses}')

asyncio.run(check_data())
"
```

### Paso 2: Configurar Stripe Webhooks

```bash
# 1. Ir a Stripe Dashboard → Developers → Webhooks
# 2. Add endpoint: https://api.your-domain.com/api/webhooks/stripe
# 3. Select events:
#    - customer.subscription.created
#    - customer.subscription.updated
#    - customer.subscription.deleted
#    - invoice.paid
#    - invoice.payment_failed
# 4. Copy webhook secret y agregar a .env

STRIPE_WEBHOOK_SECRET=whsec_...
```

### Paso 3: Configurar Backup Automático

```bash
# Create backup script
cat > /usr/local/bin/vcsa-backup.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/var/backups/vcsa"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup MongoDB
docker exec vcsa_mongodb mongodump --archive=$BACKUP_DIR/mongo_$DATE.gz --gzip

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz backend/uploads/

# Delete backups older than 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /usr/local/bin/vcsa-backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /usr/local/bin/vcsa-backup.sh
```

### Paso 4: Configurar Monitoring

```bash
# Install monitoring tools
apt install -y htop iotop net-tools

# Configure log rotation
cat > /etc/logrotate.d/vcsa << 'EOF'
/var/www/vcsa/nginx/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
}
EOF

# Optional: Install Sentry
docker-compose -f docker-compose.prod.yml exec backend pip install sentry-sdk
```

### Paso 5: Health Checks

```bash
# Create health check script
cat > /usr/local/bin/vcsa-health.sh << 'EOF'
#!/bin/bash

echo "Checking VCSA Services..."

# Check frontend
if curl -sf http://localhost:3000 > /dev/null; then
    echo "✓ Frontend: OK"
else
    echo "✗ Frontend: FAILED"
fi

# Check backend
if curl -sf http://localhost:8000/api/health > /dev/null; then
    echo "✓ Backend: OK"
else
    echo "✗ Backend: FAILED"
fi

# Check MongoDB
if docker exec vcsa_mongodb mongosh --eval "db.stats()" > /dev/null; then
    echo "✓ MongoDB: OK"
else
    echo "✗ MongoDB: FAILED"
fi

echo "Health check completed"
EOF

chmod +x /usr/local/bin/vcsa-health.sh
```

---

## 📊 Monitoreo y Mantenimiento

### Métricas para Monitorear

#### Application Metrics
- Response time (< 500ms p50)
- Error rate (< 1%)
- Uptime (> 99.9%)
- Daily active users

#### System Metrics
- CPU usage (< 80%)
- Memory usage (< 80%)
- Disk space (< 80%)
- Network I/O

### Tools Recomendados

#### Gratis
- **Uptime Robot**: Uptime monitoring
- **Sentry Self-hosted**: Error tracking
- **Grafana + Prometheus**: Metrics dashboard
- **Cloudflare**: CDN + DDoS protection

#### Pagos
- **Datadog**: $15/host/mes
- **New Relic**: $50-100/mes
- **Sentry Cloud**: $20-50/mes

### Maintenance Tasks

#### Daily
- [ ] Check error logs
- [ ] Verify backups
- [ ] Monitor system resources

#### Weekly
- [ ] Review performance metrics
- [ ] Check for updates
- [ ] Audit user activity

#### Monthly
- [ ] Security audit
- [ ] Database optimization
- [ ] Backup verification
- [ ] Capacity planning

---

## 🔧 Troubleshooting

### Issues Comunes

#### 1. Frontend no carga

**Síntoma**: Error 502 Bad Gateway

**Solución**:
```bash
# Check nginx logs
docker-compose logs nginx

# Restart frontend
docker-compose restart frontend

# Check if frontend is built
ls -la frontend/build/
```

#### 2. Backend responde lento

**Síntoma**: API response time > 5s

**Solución**:
```bash
# Check MongoDB connection
docker-compose exec backend python -c "
from server import db
import asyncio
asyncio.run(db.command('ping'))
"

# Check logs
docker-compose logs backend --tail 100

# Restart backend
docker-compose restart backend
```

#### 3. MongoDB connection failed

**Síntoma**: Error connecting to database

**Solución**:
```bash
# Check if MongoDB is running
docker ps | grep mongo

# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb

# If using Atlas, check IP whitelist
```

#### 4. SSL Certificate expired

**Síntoma**: NET::ERR_CERT_AUTHORITY_INVALID

**Solución**:
```bash
# Renew certificate
certbot renew

# Restart nginx
docker-compose restart nginx

# If auto-renewal is set up, it should renew automatically
```

### Emergency Procedures

#### Rollback to Previous Version

```bash
# Stop services
docker-compose -f docker-compose.prod.yml down

# Checkout previous commit
git checkout <previous-commit-hash>

# Rebuild and start
docker-compose -f docker-compose.prod.yml up -d --build
```

#### Restore from Backup

```bash
# Stop services
docker-compose -f docker-compose.prod.yml down

# Restore MongoDB backup
docker run --rm -v vcsa_mongodb_data:/data/mongodb \
  -v /var/backups/vcsa:/backup \
  mongo:7 mongorestore --archive=/backup/mongo_YYYYMMDD.gz --gzip

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📞 Soporte

### Contacto
- **Email**: support@vcsa.com
- **Slack**: #vcsa-support
- **Emergency**: +1-XXX-XXX-XXXX

### Resources
- **Documentation**: https://docs.vcsa.com
- **API Reference**: https://api.your-domain.com/docs
- **Status Page**: https://status.vcsa.com

---

**Última Actualización**: Abril 2026
**Versión**: 1.0.0
**Estado**: Production Ready ✅
