# 🧪 VCSA Preview Deployment

Deploy a staging/preview environment before production.

## Quick Start

```bash
# Deploy preview environment
./deploy-preview.sh deploy

# Access preview
open http://localhost:7777
```

## Preview URLs

| Service | Preview URL | Production URL |
|---------|-------------|----------------|
| Frontend | http://localhost:7777 | http://localhost:80 |
| Backend | http://localhost:8001 | http://localhost:8000 |
| MongoDB | mongodb://localhost:27018 | mongodb://localhost:27017 |

## Commands

```bash
# Deploy preview
./deploy-preview.sh deploy

# Stop preview
./deploy-preview.sh stop

# Check status
./deploy-preview.sh status

# View logs
./deploy-preview.sh logs

# Show URLs
./deploy-preview.sh urls
```

## Preview vs Production

| Feature | Preview | Production |
|---------|---------|------------|
| Port (Frontend) | 7777 | 80 |
| Port (Backend) | 8001 | 8000 |
| Port (MongoDB) | 27018 | 27017 |
| Database | vcsa_preview | vcsa |
| Debug Mode | ON | OFF |
| CORS | localhost:7777 | production domain |

## Testing Checklist

Before deploying to production:

- [ ] User registration works
- [ ] Login/logout works
- [ ] Dashboard loads correctly
- [ ] Phase 1 features functional
- [ ] All API endpoints respond
- [ ] No console errors
- [ ] Database operations work
- [ ] File uploads work (if applicable)

## Switch to Production

Once preview is tested:

```bash
# Stop preview
./deploy-preview.sh stop

# Deploy production
./deploy.sh deploy
```

---

**Environment:** Staging/Preview
**Port:** 7777
**Purpose:** Testing before production
**Auto-cleanup:** Manual (stop when done)
