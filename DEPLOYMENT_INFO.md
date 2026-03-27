# 🚀 VCSA Deployment - Complete Information

## Deployment Options

### 1. Preview Deployment (Port 7777) - For Testing

```bash
./deploy-preview.sh deploy
```

**Access:** http://localhost:7777

**Use case:** Test changes before production

---

### 2. Production Deployment (Port 80)

```bash
./deploy.sh deploy
```

**Access:** http://localhost:80

**Use case:** Production environment

---

## URLs Summary

| Environment | Frontend | Backend API | MongoDB |
|-------------|----------|-------------|---------|
| **Preview** | http://localhost:7777 | http://localhost:8001 | mongodb://localhost:27018 |
| **Production** | http://localhost:80 | http://localhost:8000 | mongodb://localhost:27017 |

---

## Quick Commands

### Preview Environment

```bash
# Deploy preview
./deploy-preview.sh deploy

# Stop preview
./deploy-preview.sh stop

# View logs
./deploy-preview.sh logs

# Show URLs
./deploy-preview.sh urls
```

### Production Environment

```bash
# Deploy production
./deploy.sh deploy

# Stop production
./deploy.sh stop

# View logs
./deploy.sh logs

# Check health
./deploy.sh health
```

---

## Workflow

1. **Deploy Preview** (Port 7777)
   ```bash
   ./deploy-preview.sh deploy
   ```

2. **Test Everything** at http://localhost:7777

3. **If Tests Pass** → Deploy Production
   ```bash
   ./deploy-preview.sh stop
   ./deploy.sh deploy
   ```

---

## Files Created for Deployment

- ✅ `docker-compose.yml` - Production configuration
- ✅ `docker-compose.preview.yml` - Preview configuration (port 7777)
- ✅ `deploy.sh` - Production deployment script
- ✅ `deploy-preview.sh` - Preview deployment script
- ✅ `build.sh` - Build script
- ✅ `backend/.env` - Backend environment
- ✅ `frontend/.env` - Frontend environment
- ✅ `.env` - Docker compose environment
- ✅ `DEPLOY_GUIDE.md` - Complete deployment guide
- ✅ `QUICK_DEPLOY.md` - Quick start guide
- ✅ `PREVIEW_DEPLOY.md` - Preview deployment guide

---

## Default Credentials

| User | Email | Password | Role |
|------|-------|----------|------|
| Admin | admin@vcsa.com | admin123 | admin |
| Demo | demo@vcsa.com | demo123 | member |

---

**Status:** ✅ Ready for deployment
**Preview Port:** 7777
**Production Port:** 80
