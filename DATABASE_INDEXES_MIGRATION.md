# 📊 MongoDB Indexes & Migration Guide

**Purpose**: Complete guide for MongoDB indexes and data migration
**Sprint**: Sprint 2 - Task 3 (Production Database Setup)
**Priority**: P1 - HIGH
**Estimated Time**: 2 hours

---

## 📋 INDEXES OVERVIEW

Proper indexes are critical for database performance. This guide covers:
- Index creation strategies
- Performance optimization
- Query patterns
- Index maintenance

---

## 🎯 INDEX ARCHITECTURE

### Indexes by Collection

#### 1. Users Collection

```javascript
// Primary index (created by default)
db.users.createIndex({ "_id": 1 })

// Unique index on email (for login)
db.users.createIndex({ "email": 1 }, { unique: true, background: true })

// Unique index on user_id
db.users.createIndex({ "user_id": 1 }, { unique: true, background: true })

// Compound index for membership queries
db.users.createIndex({ "membership": 1, "level": 1 }, { background: true })

// Index for user lookups by creation date
db.users.createIndex({ "created_at": -1 }, { background: true })

// TTL index for session cleanup (if storing sessions)
db.users.createIndex({ "last_login": 1 }, {
  expireAfterSeconds: 7776000, // 90 days
  background: true
})
```

#### 2. User Progress Collection

```javascript
// Primary index
db.user_progress.createIndex({ "_id": 1 })

// Unique index on user_id
db.user_progress.createIndex({ "user_id": 1 }, { unique: true, background: true })

// Index for leaderboard queries
db.user_progress.createIndex({ "points": -1 }, { background: true })

// Index for readiness score queries
db.user_progress.createIndex({ "readiness_score": -1 }, { background: true })

// Index for streak queries
db.user_progress.createIndex({ "streak_days": -1 }, { background: true })

// Compound index for gamification
db.user_progress.createIndex({ "level": 1, "points": -1 }, { background: true })
```

#### 3. Posts Collection

```javascript
// Primary index
db.posts.createIndex({ "_id": 1 })

// Unique index on post_id
db.posts.createIndex({ "post_id": 1 }, { unique: true, background: true })

// Index for user's posts
db.posts.createIndex({ "user_id": 1, "created_at": -1 }, { background: true })

// Index for feed queries
db.posts.createIndex({ "created_at": -1 }, { background: true })

// Index for pinned posts
db.posts.createIndex({ "pinned": -1, "created_at": -1 }, { background: true })

// Text index for search (optional)
db.posts.createIndex({ "content": "text" }, { background: true })
```

#### 4. Events Collection

```javascript
// Primary index
db.events.createIndex({ "_id": 1 })

// Unique index on event_id
db.events.createIndex({ "event_id": 1 }, { unique: true, background: true })

// Index for upcoming events
db.events.createIndex({ "start_time": 1 }, { background: true })

// Index for VIP events
db.events.createIndex({ "vip_only": 1, "start_time": 1 }, { background: true })

// Index for event type
db.events.createIndex({ "event_type": 1 }, { background: true })

// TTL index for old events
db.events.createIndex({ "end_time": 1 }, {
  expireAfterSeconds: 7776000, // 90 days after end
  background: true
})
```

#### 5. Bookmarks Collection

```javascript
// Primary index
db.bookmarks.createIndex({ "_id": 1 })

// Compound unique index on user_id and content_id
db.bookmarks.createIndex({ "user_id": 1, "content_id": 1 }, {
  unique: true,
  background: true
})

// Index for user's bookmarks
db.bookmarks.createIndex({ "user_id": 1, "created_at": -1 }, { background: true })

// Index for tag-based queries
db.bookmarks.createIndex({ "tags": 1 }, { background: true })

// Compound index for filtering
db.bookmarks.createIndex({ "user_id": 1, "tag": 1 }, { background: true })
```

#### 6. Subscription Events Collection

```javascript
// Primary index
db.subscription_events.createIndex({ "_id": 1 })

// Index for user's subscription events
db.subscription_events.createIndex({ "user_id": 1, "created_at": -1 }, { background: true })

// Index for event type queries
db.subscription_events.createIndex({ "event_type": 1 }, { background: true })

// TTL index for old events
db.subscription_events.createIndex({ "created_at": 1 }, {
  expireAfterSeconds: 94608000, // 3 years
  background: true
})
```

---

## 📝 STEP 1: CREATE INDEXES

### Step 1.1: Connect to MongoDB Compass

1. Open MongoDB Compass
2. Paste connection string
3. Connect

### Step 1.2: Create Indexes via Compass UI

For each collection:
1. Select collection
2. Click "Indexes" tab
3. Click "Create Index"
4. Enter index definition
5. Click "Create"

### Step 1.3: Create Indexes via Shell

```javascript
// Switch to production database
use vcsa_production

// Create all indexes at once
var indexes = [
  // Users
  { collection: "users", index: { email: 1 }, options: { unique: true, background: true } },
  { collection: "users", index: { user_id: 1 }, options: { unique: true, background: true } },
  { collection: "users", index: { membership: 1, level: 1 }, options: { background: true } },
  { collection: "users", index: { created_at: -1 }, options: { background: true } },

  // User Progress
  { collection: "user_progress", index: { user_id: 1 }, options: { unique: true, background: true } },
  { collection: "user_progress", index: { points: -1 }, options: { background: true } },
  { collection: "user_progress", index: { readiness_score: -1 }, options: { background: true } },

  // Posts
  { collection: "posts", index: { post_id: 1 }, options: { unique: true, background: true } },
  { collection: "posts", index: { user_id: 1, created_at: -1 }, options: { background: true } },
  { collection: "posts", index: { created_at: -1 }, options: { background: true } },

  // Events
  { collection: "events", index: { event_id: 1 }, options: { unique: true, background: true } },
  { collection: "events", index: { start_time: 1 }, options: { background: true } },

  // Bookmarks
  { collection: "bookmarks", index: { user_id: 1, content_id: 1 }, options: { unique: true, background: true } },
  { collection: "bookmarks", index: { user_id: 1, created_at: -1 }, options: { background: true } },
];

// Create indexes
indexes.forEach(function(idx) {
  try {
    db.getCollection(idx.collection).createIndex(idx.index, idx.options);
    print(`Created index on ${idx.collection}: ${JSON.stringify(idx.index)}`);
  } catch (e) {
    print(`Failed to create index on ${idx.collection}: ${e.message}`);
  }
});
```

---

## 📝 STEP 2: VERIFY INDEXES

### Step 2.1: List All Indexes

```javascript
// List indexes for a collection
db.users.getIndexes()

// List all indexes across database
db.getCollectionNames().forEach(function(collection) {
  print(`\n=== ${collection} ===`);
  db.getCollection(collection).getIndexes().forEach(function(index) {
    print(JSON.stringify(index.key));
  });
});
```

### Step 2.2: Check Index Usage

```javascript
// Check index stats
db.users.aggregate([
  { $indexStats: {} }
]);

// Check index sizes
db.users.getIndexes().forEach(function(index) {
  var stats = db.users.stats();
  print(JSON.stringify({
    index: index.name,
    size: stats.indexSizes[index.name]
  }));
});
```

---

## 📝 STEP 3: DATA MIGRATION

### Step 3.1: Export from Development/Source

```bash
# Export from development database
mongodump --uri="mongodb://localhost:27017" \
  --db=vcsa \
  --out=/path/to/migration/$(date +%Y%m%d) \
  --gzip
```

### Step 3.2: Import to Production

```bash
# Import to production database
mongorestore --uri="mongodb+srv://vcsa_app:PASSWORD@cluster.mongodb.net" \
  --db=vcsa_production \
  --drop \
  --gzip \
  /path/to/migration/20260417/vcsa
```

### Step 3.3: Migration Checklist

- [ ] Backup source database
- [ ] Export data from source
- [ ] Verify export integrity
- [ ] Backup target database (if has data)
- [ ] Import data to target
- [ ] Verify data integrity
- [ ] Update connection strings
- [ ] Test application connectivity
- [ ] Run smoke tests
- [ ] Monitor database performance

---

## 📝 STEP 4: MIGRATION VERIFICATION

### Step 4.1: Verify Document Counts

```javascript
// Compare document counts between source and target
var sourceCounts = {};
var targetCounts = {};

// Source database (development)
use vcsa
db.getCollectionNames().forEach(function(collection) {
  sourceCounts[collection] = db.getCollection(collection).countDocuments();
});

// Target database (production)
use vcsa_production
db.getCollectionNames().forEach(function(collection) {
  targetCounts[collection] = db.getCollection(collection).countDocuments();
});

// Compare
print("\n=== Document Count Comparison ===");
Object.keys(sourceCounts).forEach(function(collection) {
  var source = sourceCounts[collection];
  var target = targetCounts[collection] || 0;
  var match = source === target ? "✓" : "✗";
  print(`${match} ${collection}: source=${source}, target=${target}`);
});
```

### Step 4.2: Verify Data Integrity

```javascript
// Sample documents from each collection
use vcsa_production

// Verify users collection
print("=== Users Sample ===");
db.users.findOne();

// Verify user_progress collection
print("=== User Progress Sample ===");
db.user_progress.findOne();

// Verify posts collection
print("=== Posts Sample ===");
db.posts.findOne();
```

---

## 📝 STEP 5: PERFORMANCE OPTIMIZATION

### Step 5.1: Analyze Query Performance

```javascript
// Enable query profiling
db.setProfilingLevel(2, { slowms: 100 });

// Find slow queries
db.system.profile.find().sort({ millis: -1 }).limit(10).forEach(function(doc) {
  print(JSON.stringify({
    operation: doc.op,
    collection: doc.ns,
    millis: doc.millis,
    query: doc.query
  });
});

// Disable profiling
db.setProfilingLevel(0);
```

### Step 5.2: Optimize Slow Queries

```javascript
// Before: Collection scan (slow)
db.users.find({ "email": "user@example.com" })

// After: Index scan (fast)
db.users.find({ "email": "user@example.com" }).hint("email_1")

// Before: Missing index
db.user_progress.find({ "points": { $gt: 100 } }).sort({ "points": -1 })

// After: With index
db.user_progress.find({ "points": { $gt: 100 } }).sort({ "points": -1 }).hint("points_-1")
```

---

## ✅ INDEXING CHECKLIST

### Index Creation
- [ ] All collections have primary indexes
- [ ] Email index unique and created
- [ ] User ID indexes created
- [ ] Query-specific indexes created
- [ ] Compound indexes where appropriate
- [ ] Text indexes for search (if needed)
- [ ] TTL indexes for data cleanup
- [ ] Background creation enabled

### Index Verification
- [ ] All indexes created successfully
- [ ] Index sizes documented
- [ ] Index usage monitored
- [ ] No duplicate indexes
- [ ] Index stats reviewed

### Performance
- [ ] Query execution time <100ms
- [ ] No collection scans
- [ ] Profiling shows optimal plans
- [ ] Connection pooling configured
- [ ] Query optimization completed

### Migration
- [ ] Source database backed up
- [ ] Data exported successfully
- [ ] Data imported to production
- [ ] Document counts verified
- [ ] Data integrity verified
- [ ] Application connectivity tested

---

## 🛠️ TROUBLESHOOTING

### Issue 1: Index Creation Failed

**Symptoms**: Cannot create index on field

**Solutions**:
1. Check for duplicate values
2. Check field types are consistent
3. Use background option
4. Create compound index instead

### Issue 2: Slow Queries After Migration

**Symptoms**: Queries slower in production

**Solutions**:
1. Verify indexes exist
2. Check query plans with explain()
3. Review cluster tier
4. Optimize queries
5. Consider sharding

### Issue 3: Duplicate Key Errors

**Symptoms**: Cannot create unique index

**Solutions**:
1. Find and remove duplicates
2. Clean data before creating index
3. Use sparse index if appropriate

---

## 📊 MONITORING INDEX PERFORMANCE

### Key Metrics

1. **Index Size**
   - Monitor index storage
   - Target: <50% of data size

2. **Index Usage**
   - Monitor index hit ratio
   - Target: >95% index hits

3. **Query Performance**
   - Monitor average query time
   - Target: <100ms average

4. **Index Efficiency**
   - Monitor index selectivity
   - Target: >90% selectivity

---

**Document Created**: April 17, 2026
**Last Updated**: April 17, 2026
**Status**: ✅ READY FOR IMPLEMENTATION
**Owner**: Backend Dev / DevOps Team
