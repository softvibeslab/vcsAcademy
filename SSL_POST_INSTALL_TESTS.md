# 🧪 SSL Post-Installation Test Suite

**Purpose**: Comprehensive testing suite for SSL certificate installation
**Sprint**: Sprint 2 - Task 1
**Status**: Ready for Testing
**Estimated Time**: 15-20 minutes

---

## 📋 TEST OVERVIEW

This test suite verifies that SSL is correctly installed and configured across all components of the VCSA platform.

### Test Categories

1. **Infrastructure Tests** - Server, DNS, Network
2. **Certificate Tests** - Validity, Chain, Expiry
3. **Security Tests** - Headers, Protocols, Ciphers
4. **Application Tests** - Backend, Frontend, API
5. **Integration Tests** - End-to-end workflows

---

## 🔧 PRE-TEST CHECKLIST

Before running tests, ensure:

- [ ] SSL certificate is installed
- [ ] Nginx is running
- [ ] Backend service is running
- [ ] Frontend service is running (if applicable)
- [ ] Firewall allows port 443
- [ ] Domain DNS is propagated

---

## 🧪 TEST SUITE

### Category 1: Infrastructure Tests

#### Test 1.1: DNS Resolution

```bash
# Test domain resolves to correct IP
dig +short api.vcsa.com

# Expected: Returns server IP address
# Example: 1.2.3.4
```

**Pass Criteria**: Returns valid IP address

**Status**: ☐ Pass ☐ Fail

---

#### Test 1.2: Port Connectivity

```bash
# Test if port 443 is accessible
nc -zv api.vcsa.com 443

# Or using telnet
telnet api.vcsa.com 443

# Expected: Connection successful
# Example: Connection to api.vcsa.com 443 port [tcp/*] succeeded!
```

**Pass Criteria**: Port 443 is accessible

**Status**: ☐ Pass ☐ Fail

---

#### Test 1.3: HTTP to HTTPS Redirect

```bash
# Test redirect
curl -I http://api.vcsa.com

# Expected: 301 Redirect to HTTPS
# Example: HTTP/1.1 301 Moved Permanently
#         Location: https://api.vcsa.com/
```

**Pass Criteria**: HTTP redirects to HTTPS (301)

**Status**: ☐ Pass ☐ Fail

---

### Category 2: Certificate Tests

#### Test 2.1: Certificate Existence

```bash
# Check certificate files exist
ls -la /etc/letsencrypt/live/api.vcsa.com/

# Expected: List of certificate files
# - fullchain.pem
# - privkey.pem
# - chain.pem
# - cert.pem
```

**Pass Criteria**: All certificate files exist

**Status**: ☐ Pass ☐ Fail

---

#### Test 2.2: Certificate Validity

```bash
# Check certificate validity period
openssl x509 -in /etc/letsencrypt/live/api.vcsa.com/cert.pem -noout -dates

# Expected:
# notBefore=MMM DD HH:MM:SS YYYY GMT
# notAfter=MMM DD HH:MM:SS YYYY GMT
```

**Pass Criteria**: Certificate is valid (not expired)

**Status**: ☐ Pass ☐ Fail

---

#### Test 2.3: Certificate Expiry

```bash
# Check days until expiration
echo | openssl s_client -connect api.vcsa.com:443 2>/dev/null | \
  openssl x509 -noout -enddate | \
  cut -d= -f2 | \
  xargs -I {} date -d {} +%s | \
  awk '{print ($1 - systime()) / 86400}'

# Expected: Number of days > 30
# Example: 89
```

**Pass Criteria**: Certificate expires in >30 days

**Status**: ☐ Pass ☐ Fail

---

#### Test 2.4: Certificate Chain

```bash
# Verify certificate chain
openssl s_client -connect api.vcsa.com:443 -servername api.vcsa.com 2>/dev/null | \
  grep "Verify return code"

# Expected: Verify return code: 0 (ok)
```

**Pass Criteria**: Certificate chain is valid

**Status**: ☐ Pass ☐ Fail

---

### Category 3: Security Tests

#### Test 3.1: TLS Version

```bash
# Check TLS version
echo | openssl s_client -connect api.vcsa.com:443 -servername api.vcsa.com 2>/dev/null | \
  grep "Protocol" | \
  grep -oP "TLSv[\d\.]+"

# Expected: TLSv1.2 or TLSv1.3
```

**Pass Criteria**: TLS v1.2 or v1.3

**Status**: ☐ Pass ☐ Fail

---

#### Test 3.2: Security Headers

```bash
# Test security headers
curl -I https://api.vcsa.com/api/health 2>/dev/null | \
  grep -E "Strict-Transport-Security|X-Frame-Options|X-Content-Type-Options"

# Expected:
# Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
```

**Pass Criteria**: All security headers present

**Status**: ☐ Pass ☐ Fail

---

#### Test 3.3: HSTS Header

```bash
# Check HSTS header
curl -I https://api.vcsa.com/api/health 2>/dev/null | \
  grep -i "strict-transport-security"

# Expected: max-age=63072000; includeSubDomains; preload
```

**Pass Criteria**: HSTS with max-age > 1 year

**Status**: ☐ Pass ☐ Fail

---

#### Test 3.4: Server Version Disclosure

```bash
# Check server header
curl -I https://api.vcsa.com/api/health 2>/dev/null | \
  grep -i "server:"

# Expected: Server header not present or doesn't reveal version
```

**Pass Criteria**: Server version not disclosed

**Status**: ☐ Pass ☐ Fail

---

### Category 4: Application Tests

#### Test 4.1: Backend Health Check

```bash
# Test backend health via HTTPS
curl https://api.vcsa.com/api/health

# Expected: JSON response with status
# Example: {"status":"healthy","timestamp":"..."}
```

**Pass Criteria**: Health check returns 200 OK

**Status**: ☐ Pass ☐ Fail

---

#### Test 4.2: API Authentication

```bash
# Test login endpoint via HTTPS
curl -X POST https://api.vcsa.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@vcsa.com","password":"demo123"}' \
  -c /tmp/cookies.txt

# Expected: User data JSON response
# Example: {"user_id":"...","email":"demo@vcsa.com",...}
```

**Pass Criteria**: Login succeeds via HTTPS

**Status**: ☐ Pass ☐ Fail

---

#### Test 4.3: Authenticated Request

```bash
# Test authenticated request
curl https://api.vcsa.com/api/development/stages \
  -b /tmp/cookies.txt

# Expected: Array of stages
```

**Pass Criteria**: Authenticated request succeeds

**Status**: ☐ Pass ☐ Fail

---

#### Test 4.4: Frontend Access

```bash
# Test frontend via HTTPS
curl -I https://www.vcsa.com

# Expected: 200 OK with HTML content
```

**Pass Criteria**: Frontend accessible via HTTPS

**Status**: ☐ Pass ☐ Fail

---

### Category 5: Integration Tests

#### Test 5.1: Complete User Flow

```bash
# 1. Login
curl -X POST https://api.vcsa.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@vcsa.com","password":"demo123"}' \
  -c /tmp/cookies.txt

# 2. Get stages
curl https://api.vcsa.com/api/development/stages \
  -b /tmp/cookies.txt

# 3. Get progress
curl https://api.vcsa.com/api/development/progress \
  -b /tmp/cookies.txt

# Expected: All requests succeed
```

**Pass Criteria**: Complete flow works via HTTPS

**Status**: ☐ Pass ☐ Fail

---

#### Test 5.2: Webhook Endpoint

```bash
# Test webhook endpoint accessibility
curl -I https://api.vcsa.com/api/payments/webhook

# Expected: 405 Method Not Allowed (endpoint exists but wrong method)
```

**Pass Criteria**: Webhook endpoint accessible

**Status**: ☐ Pass ☐ Fail

---

#### Test 5.3: API Documentation

```bash
# Test API docs via HTTPS
curl -I https://api.vcsa.com/api/docs

# Expected: 200 OK with HTML content
```

**Pass Criteria**: API docs accessible via HTTPS

**Status**: ☐ Pass ☐ Fail

---

## 🌐 EXTERNAL TESTS

### Test 6.1: SSL Labs Test

1. Visit: https://www.ssllabs.com/ssltest/
2. Enter: `api.vcsa.com`
3. Submit and wait for analysis

**Pass Criteria**: Grade A or A+

**Status**: ☐ Pass ☐ Fail

---

### Test 6.2: Security Headers Test

1. Visit: https://securityheaders.com/
2. Enter: `https://api.vcsa.com`
3. Submit

**Pass Criteria**: Grade A or better

**Status**: ☐ Pass ☐ Fail

---

### Test 6.3: Browser Test

1. Open browser
2. Visit: `https://api.vcsa.com/api/docs`
3. Check for:
   - ☐ HTTPS padlock icon
   - ☐ No security warnings
   - ☐ Certificate is valid
   - ☐ Connection is secure

**Pass Criteria**: All browser checks pass

**Status**: ☐ Pass ☐ Fail

---

## 📊 TEST RESULTS SUMMARY

### Infrastructure Tests
- ☐ Test 1.1: DNS Resolution
- ☐ Test 1.2: Port Connectivity
- ☐ Test 1.3: HTTP to HTTPS Redirect

**Infrastructure**: ☐ Pass ☐ Fail

---

### Certificate Tests
- ☐ Test 2.1: Certificate Existence
- ☐ Test 2.2: Certificate Validity
- ☐ Test 2.3: Certificate Expiry
- ☐ Test 2.4: Certificate Chain

**Certificate**: ☐ Pass ☐ Fail

---

### Security Tests
- ☐ Test 3.1: TLS Version
- ☐ Test 3.2: Security Headers
- ☐ Test 3.3: HSTS Header
- ☐ Test 3.4: Server Version Disclosure

**Security**: ☐ Pass ☐ Fail

---

### Application Tests
- ☐ Test 4.1: Backend Health Check
- ☐ Test 4.2: API Authentication
- ☐ Test 4.3: Authenticated Request
- ☐ Test 4.4: Frontend Access

**Application**: ☐ Pass ☐ Fail

---

### Integration Tests
- ☐ Test 5.1: Complete User Flow
- ☐ Test 5.2: Webhook Endpoint
- ☐ Test 5.3: API Documentation

**Integration**: ☐ Pass ☐ Fail

---

### External Tests
- ☐ Test 6.1: SSL Labs Test
- ☐ Test 6.2: Security Headers Test
- ☐ Test 6.3: Browser Test

**External**: ☐ Pass ☐ Fail

---

## ✅ OVERALL RESULT

**Total Tests**: 21
**Passed**: ___ / 21
**Failed**: ___ / 21

**Overall Status**: ☐ PASS ☐ FAIL

---

## 🛠️ TROUBLESHOOTING GUIDE

### Common Issues

#### Issue: DNS Resolution Fails

**Symptoms**: Test 1.1 fails

**Solutions**:
1. Check DNS propagation: `dig api.vcsa.com`
2. Verify DNS records at registrar
3. Wait 24-48 hours for propagation
4. Check local DNS cache: Flush DNS cache

---

#### Issue: Port 443 Not Accessible

**Symptoms**: Test 1.2 fails

**Solutions**:
1. Check firewall: `ufw status` or `iptables -L`
2. Allow port 443: `ufw allow 443/tcp`
3. Check Nginx status: `systemctl status nginx`
4. Check if port is in use: `netstat -tulpn | grep 443`

---

#### Issue: Certificate Not Trusted

**Symptoms**: Browser shows warning, Test 2.4 fails

**Solutions**:
1. Verify certificate chain: `openssl s_client -connect api.vcsa.com:443`
2. Check intermediate certificates are installed
3. Restart Nginx: `systemctl restart nginx`
4. Clear browser cache

---

#### Issue: Security Headers Missing

**Symptoms**: Test 3.2 fails

**Solutions**:
1. Check Nginx configuration includes headers
2. Reload Nginx: `systemctl reload nginx`
3. Verify headers in response: `curl -I https://api.vcsa.com`
4. Check for caching: Use `curl -I` instead of browser

---

#### Issue: Backend Returns 401/403

**Symptoms**: Test 4.2 fails

**Solutions**:
1. Check backend is running
2. Verify CORS configuration includes HTTPS domain
3. Check environment variables updated to HTTPS
4. Restart backend service

---

## 📝 TEST SIGN-OFF

**Tester**: _______________
**Date**: _______________
**Environment**: Production / Staging

**Result**: ☐ PASS - Ready for Production
          ☐ FAIL - Issues to resolve

**Comments**:
_________________________________________________
_________________________________________________
_________________________________________________

**Approved By**: _______________
**Date**: _______________

---

**Document Created**: April 17, 2026
**Last Updated**: April 17, 2026
**Status**: ✅ READY FOR TESTING
**Version**: 1.0
