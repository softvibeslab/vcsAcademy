# 🚀 VCSA Deployment Procedures

**Version**: 1.0.0
**Last Updated**: April 2026
**Status**: Production Ready

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Environments](#environments)
3. [CI/CD Pipeline](#cicd-pipeline)
4. [Deployment Workflows](#deployment-workflows)
5. [Rollback Procedures](#rollback-procedures)
6. [Troubleshooting](#troubleshooting)
7. [Monitoring](#monitoring)

---

## Overview

VCSA uses a complete CI/CD pipeline with GitHub Actions for automated testing, building, and deployment.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                         │
│                   (vcsavibes/Vcsa-)                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  GitHub Actions CI/CD  │
         │  - Automated Tests     │
         │  - Security Scanning    │
         │  - Docker Builds       │
         │  - Deployments         │
         └───────────┬───────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐       ┌───────────────┐
│   Staging     │       │  Production   │
│ Environment   │       │  Environment  │
│ (develop br.)  │       │   (main br.)   │
└───────────────┘       └───────────────┘
```

---

## Environments

### Staging Environment

- **URL**: https://staging.vcsavibes.com
- **Branch**: `develop`
- **Trigger**: Push to `develop` branch
- **Auto-deploy**: ✅ Yes

### Production Environment

- **URL**: https://app.vcsavibes.com
- **Branch**: `main`
- **Trigger**: Release published
- **Auto-deploy**: ✅ Yes (with approval)

---

## CI/CD Pipeline

### Pipeline Stages

```
1. Code Quality & Testing
   ├── Frontend Tests (Jest + React Testing Library)
   ├── Backend Tests (pytest)
   └── Security Scanning (Trivy)

2. Build & Deploy
   ├── Build Docker Images
   ├── Push to Docker Hub
   └── Deploy to Environment

3. Post-Deployment
   ├── Health Checks
   ├── Smoke Tests
   └── Notifications
```

### GitHub Actions Workflow

**File**: `.github/workflows/ci-cd-pipeline.yml`

#### Triggers

```yaml
on:
  push:
    branches: [main, PLANNING, develop]
  pull_request:
    branches: [main, PLANNING, develop]
  release:
    types: [published]
```

#### Jobs

**1. Frontend Tests**
- Runs on every push and PR
- Executes linter (ESLint)
- Runs test suite with coverage
- Uploads coverage to Codecov

**2. Backend Tests**
- Runs on every push and PR
- Executes linter (flake8)
- Runs pytest with coverage
- Uploads coverage to Codecov

**3. Security Scanning**
- Runs after tests pass
- Scans for vulnerabilities (Trivy)
- Uploads results to Security tab
- Runs npm/pip audit

**4. Build Docker Images**
- Builds frontend image (vcsavibes/frontend)
- Builds backend image (vcsavibes/backend)
- Tags images with branch, commit SHA, and latest
- Pushes to Docker Hub

**5. Deploy to Staging**
- Deploys on push to `develop` branch
- Pulls latest images
- Restarts containers
- Runs health checks

**6. Deploy to Production**
- Deploys on release published
- Creates backup before deployment
- Zero-downtime deployment
- Runs health checks and smoke tests

**7. Rollback Production**
- Manual trigger via workflow_dispatch
- Rolls back to specified commit
- Restores from backup
- Notifies on completion

---

## Deployment Workflows

### Deploy to Staging

**Automatic** (push to `develop`):

```bash
# Make changes
git checkout develop
git add .
git commit -m "feat: new feature"
git push origin develop
```

**Manual** (via GitHub UI):

1. Go to Actions tab
2. Select "VCSA CI/CD Pipeline"
3. Click "Run workflow"
4. Select branch: `develop`
5. Click "Run workflow"

### Deploy to Production

**Via GitHub Release**:

1. Update `main` branch:
   ```bash
   git checkout main
   git merge develop
   git push origin main
   ```

2. Create release on GitHub:
   - Go to Releases page
   - Click "Draft a new release"
   - Tag version: `v1.0.0`
   - Target: `main` branch
   - Click "Publish release"

**Via GitHub Actions**:

1. Go to Actions tab
2. Select "Deploy to Production" workflow
3. Click "Run workflow"
4. Requires approval from maintainer

---

## Rollback Procedures

### Automatic Rollback

The deployment script automatically rolls back if:
- Health checks fail (5 retries)
- Smoke tests fail
- Deployment fails

### Manual Rollback

**Via GitHub Actions**:

1. Go to Actions tab
2. Select "Rollback Production" workflow
3. Click "Run workflow"
4. Enter commit SHA to rollback to
5. Click "Run workflow"

**Via SSH**:

```bash
# SSH to production server
ssh admin@app.vcsavibes.com

# Navigate to deployment directory
cd /opt/vcsavibes

# Run rollback script
./scripts/rollback.sh <commit-sha>
```

**Manual Commands**:

```bash
# SSH to server
ssh admin@app.vcsavibes.com

# Navigate to directory
cd /opt/vcsavibes

# Checkout previous commit
git fetch origin
git checkout <commit-sha>

# Rebuild and restart
docker-compose pull
docker-compose up -d --force-recreate
```

---

## Troubleshooting

### Deployment Failures

**Problem**: Docker build fails

```bash
# Check build logs
docker-compose build --no-cache

# Check disk space
df -h

# Clear Docker cache
docker system prune -a
```

**Problem**: Health check fails

```bash
# Check container status
docker-compose ps

# Check logs
docker-compose logs backend
docker-compose logs frontend

# Restart services
docker-compose restart
```

**Problem**: Database connection fails

```bash
# Check MongoDB
docker-compose exec mongodb mongosh

# Check environment variables
docker-compose exec backend env | grep MONGO

# Restart MongoDB
docker-compose restart mongodb
```

### Rollback Failures

**Problem**: Backup not found

```bash
# List available backups
ls -lh /opt/vcsavibes/backups/

# Check if backup exists
[ -f /opt/vcsavibes/backups/mongodb_backup.gz ] && echo "Found" || echo "Not found"
```

**Problem**: Container won't start

```bash
# Check container logs
docker-compose logs backend

# Check resource usage
docker stats

# Force restart
docker-compose down
docker-compose up -d
```

---

## Monitoring

### Health Checks

**Frontend Health**:
```bash
curl https://app.vcsavibes.com/
```

**Backend Health**:
```bash
curl https://app.vcsavibes.com/api/health
```

**Detailed Health**:
```bash
curl https://app.vcsavibes.com/api/health/detailed
```

### Logs

**View Logs**:
```bash
# All logs
docker-compose logs -f

# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend
```

**Log Files**:
- Application logs: `/var/log/vcsavibes/`
- Deployment logs: `/var/log/vcsavibes/deploy.log`
- Backup logs: `/var/log/vcsavibes/backup.log`

### Metrics

**Performance Metrics**:
```bash
# Response time
curl -w "@-" -o /dev/null -s "https://app.vcsavibes.com/api/health"
```

**Resource Usage**:
```bash
# Container stats
docker stats

# Server stats
top
htop
```

---

## Best Practices

### Before Deploying

1. ✅ Run tests locally
2. ✅ Check test coverage
3. ✅ Review security scan results
4. ✅ Verify environment variables
5. ✅ Check disk space on servers

### During Deployment

1. ✅ Monitor deployment logs
2. ✅ Watch health checks
3. ✅ Be ready to rollback
4. ✅ Notify team of deployment

### After Deployment

1. ✅ Run smoke tests
2. ✅ Monitor error rates
3. ✅ Check performance metrics
4. ✅ Verify backups were created
5. ✅ Update documentation

---

## Security

### Secrets Management

All secrets are stored in GitHub Secrets:

- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password
- `STAGING_HOST` - Staging server host
- `STAGING_USER` - Staging SSH user
- `STAGING_SSH_KEY` - Staging SSH key
- `PRODUCTION_HOST` - Production server host
- `PRODUCTION_USER` - Production SSH user
- `PRODUCTION_SSH_KEY` - Production SSH key
- `SLACK_WEBHOOK` - Slack webhook URL
- `SMTP_SERVER` - SMTP server
- `SMTP_PORT` - SMTP port
- `SMTP_USERNAME` - SMTP username
- `SMTP_PASSWORD` - SMTP password
- `NOTIFICATION_EMAIL` - Notification email

### Access Control

- **Staging**: Requires `develop` branch write access
- **Production**: Requires release approval
- **Rollback**: Requires admin privileges

---

## Support

### Deployment Issues

Contact: devops@vcsavibes.com

### Emergency Contacts

- On-Call Engineer: +1 (555) 123-4567
- Slack: #vcsa-deployments
- Email: emergency@vcsavibes.com

---

**Maintained by**: VCSA DevOps Team
**Last Review**: April 2026
**Next Review**: May 2026
