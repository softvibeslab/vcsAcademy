# 🔒 Security Procedures

**Version**: 1.0.0
**Last Updated**: April 2026
**Status**: Production Ready
**Audience**: Operations Team, SREs, DevOps Engineers

---

## 📋 Table of Contents

1. [Security Overview](#security-overview)
2. [Access Control](#access-control)
3. [Security Monitoring](#security-monitoring)
4. [Vulnerability Management](#vulnerability-management)
5. [Incident Response](#incident-response)
6. [Compliance](#compliance)
7. [Security Best Practices](#security-best-practices)
8. [Security Audits](#security-audits)

---

## Security Overview

### Security Principles

**Defense in Depth**:
- Multiple layers of security
- No single point of failure
- Compartmentalization

**Least Privilege**:
- Minimum required access
- Role-based access control
- Regular access reviews

**Zero Trust**:
- Never trust, always verify
- Assume breach mentality
- Continuous monitoring

### Security Domains

```yaml
Application Security:
  - Authentication & Authorization
  - Input validation
  - Output encoding
  - Session management
  - API security

Infrastructure Security:
  - Network security
  - Server hardening
  - Container security
  - Secret management
  - Access control

Data Security:
  - Encryption at rest
  - Encryption in transit
  - Data classification
  - Backup security
  - Data retention

Operational Security:
  - Access logging
  - Change management
  - Security monitoring
  - Incident response
  - Security training
```

---

## Access Control

### SSH Access

**SSH Configuration**:

```bash
# /etc/ssh/sshd_config
Port 22
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2

# Allow only specific users
AllowUsers admin deploy

# Restart SSH
sudo systemctl restart sshd
```

**SSH Key Management**:

```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "admin@vcsavibes.com" -f ~/.ssh/vcsavibes_admin

# Copy public key to server
ssh-copy-id -i ~/.ssh/vcsavibes_admin.pub admin@app.vcsavibes.com

# Test SSH connection
ssh -i ~/.ssh/vcsavibes_admin admin@app.vcsavibes.com

# Revoke access (remove authorized key)
# On server: remove key from ~/.ssh/authorized_keys
```

**SSH Best Practices**:

```yaml
DO:
  ✅ Use key-based authentication
  ✅ Disable password authentication
  ✅ Use strong passphrases for keys
  ✅ Rotate keys regularly (quarterly)
  ✅ Limit SSH access by IP
  ✅ Use bastion host for indirect access

DON'T:
  ❌ Allow root login
  ❌ Use password authentication
  ✅ Share SSH keys
  ❌ Leave unused keys authorized
  ❌ Use default SSH port (optional)
```

### Application Access

**Role-Based Access Control (RBAC)**:

```python
# Backend RBAC configuration
from enum import Enum
from fastapi import Depends, HTTPException
from functools import lru_cache

class UserRole(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    MEMBER = "member"
    GUEST = "guest"

class Permission(str, Enum):
    # User permissions
    USER_READ = "user:read"
    USER_WRITE = "user:write"
    USER_DELETE = "user:delete"

    # Content permissions
    CONTENT_READ = "content:read"
    CONTENT_WRITE = "content:write"
    CONTENT_DELETE = "content:delete"

    # Admin permissions
    ADMIN_READ = "admin:read"
    ADMIN_WRITE = "admin:write"
    ADMIN_DELETE = "admin:delete"

# Role permissions mapping
ROLE_PERMISSIONS = {
    UserRole.ADMIN: [
        Permission.USER_READ, Permission.USER_WRITE, Permission.USER_DELETE,
        Permission.CONTENT_READ, Permission.CONTENT_WRITE, Permission.CONTENT_DELETE,
        Permission.ADMIN_READ, Permission.ADMIN_WRITE, Permission.ADMIN_DELETE,
    ],
    UserRole.MANAGER: [
        Permission.USER_READ, Permission.USER_WRITE,
        Permission.CONTENT_READ, Permission.CONTENT_WRITE,
        Permission.ADMIN_READ,
    ],
    UserRole.MEMBER: [
        Permission.USER_READ,
        Permission.CONTENT_READ,
    ],
    UserRole.GUEST: [
        Permission.CONTENT_READ,
    ],
}

def require_permission(permission: Permission):
    async def check_permission(current_user = Depends(get_current_user)):
        user_permissions = ROLE_PERMISSIONS.get(current_user.role, [])
        if permission not in user_permissions:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return check_permission

# Usage
@router.get("/admin/users")
@require_permission(Permission.ADMIN_READ)
async def list_users():
    return await db.users.find().to_list(None)
```

**API Access Control**:

```python
# API key authentication
from fastapi import Security, HTTPException
from fastapi.security.api_key import APIKeyHeader

API_KEY_HEADER = APIKeyHeader(name="X-API-Key")

async def verify_api_key(api_key: str = Security(API_KEY_HEADER)):
    # Check against database or environment
    valid_keys = os.getenv("API_KEYS", "").split(",")
    if api_key not in valid_keys:
        raise HTTPException(status_code=403, detail="Invalid API key")
    return api_key

# Usage
@router.post("/api/external/webhook")
async def webhook(api_key: str = Depends(verify_api_key)):
    # Process webhook
    pass
```

### Database Access

**MongoDB Authentication**:

```yaml
# docker-compose.yml
environment:
  MONGO_INITDB_ROOT_USERNAME: admin
  MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
  MONGO_INITDB_DATABASE: vcsa
```

**User Management**:

```bash
# Connect to MongoDB
docker-compose exec mongodb mongosh

# Create application user
db.createUser({
  user: "vcsa_app",
  pwd: "strong_password_here",
  roles: [
    { role: "readWrite", db: "vcsa" }
  ]
})

# Create backup user
db.createUser({
  user: "vcsa_backup",
  pwd: "another_strong_password",
  roles: [
    { role: "backup", db: "vcsa" }
  ]
})

# Create read-only user
db.createUser({
  user: "vcsa_readonly",
  pwd: "yet_another_password",
  roles: [
    { role: "read", db: "vcsa" }
  ]
})
```

**Connection Security**:

```python
# Backend database connection
# Use environment variables for credentials
MONGO_URL = os.getenv(
    "MONGO_URL",
    "mongodb://vcsa_app:password@mongodb:27017/vcsa?authSource=vcsa"
)

# Enable TLS for production connections
MONGO_URL_PROD = os.getenv(
    "MONGO_URL_PROD",
    "mongodb://vcsa_app:password@mongodb.prod.vcsavibes.com:27017/vcsa?authSource=vcsa&tls=true"
)
```

---

## Security Monitoring

### Log Monitoring

**Security Events to Monitor**:

```yaml
Authentication Events:
  - Failed login attempts
  - Successful logins (from unusual locations)
  - Password changes
  - Permission changes
  - Account creation/deletion

Authorization Events:
  - Access denied
  - Privilege escalation attempts
  - Resource access outside business hours
  - Unusual API usage patterns

Data Events:
  - Large data exports
  - Unusual query patterns
  - Access to sensitive data
  - Bulk delete operations

Network Events:
  - Port scanning
  - DDoS attempts
  - Unusual traffic patterns
  - Connection from blacklisted IPs
```

**Log Aggregation**:

```bash
# Security log monitoring script
#!/bin/bash
# /opt/vcsavibes/scripts/monitor_security.sh

LOG_FILE="/var/log/vcsavibes/security.log"
ALERT_WEBHOOK="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

# Check for failed logins
FAILED_LOGINS=$(docker-compose logs backend --since="1h" | grep -i "failed login" | wc -l)
if [ $FAILED_LOGINS -gt 10 ]; then
    echo "[$(date)] ALERT: $FAILED_LOGINS failed logins in last hour" >> "$LOG_FILE"
    curl -X POST "$ALERT_WEBHOOK" -d "{\"text\": \"🚨 High number of failed logins: $FAILED_LOGINS\"}"
fi

# Check for authorization failures
AUTH_FAILURES=$(docker-compose logs backend --since="1h" | grep -i "403\|unauthorized" | wc -l)
if [ $AUTH_FAILURES -gt 50 ]; then
    echo "[$(date)] ALERT: $AUTH_FAILURES authorization failures in last hour" >> "$LOG_FILE"
    curl -X POST "$ALERT_WEBHOOK" -d "{\"text\": \"🚨 High number of authorization failures: $AUTH_FAILURES\"}"
fi

# Check for unusual database activity
DB_EXPORTS=$(docker-compose logs mongodb --since="1h" | grep -i "mongodump\|export" | wc -l)
if [ $DB_EXPORTS -gt 0 ]; then
    echo "[$(date)] ALERT: Database export detected" >> "$LOG_FILE"
    curl -X POST "$ALERT_WEBHOOK" -d "{\"text\": \"🚨 Database export detected\"}"
fi

echo "[$(date)] Security monitoring completed" >> "$LOG_FILE"
```

**Security Dashboard**:

```yaml
Metrics to Monitor:
  - Failed login rate (per minute)
  - Authorization failure rate (per minute)
  - Unique IPs accessing the system
  - Requests per user
  - Database query patterns
  - Data export attempts

Alert Thresholds:
  - Failed logins: > 10/hour
  - Authorization failures: > 50/hour
  - Unusual location: New country/city
  - Data export: Any export > 1000 records
```

### Intrusion Detection

**Fail2Ban Configuration**:

```bash
# /etc/fail2ban/jail.local
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
```

**Security Scanning**:

```bash
# Daily vulnerability scan
#!/bin/bash
# /opt/vcsavibes/scripts/security_scan.sh

# Scan Docker images
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
    aquasec/trivy image --severity HIGH,CRITICAL \
    vcsavibes/backend:latest

# Scan dependencies
cd /opt/vcsavibes/backend
pip-audit

cd /opt/vcsavibes/frontend
npm audit --audit-level=high

# Scan for exposed secrets
git-secrets scan /opt/vcsavibes

# Check for common vulnerabilities
./scripts/security_check.sh
```

---

## Vulnerability Management

### Dependency Scanning

**Automated Scanning**:

```yaml
GitHub Actions (automated):
  - Runs on every PR
  - Scans dependencies for vulnerabilities
  - Blocks merge if critical vulnerabilities found
  - Creates issues for remediation

Daily Scanning:
  - Automated security scans
  - Report generated daily
  - Alerts for new critical vulnerabilities

Weekly Scanning:
  - Full vulnerability scan
  - Includes transitive dependencies
  - Prioritized remediation plan
```

**Scanning Tools**:

```bash
# Backend scanning
cd backend
pip-audit --desc
safety check

# Frontend scanning
cd frontend
npm audit
npm audit fix

# Docker image scanning
docker run --rm -v /opt/vcsavibes:/app \
    trivy fs --severity HIGH,CRITICAL /app

# Container scanning
trivy image vcsavibes/backend:latest
```

### Patch Management

**Patch Priority**:

```yaml
Critical (Patch within 24 hours):
  - Remote code execution
  - SQL injection
  - Authentication bypass
  - Data exposure

High (Patch within 1 week):
  - XSS vulnerabilities
  - CSRF vulnerabilities
  - Privilege escalation
  - DoS vulnerabilities

Medium (Patch within 1 month):
  - Information disclosure
  - Race conditions
  - Resource exhaustion

Low (Patch within 3 months):
  - Minor issues
  - Best practice violations
```

**Patch Procedure**:

```bash
# 1. Identify vulnerability
npm audit
pip-audit

# 2. Check for patch
npm audit fix
pip install --upgrade <package>

# 3. Test in staging
git checkout staging
git pull origin staging
# Apply patch
docker-compose up -d --build
# Test functionality

# 4. Deploy to production
git checkout main
git merge staging
git push origin main
# Create release to trigger deployment

# 5. Verify
# Monitor logs
# Check error rates
# Verify fix works
```

---

## Incident Response

### Security Incident Classification

**Incident Types**:

```yaml
P1 - Critical (Immediate Response):
  - Confirmed data breach
  - Active intrusion
  - Ransomware infection
  - Complete system compromise

P2 - High (Response within 1 hour):
  - Suspected data breach
  - Unauthorized access attempt
  - Malware detected
  - DDoS attack

P3 - Medium (Response within 4 hours):
  - Security policy violation
  - Vulnerability exploited
  - Suspicious activity
  - Social engineering attempt

P4 - Low (Response within 24 hours):
  - Potential security issue
  - Policy violation
  - Misconfiguration
```

### Incident Response Procedure

**1. Detection & Identification**:

```bash
# Identify suspicious activity
./scripts/monitor_security.sh

# Check logs
docker-compose logs backend | grep -i "error\|exception\|failed"
tail -100 /var/log/nginx/access.log | grep -i "401\|403"

# Verify incident
# Confirm it's not a false positive
# Assess scope and impact
```

**2. Containment**:

```yaml
Immediate Actions:
  - Isolate affected systems
  - Suspend compromised accounts
  - Block malicious IPs
  - Disable vulnerable services

Containment Strategies:
  - Network containment (block IPs, subnet isolation)
  - System containment (stop services, shutdown servers)
  - Account containment (disable accounts, reset passwords)
```

**3. Eradication**:

```bash
# Remove malicious code
# Delete unauthorized accounts
# Patch vulnerabilities
# Remove malware

# Example: Remove unauthorized SSH key
# Edit ~/.ssh/authorized_keys
# Remove suspicious key

# Example: Remove malicious container
docker stop malicious_container
docker rm malicious_container
docker rmi malicious_image
```

**4. Recovery**:

```bash
# Restore from clean backup
./scripts/restore_database.sh /path/to/clean/backup.gz

# Reset all passwords
docker-compose exec mongodb mongosh --eval "
db.users.updateMany({}, {\$set: {password_reset_required: true}})
"

# Verify system integrity
./scripts/security_scan.sh

# Monitor for recurrence
./scripts/monitor_security.sh
```

**5. Post-Incident Activities**:

```yaml
Documentation:
  - Incident timeline
  - Root cause analysis
  - Actions taken
  - Lessons learned

Prevention:
  - Implement new controls
  - Update procedures
  - Train team
  - Share knowledge

Reporting:
  - Internal report
  - Customer notification (if required)
  - Regulatory report (if required)
  - Public statement (if required)
```

---

## Compliance

### Data Protection

**GDPR Compliance**:

```yaml
User Rights:
  - Right to access: Users can export their data
  - Right to rectification: Users can update their data
  - Right to erasure: Users can delete their account
  - Right to portability: Users can export their data
  - Right to object: Users can opt-out of processing

Implementation:
  - Data export endpoint: GET /api/user/export
  - Data deletion endpoint: DELETE /api/user/account
  - Cookie consent banner
  - Privacy policy page
  - Data processing agreement
```

**Data Encryption**:

```python
# Encryption at rest (MongoDB)
# MongoDB Enterprise or use filesystem encryption
# Or use encrypted volumes (LUKS, BitLocker)

# Encryption in transit (TLS/SSL)
from fastapi import FastAPI
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

app = FastAPI()
app.add_middleware(HTTPSRedirectMiddleware)

# Force HTTPS
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response
```

### PCI DSS Compliance (for payments)

**Payment Security**:

```yaml
Requirements:
  - Never store full card data
  - Use Stripe for payment processing
  - Use Stripe Elements for card input
  - Log all payment operations
  - Regular security audits

Implementation:
  - Stripe handles card data
  - Only store last 4 digits
  - Store Stripe token for future use
  - PCI-compliant logging
  - Annual security review
```

---

## Security Best Practices

### Application Security

**Input Validation**:

```python
from pydantic import BaseModel, validator, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain digit')
        return v

    @validator('name')
    def validate_name(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Name is required')
        if len(v) > 100:
            raise ValueError('Name too long')
        return v.strip()
```

**Output Encoding**:

```python
from fastapi.responses import JSONResponse
import html

def safe_response(data: dict) -> JSONResponse:
    """Encode output to prevent XSS"""
    sanitized = {}
    for key, value in data.items():
        if isinstance(value, str):
            sanitized[key] = html.escape(value)
        else:
            sanitized[key] = value
    return JSONResponse(content=sanitized)
```

### Infrastructure Security

**Server Hardening**:

```bash
# Disable unused services
sudo systemctl disable bluetooth
sudo systemctl disable cups

# Enable firewall
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Install security updates
sudo apt update
sudo apt upgrade -y
sudo apt autoremove -y

# Configure automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

**Container Security**:

```yaml
Docker Security:
  - Use minimal base images (alpine)
  - Run as non-root user
  - Read-only file systems where possible
  - Limit container capabilities
  - Scan images for vulnerabilities
  - Keep images updated

docker-compose.yml:
  services:
    backend:
      security_opt:
        - no-new-privileges:true
      read_only: true
      tmpfs:
        - /tmp
      cap_drop:
        - ALL
      cap_add:
        - NET_BIND_SERVICE
```

---

## Security Audits

### Monthly Security Review

**Checklist**:

```yaml
Access Control:
  [ ] Review user access (remove unused accounts)
  [ ] Review SSH keys (revoke unused keys)
  [ ] Review API keys (rotate if needed)
  [ ] Review permissions (ensure least privilege)

Vulnerability Management:
  [ ] Run dependency scans
  [ ] Review vulnerability reports
  [ ] Apply security patches
  [ ] Update security tools

Monitoring & Logging:
  [ ] Review security logs
  [ ] Check for unusual activity
  [ ] Verify alerts working
  [ ] Test monitoring systems

Configuration:
  [ ] Review security configurations
  [ ] Check for misconfigurations
  [ ] Verify encryption enabled
  [ ] Test backup restoration

Documentation:
  [ ] Update security procedures
  [ ] Document incidents
  [ ] Review runbooks
  [ ] Train team
```

### Quarterly Security Audit

**Full Security Assessment**:

```yaml
Penetration Testing:
  - External penetration test
  - Internal penetration test
  - Application security test
  - Social engineering test

Compliance Review:
  - GDPR compliance check
  - PCI DSS compliance check (if applicable)
  - Security policy review
  - Incident response test

Infrastructure Review:
  - Network security review
  - Server hardening check
  - Container security review
  - Database security check

Third-Party Review:
  - Vendor security assessments
  - Service provider reviews
  - Supply chain security
  - Data processing agreements
```

---

## Security Contacts

### Security Team

| Role | Name | Contact |
|------|------|----------|
| Security Lead | [Name] | security@vcsavibes.com |
| CTO | [Name] | cto@vcsavibes.com |
| VP Engineering | [Name] | vp@vcsavibes.com |

### Incident Response

| Severity | Response Time | Contact |
|----------|---------------|---------|
| P1 - Critical | Immediate | +1 (555) 123-4567 |
| P2 - High | 1 hour | security@vcsavibes.com |
| P3 - Medium | 4 hours | security@vcsavibes.com |
| P4 - Low | 24 hours | security@vcsavibes.com |

### Vulnerability Disclosure

**Report Vulnerabilities**:
- Email: security@vcsavibes.com
- PGP Key: Available on website
- Response Time: 48 hours

---

## Runbook Maintenance

**Update Frequency**: Monthly
**Last Updated**: April 2026
**Next Review**: May 2026

**Owner**: Security Manager
**Approvals**: CTO, VP Engineering

---

**Maintained by**: VCSA Operations Team
**Contact**: operations@vcsavibes.com
**Emergency**: +1 (555) 123-4567
