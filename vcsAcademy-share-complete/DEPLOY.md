# VCSA - Deployment Guide

This guide provides step-by-step instructions for deploying the VCSA (Vacation Club Sales Academy) application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Local Development](#local-development)
4. [Production Deployment](#production-deployment)
5. [Docker Deployment](#docker-deployment)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying VCSA, ensure you have the following installed:

- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)
- **Node.js** (v18+) - for local development
- **Python** (v3.13+) - for local development
- **MongoDB** (v8+) - if not using Docker
- **Git** - for cloning the repository

### Verify installations:

```bash
docker --version
docker-compose --version
node --version
python3 --version
git --version
```

## Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Vcsa-
```

### 2. Configure Environment Variables

#### Backend Environment Variables

Copy the example file and configure:

```bash
cp backend/.env.example backend/.env
nano backend/.env
```

**Required variables:**
- `MONGO_URL` - MongoDB connection string
- `DB_NAME` - Database name (default: vcsa)
- `JWT_SECRET` - Secret key for JWT tokens (generate a strong random string)

**Optional variables:**
- `STRIPE_API_KEY` - Stripe API key for payments
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

#### Frontend Environment Variables

```bash
cp frontend/.env.example frontend/.env
nano frontend/.env
```

**Required variables:**
- `REACT_APP_BACKEND_URL` - Backend API URL

**Optional variables:**
- `REACT_APP_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

### 3. Generate Secure Keys

Generate a secure JWT secret:

```bash
# Linux/Mac
openssl rand -hex 32

# Or use Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

## Local Development

### Option 1: Using Docker Compose (Recommended)

1. **Start all services:**

```bash
./deploy.sh deploy
```

Or manually:

```bash
docker-compose up -d
```

2. **Check service health:**

```bash
./deploy.sh health
```

3. **View logs:**

```bash
./deploy.sh logs
```

4. **Access the application:**
- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Access the application at http://localhost:3000

## Production Deployment

### Docker Deployment (Recommended)

#### 1. Build Production Images

```bash
./build.sh docker
```

Or manually:

```bash
docker-compose build --no-cache
```

#### 2. Deploy to Production

```bash
# Set environment variables
export REACT_APP_BACKEND_URL=https://api.yourdomain.com
export MONGO_URL=mongodb://username:password@mongodb-host:27017
export DB_NAME=vcsa_production

# Deploy
./deploy.sh deploy
```

#### 3. Configure SSL/HTTPS

For production, you should use SSL certificates. Here's how to set up with Let's Encrypt:

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certificates will be automatically configured in nginx
```

### Cloud Deployment Options

#### AWS ECS/Fargate

1. Push images to ECR (Elastic Container Registry)
2. Create ECS task definitions
3. Configure load balancer
4. Set up auto-scaling

#### Google Cloud Run

1. Build and push images to GCR
2. Deploy to Cloud Run

```bash
gcloud run deploy vcsa-backend \
  --image gcr.io/PROJECT_ID/vcsa-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

gcloud run deploy vcsa-frontend \
  --image gcr.io/PROJECT_ID/vcsa-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Azure Container Instances

1. Push images to ACR (Azure Container Registry)
2. Deploy to Container Instances

### Kubernetes Deployment

For Kubernetes deployments, use the provided manifests (create these):

```bash
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

## Monitoring & Maintenance

### Health Checks

Check service health:

```bash
# Backend health
curl http://localhost:8000/api/health

# Frontend health
curl http://localhost/health
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Database Backups

Automated backup:

```bash
./deploy.sh backup
```

Manual backup:

```bash
docker-compose exec mongodb mongodump \
  --uri="mongodb://admin:password@mongodb:27017/vcsa" \
  --archive=/backup/backup_$(date +%Y%m%d).archive
```

### Restore Database

```bash
docker-compose exec -T mongodb mongorestore \
  --uri="mongodb://admin:password@mongodb:27017/vcsa" \
  --archive=/backup/backup.archive
```

### Update Application

To update to a new version:

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Or use the deploy script
./deploy.sh deploy
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

If port 80 or 8000 is already in use:

```bash
# Check what's using the port
sudo lsof -i :80
sudo lsof -i :8000

# Stop the conflicting service or change ports in docker-compose.yml
```

#### 2. MongoDB Connection Issues

```bash
# Check MongoDB logs
docker-compose logs mongodb

# Verify MongoDB is running
docker-compose ps mongodb

# Test connection
docker-compose exec mongodb mongosh
```

#### 3. Frontend Build Fails

```bash
# Clear node modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 4. Backend Import Errors

```bash
# Reinstall backend dependencies
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 5. Permissions Issues

```bash
# Fix file permissions
sudo chown -R $USER:$USER .
chmod +x deploy.sh build.sh
```

### Debug Mode

Enable debug logging:

```bash
# In backend/.env
DEBUG=true

# Restart services
docker-compose restart backend
```

### Check Resource Usage

```bash
# Docker stats
docker stats

# Disk usage
docker system df

# Clean up unused resources
docker system prune -a
```

## Security Best Practices

1. **Change Default Passwords**: Always change default MongoDB credentials
2. **Use HTTPS**: Enable SSL/TLS for production
3. **Limit CORS**: Configure CORS origins properly
4. **Secure JWT**: Use strong JWT secrets and proper expiration
5. **Regular Updates**: Keep Docker images and dependencies updated
6. **Backup Regularly**: Set up automated database backups
7. **Monitor Logs**: Regularly check logs for suspicious activity

## Performance Optimization

1. **Enable gzip compression** (already configured in nginx)
2. **Use CDN** for static assets in production
3. **Configure MongoDB indexes** for better query performance
4. **Enable caching** where appropriate
5. **Use multiple workers** for backend (configured in Dockerfile)

## Support

For issues or questions:
- Check the [CLAUDE.md](CLAUDE.md) for architecture details
- Review logs using `./deploy.sh logs`
- Check service health with `./deploy.sh health`

---

**Last Updated**: March 15, 2026
