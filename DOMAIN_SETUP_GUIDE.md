# 🌐 Custom Domain Configuration Guide

**Purpose**: Complete guide for custom domain setup for VCSA platform
**Sprint**: Sprint 2 - Task 2
**Priority**: P0 - CRITICAL
**Estimated Time**: 3 hours

---

## 📋 OVERVIEW

This guide covers the complete custom domain configuration process including:

1. Domain purchase and registrar setup
2. DNS records configuration (A, CNAME, MX, TXT)
3. Subdomain configuration (api, www, app)
4. DNSSEC setup (optional but recommended)
5. DNS propagation verification
6. CDN configuration (Cloudflare/AWS CloudFront)

---

## 🎯 DOMAIN ARCHITECTURE

### Domain Structure

```
vcsa.com                     # Main domain
├── api.vcsa.com            # API backend (FastAPI)
├── www.vcsa.com            # Frontend (React)
├── app.vcsa.com            # Application (SPA)
├── mail.vcsa.com           # Email server (optional)
└── * (wildcard)            # Catch-all for future use
```

### Server Mapping

| Domain/Subdomain | Purpose | Target Server | Port |
|-----------------|---------|---------------|------|
| vcsa.com | Main domain redirect | Frontend | 443 |
| www.vcsa.com | Frontend application | Frontend | 443 |
| api.vcsa.com | API backend | Backend | 443 |
| app.vcsa.com | SPA application | Frontend | 443 |
| mail.vcsa.com | Email server | Mail server | 25/587 |

---

## 📝 STEP 1: DOMAIN PURCHASE (IF NEEDED)

### Recommended Domain Registrars

1. **Namecheap** - Affordable, good UI
2. **GoDaddy** - Popular, good support
3. **Google Domains** - Clean interface, privacy included
4. **Cloudflare Registrar** - At-cost pricing, security features

### Domain Purchase Checklist

- [ ] Domain name is available
- [ ] WHOIS privacy protection enabled
- [ ] Domain lock enabled
- [ ] Auto-renewal configured
- [ ] Contact information verified

### Domain Purchase Process

#### Step 1.1: Search for Domain

```
Example search: vcsa.com
Alternatives: vcsa.io, vcsatraining.com, vcsa-academy.com
```

#### Step 1.2: Purchase Domain

1. Create account with registrar
2. Add domain to cart
3. Configure registration:
   - Registration period: 1-10 years
   - WHOIS privacy: Enable
   - Domain lock: Enable
   - Auto-renewal: Enable
4. Complete purchase

#### Step 1.3: Verify Registration

```bash
# Check whois record
whois vcsa.com

# Check domain availability
dig vcsa.com NS
```

**Expected Output**: Domain shows your registrar information

---

## 📝 STEP 2: DNS RECORDS CONFIGURATION

### DNS Records Overview

| Type | Name | Value | TTL | Priority |
|------|------|-------|-----|----------|
| A | @ | YOUR_SERVER_IP | 3600 | - |
| A | api | YOUR_SERVER_IP | 3600 | - |
| A | www | YOUR_SERVER_IP | 3600 | - |
| A | app | YOUR_SERVER_IP | 3600 | - |
| CNAME | mail | mail.provider.com | 3600 | - |
| MX | @ | mail.vcsa.com | 3600 | 10 |
| TXT | @ | v=spf1 include:provider.com ~all | 3600 | - |
| TXT | _dmarc | v=DMARC1; p=quarantine; rua=mailto:dmarc@vcsa.com | 3600 | - |

### Step 2.1: Access DNS Management

1. Login to domain registrar
2. Navigate to DNS Management / DNS Settings
3. Locate DNS zone editor

### Step 2.2: Configure A Records

#### Root Domain (@) A Record

```
Type: A
Name: @ (or blank)
Value: YOUR_SERVER_IP (e.g., 1.2.3.4)
TTL: 3600 (1 hour)
```

#### API Subdomain A Record

```
Type: A
Name: api
Value: YOUR_SERVER_IP (e.g., 1.2.3.4)
TTL: 3600 (1 hour)
```

#### WWW Subdomain A Record

```
Type: A
Name: www
Value: YOUR_SERVER_IP (e.g., 1.2.3.4)
TTL: 3600 (1 hour)
```

#### App Subdomain A Record

```
Type: A
Name: app
Value: YOUR_SERVER_IP (e.g., 1.2.3.4)
TTL: 3600 (1 hour)
```

### Step 2.3: Configure CNAME Records (Optional)

#### Mail CNAME Record (if using external email)

```
Type: CNAME
Name: mail
Value: mail.your-email-provider.com
TTL: 3600 (1 hour)
```

### Step 2.4: Configure MX Records (Optional)

#### MX Record for Email

```
Type: MX
Name: @ (or blank)
Value: mail.vcsa.com
Priority: 10
TTL: 3600 (1 hour)
```

### Step 2.5: Configure TXT Records

#### SPF Record (for email)

```
Type: TXT
Name: @
Value: v=spf1 include:google.com ~all
TTL: 3600 (1 hour)
```

#### DMARC Record

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@vcsa.com; ruf=mailto:dmarc@vcsa.com
TTL: 3600 (1 hour)
```

#### Verification TXT Records (optional)

```
# Google Search Console verification
Type: TXT
Name: google-site-verification
Value: YOUR_VERIFICATION_CODE
TTL: 3600 (1 hour)
```

---

## 📝 STEP 3: DNSSEC CONFIGURATION (OPTIONAL)

### What is DNSSEC?

DNSSEC (Domain Name System Security Extensions) adds cryptographic authentication to DNS responses, preventing DNS spoofing and cache poisoning attacks.

### Step 3.1: Enable DNSSEC at Registrar

1. Access DNS management
2. Locate DNSSEC section
3. Enable DNSSEC for domain

### Step 3.2: Generate DNSSEC Records

The registrar will automatically generate DNSSEC records:
- DNSKEY records
- DS records
- RRSIG records

### Step 3.3: Verify DNSSEC

```bash
# Check DNSSEC status
dig +dnssec vcsa.com DNSKEY

# Verify DNSSEC chain
delv vcsa.com
```

**Expected Output**: DNSSEC validation successful

---

## 📝 STEP 4: DNS PROPAGATION VERIFICATION

### Step 4.1: Check DNS Propagation

#### Global DNS Checkers

1. **DNS Checker**: https://dnschecker.org/
2. **WhatsMyDNS**: https://www.whatsmydns.net/
3. **DNS Propagation Checker**: https://dnspropagation.net/

#### Command Line Check

```bash
# Check A record
dig vcsa.com A

# Check API subdomain
dig api.vcsa.com A

# Check WWW subdomain
dig www.vcsa.com A

# Check all nameservers
dig vcsa.com NS
```

**Expected Output**: Records point to correct IP addresses

### Step 4.2: Check Propagation Timeline

| Region | Propagation Time | Status |
|--------|-----------------|--------|
| North America | 1-4 hours | ⏳ Pending |
| Europe | 2-6 hours | ⏳ Pending |
| Asia | 4-12 hours | ⏳ Pending |
| Australia | 4-12 hours | ⏳ Pending |
| Global | 24-48 hours | ⏳ Pending |

### Step 4.3: Verify DNS Resolution

```bash
# Test from your local machine
nslookup vcsa.com
nslookup api.vcsa.com
nslookup www.vcsa.com

# Test from remote server
dig +short vcsa.com @8.8.8.8
dig +short api.vcsa.com @1.1.1.1
```

**Expected Output**: All queries return correct IP address

---

## 📝 STEP 5: CDN CONFIGURATION

### Option A: Cloudflare CDN (Recommended - FREE)

#### Step 5.1: Create Cloudflare Account

1. Visit: https://dash.cloudflare.com/
2. Create free account
3. Add domain: vcsa.com

#### Step 5.2: Update Nameservers

Cloudflare will provide nameservers like:
```
alice.ns.cloudflare.com
bob.ns.cloudflare.com
```

**Action**: Update nameservers at domain registrar

#### Step 5.3: Configure DNS Records in Cloudflare

Add these records in Cloudflare DNS:

| Type | Name | Content | Proxy | TTL |
|------|------|---------|-------|-----|
| A | api | YOUR_SERVER_IP | DNS only | Auto |
| A | www | YOUR_SERVER_IP | Proxied | Auto |
| A | @ | YOUR_SERVER_IP | Proxied | Auto |
| CNAME | app | www.vcsa.com | Proxied | Auto |

#### Step 5.4: Configure SSL/TLS

1. Go to SSL/TLS settings
2. Set encryption mode: **Full (strict)**
3. Enable **Always Use HTTPS**
4. Enable **Automatic HTTPS Rewrites**

#### Step 5.5: Configure Caching

1. Go to Caching settings
2. Configure caching level: **Standard**
3. Enable **Browser Cache TTL**: 4 hours
4. Enable **Always Online**: Yes

#### Step 5.6: Configure Page Rules (Optional)

Create rule for api subdomain:
```
*api.vcsa.com*
- Cache Level: Bypass
- Disable Performance
```

Create rule for static assets:
```
*vcsa.com/*.js
*vcsa.com/*.css
*vcsa.com/*.png
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
```

### Option B: AWS CloudFront

#### Step 5.1: Create CloudFront Distribution

1. Login to AWS Console
2. Navigate to CloudFront
3. Create Distribution

#### Step 5.2: Configure Origin Settings

```
Origin Domain Name: vcsa.com
Origin Protocol Policy: HTTPS Only
Origin SSL Protocols: TLSv1.2
```

#### Step 5.3: Configure Default Cache Behavior

```
Viewer Protocol Policy: Redirect HTTP to HTTPS
Allowed HTTP Methods: GET, HEAD, OPTIONS
Compress Objects: Yes
```

#### Step 5.4: Configure Alternate Domain Names

```
vcsa.com
www.vcsa.com
app.vcsa.com
```

#### Step 5.5: Configure SSL Certificate

1. Request ACM certificate for domains
2. Validate via DNS
3. Attach certificate to distribution

---

## 📝 STEP 6: VERIFICATION & TESTING

### Step 6.1: DNS Verification Tests

```bash
# Test all subdomains
for subdomain in "" "www" "api" "app"; do
    echo "Testing $subdomain.vcsa.com..."
    dig +short ${subdomain:+$subdomain.}vcsa.com
    echo ""
done
```

### Step 6.2: HTTP/HTTPS Access Tests

```bash
# Test HTTP access
curl -I http://vcsa.com
curl -I http://www.vcsa.com
curl -I http://api.vcsa.com

# Test HTTPS access
curl -I https://vcsa.com
curl -I https://www.vcsa.com
curl -I https://api.vcsa.com
```

### Step 6.3: SSL Certificate Tests

```bash
# Test SSL certificate
openssl s_client -connect api.vcsa.com:443 -servername api.vcsa.com

# Test SSL for all domains
for domain in "vcsa.com" "www.vcsa.com" "api.vcsa.com"; do
    echo "Testing SSL for $domain..."
    curl -I https://$domain
    echo ""
done
```

### Step 6.4: Browser Tests

1. Open browser
2. Test each domain:
   - http://vcsa.com (should redirect to https)
   - https://vcsa.com (should load frontend)
   - https://api.vcsa.com/api/health (should return JSON)
   - https://www.vcsa.com (should load frontend)

---

## ✅ COMPLETION CHECKLIST

### Domain Configuration
- [ ] Domain purchased and verified
- [ ] WHOIS privacy enabled
- [ ] Domain lock enabled
- [ ] Auto-renewal configured

### DNS Records
- [ ] A records configured (@, www, api, app)
- [ ] CNAME records configured (if using email)
- [ ] MX records configured (if using email)
- [ ] TXT records configured (SPF, DMARC)

### DNSSEC (Optional)
- [ ] DNSSEC enabled at registrar
- [ ] DNSSEC records generated
- [ ] DNSSEC verification successful

### CDN Configuration
- [ ] CDN account created (Cloudflare/AWS)
- [ ] Nameservers updated
- [ ] DNS records configured in CDN
- [ ] SSL/TLS configured
- [ ] Caching rules configured

### Verification
- [ ] DNS propagation complete
- [ ] All subdomains resolve correctly
- [ ] HTTP redirects to HTTPS
- [ ] HTTPS works for all domains
- [ ] SSL certificates valid
- [ ] CDN is caching static assets
- [ ] API accessible via HTTPS

---

## 🛠️ TROUBLESHOOTING

### Issue 1: DNS Not Propagating

**Symptoms**: DNS records not resolving

**Solutions**:
1. Check DNS configuration at registrar
2. Verify nameservers are correct
3. Wait 24-48 hours for full propagation
4. Clear local DNS cache: `ipconfig /flushdns` (Windows) or `sudo systemd-resolve --flush-caches` (Linux)

### Issue 2: Subdomains Not Working

**Symptoms**: Subdomains return 404 or don't resolve

**Solutions**:
1. Verify A records exist for subdomains
2. Check Nginx configuration includes subdomains
3. Verify DNS propagation for subdomains
4. Check firewall allows subdomain access

### Issue 3: SSL Certificate Errors

**Symptoms**: Browser shows SSL warnings

**Solutions**:
1. Verify SSL certificate covers all subdomains
2. Check certificate is installed correctly
3. Verify DNS resolves to correct server
4. Run SSL verification script

### Issue 4: CDN Not Caching

**Symptoms**: CDN not caching static assets

**Solutions**:
1. Verify CDN is configured for domain
2. Check caching rules are active
3. Verify origin is accessible
4. Check CDN SSL configuration

---

## 📚 ADDITIONAL RESOURCES

- **Cloudflare Docs**: https://developers.cloudflare.com/
- **AWS CloudFront**: https://docs.aws.amazon.com/cloudfront/
- **DNS Specifications**: https://www.iana.org/domains/root/db
- **DNSSEC Overview**: https://www.icann.org/dnssec/

---

## ✅ ACCEPTANCE CRITERIA

Custom domain configuration is complete when:

- [ ] All A records configured and resolving
- [ ] All subdomains accessible via HTTPS
- [ ] DNS propagation complete globally
- [ ] CDN configured and caching
- [ ] SSL certificates valid for all domains
- [ ] HTTP redirects to HTTPS
- [ ] API accessible via api.vcsa.com
- [ ] Frontend accessible via www.vcsa.com
- [ ] DNSSEC configured (if enabled)

---

**Document Created**: April 17, 2026
**Last Updated**: April 17, 2026
**Status**: ✅ READY FOR IMPLEMENTATION
**Owner**: DevOps Team
