# 🗄️ Production Database Setup Guide (MongoDB Atlas)

**Purpose**: Complete guide for setting up production MongoDB database on MongoDB Atlas
**Sprint**: Sprint 2 - Task 3
**Priority**: P1 - HIGH
**Estimated Time**: 6 hours

---

## 📋 OVERVIEW

This guide covers the complete production database setup process:

1. MongoDB Atlas account creation
2. Cluster configuration and deployment
3. Database authentication and security
4. User management and permissions
5. Backup configuration
6. Monitoring setup
7. Connection pooling
8. Performance optimization
9. Data migration
10. Testing and verification

---

## 🎯 ARCHITECTURE

### Database Structure

```
MongoDB Atlas Production Cluster
├── Database: vcsa_production
│   ├── Collections:
│   │   ├── users              # User accounts and authentication
│   │   ├── user_progress      # Training progress and gamification
│   │   ├── user_activity      # Activity tracking
│   │   ├── bookmarks          # Watch Later items
│   │   ├── posts              # Community posts
│   │   ├── comments           # Post comments
│   │   ├── events             # Calendar events
│   │   ├── resources          # Downloadable resources
│   │   ├── subscription_events # Payment webhooks
│   │   └── coaching_content   # Coaching content
│   └── Indexes for performance
├── Backup: Automated daily backups
├── Monitoring: Performance metrics and alerts
└── Security: Whitelist IP, authentication
```

---

## 📝 STEP 1: CREATE MONGODB ATLAS ACCOUNT

### Step 1.1: Sign Up for MongoDB Atlas

1. Visit: https://www.mongodb.com/cloud/atlas
2. Click "Start Free"
3. Choose authentication method (Google/GitHub/Email)
4. Complete registration

### Step 1.2: Configure Organization

1. Create organization: `VCSA Production`
2. Add team members:
   - Database Admin
   - Backend Developer
   - DevOps Engineer

### Step 1.3: Choose Pricing Tier

**Recommendations**:
- Development: M0 (Free - 512 MB)
- Staging: M2 ($9/month - 2 GB)
- Production: M10+ ($57+/month - 10 GB+)

**Production Tier Selection**:
- **M10** ($57/month) - Minimum for production
  - 10 GB storage
  - 2 GB RAM
  - 30 days backup
  - 99.95% uptime SLA

- **M20** ($140/month) - Recommended for production
  - 40 GB storage
  - 4 GB RAM
  - 30 days backup
  - 99.95% uptime SLA
  - Better performance

---

## 📝 STEP 2: DEPLOY PRODUCTION CLUSTER

### Step 2.1: Create New Cluster

1. Click "Build a Database"
2. Choose **Atlas** (recommended)
3. Configure cluster:

```
Cluster Name: vcsa-prod
Cloud Provider: AWS
Region: us-east-1 (or closest to your users)
Cluster Tier: M10+ (production)
Additional Storage: 10 GB+ (as needed)
Cluster Version: Latest stable (e.g., 7.0)
```

### Step 2.2: Advanced Configuration

**Replica Sets**: Enable (recommended for production)
```
Number of replicas: 2 (total 3 nodes)
- Primary (read/write)
- Secondary 1 (read-only)
- Secondary 2 (read-only)
```

**Sharding**: Not needed initially (can add later)

**Backup**: Enable
```
Continuous Backup: Enabled
Retention Period: 30 days
Point-in-Time Recovery: Enabled
```

### Step 2.3: Deploy Cluster

1. Review configuration
2. Click "Create Cluster"
3. Wait for deployment (5-10 minutes)
4. Note connection information

---

## 📝 STEP 3: CONFIGURE SECURITY

### Step 3.1: Network Access (IP Whitelist)

1. Navigate to **Security** → **Network Access**
2. Click "Add IP Address"

#### Option A: Specific IP (Recommended)

```
Access List Entry: YOUR_SERVER_IP
Description: VCSA Production Server
```

#### Option B: IP Range (if using multiple servers)

```
Access List Entry: YOUR_SERVER_IP/24
Description: VCSA Server Range
```

#### Option C: Allow All Access (NOT RECOMMENDED)

```
Access List Entry: 0.0.0.0/0
Description: All IPs (temporary only)
```

### Step 3.2: Database Authentication

1. Navigate to **Security** → **Database Access**
2. Click "Add New Database User"

#### Create Admin User

```
Authentication Method: SCRAM-SHA-256
Username: vcsa_admin
Password: [Strong password - use password manager]
Database Permissions:
  - Atlas admin (all databases)
```

#### Create Application User (Recommended)

```
Authentication Method: SCRAM-SHA-256
Username: vcsa_app
Password: [Strong password]
Database Permissions:
  - Read and write to vcsa_production database
```

### Step 3.3: Encryption at Rest

1. Navigate to **Security** → **Encryption**
2. Verify **Encryption at Rest** is enabled (automatic in Atlas)

### Step 3.4: TLS/SSL

1. Navigate to **Security** → **TLS/SSL**
2. Verify **Require TLS** is enabled

---

## 📝 STEP 4: CONNECT TO CLUSTER

### Step 4.1: Get Connection String

1. Navigate to **Deployment** → **Database**
2. Click "Connect"
3. Choose "Connect your application"
4. Copy connection string

**Example Connection String**:
```
mongodb+srv://vcsa_app:PASSWORD@vcsa-prod.abc123.mongodb.net/vcsa_production?retryWrites=true&w=majority
```

### Step 4.2: Update Environment Variables

**Backend .env**:
```bash
# Production Database Configuration
MONGO_URL=mongodb+srv://vcsa_app:PASSWORD@vcsa-prod.abc123.mongodb.net/vcsa_production?retryWrites=true&w=majority
DB_NAME=vcsa_production

# Connection Pool Settings
MONGO_MIN_POOL_SIZE=10
MONGO_MAX_POOL_SIZE=100
MONGO_IDLE_TIMEOUT_MS=10000
MONGO_CONNECT_TIMEOUT_MS=10000
MONGO_SERVER_SELECTION_TIMEOUT_MS=5000
```

### Step 4.3: Test Connection

```python
# Test MongoDB connection
from pymongo import MongoClient
import os

client = MongoClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]

# Test connection
try:
    result = db.command('ping')
    print("Connected to MongoDB:", result)
except Exception as e:
    print("Connection failed:", e)
```

---

## 📝 STEP 5: CONFIGURE INDEXES

### Step 5.1: Connect via MongoDB Compass

1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Install and open
3. Paste connection string
4. Connect

### Step 5.2: Create Indexes

#### Users Collection

```javascript
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "user_id": 1 }, { unique: true })
db.users.createIndex({ "created_at": -1 })
db.users.createIndex({ "membership": 1, "level": 1 })
```

#### User Progress Collection

```javascript
db.user_progress.createIndex({ "user_id": 1 }, { unique: true })
db.user_progress.createIndex({ "readiness_score": -1 })
db.user_progress.createIndex({ "points": -1 })
db.user_progress.createIndex({ "streak_days": -1 })
```

#### Posts Collection

```javascript
db.posts.createIndex({ "post_id": 1 }, { unique: true })
db.posts.createIndex({ "user_id": 1, "created_at": -1 })
db.posts.createIndex({ "created_at": -1 })
db.posts.createIndex({ "pinned": -1, "created_at": -1 })
```

#### Events Collection

```javascript
db.events.createIndex({ "event_id": 1 }, { unique: true })
db.events.createIndex({ "start_time": 1 })
db.events.createIndex({ "vip_only": 1, "start_time": 1 })
```

### Step 5.3: Verify Indexes

```javascript
// List all indexes
db.users.getIndexes()
db.user_progress.getIndexes()
db.posts.getIndexes()
db.events.getIndexes()
```

---

## 📝 STEP 6: CONFIGURE BACKUPS

### Step 6.1: Enable Continuous Backups

1. Navigate to **Backup** → **Snapshot**
2. Verify **Continuous Backup** is enabled
3. Configure retention:
   ```
   Retention Period: 30 days
   Snapshot Interval: Every 6 hours
   ```

### Step 6.2: Configure Backup Policy

**Automatic Snapshots**:
```
Frequency: Daily
Retention: 30 days
Time: 2:00 AM UTC
```

**On-Demand Snapshots**:
```
- Before major deployments
- Before schema changes
- Before data migrations
```

### Step 6.3: Test Backup and Restore

1. Create test snapshot
2. Verify snapshot creation
3. Test restore process (in test environment)

---

## 📝 STEP 7: CONFIGURE MONITORING

### Step 7.1: Enable Performance Monitoring

1. Navigate to **Metrics** tab
2. Verify metrics are being collected:
   - Operations
   - Memory
   - CPU
   - Connections
   - Disk I/O

### Step 7.2: Create Alerts

Navigate to **Alerts** → **Create Alert**

#### Alert 1: High CPU Usage

```
Metric: Host CPU {percent}
Threshold: > 80%
For: 5 minutes
Action: Send email notification
```

#### Alert 2: High Memory Usage

```
Metric: Resident Memory {percent}
Threshold: > 85%
For: 5 minutes
Action: Send email notification
```

#### Alert 3: Slow Queries

```
Metric: Query Execution Time {ms}
Threshold: > 1000ms
For: 5 minutes
Action: Send email notification
```

#### Alert 4: Connection Pool Exhaustion

```
Metric: Connections {percent}
Threshold: > 90%
For: 2 minutes
Action: Send email + SMS notification
```

### Step 7.3: Configure Data Explorer

1. Navigate to **Data Explorer**
2. Verify collections are visible
3. Create favorite queries

---

## 📝 STEP 8: DATA MIGRATION

### Step 8.1: Export from Development Database

```bash
# Using mongodump
mongodump --db=vcsa \
  --out=/path/to/backup/$(date +%Y%m%d)
```

### Step 8.2: Import to Production Database

```bash
# Using mongorestore
mongorestore --db=vcsa_production \
  --drop \
  /path/to/backup/20260417/vcsa
```

### Step 8.3: Verify Data Integrity

```javascript
// Count documents in each collection
db.users.countDocuments()
db.user_progress.countDocuments()
db.posts.countDocuments()
db.events.countDocuments()

// Verify data integrity
db.users.findOne()
db.user_progress.findOne()
```

---

## 📝 STEP 9: CONNECTION POOLING CONFIGURATION

### Step 9.1: Configure Motor (Async Python)

**Backend Configuration** (`backend/database.py`):

```python
from motor.motor_asyncio import AsyncIOMotorClient
import os

class Database:
    client: AsyncIOMotorClient = None

    def connect_to_database(self):
        """Connect to MongoDB with connection pooling"""
        mongo_url = os.environ['MONGO_URL']

        self.client = AsyncIOMotorClient(
            mongo_url,
            maxPoolSize=100,          # Maximum connections
            minPoolSize=10,           # Minimum connections
            maxIdleTimeMS=10000,      # Close idle connections after 10s
            connectTimeoutMS=10000,   # Connection timeout
            serverSelectionTimeoutMS=5000,  # Server selection timeout
            retryWrites=True,         # Retry writes on failure
            w="majority"              # Write concern
        )

        return self.client

    def get_database(self):
        """Get database instance"""
        return self.client[os.environ['DB_NAME']]
```

### Step 9.2: Test Connection Pooling

```python
# Test connection pooling
import asyncio
from database import Database

async def test_connection_pool():
    db = Database()
    await db.connect_to_database()

    # Test multiple concurrent connections
    tasks = []
    for i in range(20):
        task = db.client.admin.command('ping')
        tasks.append(task)

    results = await asyncio.gather(*tasks)
    print(f"Successfully executed {len(results)} concurrent queries")

asyncio.run(test_connection_pool())
```

---

## 📝 STEP 10: PERFORMANCE OPTIMIZATION

### Step 10.1: Analyze Slow Queries

1. Navigate to **Performance Advisor** tab
2. Review slow query suggestions
3. Create recommended indexes

### Step 10.2: Enable Profiling (temporary)

```javascript
// Enable profiling (in MongoDB Shell)
db.setProfilingLevel(1, { slowms: 100 })

// View slow queries
db.system.profile.find().sort({ millis: -1 }).limit(10)

// Disable profiling when done
db.setProfilingLevel(0)
```

### Step 10.3: Optimize Queries

#### Before Optimization

```javascript
// Slow query (collection scan)
db.users.find({ "email": "user@example.com" })
```

#### After Optimization

```javascript
// Fast query (index scan)
db.users.find({ "email": "user@example.com" }).hint("email_1")
```

---

## ✅ VERIFICATION CHECKLIST

### Cluster Setup
- [ ] MongoDB Atlas account created
- [ ] Production cluster deployed
- [ ] Cluster tier appropriate for load
- [ ] Replication enabled
- [ ] Backup configured

### Security
- [ ] IP whitelist configured
- [ ] Database users created (admin, app)
- [ ] Strong passwords set
- [ ] TLS/SSL enabled
- [ ] Encryption at rest enabled

### Indexes
- [ ] User indexes created
- [ ] Progress indexes created
- [ ] Post indexes created
- [ ] Event indexes created
- [ ] Indexes verified

### Monitoring
- [ ] Performance monitoring enabled
- [ ] Alerts configured (CPU, memory, queries)
- [ ] Data Explorer working
- [ ] Metrics dashboard configured

### Backup
- [ ] Continuous backup enabled
- [ ] Retention period set (30 days)
- [ ] Snapshot schedule configured
- [ ] Backup and restore tested

### Connection
- [ ] Connection string obtained
- [ ] Environment variables updated
- [ ] Connection tested from application
- [ ] Connection pooling configured
- [ ] Max/min pool size set

### Migration
- [ ] Data exported from development
- [ ] Data imported to production
- [ ] Data integrity verified
- [ ] Rollback plan tested

---

## 🛠️ TROUBLESHOOTING

### Issue 1: Connection Refused

**Symptoms**: Cannot connect to MongoDB

**Solutions**:
1. Verify IP whitelist includes server IP
2. Check firewall allows port 27017
3. Verify username/password correct
4. Check connection string format

### Issue 2: Slow Queries

**Symptoms**: Queries taking >1 second

**Solutions**:
1. Check query plan with explain()
2. Verify indexes exist
3. Use query hints if needed
4. Consider increasing cluster tier

### Issue 3: Connection Pool Exhaustion

**Symptoms**: Cannot get connection from pool

**Solutions**:
1. Increase maxPoolSize
2. Decrease connection timeout
3. Check for connection leaks
4. Scale cluster horizontally

### Issue 4: High Memory Usage

**Symptoms**: Memory usage >85%

**Solutions**:
1. Increase cluster tier
2. Optimize queries
3. Create indexes
4. Review working set size

---

## 📊 MONITORING DASHBOARD

### Key Metrics to Monitor

1. **Operations/sec**
   - Target: <10,000 ops/sec
   - Alert if: >8,000 ops/sec

2. **Memory Usage**
   - Target: <80%
   - Alert if: >85%

3. **CPU Usage**
   - Target: <70%
   - Alert if: >80%

4. **Connections**
   - Target: <80% of max
   - Alert if: >90%

5. **Query Performance**
   - Target: <100ms average
   - Alert if: >500ms average

---

## 📚 ADDITIONAL RESOURCES

- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **Motor Documentation**: https://motor.readthedocs.io/
- **Performance Best Practices**: https://www.mongodb.com/docs/manual/administration/analyzing-mongodb-performance/
- **Backup and Restore**: https://docs.atlas.mongodb.com/backup-restore/

---

## ✅ ACCEPTANCE CRITERIA

Production database setup is complete when:

- [ ] MongoDB Atlas cluster deployed and running
- [ ] IP whitelist configured correctly
- [ ] Database users created with appropriate permissions
- [ ] Connection tested from application
- [ ] All indexes created and verified
- [ ] Automated backups configured and tested
- [ ] Monitoring and alerts configured
- [ ] Connection pooling configured
- [ ] Data migrated successfully
- [ ] Performance baseline established

---

**Document Created**: April 17, 2026
**Last Updated**: April 17, 2026
**Status**: ✅ READY FOR IMPLEMENTATION
**Owner**: Backend Dev / DevOps Team
