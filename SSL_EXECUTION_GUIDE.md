# 🔨 SSL Execution Guide - Step by Step

**Purpose**: Complete step-by-step guide for SSL certificate installation
**Sprint**: Sprint 2 - Task 1
**Status**: Ready for Production Execution
**Estimated Time**: 30-45 minutes

---

## 📋 PRE-INSTALLATION CHECKLIST

Before starting, verify the following:

### Domain Requirements
- [ ] Domain name (vcsa.com) is purchased
- [ ] Domain nameservers are configured
- [ ] DNS A record points to server IP address
- [ ] DNS propagation is complete (can take 24-48 hours)

### Server Requirements
- [ ] Server root access or sudo privileges
- [ ] Ports 80 and 443 are open in firewall
- [ ] Nginx is installed (or willing to install)
- [ ] Server IP address is known

### Test DNS Resolution
```bash
# Replace with your actual domain
dig api.vcsa.com
host api.vcsa.com
nslookup api.vcsa.com

# Should return your server IP
```

### Test Server Connectivity
```bash
# Test if ports are accessible
telnet your-server-ip 80
telnet your-server-ip 443

# Or using nc (netcat)
nc -zv your-server-ip 80
nc -zv your-server-ip 443
```

---

## 🚀 INSTALLATION PROCESS

### Step 1: Connect to Your Server

```bash
# SSH into your server
ssh root@your-server-ip

# Or with sudo user
ssh user@your-server-ip
sudo su -
```

### Step 2: Prepare the Environment

```bash
# Update system packages
apt update && apt upgrade -y

# Install required tools
apt install -y curl wget git nginx

# Create working directory
mkdir -p /root/vcsa-ssl
cd /root/vcsa-ssl
```

### Step 3: Download SSL Setup Script

```bash
# Option A: If you have the script from the repository
git clone https://github.com/softvibeslab/vcsAcademy.git
cd vcsAcademy
chmod +x scripts/setup_ssl.sh

# Option B: Create script manually
nano setup_ssl.sh
# (Copy content from scripts/setup_ssl.sh)
chmod +x setup_ssl.sh
```

### Step 4: Configure Domain Variables

Edit the script to match your domain:

```bash
nano setup_ssl.sh

# Update these variables at the top:
DOMAIN="vcsa.com"              # Your main domain
API_DOMAIN="api.vcsa.com"      # API subdomain
WWW_DOMAIN="www.vcsa.com"      # WWW subdomain
APP_DOMAIN="app.vcsa.com"      # App subdomain
EMAIL="admin@vcsa.com"         # Your email for Let's Encrypt
```

### Step 5: Run SSL Setup Script

```bash
# Execute the script
sudo ./setup_ssl.sh
```

**Expected Output**:
```
═══════════════════════════════════════════════════════
  VCSA SSL Certificate Setup
═══════════════════════════════════════════════════════

ℹ Configuration:
  Domain: vcsa.com
  API Domain: api.vcsa.com
  WWW Domain: www.vcsa.com
  App Domain: app.vcsa.com
  Email: admin@vcsa.com

✓ Installing Certbot...
✓ Checking DNS...
✓ Configuring Nginx...
✓ Generating SSL Certificate...
✓ Certificate generated successfully
✓ Setting up auto-renewal...
✓ SSL setup completed successfully!
```

### Step 6: Verify Installation

```bash
# Run verification script
chmod +x scripts/verify_ssl.sh
./scripts/verify_ssl.sh api.vcsa.com
```

**Expected Output**:
```
═══════════════════════════════════════════════════════
  SSL Certificate Verification for api.vcsa.com
═══════════════════════════════════════════════════════

✓ PASS: Domain api.vcsa.com resolves to 1.2.3.4
✓ PASS: SSL connection successful
✓ PASS: Certificate validity period
✓ PASS: Certificate expires in 89 days
✓ PASS: Certificate chain is valid
✓ PASS: HTTPS connection successful
✓ PASS: HSTS header present
✓ PASS: X-Frame-Options header present
✓ PASS: Using secure TLS version: TLSv1.3
✓ PASS: HTTP redirects to HTTPS

Passed: 10
Warnings: 0
Failed: 0

✓ PASS: All critical tests passed! SSL is configured correctly.
```

---

## ✅ POST-INSTALLATION STEPS

### Step 7: Test SSL Labs

1. Visit: https://www.ssllabs.com/ssltest/
2. Enter your domain: `api.vcsa.com`
3. Click "Submit"
4. Wait for analysis (2-3 minutes)
5. **Target**: Grade A or A+

### Step 8: Test in Browser

```bash
# Test HTTPS access
curl -I https://api.vcsa.com/api/health

# Expected output:
# HTTP/2 200
# content-type: application/json
# strict-transport-security: max-age=63072000; includeSubDomains; preload
```

Visit in browser:
- https://api.vcsa.com/api/docs - API documentation
- https://api.vcsa.com/api/health - Health check
- https://www.vcsa.com - Frontend

### Step 9: Update Environment Variables

**Backend** (`backend/.env`):
```bash
# Update backend URL to HTTPS
REACT_APP_BACKEND_URL=https://api.vcsa.com
FRONTEND_URL=https://www.vcsa.com

# Add production-specific settings
ENVIRONMENT=production
DEBUG=False
ALLOWED_HOSTS=api.vcsa.com,www.vcsa.com,vcsa.com
```

**Frontend** (`frontend/.env`):
```bash
# Update backend URL to HTTPS
REACT_APP_BACKEND_URL=https://api.vcsa.com
```

### Step 10: Restart Services

```bash
# Restart Nginx
systemctl restart nginx
systemctl status nginx

# If running FastAPI with systemd
systemctl restart vcsa-api
systemctl status vcsa-api

# Or if running with Docker
docker-compose restart backend
docker-compose restart frontend
```

### Step 11: Test Full Stack

```bash
# Test backend health
curl https://api.vcsa.com/api/health

# Test API authentication
curl -X POST https://api.vcsa.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@vcsa.com","password":"demo123"}'

# Test frontend
curl -I https://www.vcsa.com
```

---

## 🔍 VERIFICATION CHECKLIST

After installation, verify all items:

### Certificate Installation
- [ ] Certificate file exists at `/etc/letsencrypt/live/api.vcsa.com/fullchain.pem`
- [ ] Private key exists at `/etc/letsencrypt/live/api.vcsa.com/privkey.pem`
- [ ] Certificate is valid (not expired)
- [ ] Certificate expires in >30 days

### SSL Configuration
- [ ] HTTPS works without browser warnings
- [ ] HTTP redirects to HTTPS
- [ ] SSL Labs test scores A or higher
- [ ] All subdomains have SSL configured

### Security Headers
- [ ] HSTS header is present
- [ ] X-Frame-Options is set to DENY
- [ ] X-Content-Type-Options is set to nosniff
- [ ] X-XSS-Protection is enabled

### Services
- [ ] Backend API accessible via HTTPS
- [ ] Frontend accessible via HTTPS
- [ ] Webhook endpoint accessible via HTTPS
- [ ] Health check endpoint works

### Auto-Renewal
- [ ] Certbot timer is active
- [ ] Auto-renewal test passes
- [ ] Renewal log exists

---

## 🛠️ TROUBLESHOOTING

### Issue 1: Domain Not Pointing to Server

**Symptom**: DNS resolution fails

**Solution**:
```bash
# Check DNS propagation
dig api.vcsa.com

# If not pointing to correct IP, update DNS records
# Wait 24-48 hours for DNS propagation
# Check propagation status at: https://dnschecker.org/
```

### Issue 2: Ports Blocked

**Symptom**: Cannot connect to port 80 or 443

**Solution**:
```bash
# Check firewall status
ufw status

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Or if using iptables
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

### Issue 3: Certificate Generation Fails

**Symptom**: Certbot fails to generate certificate

**Solution**:
```bash
# Stop Nginx if it's using port 80
systemctl stop nginx

# Generate certificate in standalone mode
certbot certonly --standalone -d api.vcsa.com -d www.vcsa.com

# Start Nginx again
systemctl start nginx
```

### Issue 4: Nginx Configuration Error

**Symptom**: Nginx fails to start

**Solution**:
```bash
# Test Nginx configuration
nginx -t

# Check error log
tail -f /var/log/nginx/error.log

# Fix configuration errors and restart
systemctl restart nginx
```

### Issue 5: Browser Shows "Not Secure"

**Symptom**: HTTPS padlock doesn't appear

**Solution**:
```bash
# Check if certificate is installed
ls -la /etc/letsencrypt/live/api.vcsa.com/

# Verify Nginx SSL configuration
grep -r "ssl_certificate" /etc/nginx/

# Restart Nginx
systemctl restart nginx

# Clear browser cache and try again
```

---

## 📊 MAINTENANCE

### Check Certificate Status

```bash
# Check certificate expiration
openssl x509 -in /etc/letsencrypt/live/api.vcsa.com/cert.pem -noout -dates

# Check certbot status
certbot certificates

# Check auto-renewal status
systemctl status certbot.timer
```

### Manual Certificate Renewal

```bash
# Test renewal (dry run)
certbot renew --dry-run

# Actual renewal
certbot renew

# Restart Nginx after renewal
systemctl restart nginx
```

### Monitor SSL Expiry

```bash
# Create cron job to check expiry
crontab -e

# Add this line to check weekly
0 0 * * 0 certbot renew --quiet --no-self-upgrade
```

---

## 📝 LOG FILES

Important log files to monitor:

```bash
# Nginx logs
tail -f /var/log/nginx/vcsa-api-access.log
tail -f /var/log/nginx/vcsa-api-error.log

# Certbot logs
tail -f /var/log/letsencrypt/letsencrypt.log

# System logs
journalctl -u nginx -f
journalctl -u certbot -f
```

---

## ✅ COMPLETION CHECKLIST

When SSL setup is complete:

- [ ] Certificate installed successfully
- [ ] HTTPS works without warnings
- [ ] SSL Labs grade A or higher
- [ ] All security headers present
- [ ] HTTP redirects to HTTPS
- [ ] Auto-renewal configured
- [ ] Environment variables updated
- [ ] Services restarted
- [ ] Full stack tested
- [ ] Verification script passes all tests

---

## 🎯 SUCCESS CRITERIA

SSL installation is considered complete when:

1. ✅ Certificate is installed and valid
2. ✅ HTTPS is accessible without browser warnings
3. ✅ SSL Labs test scores A or higher
4. ✅ All 10 verification tests pass
5. ✅ Auto-renewal is configured and tested
6. ✅ Security headers are present
7. ✅ Backend and frontend work via HTTPS

---

**Document Created**: April 17, 2026
**Last Updated**: April 17, 2026
**Status**: ✅ READY FOR PRODUCTION EXECUTION
**Estimated Time**: 30-45 minutes
**Difficulty**: ⭐⭐⭐ (Intermediate)
