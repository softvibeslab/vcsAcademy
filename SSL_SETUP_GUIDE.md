# 🔒 SSL Certificate Setup Guide

**Purpose**: Complete guide for setting up SSL certificates for VCSA production infrastructure
**Sprint**: Sprint 2 - Task 1
**Priority**: P0 - CRITICAL
**Estimate**: 4 hours

---

## 📋 Overview

This guide covers three SSL certificate options:

1. **Let's Encrypt (Free)** - Recommended for development/staging
2. **Cloudflare SSL (Free)** - Recommended if using Cloudflare CDN
3. **Commercial SSL (Paid)** - Recommended for production with warranty

---

## 🔧 Option 1: Let's Encrypt (Certbot) - FREE

### Prerequisites
- Domain name pointing to server IP
- Server with root access
- Port 80 and 443 open

### Installation Steps

#### Step 1: Install Certbot

**Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

**CentOS/RHEL**:
```bash
sudo yum install certbot python3-certbot-nginx
```

#### Step 2: Generate SSL Certificate

**For Nginx**:
```bash
sudo certbot --nginx -d api.vcsa.com -d www.vcsa.com -d vcsa.com
```

**For standalone (no webserver)**:
```bash
sudo certbot certonly --standalone -d api.vcsa.com
```

#### Step 3: Verify Installation

Certificates are installed in:
- Certificate: `/etc/letsencrypt/live/vcsa.com/fullchain.pem`
- Private Key: `/etc/letsencrypt/live/vcsa.com/privkey.pem`

#### Step 4: Setup Auto-Renewal

Certbot automatically sets up a systemd timer or cron job. Verify:

```bash
sudo systemctl status certbot.timer
sudo certbot renew --dry-run
```

#### Step 5: Configure Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name api.vcsa.com;

    ssl_certificate /etc/letsencrypt/live/vcsa.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vcsa.com/privkey.pem;

    # Strong SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256...';
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.vcsa.com;
    return 301 https://$server_name$request_uri;
}
```

#### Step 6: Test SSL Configuration

```bash
# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Verify SSL
curl https://api.vcsa.com/api/health
```

---

## 🌐 Option 2: Cloudflare SSL - FREE

### Prerequisites
- Cloudflare account (free tier)
- Domain added to Cloudflare

### Installation Steps

#### Step 1: Add Domain to Cloudflare

1. Login to Cloudflare dashboard
2. Click "Add a Site"
3. Enter domain name (vcsa.com)
4. Select Free plan
5. Cloudflare will scan existing DNS records

#### Step 2: Update Nameservers

Cloudflare will provide two nameservers:
```
alice.ns.cloudflare.com
bob.ns.cloudflare.com
```

Update your domain registrar to use these nameservers.

#### Step 3: Configure DNS Records

Add DNS records in Cloudflare:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | api | YOUR_SERVER_IP | Proxied |
| A | www | YOUR_SERVER_IP | Proxied |
| A | @ | YOUR_SERVER_IP | Proxied |

#### Step 4: Enable SSL/TLS

In Cloudflare dashboard:
1. Go to SSL/TLS
2. Choose encryption mode: **Full (strict)**
3. Enable **Always Use HTTPS**
4. Enable **Automatic HTTPS Rewrites**

#### Step 5: Configure Origin Certificate (Optional)

For extra security, generate an Origin Certificate:

1. SSL/TLS → Origin Server → Create Certificate
2. Select hostnames: `*.vcsa.com`, `vcsa.com`
3. Validity: 15 years
4. Click Create
5. Save the certificate and key

**Install on Nginx**:
```nginx
ssl_certificate /etc/nginx/cloudflare/vcsa.com.pem;
ssl_certificate_key /etc/nginx/cloudflare/vcsa.com.key;
```

#### Step 6: Test SSL Configuration

```bash
# Wait for DNS propagation (can take up to 24 hours)
dig api.vcsa.com

# Test SSL
curl https://api.vcsa.com/api/health
```

---

## 💳 Option 3: Commercial SSL Certificate

### Recommended Providers
- **DigiCert** - Premium, expensive ($200+/year)
- **Sectigo** - Mid-range ($50-100/year)
- **Comodo** - Budget ($20-50/year)

### Installation Steps

#### Step 1: Generate CSR (Certificate Signing Request)

**Generate Private Key**:
```bash
openssl genrsa -out vcsa.com.key 2048
```

**Generate CSR**:
```bash
openssl req -new -key vcsa.com.key -out vcsa.com.csr
```

You'll be asked for:
- Country Name (2 letter code): `US`
- State or Province Name: `YourState`
- Locality Name: `YourCity`
- Organization Name: `YourCompany`
- Common Name: `*.vcsa.com` (for wildcard) or `api.vcsa.com`
- Email Address: `admin@vcsa.com`

#### Step 2: Submit CSR to Certificate Authority

1. Purchase SSL certificate from provider
2. Submit the CSR file (`vcsa.com.csr`)
3. Complete domain validation (email, DNS, or file)
4. Download certificate files

#### Step 3: Install Certificate

You'll receive:
- `your_domain.crt` - Your certificate
- `ca_bundle.crt` - CA intermediate certificates

**Combine certificate and CA bundle**:
```bash
cat your_domain.crt ca_bundle.crt > ssl-bundle.crt
```

**Configure Nginx**:
```nginx
ssl_certificate /etc/nginx/ssl/ssl-bundle.crt;
ssl_certificate_key /etc/nginx/ssl/vcsa.com.key;
```

#### Step 4: Configure Nginx

See Option 1, Step 5 for complete Nginx SSL configuration.

---

## 🔍 SSL Testing & Validation

### Test 1: SSL Labs Test

Visit: https://www.ssllabs.com/ssltest/

**Expected Result**: Grade A or A+

### Test 2: Curl Test

```bash
# Test HTTPS connection
curl -I https://api.vcsa.com/api/health

# Expected output should include:
# HTTP/2 200
# strict-transport-security: max-age=63072000
```

### Test 3: Browser Test

1. Open `https://api.vcsa.com/api/docs`
2. Verify no security warnings
3. Check for HTTPS padlock icon
4. Click padlock → "Connection is secure"

### Test 4: SSL Configuration Check

```bash
# Check certificate details
openssl s_client -connect api.vcsa.com:443 -servername api.vcsa.com

# Check certificate expiration
echo | openssl s_client -connect api.vcsa.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

## 🛡️ Security Hardening

### Recommended SSL Configuration

```nginx
# Strong SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
ssl_prefer_server_ciphers off;

# SSL session caching
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

# OCSP Stapling
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;

# Security Headers
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Content-Security-Policy "default-src 'self'" always;
```

---

## 📋 Pre-Production Checklist

Before going live, verify:

- [ ] SSL certificate installed correctly
- [ ] HTTPS works without browser warnings
- [ ] SSL Labs test scores A or higher
- [ ] HSTS header is present
- [ ] Auto-renewal configured (Let's Encrypt)
- [ ] Certificate expiry date is >30 days away
- [ ] All subdomains (api, www, app) have SSL
- [ ] HTTP redirects to HTTPS
- [ ] Backend API accessible via HTTPS
- [ ] Frontend can communicate with HTTPS backend

---

## 🔧 Troubleshooting

### Issue: Certificate Not Trusted

**Symptom**: Browser shows "Certificate not trusted" warning

**Solution**:
1. Verify certificate chain is complete
2. Check intermediate certificates are installed
3. Verify certificate matches domain name

### Issue: Mixed Content Warning

**Symptom**: Browser shows mixed content (HTTP + HTTPS)

**Solution**:
1. Update all HTTP URLs to HTTPS
2. Add CSP header to block mixed content
3. Use relative URLs or protocol-relative URLs

### Issue: SSL Handshake Failed

**Symptom**: `SSL_ERROR_HANDSHAKE_FAILURE`

**Solution**:
1. Verify private key matches certificate
2. Check certificate files are readable
3. Verify SSL port (443) is open
4. Check firewall rules

---

## 📚 Additional Resources

- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Cloudflare SSL/TLS](https://developers.cloudflare.com/ssl/)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)
- [SSL Labs Server Test](https://www.ssllabs.com/ssltest/)

---

## ✅ Acceptance Criteria

- [ ] HTTPS works without browser warnings
- [ ] SSL Labs test scores A or higher
- [ ] Auto-renewal configured and tested
- [ ] All subdomains have SSL configured
- [ ] HSTS header is present
- [ ] HTTP redirects to HTTPS

---

**Document Created**: April 17, 2026
**Last Updated**: April 17, 2026
**Owner**: DevOps Team
**Status**: 🟢 READY FOR IMPLEMENTATION
