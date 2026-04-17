# Base de Datos

Guía completa de la base de datos MongoDB de VCSA.

## 🗄️ Stack Tecnológico

- **MongoDB** - NoSQL document database
- **Motor** - Async MongoDB driver for Python
- **Pydantic** - Data validation and modeling

---

## 📊 Colecciones

### 1. users

Almacena información de usuarios y autenticación.

```javascript
{
  _id: ObjectId("..."),
  email: "user@vcsa.com",
  password_hash: "$2b$12$...",
  name: "John Doe",
  role: "member",              // admin | member
  membership_tier: "free",     // free | pro | vip
  created_at: ISODate("2026-03-16T00:00:00Z"),
  updated_at: ISODate("2026-03-16T00:00:00Z")
}
```

**Indexes**:
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
```

---

### 2. user_progress

Almacena el progreso de entrenamiento de cada usuario.

```javascript
{
  _id: ObjectId("..."),
  user_id: ObjectId("..."),        // Reference to users._id
  current_stage: 2,                // 1-4 (4 stages)
  readiness_score: 45,             // 0-100 calculated score
  points: 150,                     // Total points earned
  training_streak: 7,              // Consecutive days
  completed_modules: [             // Array of module IDs
    "module_1_1",
    "module_1_2",
    "module_1_3"
  ],
  completed_breakdowns: [          // Array of breakdown IDs
    "breakdown_1",
    "breakdown_2"
  ],
  applied_quickwins: [             // Array of quickwin IDs
    "quickwin_1",
    "quickwin_2"
  ],
  badges_awarded: [                // Array of badge IDs
    "first_module",
    "stage_1_complete",
    "streak_7"
  ],
  last_training_date: ISODate("2026-03-16T00:00:00Z")
}
```

**Indexes**:
```javascript
db.user_progress.createIndex({ user_id: 1 }, { unique: true })
db.user_progress.createIndex({ readiness_score: -1 })
db.user_progress.createIndex({ points: -1 })
```

---

### 3. user_activity

Tracking de actividad del usuario para analytics.

```javascript
{
  _id: ObjectId("..."),
  user_id: ObjectId("..."),
  action: "module_complete",       // module_complete | breakdown_review | quickwin_apply | login
  content_id: "module_1_1",        // ID of the content
  content_type: "module",          // module | breakdown | quickwin
  timestamp: ISODate("2026-03-16T00:00:00Z"),
  metadata: {                      // Optional additional data
    duration_seconds: 300,
    completed: true
  }
}
```

**Indexes**:
```javascript
db.user_activity.createIndex({ user_id: 1, timestamp: -1 })
db.user_activity.createIndex({ action: 1 })
db.user_activity.createIndex({ timestamp: -1 })
```

---

### 4. bookmarks

Watch Later / Bookmarks con tags para Pre-Tour Tactical Mode.

```javascript
{
  _id: ObjectId("..."),
  user_id: ObjectId("..."),
  content_id: "module_1_1",
  content_type: "module",          // module | breakdown | quickwin
  tags: [                          // Pre-Tour Mode tags
    "before_tour",
    "closing_help",
    "objections"
  ],
  notes: "Use this for price objections",
  created_at: ISODate("2026-03-16T00:00:00Z")
}
```

**Available Tags**:
- `before_tour` - Content to review before sales tour
- `closing_help` - Closing techniques
- `objections` - Objection handling
- `discovery` - Discovery phase techniques
- `value_build` - Value building strategies
- `momentum` - Maintaining momentum

**Indexes**:
```javascript
db.bookmarks.createIndex({ user_id: 1, content_id: 1 }, { unique: true })
db.bookmarks.createIndex({ user_id: 1, tags: 1 })
```

---

### 5. posts

Community posts y social interactions.

```javascript
{
  _id: ObjectId("..."),
  author_id: ObjectId("..."),
  content: "Just closed my first deal using the Value Architecture techniques!",
  likes: [                        // Array of user IDs who liked
    ObjectId("..."),
    ObjectId("...")
  ],
  comments: [
    {
      _id: ObjectId("..."),
      user_id: ObjectId("..."),
      content: "Congratulations!",
      timestamp: ISODate("2026-03-16T00:00:00Z")
    }
  ],
  created_at: ISODate("2026-03-16T00:00:00Z"),
  updated_at: ISODate("2026-03-16T00:00:00Z")
}
```

**Indexes**:
```javascript
db.posts.createIndex({ author_id: 1, created_at: -1 })
db.posts.createIndex({ created_at: -1 })
```

---

### 6. events

Events del calendario de la industria.

```javascript
{
  _id: ObjectId("..."),
  title: "ARDA World 2026",
  description: "Annual timeshare industry conference",
  date: ISODate("2026-04-15T00:00:00Z"),
  location: "Orlando, FL",
  registration_link: "https://arda.org/conference",
  created_at: ISODate("2026-03-16T00:00:00Z")
}
```

**Indexes**:
```javascript
db.events.createIndex({ date: -1 })
```

---

### 7. resources

Downloadable resources y archivos.

```javascript
{
  _id: ObjectId("..."),
  title: " objection Handling Cheat Sheet",
  description: "Quick reference for common objections",
  file_url: "https://s3.amazonaws.com/vcsa/objection-handling.pdf",
  file_type: "pdf",               // pdf | doc | video
  category: "training",            // training | template | tool
  created_at: ISODate("2026-03-16T00:00:00Z")
}
```

**Indexes**:
```javascript
db.resources.createIndex({ category: 1 })
```

---

### 8. courses (Legacy)

Cursos legacy - será reemplazado por Phase 1 system.

```javascript
{
  _id: ObjectId("..."),
  title: "Advanced Closing Techniques",
  description: "Master the art of closing",
  thumbnail_url: "https://...",
  instructor: "John Smith",
  duration_minutes: 45,
  price: 99.99,
  created_at: ISODate("2026-03-16T00:00:00Z")
}
```

---

## 🔍 Queries Comunes

### Get User Progress

```javascript
db.user_progress.aggregate([
  {
    $match: { user_id: ObjectId("...") }
  },
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user"
    }
  },
  {
    $project: {
      "user.password_hash": 0      // Exclude sensitive data
    }
  }
])
```

### Leaderboard

```javascript
db.user_progress.find({})
  .sort({ points: -1 })
  .limit(10)
  .toArray()
```

### Recent Activity

```javascript
db.user_activity.aggregate([
  {
    $match: { user_id: ObjectId("...") }
  },
  {
    $sort: { timestamp: -1 }
  },
  {
    $limit: 20
  },
  {
    $group: {
      _id: "$action",
      count: { $sum: 1 }
    }
  }
])
```

### Get Bookmarks by Tag

```javascript
db.bookmarks.find({
  user_id: ObjectId("..."),
  tags: "before_tour"              // Pre-Tour Tactical Mode
}).toArray()
```

### Activity Analytics

```javascript
db.user_activity.aggregate([
  {
    $match: {
      timestamp: {
        $gte: ISODate("2026-03-01T00:00:00Z"),
        $lt: ISODate("2026-04-01T00:00:00Z")
      }
    }
  },
  {
    $group: {
      _id: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
        action: "$action"
      },
      count: { $sum: 1 }
    }
  },
  {
    $sort: { "_id.date": 1 }
  }
])
```

---

## 🔧 Motor Operations (Python)

### Connection Setup

```python
from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.vcsa
```

### CRUD Operations

```python
# Create
result = await db.users.insert_one({
    "email": "user@vcsa.com",
    "name": "User",
    "role": "member"
})
user_id = result.inserted_id

# Read
user = await db.users.find_one({"_id": user_id})

# Update
await db.users.update_one(
    {"_id": user_id},
    {"$set": {"name": "Updated Name"}}
)

# Delete
await db.users.delete_one({"_id": user_id})
```

### Array Operations

```python
# Push to array
await db.user_progress.update_one(
    {"user_id": user_id},
    {"$push": {"completed_modules": "module_1_1"}}
)

# Pull from array
await db.user_progress.update_one(
    {"user_id": user_id},
    {"$pull": {"badges_awarded": "streak_7"}}
)

# Add to set (avoid duplicates)
await db.user_progress.update_one(
    {"user_id": user_id},
    {"$addToSet": {"tags": "before_tour"}}
)
```

### Aggregation Pipeline

```python
pipeline = [
    {"$match": {"user_id": user_id}},
    {"$group": {
        "_id": "$action",
        "count": {"$sum": 1},
        "latest": {"$max": "$timestamp"}
    }},
    {"$sort": {"count": -1}}
]

results = await db.user_activity.aggregate(pipeline).to_list(length=100)
```

---

## 📊 Data Modeling Best Practices

### 1. Embed vs Reference

**Embed** (para datos que siempre se necesitan juntos):
```javascript
// User progress - embed arrays
{
  user_id: ObjectId("..."),
  completed_modules: ["id1", "id2"],  // Embed IDs
  badges_awarded: ["badge1", "badge2"] // Embed badges
}
```

**Reference** (para datos grandes o raramente necesarios):
```javascript
// Post comments - reference users
{
  comments: [
    {
      user_id: ObjectId("..."),  // Reference (no embed user data)
      content: "Comment text"
    }
  ]
}
```

### 2. Indexing Strategy

```javascript
// Single field indexes
db.users.createIndex({ email: 1 })

// Compound indexes
db.user_progress.createIndex({ user_id: 1, readiness_score: -1 })

// Multikey indexes (arrays)
db.bookmarks.createIndex({ tags: 1 })

// Text indexes (search)
db.posts.createIndex({ content: "text" })
```

### 3. Data Validation

```python
# Use Pydantic models for validation
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str = Field(..., min_length=2, max_length=100)
    role: str = Field(default="member", regex="^(admin|member)$")
```

---

## 🔒 Security Considerations

1. **Password Hashing**: Nunca almacenar passwords en texto plano
2. **Input Validation**: Validar todos los inputs con Pydantic
3. **SQL Injection**: MongoDB es NoSQL, pero validar queries de todos modos
4. **Authorization**: Verificar ownership de datos antes de permitir updates
5. **Sensitive Data**: No retornar password_hash, tokens, etc. en responses

---

## 📈 Performance Optimization

1. **Indexes**: Crear indexes en campos frecuentemente query-ados
2. **Projection**: Solo retornar campos necesarios
3. **Pagination**: Usar skip() y limit() para listas largas
4. **Caching**: Considerar Redis para datos frecuentemente accedidos
5. **Connection Pooling**: Motor maneja connection pooling automáticamente

---

## 🧪 Testing Database Operations

```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_user(db):
    # Test user creation
    result = await db.users.insert_one({
        "email": "test@test.com",
        "name": "Test",
        "role": "member"
    })
    assert result.inserted_id

    # Verify user exists
    user = await db.users.find_one({"email": "test@test.com"})
    assert user["name"] == "Test"

    # Cleanup
    await db.users.delete_one({"_id": result.inserted_id})
```

---

## 📚 Recursos

- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Motor Documentation](https://motor.readthedocs.io/)
- [MongoDB University](https://university.mongodb.com/)
