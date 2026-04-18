# 🤖 Claude Code VPS Deployment Guide

**Version**: 1.0.0
**Last Updated**: April 18, 2026
**Status**: Ready for Use

---

## 📋 Overview

This guide explains how to use Claude Code to deploy VCSA to a new VPS. The deployment is fully automated and can be executed directly from Claude Code.

---

## 🚀 Quick Start with Claude Code

### Step 1: Set VPS Credentials

Tell Claude Code your VPS details:

```
I want to deploy VCSA to my VPS. Here are the details:
- VPS IP: 123.456.789.012
- SSH Port: 22
- SSH User: root
- Branch: sprint-4-planning
```

### Step 2: Run Deployment Script

Claude Code will execute:

```bash
./scripts/vps-deploy.sh
```

### Step 3: Configure Environment

Claude Code will help you configure:

```bash
ssh root@YOUR_VPS_IP
cd /opt/vcsavibes
nano .env
```

### Step 4: Verify Deployment

Claude Code will verify:

- Services are running
- Health checks passing
- SSL certificates valid
- Monitoring active

---

## 📝 Claude Code Commands

### Deployment Commands

**Deploy to VPS**:
```
Deploy VCSA to production VPS using the deployment script
```

**Check Deployment Status**:
```
Check the deployment status on the VPS
```

**View Logs**:
```
Show me the logs from the production VPS
```

**Restart Services**:
```
Restart all services on the production VPS
```

### Maintenance Commands

**Update Deployment**:
```
Update the production deployment with the latest code
```

**Backup Database**:
```
Create a backup of the production database
```

**Check Health**:
```
Run health checks on the production VPS
```

**View Metrics**:
```
Show me the performance metrics from production
```

---

## 🔧 Configuration Files

### Environment Variables

Create `.env.vps` file:

```bash
# VPS Configuration
VPS_HOST=your.vps.ip
VPS_PORT=22
VPS_USER=root

# Project Configuration
PROJECT_NAME=vcsavibes
REMOTE_DIR=/opt/vcsavibes
BRANCH=sprint-4-planning

# Database (VPS)
MONGO_URL=mongodb://mongo:27017
DB_NAME=vcsa

# JWT
JWT_SECRET=your-jwt-secret-here

# Stripe
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google OAuth
GOOGLE_OAUTH_CLIENT_ID=your-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-client-secret

# Frontend
REACT_APP_BACKEND_URL=https://your-domain.com

# Sentry
SENTRY_DSN=your-sentry-dsn
```

---

## 🤖 Automated Deployment with Claude Code

### Full Deployment Workflow

**Tell Claude Code**:
```
I want to deploy VCSA to production. Please:
1. Test the SSH connection to the VPS
2. Run the VPS setup script
3. Deploy the application code
4. Configure the environment
5. Start all services
6. Verify the deployment
7. Run health checks
```

**Claude Code will**:
1. ✅ Test SSH connection
2. ✅ Setup VPS (Docker, firewall, etc.)
3. ✅ Deploy code via rsync
4. ✅ Configure environment variables
5. ✅ Build and start Docker containers
6. ✅ Verify all services are running
7. ✅ Run health checks
8. ✅ Provide deployment summary

---

## 📊 Deployment Verification

### Automatic Checks

Claude Code automatically verifies:

- ✅ All containers running
- ✅ Backend API responding
- ✅ Frontend accessible
- ✅ Database connected
- ✅ SSL certificates valid
- ✅ Health checks passing
- ✅ Monitoring active

### Manual Verification

Tell Claude Code:
```
Run manual deployment verification including:
1. Check all Docker containers
2. Test API endpoints
3. Verify database connection
4. Check SSL certificates
5. Test user registration
6. Test login functionality
7. Verify payment flow
```

---

## 🔄 Update Deployment

### Update Existing Deployment

**Tell Claude Code**:
```
Update the production VPS with the latest changes:
1. Pull latest code
2. Rebuild containers
3. Restart services
4. Verify update
```

**Claude Code will execute**:
```bash
# SSH into VPS
ssh root@VPS_IP

# Navigate to project
cd /opt/vcsavibes

# Pull latest changes
git pull origin sprint-4-planning

# Rebuild containers
docker-compose build

# Restart services
docker-compose up -d

# Verify
docker-compose ps
docker-compose logs --tail=50
```

---

## 🚨 Rollback Deployment

### Emergency Rollback

**Tell Claude Code**:
```
Rollback the production deployment to the previous version
```

**Claude Code will**:
1. Stop current services
2. Restore previous backup
3. Restart services
4. Verify rollback
5. Notify team

---

## 📈 Monitoring with Claude Code

### Real-time Monitoring

**Tell Claude Code**:
```
Show me the current status of the production VPS
```

**Claude Code will display**:
- Container status
- CPU/Memory usage
- Disk space
- Recent logs
- Error rates
- Response times

### Alert Management

**Tell Claude Code**:
```
Check if there are any alerts on the production VPS
```

**Claude Code will**:
- Check monitoring systems
- Review error logs
- Analyze performance metrics
- Report any issues

---

## 🔒 Security with Claude Code

### Security Scan

**Tell Claude Code**:
```
Run a security scan on the production VPS
```

**Claude Code will check**:
- Firewall rules
- SSH configuration
- SSL certificates
- Open ports
- Failed login attempts
- Security updates

### Security Hardening

**Tell Claude Code**:
```
Harden the security on the production VPS
```

**Claude Code will**:
- Update system packages
- Configure firewall
- Setup fail2ban
- Implement security best practices

---

## 💾 Backup & Recovery

### Automated Backups

**Tell Claude Code**:
```
Setup automated backups on the production VPS
```

**Claude Code will**:
- Create backup script
- Schedule cron jobs
- Configure retention
- Test backup restoration

### Manual Backup

**Tell Claude Code**:
```
Create a backup of the production database
```

**Claude Code will**:
- Dump database
- Compress backup
- Store in backup directory
- Verify backup integrity

---

## 🎯 Common Tasks

### Check Logs

```
Show me the last 100 lines of logs from the production VPS
```

### Restart Services

```
Restart the backend service on the production VPS
```

### Clear Cache

```
Clear the application cache on the production VPS
```

### Update SSL

```
Renew the SSL certificates on the production VPS
```

### Scale Resources

```
Increase the memory allocation for the backend container
```

---

## 📚 Troubleshooting with Claude Code

### Diagnosis

**Tell Claude Code**:
```
The production VPS is slow. Please diagnose the issue
```

**Claude Code will**:
1. Check system resources
2. Analyze logs
3. Review performance metrics
4. Identify bottlenecks
5. Recommend solutions

### Common Issues

**Services not starting**:
```
The services won't start on the production VPS. Help me fix it
```

**High memory usage**:
```
Memory usage is high on the production VPS. Investigate and fix
```

**Database connection failed**:
```
The backend can't connect to the database. Troubleshoot this
```

---

## 🚀 Best Practices

### Before Deployment

1. ✅ Test in staging first
2. ✅ Create backup
3. ✅ Verify environment variables
4. ✅ Check SSL certificates
5. ✅ Notify team

### During Deployment

1. ✅ Use deployment script
2. ✅ Monitor logs
3. ✅ Run health checks
4. ✅ Verify functionality
5. ✅ Document changes

### After Deployment

1. ✅ Monitor performance
2. ✅ Check error logs
3. ✅ Verify alerts
4. ✅ Update documentation
5. ✅ Notify stakeholders

---

## 📞 Support

### Getting Help

If you need help with deployment, tell Claude Code:

```
I'm having trouble deploying to VPS. Help me troubleshoot
```

### Common Issues

- **SSH Connection Failed**: Check IP, port, and SSH keys
- **Docker Build Failed**: Check logs and fix build errors
- **Services Won't Start**: Check logs and configuration
- **SSL Certificate Error**: Renew certificates with certbot
- **Database Connection Failed**: Check MongoDB container

---

## 🎯 Next Steps

1. **Deploy to Production**:
   ```
   Deploy VCSA to production VPS now
   ```

2. **Monitor Deployment**:
   ```
   Monitor the production deployment for the next hour
   ```

3. **Optimize Performance**:
   ```
   Analyze the production performance and recommend optimizations
   ```

---

**Ready to Deploy?** Just tell Claude Code:
```
Deploy VCSA to production VPS
```

Claude Code will handle the rest! 🚀
