# 🚨 Incident Response Runbook

**Version**: 1.0.0
**Last Updated**: April 2026
**Status**: Production Ready
**Severity Levels**: P1 (Critical) → P4 (Low)

---

## 📋 Table of Contents

1. [Incident Severity Levels](#incident-severity-levels)
2. [Incident Response Team](#incident-response-team)
3. [Incident Detection](#incident-detection)
4. [Response Procedures](#response-procedures)
5. [Communication Protocols](#communication-protocols)
6. [Post-Incident Activities](#post-incident-activities)
7. [Common Incidents](#common-incidents)

---

## Incident Severity Levels

### P1 - CRITICAL (1 hour response time)
- Complete service outage
- Data breach
- Security compromise
- Payment processing failure
- **Impact**: All users affected, business critical

### P2 - HIGH (4 hour response time)
- Major feature broken
- Performance degradation (>50% users)
- Partial service outage
- **Impact**: Many users affected, significant impact

### P3 - MEDIUM (24 hour response time)
- Minor feature broken
- Performance issues (<50% users)
- Workarounds available
- **Impact**: Some users affected, limited impact

### P4 - LOW (48 hour response time)
- Cosmetic issues
- Documentation errors
- Non-critical bugs
- **Impact**: Minimal impact

---

## Incident Response Team

### Roles & Responsibilities

**Incident Commander (IC)**
- Overall incident coordination
- Decision-making authority
- Team coordination
- Status updates

**Technical Lead (TL)**
- Technical investigation
- Root cause analysis
- Fix implementation
- Testing fixes

**Communications Lead (CL)**
- Customer communications
- Status page updates
- Internal notifications
- Stakeholder management

**Support Lead (SL)**
- Customer support coordination
- User impact assessment
- Workaround documentation
- Support ticket management

---

## Incident Detection

### Monitoring Alerts

**Automated Monitoring**:
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry)
- Performance metrics (Datadog, New Relic)
- Log aggregation (ELK Stack)
- Health check endpoints

**Alert Thresholds**:
- Error rate > 5% → P2 alert
- Error rate > 20% → P1 alert
- Response time > 3s → P2 alert
- Response time > 10s → P1 alert
- Service down → P1 alert

### Manual Detection

**Channels**:
- User reports (email, support tickets)
- Internal team reports
- Social media mentions
- Third-party services (Stripe, AWS)

---

## Response Procedures

### Standard Incident Response Flow

```
1. DETECTION
   ├── Automated monitoring alert
   ├── User report
   └── Internal observation

2. ASSESSMENT
   ├── Determine severity level
   ├── Assess user impact
   └── Assign incident commander

3. RESPONSE
   ├── Mobilize response team
   ├── Investigate root cause
   ├── Implement fix or workaround
   └── Monitor resolution

4. RECOVERY
   ├── Verify fix is working
   ├── Monitor for recurrence
   ├── Remove temporary workarounds
   └── Return to normal operations

5. POST-INCIDENT
   ├── Post-mortem analysis
   ├── Document lessons learned
   ├── Update runbooks
   └── Improve processes
```

### P1 - Critical Incident Procedure

**Timeline**:
- 0-5 min: Acknowledge and assess
- 5-15 min: Mobilize team and investigate
- 15-30 min: Implement workaround
- 30-60 min: Implement fix
- 60+ min: Monitor and verify

**Steps**:

1. **Immediate Response (0-5 min)**
   ```bash
   # Acknowledge incident in Slack
   /incident-acknowledge P1 "Service Outage"

   # Check status page
   curl https://status.vcsavibes.com

   # Check health endpoints
   curl https://app.vcsavibes.com/api/health

   # Notify on-call engineer
   /pagerduty-notify oncall "P1: Service Down"
   ```

2. **Assessment & Investigation (5-15 min)**
   ```bash
   # Check server status
   ssh admin@app.vcsavibes.com
   cd /opt/vcsavibes
   ./scripts/dashboard.sh

   # Check container status
   docker-compose ps

   # Check logs
   docker-compose logs --tail=100 backend
   docker-compose logs --tail=100 frontend

   # Check system resources
   top
   df -h
   free -h
   ```

3. **Workaround Implementation (15-30 min)**
   - If total outage: Restore from backup
   - If partial outage: Restart affected services
   - If performance issue: Scale resources
   - Update status page with workaround

4. **Fix Implementation (30-60 min)**
   - Deploy hotfix to staging
   - Test thoroughly
   - Deploy to production
   - Verify fix is working

5. **Verification (60+ min)**
   - Monitor error rates
   - Check response times
   - Verify all services operational
   - Remove temporary workarounds

---

## Communication Protocols

### Internal Communication

**Slack Channels**:
- `#incidents` - Incident coordination
- `#engineering` - Technical discussion
- `#customer-support` - Support coordination

**Status Updates**:
- Every 15 minutes for P1
- Every 30 minutes for P2
- Every 2 hours for P3
- As needed for P4

**Update Format**:
```
🚨 INCIDENT UPDATE - [P1]
Status: Investigating
Impact: All users unable to access platform
ETA: Unknown
Next update: 15 minutes
```

### External Communication

**Status Page**:
- Update immediately on detection
- Update every 15 minutes during incident
- Mark resolved when fixed

**Customer Communications**:
- Email notifications for P1/P2
- In-app banners for service-wide issues
- Support team notifications for all incidents

**Social Media**:
- Monitor mentions during incidents
- Post updates for P1 incidents
- Respond to customer inquiries

---

## Post-Incident Activities

### Post-Mortem Analysis

**Within 24-48 hours**:

1. **Timeline Creation**
   - What happened?
   - When did it happen?
   - How were we notified?
   - What did we do?

2. **Root Cause Analysis**
   - Why did it happen?
   - What was the trigger?
   - Was this preventable?

3. **Impact Assessment**
   - How many users affected?
   - How long was the outage?
   - What was the business impact?

4. **Lessons Learned**
   - What did we do well?
   - What could we improve?
   - What changes need to be made?

### Action Items

**Immediate** (within 48 hours):
- [ ] Fix root cause
- [ ] Update monitoring/alerts
- [ ] Update runbooks
- [ ] Team retrospective

**Short-term** (within 1 week):
- [ ] Implement preventive measures
- [ ] Update training materials
- [ ] Improve monitoring
- [ ] Update documentation

**Long-term** (within 1 month):
- [ ] Architectural improvements
- [ ] Process changes
- [ ] Tool improvements
- [ **Knowledge base updates**

---

## Common Incidents

### 1. Database Outage

**Symptoms**:
- "Database connection failed" errors
- MongoDB container not responding
- High database CPU/memory

**Detection**:
- Health check fails: `/api/health/detailed`
- Sentry errors: "MongoDB timeout"
- Monitoring: MongoDB down alert

**Response**:
1. Check MongoDB container: `docker-compose ps mongodb`
2. Check MongoDB logs: `docker-compose logs mongodb --tail=100`
3. Restart MongoDB: `docker-compose restart mongodb`
4. If restart fails: `docker-compose down && docker-compose up -d`
5. Verify: `curl -f https://app.vcsavibes.com/api/health`

### 2. Backend Service Down

**Symptoms**:
- 502/503 errors
- Backend health check fails
- All API requests failing

**Detection**:
- Uptime monitor alerts
- Health check fails
- Sentry: 502/503 errors spike

**Response**:
1. Check backend container: `docker-compose ps backend`
2. Check backend logs: `docker-compose logs backend --tail=100`
3. Check system resources: `top`, `df -h`
4. Restart backend: `docker-compose restart backend`
5. If restart fails: `docker-compose up -d --force-recreate backend`
6. Verify: `curl -f https://app.vcsibes.com/api/health`

### 3. Frontend Build Issues

**Symptoms**:
- Frontend not loading
- White screen after load
- JavaScript errors in console

**Detection**:
- Uptime monitor: Frontend down
- User reports: "Site won't load"
- Sentry: JavaScript errors spike

**Response**:
1. Check frontend container: `docker-compose ps frontend`
2. Check frontend logs: `docker-compose logs frontend --tail=100`
3. Check build: Verify latest build is successful
4. Rollback to previous version if needed
5. Restart frontend: `docker-compose restart frontend`
6. Clear CDN cache if applicable

### 4. High Error Rate

**Symptoms**:
- Sentry error rate > 5%
- User complaints: "App is broken"
- Performance degradation

**Detection**:
- Sentry alert: Error rate threshold
- Monitoring: Error spike
- Support ticket spike

**Response**:
1. Check Sentry for error patterns
2. Identify root cause (recent deploy, bug, third-party)
3. If recent deploy: Consider rollback
4. If bug: Deploy hotfix
5. If third-party: Check status page
6. Update status page with workaround

### 5. Slow Performance

**Symptoms**:
- Response time > 3s
- Users complain: "App is slow"
- Performance alerts triggered

**Detection**:
- Monitoring: Response time threshold
- APM: Slow queries/endpoints
- User reports: Performance issues

**Response**:
1. Check APM metrics for slow endpoints
2. Check database: Slow queries, indexes
3. Check system resources: CPU, memory
4. Scale resources if needed
5. Restart services if needed
6. Optimize slow queries

### 6. Payment Processing Failure

**Symptoms**:
- Stripe webhooks failing
- Payments not processing
- User complaints: "Can't pay"

**Detection**:
- Sentry: Stripe errors
- User reports: Payment failures
- Admin: No new payments

**Response**:
1. Check Stripe status page
2. Check Stripe API keys
3. Test webhook endpoint: `/api/stripe/webhook`
4. Check webhook logs in Stripe dashboard
5. Restart backend if needed
6. Notify users of payment issues

### 7. SSL Certificate Expired

**Symptoms**:
- Browser security warnings
- "Your connection is not private"
- HTTPS not working

**Detection**:
- SSL monitoring alert
- User reports: Security warning
- Browser: Certificate expired

**Response**:
1. Check certificate expiry: `openssl s_client -connect app.vcsavibes.com:443`
2. Renew certificate if expired (Let's Encrypt)
3. Reload nginx: `docker-compose exec nginx nginx -s reload`
4. Verify: `curl -I https://app.vcsavibes.com`

### 8. Disk Space Full

**Symptoms**:
- "No space left on device"
- Container failures
- Database write errors

**Detection**:
- Monitoring: Disk space alert
- System logs: No space error
- Container failures

**Response**:
1. Check disk space: `df -h`
2. Clean Docker: `docker system prune -a`
3. Clean logs: `docker-compose logs --tail=0`
4. Clean backups: Remove old backups (>30 days)
5. Expand disk if needed
6. Monitor for recurrence

---

## Escalation Matrix

| Time | Severity | Action |
|------|----------|--------|
| 0-5 min | P1 | Notify all on-call engineers |
| 5-15 min | P1 | Notify CTO, VP Engineering |
| 15-30 min | P1 | Notify CEO, Customer Success |
| 30+ min | P1 | Notify all stakeholders |
| As needed | P2 | Notify engineering leadership |
| As needed | P3 | Notify relevant teams |

---

## Runbook Maintenance

**Update Frequency**: Quarterly
**Last Updated**: April 2026
**Next Review**: July 2026

**Owner**: DevOps Team
**Approvals**: CTO, VP Engineering

---

**Maintained by**: VCSA Operations Team
**Contact**: operations@vcsavibes.com
**Emergency**: +1 (555) 123-4567
