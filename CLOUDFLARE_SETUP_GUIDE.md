# ☁️ Cloudflare CDN Setup Guide

**Purpose**: Complete guide for configuring Cloudflare CDN for VCSA platform
**Sprint**: Sprint 2 - Task 2 (CDN Configuration)
**Priority**: P0 - CRITICAL
**Estimated Time**: 1 hour

---

## 📋 OVERVIEW

Cloudflare provides:
- **Free CDN** - Global content delivery network
- **DDoS Protection** - Protection against attacks
- **SSL/TLS** - Free HTTPS certificates
- **Caching** - Faster load times
- **Security** - Web Application Firewall (WAF)

---

## 🚀 SETUP PROCESS

### Step 1: Create Cloudflare Account

1. Visit: https://dash.cloudflare.com/
2. Click "Sign Up"
3. Register with email:
   ```
   Email: admin@vcsa.com
   Password: [Strong password]
   ```
4. Verify email address

---

### Step 2: Add Domain to Cloudflare

1. Click "Add a Site"
2. Enter domain: `vcsa.com`
3. Select **Free** plan
4. Click "Add Site"

---

### Step 3: Scan DNS Records

Cloudflare will automatically scan existing DNS records.

**Review scanned records**:
- ✅ Keep existing A records
- ✅ Keep existing CNAME records
- ✅ Keep existing MX records

---

### Step 4: Update Nameservers

Cloudflare will provide two nameservers:
```
alice.ns.cloudflare.com
bob.ns.cloudflare.com
```

#### Step 4.1: Update at Domain Registrar

1. Login to your domain registrar (GoDaddy, Namecheap, etc.)
2. Navigate to DNS Settings / Nameservers
3. Select "Custom nameservers"
4. Replace existing nameservers with Cloudflare nameservers:
   ```
   ns1: alice.ns.cloudflare.com
   ns2: bob.ns.cloudflare.com
   ```
5. Save changes

#### Step 4.2: Verify Nameserver Update

```bash
# Check if nameservers are updated
dig vcsa.com NS

# Expected: Should show Cloudflare nameservers
```

**Note**: Nameserver propagation can take 24-48 hours

---

### Step 5: Configure DNS Records in Cloudflare

After nameservers propagate, configure DNS records:

#### Required Records

| Type | Name | Content | Proxy Status | TTL |
|------|------|---------|--------------|-----|
| A | api | YOUR_SERVER_IP | DNS Only | Auto |
| A | www | YOUR_SERVER_IP | Proxied | Auto |
| A | @ | YOUR_SERVER_IP | Proxied | Auto |
| CNAME | app | www.vcsa.com | Proxied | Auto |

#### Configuration Steps

1. Go to **DNS** → **Records**
2. Add each record with above values
3. Set proxy status:
   - **API**: DNS Only (don't cache API calls)
   - **WWW/App**: Proxied (cache static content)

---

### Step 6: Configure SSL/TLS

1. Go to **SSL/TLS** → **Overview**
2. Set encryption mode: **Full (strict)**
   - This ensures HTTPS between Cloudflare and origin

3. Enable **Always Use HTTPS**
   - Automatically redirects HTTP to HTTPS

4. Enable **Automatic HTTPS Rewrites**
   - Rewrites HTTP links to HTTPS

---

### Step 7: Configure Caching

1. Go to **Caching** → **Configuration**

2. Set **Caching Level**: Standard

3. Configure **Browser Cache TTL**: 4 hours
   - Respects "Existing Headers"

4. Enable **Always Online**: Yes
   - Serves cached pages if origin server goes down

---

### Step 8: Create Page Rules (Optional)

#### Rule 1: API Subdomain - Bypass Cache

1. Go to **Rules** → **Page Rules**
2. Create Page Rule
3. Match: `*api.vcsa.com/*`
4. Settings:
   - Cache Level: Bypass
   - Disable Performance
   - Disable Security
   - Disable Apps

#### Rule 2: Static Assets - Cache Everything

1. Create another Page Rule
2. Match: `*vcsa.com/*.js*vcsa.com/*.css*vcsa.com/*.png*vcsa.com/*.jpg*vcsa.com/*.svg`
3. Settings:
   - Cache Level: Cache Everything
   - Edge Cache TTL: 1 month
   - Browser Cache TTL: 4 hours

---

### Step 9: Configure Security Settings

1. Go to **Security** → **Settings**

2. **Security Level**: Medium
   - Basic protection for most sites

3. **Bot Fight Mode**: On
   - Blocks automated bots

4. **Challenge Passage**: 30 minutes
   - Remember verified visitors

---

### Step 10: Configure Firewall Rules (Optional)

1. Go to **Security** → **WAF**

2. Create rule to block suspicious traffic:
   ```
   Field: User Agent
   Operator: contains
   Value: bot, crawler, spider
   Action: Block
   ```

---

### Step 11: Setup Analytics

1. Go to **Analytics** → **Overview**
2. Review traffic patterns
3. Monitor cached vs uncached requests
4. Check top visitor countries

---

### Step 12: Test Configuration

#### Test 1: DNS Resolution

```bash
# Check if domain resolves to Cloudflare
dig vcsa.com

# Should show Cloudflare IPs (not your origin IP)
```

#### Test 2: HTTP/HTTPS Access

```bash
# Test HTTP redirects to HTTPS
curl -I http://vcsa.com

# Should return 301/302 redirect to HTTPS
```

#### Test 3: API Accessibility

```bash
# Test API (should bypass cache)
curl https://api.vcsa.com/api/health

# Should return health check JSON
```

#### Test 4: CDN Caching

```bash
# Check response headers
curl -I https://www.vcsa.com

# Should show:
# CF-Cache-Status: HIT (for cached content)
# CF-Ray: [ray ID]
```

---

## ✅ VERIFICATION CHECKLIST

### Cloudflare Configuration
- [ ] Account created
- [ ] Domain added
- [ ] Nameservers updated at registrar
- [ ] Nameservers propagated globally
- [ ] DNS records configured
- [ ] SSL/TLS configured (Full strict)
- [ ] Always Use HTTPS enabled
- [ ] Caching configured
- [ ] Page rules created (optional)
- [ ] Security settings configured

### Testing
- [ ] Domain resolves to Cloudflare
- [ ] HTTP redirects to HTTPS
- [ ] API accessible via HTTPS
- [ ] Frontend loads correctly
- [ ] CDN is caching static assets
- [ ] CF-Cache-Status headers present

---

## 🛠️ TROUBLESHOOTING

### Issue 1: Nameservers Not Updating

**Symptoms**: Domain still shows old nameservers

**Solutions**:
1. Verify nameservers at registrar
2. Wait 24-48 hours for propagation
3. Check whois record: `whois vcsa.com`

### Issue 2: SSL Errors

**Symptoms**: "5xx" errors or SSL warnings

**Solutions**:
1. Check SSL/TLS mode is "Full (strict)"
2. Verify origin server has valid SSL certificate
3. Check origin server is accessible on port 443

### Issue 3: API Not Working

**Symptoms**: API returns errors or timeouts

**Solutions**:
1. Verify API subdomain is "DNS Only" (not proxied)
2. Check origin server firewall allows Cloudflare IPs
3. Verify origin server is running

### Issue 4: Cache Not Working

**Symptoms**: CF-Cache-Status shows BYPASS

**Solutions**:
1. Check caching level is set to "Standard"
2. Verify cache rules aren't bypassing cache
3. Check origin server isn't sending no-cache headers

---

## 📊 MONITORING

### Cloudflare Analytics

Monitor these metrics:

1. **Total Requests** - Overall traffic
2. **Cached Requests** - Cache hit ratio (target: >80%)
3. **Uncached Requests** - Content not cached
4. **Bandwidth** - Data transferred
5. **Threats** - Blocked threats
6. **Visitor Countries** - Geographic distribution

### Target Metrics

- Cache Hit Ratio: >80%
- Average Response Time: <200ms
- Uptime: >99.9%
- Threats Blocked: 100%

---

## 🔧 ADVANCED CONFIGURATION

### Argonaut Tier (Paid Features)

If upgrading to Pro plan:

1. **Image Optimization** - Auto-optimize images
2. **Mobile Redirect** - Redirect mobile visitors
3. **Polish** - Optimize web content
4. **Rocket Loader** - Optimize JavaScript loading

### Web Application Firewall (WAF)

Enable WAF rules for:
- SQL injection protection
- XSS protection
- File upload protection
- Rate limiting

---

## 📚 ADDITIONAL RESOURCES

- **Cloudflare Docs**: https://developers.cloudflare.com/
- **DNS Records**: https://developers.cloudflare.com/dns/
- **SSL/TLS**: https://developers.cloudflare.com/ssl/
- **Caching**: https://developers.cloudflare.com/cache/

---

## ✅ ACCEPTANCE CRITERIA

Cloudflare configuration is complete when:

- [ ] Nameservers updated and propagated
- [ ] All DNS records configured
- [ ] SSL/TLS working (Full strict)
- [ ] HTTP redirects to HTTPS
- [ ] CDN caching static assets
- [ ] API accessible via HTTPS (bypasses cache)
- [ ] Security settings configured
- [ ] Analytics showing traffic data
- [ ] Cache hit ratio >80%

---

**Document Created**: April 17, 2026
**Last Updated**: April 17, 2026
**Status**: ✅ READY FOR IMPLEMENTATION
**Owner**: DevOps Team
