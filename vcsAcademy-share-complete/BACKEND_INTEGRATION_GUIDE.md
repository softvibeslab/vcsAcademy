# Backend API Integration - MVP Lite

**Date**: April 7, 2026
**Status**: Complete & Integrated
**File**: `backend/dashboard_routes.py`

---

## 📋 Overview

Se ha creado un módulo completo de endpoints API para el MVP Lite que incluye:

- **Dashboard Module**: Strategy Panel, Daily Performance
- **Training Module**: Session details, progress tracking
- **Coaching Module**: Events, Group Sessions, Role Play, Q&A

---

## 🔌 Integration

### Router Integration

El router de dashboard ya está integrado en `server.py`:

```python
# Line 1698-1701 in server.py
try:
    from dashboard_routes import dashboard_router
    app.include_router(dashboard_router, prefix="/api")
    print("Dashboard routes loaded successfully")
except ImportError:
    print("Warning: dashboard_routes not available")
```

### Dependency Injection

Los endpoints usan un sistema de dependencias personalizado para acceder a la base de datos y usuario:

```python
# Helper functions
async def get_db(request: Request):
    return request.app.state.db

async def get_user(request: Request):
    return request.app.state.user

# Usage in endpoints
@dashboard_router.get("/strategy")
async def get_strategy(
    db: Any = Depends(get_db),
    user: Any = Depends(get_user)
):
    user_id = user.user_id
    # ... implementation
```

---

## 📊 Endpoints Implementados

### Dashboard Module

#### GET /api/dashboard/strategy
**Response**: StrategyResponse
```json
{
  "monthly_objective": {
    "target_income": 15000.0,
    "current_income": 9750.0,
    "progress": 65.0,
    "days_remaining": 12
  },
  "key_metrics": {
    "sales_trend": "+15%",
    "achievements": 12,
    "action_items": 5,
    "conversion_rate": 22
  },
  "weekly_highlights": [
    { "id": 1, "title": "Closed 3 deals this week", "impact": "positive" }
  ],
  "upcoming_events": [
    { "id": 1, "title": "Group Coaching", "date": "Tomorrow, 2 PM", "type": "group-coaching" }
  ]
}
```

#### PUT /api/dashboard/strategy
**Request**: Dict with updates
**Response**: `{ success: true, message: "Strategy updated" }`

#### GET /api/dashboard/performance?date=YYYY-MM-DD
**Response**: PerformanceResponse
```json
{
  "date": "2026-04-07",
  "tours_completed": 3,
  "sales_count": 1,
  "total_volume": 4500.0,
  "avg_deal_size": 4500.0,
  "conversion_rate": 33,
  "active_hours": 6,
  "tours": [
    { "id": 1, "time": "10:00 AM", "outcome": "Sale", "volume": 4500.0, "duration": 45 }
  ],
  "daily_goal": {
    "tours_target": 5,
    "sales_target": 2,
    "volume_target": 8000.0
  }
}
```

#### POST /api/dashboard/performance/tour
**Request**: TourCreate
```json
{
  "time": "10:00 AM",
  "outcome": "Sale",
  "volume": 4500.0,
  "duration": 45
}
```
**Response**: `{ success: true, message: "Tour logged successfully" }`

---

### Training Module

#### GET /api/dashboard/training/session/{session_id}
**Response**: SessionDetailResponse
```json
{
  "id": "session-1",
  "title": "Session 1: Foundation of Sales Excellence",
  "category": "Mindset",
  "duration": "45 min",
  "difficulty": "beginner",
  "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
  "key_takeaway": "Adopt the champion mindset...",
  "description": "Learn the foundational principles...",
  "instructor": "Maria Garcia",
  "points": 10,
  "modules_count": 6,
  "completed_modules": 0,
  "completed": false,
  "related_sessions": [
    { "id": "session-2", "title": "Session 2", "category": "Discovery" }
  ],
  "resources": [
    { "id": 1, "title": "Workbook", "type": "pdf", "file_size": 2500000 }
  ]
}
```

#### POST /api/dashboard/training/session/{session_id}/complete
**Response**:
```json
{
  "success": true,
  "message": "Session marked as complete",
  "points": 10
}
```

**Side Effects**:
- Creates entry in `user_progress` collection
- Increments user points by 10

---

### Coaching Module

#### GET /api/dashboard/coaching/events
**Response**: List[CoachingSession]
```json
[
  {
    "id": 1,
    "title": "Advanced Closing Techniques",
    "description": "Learn advanced closing...",
    "instructor": "Maria Garcia",
    "date": "2026-04-15",
    "time": "2:00 PM EST",
    "duration": "90 min",
    "location": "Zoom",
    "type": "group-coaching",
    "registered": true,
    "attendees": 45,
    "max_attendees": 100,
    "recording_available": false,
    "topics": ["Handling objections", "Closing"],
    "rating": 4.9
  }
]
```

#### GET /api/dashboard/coaching/group
**Response**: List[CoachingSession] (filtered by type="group-coaching")

#### GET /api/dashboard/coaching/roleplay
**Response**: List[CoachingSession] (filtered by type="roleplay")

#### GET /api/dashboard/coaching/qa
**Response**: List[CoachingSession] (filtered by type="qa")

#### POST /api/dashboard/coaching/events/{event_id}/register
**Response**: `{ success: true, message: "Registered for event" }`

**Side Effects**:
- Updates `coaching_events` collection
- Sets `registered: true` and `registered_at` timestamp

#### POST /api/dashboard/coaching/qa/question
**Request**: `{ question: "How to handle objections?" }`
**Response**: `{ success: true, message: "Question submitted" }`

**Side Effects**:
- Creates entry in `qa_questions` collection
- Stores question with user_id and timestamp

---

## 🗄️ Database Collections

### New Collections Created

1. **dashboard_strategy**
   - Stores user strategy data
   - Indexed by: `user_id`

2. **dashboard_performance**
   - Stores daily performance data
   - Indexed by: `user_id`, `date`

3. **training_sessions**
   - Stores training session metadata
   - Indexed by: `session_id`

4. **coaching_events**
   - Stores coaching event registrations
   - Indexed by: `user_id`, `id`

5. **qa_questions**
   - Stores Q&A questions
   - Indexed by: `user_id`, `answered`

### Existing Collections Used

1. **users** - User data and points
2. **user_progress** - Training progress tracking
3. **courses** - Training courses (existing)
4. **lessons** - Course lessons (existing)
5. **events** - Events (existing)
6. **resources** - Resources (existing)

---

## 🔄 Demo Data Fallback

Todos los endpoints incluyen **datos demo** que se activan automáticamente cuando:

1. No hay datos en la base de datos
2. Las consultas no retornan resultados
3. El usuario es nuevo y no tiene datos registrados

Esto permite probar el frontend inmediatamente sin necesidad de poblar la base de datos primero.

---

## 🧪 Testing

### Start Backend Server
```bash
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

### Test Endpoints (curl)

```bash
# Strategy Panel
curl http://localhost:8000/api/dashboard/strategy \
  -H "Authorization: Bearer YOUR_TOKEN"

# Daily Performance
curl http://localhost:8000/api/dashboard/performance \
  -H "Authorization: Bearer YOUR_TOKEN"

# Log Tour
curl -X POST http://localhost:8000/api/dashboard/performance/tour \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"time": "10:00 AM", "outcome": "Sale", "volume": 4500, "duration": 45}'

# Training Session
curl http://localhost:8000/api/dashboard/training/session/session-1 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Coaching Events
curl http://localhost:8000/api/dashboard/coaching/events \
  -H "Authorization: Bearer YOUR_TOKEN"

# Register for Event
curl -X POST http://localhost:8000/api/dashboard/coaching/events/1/register \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Postman Collection

Import this collection for easy testing:

```json
{
  "info": {
    "name": "VCSA MVP Lite API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Dashboard Strategy",
      "request": {
        "method": "GET",
        "header": [],
        "url": "{{base_url}}/api/dashboard/strategy"
      }
    },
    {
      "name": "Daily Performance",
      "request": {
        "method": "GET",
        "header": [],
        "url": "{{base_url}}/api/dashboard/performance"
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000"
    }
  ]
}
```

---

## 🔒 Authentication

Todos los endpoints requieren autenticación JWT. El sistema de autenticación se maneja mediante las funciones `get_db` y `get_user` que obtienen el usuario desde el request state.

**Nota**: La autenticación real depende de la configuración en `server.py` y el middleware que establece `request.app.state.user`.

---

## 🚀 Production Deployment

### Environment Variables
```bash
# .env
MONGO_URL=mongodb://localhost:27017
DB_NAME=vcsa
JWT_SECRET=your_jwt_secret_here
```

### MongoDB Indexes (Recommended)
```javascript
// Create indexes for better performance
db.dashboard_strategy.createIndex({ "user_id": 1 })
db.dashboard_performance.createIndex({ "user_id": 1, "date": 1 })
db.coaching_events.createIndex({ "user_id": 1, "id": 1 })
db.qa_questions.createIndex({ "user_id": 1, "answered": 1 })
db.user_progress.createIndex({ "user_id": 1, "content_id": 1, "content_type": 1 })
```

---

## 📝 Next Steps

1. ✅ Backend endpoints created
2. ✅ Router integrated in server.py
3. ⏳ Test endpoints with Postman
4. ⏳ Populate database with real content
5. ⏳ Configure production environment variables
6. ⏳ Deploy and test in production

---

## 🐛 Troubleshooting

### Router not loading
**Error**: `Warning: dashboard_routes not available`

**Solution**:
1. Check that `dashboard_routes.py` is in the `backend/` directory
2. Verify no syntax errors in the file
3. Check that all imports are available

### Database connection errors
**Error**: `MongoDB connection failed`

**Solution**:
1. Verify MongoDB is running: `mongosh` or `mongo`
2. Check MONGO_URL in `.env` file
3. Ensure MongoDB credentials are correct

### Authentication errors
**Error**: `401 Unauthorized`

**Solution**:
1. Verify JWT token is valid
2. Check that user exists in `users` collection
3. Ensure token is sent in Authorization header

---

## 📚 Additional Resources

- FastAPI Documentation: https://fastapi.tiangolo.com/
- Motor (MongoDB): https://motor.readthedocs.io/
- Pydantic Models: https://docs.pydantic.dev/

---

**Implementation Status**: ✅ Complete
**Ready for**: Testing → Database Population → Production Deployment
