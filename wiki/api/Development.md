# API - Phase 1 Development System

Documentación completa de los endpoints del Phase 1 Development System.

## 🔗 Base URL

```
http://localhost:8000/api/development
```

Todos los endpoints requieren autenticación vía JWT token (httpOnly cookie).

---

## 📋 Endpoints

### Stages

### GET /stages

Obtiene las 4 etapas del sistema de progresión.

**Request**:
```http
GET /api/development/stages
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
[
  {
    "id": 1,
    "name": "New Rep",
    "description": "Build your sales foundation",
    "points_required": 150,
    "duration_weeks": "1-2",
    "icon": "🌱",
    "color": "#10B981"
  },
  {
    "id": 2,
    "name": "Developing Rep",
    "description": "Execute with consistency",
    "points_required": 300,
    "duration_weeks": "2-4",
    "icon": "📈",
    "color": "#3B82F6"
  },
  {
    "id": 3,
    "name": "Performing Rep",
    "description": "Close consistently",
    "points_required": 500,
    "duration_weeks": "4-8",
    "icon": "⚡",
    "color": "#F59E0B"
  },
  {
    "id": 4,
    "name": "Top Producer",
    "description": "Elite performer",
    "points_required": 750,
    "duration_weeks": "8-12",
    "icon": "👑",
    "color": "#D4AF37"
  }
]
```

---

### Tracks

### GET /tracks

Obtiene todos los 6 tracks de entrenamiento.

**Request**:
```http
GET /api/development/tracks
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
[
  {
    "id": 1,
    "stage_id": 1,
    "title": "Pro Mindset",
    "description": "Master the psychology of sales success",
    "icon": "🧠",
    "modules_count": 6
  },
  {
    "id": 2,
    "stage_id": 1,
    "title": "Discovery & Control",
    "description": "Take control from the first moment",
    "icon": "🔍",
    "modules_count": 6
  },
  {
    "id": 3,
    "stage_id": 2,
    "title": "Value Architecture",
    "description": "Build irresistible value",
    "icon": "🏗️",
    "modules_count": 6
  },
  {
    "id": 4,
    "stage_id": 2,
    "title": "Decision Management",
    "description": "Guide decisions confidently",
    "icon": "🎯",
    "modules_count": 6
  },
  {
    "id": 5,
    "stage_id": 3,
    "title": "Objection Mastery",
    "description": "Handle any objection with ease",
    "icon": "🛡️",
    "modules_count": 6
  },
  {
    "id": 6,
    "stage_id": 3,
    "title": "Post-Decision Integrity",
    "description": "Maintain relationships after the sale",
    "icon": "🤝",
    "modules_count": 6
  }
]
```

---

### GET /tracks/{track_id}

Obtiene un track específico con sus módulos.

**Request**:
```http
GET /api/development/tracks/1
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
{
  "id": 1,
  "title": "Pro Mindset",
  "description": "Master the psychology of sales success",
  "icon": "🧠",
  "modules": [
    {
      "id": "module_1_1",
      "title": "The Elite Sales Mindset",
      "description": "Develop the mental framework of top producers",
      "video_url": "https://www.youtube.com/embed/xxx",
      "thumbnail_url": "https://...",
      "key_move": "Adopt the 'Abundance Mindset' - there are always more prospects",
      "duration_minutes": 12,
      "order": 1,
      "is_completed": true
    },
    {
      "id": "module_1_2",
      "title": "Goal Setting That Works",
      "description": "Set and achieve ambitious sales targets",
      "video_url": "https://www.youtube.com/embed/xxx",
      "thumbnail_url": "https://...",
      "key_move": "Use the 'Reverse Engineer' method - start with the goal and work backwards",
      "duration_minutes": 15,
      "order": 2,
      "is_completed": false
    }
  ]
}
```

---

### Modules

### POST /modules/{module_id}/complete

Marca un módulo como completado y otorga puntos.

**Request**:
```http
POST /api/development/modules/module_1_2/complete
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
{
  "message": "Module completed successfully",
  "points_earned": 10,
  "new_badges": [
    "first_module"
  ],
  "updated_progress": {
    "total_points": 160,
    "completed_modules": 2,
    "current_stage": 1
  }
}
```

**Response** (400):
```json
{
  "detail": "Module already completed"
}
```

---

### Deal Breakdowns

### GET /breakdowns

Obtiene todos los deal breakdowns.

**Request**:
```http
GET /api/development/breakdowns
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
[
  {
    "id": "breakdown_1",
    "title": "Lost Control After Price Reveal",
    "scenario": "You present the price and the prospect says 'That's too expensive'. You panic and start discounting...",
    "mistake": "Showing uncertainty and lowering price immediately",
    "fix": "Stay confident, isolate the objection, and rebuild value before discussing price",
    "key_takeaway": "Price objections are often value objections in disguise",
    "is_reviewed": false
  },
  {
    "id": "breakdown_2",
    "title": "The Missing Spouse Objection",
    "scenario": "After a great presentation, they say 'We need to talk to my spouse/partner'...",
    "mistake": "Not setting expectations upfront about who needs to be present",
    "fix": "Always establish decision-making criteria before the presentation",
    "key_takeaway": "Pre-frame the decision-making process in discovery",
    "is_reviewed": false
  }
]
```

### POST /breakdowns/{breakdown_id}/review

Marca un breakdown como revisado.

**Request**:
```http
POST /api/development/breakdowns/breakdown_1/review
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
{
  "message": "Breakdown reviewed successfully",
  "points_earned": 5
}
```

---

### Quick Wins

### GET /quickwins

Obtiene todos los quick wins.

**Request**:
```http
GET /api/development/quickwins
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
[
  {
    "id": "quickwin_1",
    "title": "How to Recover After Losing Control",
    "category": "Control",
    "script": "You know what, I got a little ahead of myself there. Let me take a step back. What's most important to you about this vacation experience?",
    "when_to_use": "When you catch yourself talking too much or the prospect looks disengaged",
    "is_applied": false
  },
  {
    "id": "quickwin_2",
    "title": "How to Answer 'We Need to Think About It'",
    "category": "Closing",
    "script": "I completely understand. What specifically would you like to think about? Is it the ownership, the flexibility, or something else?",
    "when_to_use": "When prospects use the think-it-over objection",
    "is_applied": false
  }
]
```

### POST /quickwins/{quickwin_id}/apply

Marca un quick win como aplicado.

**Request**:
```http
POST /api/development/quickwins/quickwin_1/apply
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
{
  "message": "Quick win applied successfully",
  "points_earned": 3
}
```

---

### Progress

### GET /progress

Obtiene el progreso completo del usuario.

**Request**:
```http
GET /api/development/progress
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
{
  "current_stage": 2,
  "readiness_score": 45,
  "points": 160,
  "training_streak": 7,
  "completed_modules": 2,
  "completed_breakdowns": 1,
  "applied_quickwins": 0,
  "badges_awarded": [
    "first_module",
    "streak_7"
  ],
  "stage_progress": {
    "stage_1": {
      "points_earned": 160,
      "points_required": 150,
      "is_complete": true
    },
    "stage_2": {
      "points_earned": 10,
      "points_required": 300,
      "is_complete": false
    }
  },
  "track_progress": [
    {
      "track_id": 1,
      "completed_modules": 2,
      "total_modules": 6,
      "progress_percent": 33
    }
  ]
}
```

---

### Badges

### GET /badges

Obtiene todas las badges disponibles y su estado.

**Request**:
```http
GET /api/development/badges
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
{
  "awarded": [
    {
      "id": "first_module",
      "name": "First Steps",
      "description": "Complete your first module",
      "icon": "🎯",
      "awarded_at": "2026-03-16T10:30:00Z"
    },
    {
      "id": "streak_7",
      "name": "Week Warrior",
      "description": "7-day training streak",
      "icon": "🔥",
      "awarded_at": "2026-03-16T09:00:00Z"
    }
  ],
  "available": [
    {
      "id": "stage_1_complete",
      "name": "Foundation Builder",
      "description": "Complete Stage 1",
      "icon": "🌱",
      "is_unlocked": false
    },
    {
      "id": "readiness_100",
      "name": "Ready for Anything",
      "description": "100% readiness score",
      "icon": "💯",
      "is_unlocked": false
    }
  ]
}
```

---

### Bookmarks

### POST /bookmarks

Crea un nuevo bookmark con tags.

**Request**:
```http
POST /api/development/bookmarks
Cookie: access_token=<jwt_token>
Content-Type: application/json

{
  "content_id": "module_1_3",
  "content_type": "module",
  "tags": ["before_tour", "objections"],
  "notes": "Review this before tomorrow's tour"
}
```

**Response** (201):
```json
{
  "_id": "...",
  "content_id": "module_1_3",
  "content_type": "module",
  "tags": ["before_tour", "objections"],
  "notes": "Review this before tomorrow's tour",
  "created_at": "2026-03-16T10:30:00Z"
}
```

### GET /bookmarks

Obtiene los bookmarks del usuario.

**Request**:
```http
GET /api/development/bookmarks?tag=before_tour
Cookie: access_token=<jwt_token>
```

**Query Parameters**:
- `tag` (optional): Filter by tag

**Response** (200):
```json
[
  {
    "_id": "...",
    "content_id": "module_1_3",
    "content_type": "module",
    "content": {
      "id": "module_1_3",
      "title": "Objection Handling Basics",
      "thumbnail_url": "https://..."
    },
    "tags": ["before_tour", "objections"],
    "notes": "Review this before tomorrow's tour",
    "created_at": "2026-03-16T10:30:00Z"
  }
]
```

### DELETE /bookmarks/{bookmark_id}

Elimina un bookmark.

**Request**:
```http
DELETE /api/development/bookmarks/{bookmark_id}
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
{
  "message": "Bookmark deleted successfully"
}
```

---

## 🔐 Authentication

Todos los endpoints requieren un JWT token válido enviado como httpOnly cookie.

### Obtener Token

El token se obtiene al hacer login:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@vcsa.com",
  "password": "password123"
}
```

El token se establece automáticamente como una cookie httpOnly:

```
Set-Cookie: access_token=<jwt_token>; HttpOnly; Path=/; SameSite=lax
```

### Usar Token

El frontend no necesita enviar explícitamente el token - las cookies se envían automáticamente con cada request.

---

## 📊 Códigos de Respuesta

| Código | Descripción |
|--------|-------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 🧪 Testing

### cURL Examples

```bash
# Get stages
curl -X GET http://localhost:8000/api/development/stages \
  -H "Cookie: access_token=<your_token>"

# Complete module
curl -X POST http://localhost:8000/api/development/modules/module_1_1/complete \
  -H "Cookie: access_token=<your_token>"

# Get progress
curl -X GET http://localhost:8000/api/development/progress \
  -H "Cookie: access_token=<your_token>"
```

---

## 📚 Referencias

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
