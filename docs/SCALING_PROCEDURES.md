# 📈 Scaling Procedures

**Version**: 1.0.0
**Last Updated**: April 2026
**Status**: Production Ready
**Audience**: Operations Team, SREs, DevOps Engineers

---

## 📋 Table of Contents

1. [Scaling Overview](#scaling-overview)
2. [Scaling Strategy](#scaling-strategy)
3. [Horizontal Scaling](#horizontal-scaling)
4. [Vertical Scaling](#vertical-scaling)
5. [Database Scaling](#database-scaling)
6. [Caching Strategies](#caching-strategies)
7. [CDN Scaling](#cdn-scaling)
8. [Auto-Scaling](#auto-scaling)

---

## Scaling Overview

### Scaling Philosophy

**Scaling Goals**:
- Maintain performance under load
- Zero downtime during scaling
- Cost-effective resource utilization
- Proactive scaling, not reactive

### Scaling Triggers

```yaml
CPU Triggers:
  - Warning: CPU > 70% for 5 minutes
  - Scale Up: CPU > 80% for 3 minutes
  - Scale Down: CPU < 30% for 15 minutes

Memory Triggers:
  - Warning: Memory > 80% for 5 minutes
  - Scale Up: Memory > 90% for 3 minutes
  - Scale Down: Memory < 40% for 15 minutes

Request Rate Triggers:
  - Scale Up: Requests > 1000/min per instance
  - Scale Down: Requests < 200/min per instance

Response Time Triggers:
  - Warning: p95 > 2s
  - Scale Up: p95 > 3s for 2 minutes
  - Scale Down: p95 < 500ms for 10 minutes
```

---

## Scaling Strategy

### Scaling Decision Tree

```
Is there a performance issue?
│
├─ YES
│  ├─ Is it CPU bound?
│  │  └─ Scale horizontally (add instances)
│  │
│  ├─ Is it memory bound?
│  │  └─ Scale vertically (increase memory)
│  │
│  ├─ Is it I/O bound?
│  │  └─ Scale vertically (faster disk) or optimize I/O
│  │
│  └─ Is it database bound?
│     └─ Scale database (read replicas, sharding)
│
└─ NO (Future growth)
   └─ Plan capacity for projected growth
```

### Capacity Planning

**Growth Projections**:

```yaml
User Growth:
  - Month 1-3: 100-500 users
  - Month 4-6: 500-2,000 users
  - Month 7-12: 2,000-10,000 users

Resource Requirements (per 1,000 active users):
  - Backend: 2 instances (1 CPU, 2GB RAM each)
  - Frontend: 2 instances (0.5 CPU, 1GB RAM each)
  - Database: 4GB RAM, 20GB storage
  - Redis: 1GB RAM (if using)

Cost Estimates:
  - Small deployment (2 instances): $50-100/month
  - Medium deployment (4 instances): $150-300/month
  - Large deployment (8+ instances): $500-1000/month
```

---

## Horizontal Scaling

### Scaling Backend Services

**Current Setup**:

```yaml
# docker-compose.yml
services:
  backend:
    image: vcsavibes/backend:latest
    deploy:
      replicas: 1
      resources:
        limits:
          cpus: '1'
          memory: 2G
```

**Scale to Multiple Instances**:

```bash
# Method 1: Using docker-compose scale
docker-compose up -d --scale backend=3

# Method 2: Edit docker-compose.yml
# Change deploy.replicas to desired number
docker-compose up -d

# Method 3: Using swarm mode
docker service scale vcsavibes_backend=3
```

**Load Balancer Configuration**:

```nginx
# nginx.conf
upstream backend {
    least_conn;
    server backend:8000;
    server backend:8000;
    server backend:8000;

    # Health check
    check interval=3000 rise=2 fall=3 timeout=1000;
}

server {
    listen 443 ssl;
    server_name app.vcsavibes.com;

    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Sticky sessions (if needed)
        # proxy_set_header Cookie $http_cookie;
        # ip_hash;
    }
}
```

**Session Management for Multiple Instances**:

```python
# Backend session configuration
# When using multiple backend instances, sessions must be stored centrally

# Option 1: Redis session store
from fastapi_sessions.backends.redis import RedisBackend
from redis import Redis

redis = Redis(host="redis", port=6379)
session_backend = RedisBackend(redis)

# Option 2: MongoDB session store
from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient("mongodb://mongodb:27017")
session_backend = MongoBackend(client.vcsa.sessions)

# Option 3: JWT tokens (stateless, recommended)
# No session storage needed, JWT contains all info
```

### Scaling Frontend Services

**Scale Frontend**:

```bash
# Scale frontend to 2 instances
docker-compose up -d --scale frontend=2

# Nginx configuration
upstream frontend {
    least_conn;
    server frontend:3000;
    server frontend:3000;
}

server {
    listen 443 ssl;
    server_name app.vcsavibes.com;

    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Static Asset Optimization**:

```yaml
CDN Configuration:
  - Use Cloudflare/CloudFront for static assets
  - Cache CSS, JS, images at edge
  - Reduce load on frontend servers

Cache Headers:
  - Static assets: 1 year
  - HTML: 1 hour
  - API responses: No cache
```

---

## Vertical Scaling

### Scaling Up (Increase Resources)

**When to Scale Up**:
- Memory-bound applications
- Single-instance applications
- Database servers
- Applications that can't be distributed

**Scale Up Procedure**:

```bash
# 1. Check current resources
docker stats --no-stream

# 2. Edit docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'      # Increase from 1 to 2
          memory: 4G     # Increase from 2G to 4G

# 3. Recreate containers
docker-compose up -d --force-recreate

# 4. Verify resources
docker stats --no-stream
```

**AWS/DigitalOcean Scaling**:

```bash
# 1. Create snapshot of current server
# AWS: Create AMI
# DigitalOcean: Create snapshot

# 2. Create larger server from snapshot
# AWS: Launch larger instance
# DigitalOcean: Resize droplet

# 3. Update DNS if IP changed
# 4. Verify all services running
```

### Scale Down (Decrease Resources)

**When to Scale Down**:
- Over-provisioned resources
- Cost optimization
- Reduced traffic

**Scale Down Procedure**:

```bash
# 1. Check if safe to scale down
# - CPU usage < 30%
# - Memory usage < 40%
# - Response time acceptable

# 2. Edit docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'     # Decrease from 1 to 0.5
          memory: 1G      # Decrease from 2G to 1G

# 3. Recreate containers
docker-compose up -d --force-recreate

# 4. Monitor for issues
docker stats --no-stream
```

---

## Database Scaling

### Read Replicas

**Setup Read Replicas**:

```yaml
# docker-compose.yml
services:
  mongodb-primary:
    image: mongo:6.0
    command: mongod --replSet rs0

  mongodb-secondary-1:
    image: mongo:6.0
    command: mongod --replSet rs0

  mongodb-secondary-2:
    image: mongo:6.0
    command: mongod --replSet rs0
```

**Configure Replication**:

```bash
# Initialize replica set
docker-compose exec mongodb-primary mongosh --eval "
rs.initiate({
  _id: 'rs0',
  members: [
    {_id: 0, host: 'mongodb-primary:27017'},
    {_id: 1, host: 'mongodb-secondary-1:27017'},
    {_id: 2, host: 'mongodb-secondary-2:27017'}
  ]
})
"

# Check replica set status
docker-compose exec mongodb-primary mongosh --eval "rs.status()"
```

**Application Configuration**:

```python
# Backend configuration for read replicas
from motor.motor_asyncio import AsyncIOMotorClient

# Primary for writes
primary_client = AsyncIOMotorClient(
    "mongodb://mongodb-primary:27017"
)

# Secondary for reads
secondary_client = AsyncIOMotorClient(
    "mongodb://mongodb-secondary-1:27017,mongodb-secondary-2:27017?readPreference=secondaryPreferred"
)

# Use primary for writes
async def create_user(user_data):
    await primary_client.vcsa.users.insert_one(user_data)

# Use secondary for reads
async def get_user(user_id):
    return await secondary_client.vcsa.users.find_one({"_id": user_id})
```

### Database Sharding

**When to Shard**:
- Single replica set can't handle load
- Data size > 1TB
- Write performance bottleneck

**Sharding Strategy**:

```yaml
Shard Key Selection:
  - High cardinality (many unique values)
  - Even distribution
  - No hotspots

Recommended Shard Keys:
  - user_id (for user-centric data)
  - _id (if using ObjectId)
  - timestamp (for time-series data)

Avoid:
  - Low cardinality keys (status, type)
  - Keys that increase monotonically (timestamp)
```

**Sharding Setup** (Advanced):

```bash
# This is a simplified example
# Production sharding requires careful planning

# 1. Start config servers
docker-compose up -d mongos-config-1 mongos-config-2 mongos-config-3

# 2. Start shard servers
docker-compose up -d mongos-shard-1 mongos-shard-2 mongos-shard-3

# 3. Start mongos router
docker-compose up -d mongos-router

# 4. Enable sharding
docker-compose exec mongos-router mongosh --eval "
sh.addShard('mongos-shard-1:27017')
sh.addShard('mongos-shard-2:27017')
sh.enableSharding('vcsa')
sh.shardCollection('vcsa.users', {_id: 1})
"
```

---

## Caching Strategies

### Redis Caching

**Setup Redis**:

```yaml
# docker-compose.yml
services:
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  backend:
    depends_on:
      - redis
    environment:
      - REDIS_URL=redis://redis:6379
```

**Cache Configuration**:

```python
# Backend cache configuration
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis

# Initialize Redis cache
redis = aioredis.from_url("redis://redis:6379")
FastAPICache.init(RedisBackend(redis), prefix="vcsa-cache")

# Cache decorator
from fastapi_cache.decorator import cache

@cache(expire=300)  # Cache for 5 minutes
async def get_tracks():
    return await db.tracks.find().to_list(None)

# Invalidate cache on updates
async def update_track(track_id, data):
    await db.tracks.update_one({"_id": track_id}, {"$set": data})
    await FastAPICache.clear(prefix="vcsa-cache")
```

### Application-Level Caching

**Cache Strategies**:

```yaml
Cache-Aside:
  - Check cache first
  - If miss, load from DB
  - Populate cache
  - Return data

Write-Through:
  - Write to cache and DB simultaneously
  - Ensures cache consistency

Write-Behind:
  - Write to cache immediately
  - Async write to DB
  - Better performance, risk of data loss

Cache Invalidation:
  - Time-based (TTL)
  - Event-based (on update/delete)
  - Manual (admin trigger)
```

**Cache Configuration**:

```python
# Cache TTL settings
CACHE_TTLS = {
    "static_data": 86400,      # 24 hours (stages, tracks)
    "user_data": 300,          # 5 minutes (user profile)
    "content_data": 1800,      # 30 minutes (modules, videos)
    "session_data": 3600,      # 1 hour (sessions)
    "api_response": 60,        # 1 minute (API responses)
}

# Cache keys
def cache_key(*args, **kwargs):
    return ":".join(str(arg) for arg in args)

# Usage
@cache(expire=CACHE_TTLS["content_data"])
async def get_track(track_id: str):
    return await db.tracks.find_one({"_id": track_id})
```

---

## CDN Scaling

### Cloudflare Configuration

**Setup Cloudflare CDN**:

```yaml
DNS Records:
  A Record: app.vcsavibes.com -> Server IP
  CNAME: www.vcsavibes.com -> app.vcsavibes.com

Cache Rules:
  - Cache static assets (.js, .css, .png, .jpg, .gif)
  - Cache duration: 1 year
  - Bypass cache for /api/*
  - Respect origin cache headers

Page Rules:
  - Cache HTML: 1 hour
  - Cache API responses: No cache
  - Auto-minify: Enable
  - Brotli compression: Enable
```

**Cache Headers**:

```nginx
# nginx.conf
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header X-Content-Type-Options nosniff;
}

location / {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}

location /api/ {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

### CDN Best Practices

```yaml
DO:
  ✅ Cache all static assets
  ✅ Use long cache times for versioned assets
  ✅ Enable compression (Brotli, Gzip)
  ✅ Use HTTP/2 or HTTP/3
  ✅ Enable TLS 1.3
  ✅ Use image optimization (WebP, AVIF)

DON'T:
  ❌ Cache dynamic content
  ❌ Cache user-specific data
  ❌ Ignore cache invalidation
  ❌ Forget to purge cache on updates
```

---

## Auto-Scaling

### Kubernetes Auto-Scaling

**Horizontal Pod Autoscaler**:

```yaml
# deployment.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: vcsa-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Docker Swarm Auto-Scaling

**Auto-Scaling Script**:

```bash
#!/bin/bash
# /opt/vcsavibes/scripts/auto_scale.sh

MIN_INSTANCES=2
MAX_INSTANCES=10
CPU_THRESHOLD=70
MEMORY_THRESHOLD=80

while true; do
    # Get current metrics
    CPU_USAGE=$(docker stats --no-stream --format "{{.CPUPerc}}" backend | sed 's/%//')
    MEMORY_USAGE=$(docker stats --no-stream --format "{{.MemPerc}}" backend | sed 's/%//')
    CURRENT_INSTANCES=$(docker ps --filter name=backend --format "{{.Names}}" | wc -l)

    # Scale up if needed
    if (( $(echo "$CPU_USAGE > $CPU_THRESHOLD" | bc -l) )) || (( $(echo "$MEMORY_USAGE > $MEMORY_THRESHOLD" | bc -l) )); then
        if [ $CURRENT_INSTANCES -lt $MAX_INSTANCES ]; then
            echo "Scaling up to $((CURRENT_INSTANCES + 1)) instances"
            docker-compose up -d --scale backend=$((CURRENT_INSTANCES + 1))
        fi
    fi

    # Scale down if needed
    if (( $(echo "$CPU_USAGE < 30" | bc -l) )) && (( $(echo "$MEMORY_USAGE < 40" | bc -l) )); then
        if [ $CURRENT_INSTANCES -gt $MIN_INSTANCES ]; then
            echo "Scaling down to $((CURRENT_INSTANCES - 1)) instances"
            docker-compose up -d --scale backend=$((CURRENT_INSTANCES - 1))
        fi
    fi

    sleep 60
done
```

### Cloud Auto-Scaling

**AWS Auto Scaling**:

```yaml
Auto Scaling Group:
  - Min instances: 2
  - Max instances: 10
  - Desired capacity: 2
  - Scaling policies:
    - Scale up: CPU > 70% for 3 minutes
    - Scale down: CPU < 30% for 15 minutes

Launch Template:
  - AMI: vcsavibes-production
  - Instance type: t3.medium (2 vCPU, 4GB RAM)
  - Security groups: web-server, database-access
  - User data: Docker Compose startup script
```

---

## Scaling Best Practices

### Do's and Don'ts

**DO**:
- ✅ Monitor performance before scaling
- ✅ Test scaling in staging first
- ✅ Use load balancers for horizontal scaling
- ✅ Implement caching before scaling
- ✅ Plan capacity for growth
- ✅ Document scaling procedures
- ✅ Review scaling costs regularly
- ✅ Use auto-scaling for predictable workloads

**DON'T**:
- ❌ Scale without understanding the bottleneck
- ❌ Forget to scale the database
- ❌ Ignore session management
- ❌ Scale indefinitely (set limits)
- ❌ Forget to scale down when traffic drops
- ❌ Skip load testing
- ❌ Ignore cost implications
- ❌ Scale vertically when horizontal is better

### Scaling Checklist

**Before Scaling**:
- [ ] Identify bottleneck (CPU, memory, I/O, database)
- [ ] Review current metrics
- [ ] Plan scaling approach
- [ ] Estimate costs
- [ ] Test in staging
- [ ] Prepare rollback plan

**During Scaling**:
- [ ] Monitor health checks
- [ ] Verify load balancer configuration
- [ ] Check session management
- [ ] Monitor error rates
- [ ] Verify database connections
- [ ] Test all functionality

**After Scaling**:
- [ ] Verify performance improvement
- [ ] Monitor costs
- [ ] Update documentation
- [ ] Review auto-scaling rules
- [ ] Document lessons learned
- [ ] Plan next scaling review

---

## Runbook Maintenance

**Update Frequency**: Monthly
**Last Updated**: April 2026
**Next Review**: May 2026

**Owner**: Operations Manager
**Approvals**: Director of Operations

---

**Maintained by**: VCSA Operations Team
**Contact**: operations@vcsavibes.com
**Emergency**: +1 (555) 123-4567
