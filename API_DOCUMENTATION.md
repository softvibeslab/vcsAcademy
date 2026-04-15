# 📚 VCSA API Documentation

**Version**: 1.0.0
**Last Updated**: April 15, 2026
**API Version**: v1
**Base URL**: `https://api.vcsa.com/api` (production) or `http://localhost:8000/api` (development)

---

## 🔐 Authentication

VCSA API uses session-based authentication. Include your session token in cookies for authenticated requests.

### Login

**Endpoint**: `POST /auth/login`
**Authentication**: Not required
**Rate Limiting**: 5 requests per minute

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "YourPassword123"
}
```

**Response** (200 OK):
```json
{
  "user_id": "user_abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://example.com/avatar.jpg",
  "level": 1,
  "points": 150,
  "membership": "vip",
  "role": "member",
  "created_at": "2026-04-15T10:30:00Z"
}
```

**Error Responses**:
- `401 Unauthorized` - Invalid credentials
- `422 Validation Error` - Missing or invalid fields
- `429 Too Many Requests` - Account locked (too many failed attempts)

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

---

### Register

**Endpoint**: `POST /auth/register`
**Authentication**: Not required
**Rate Limiting**: 3 requests per email per hour

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Response** (200 OK):
```json
{
  "user_id": "user_xyz789",
  "email": "user@example.com",
  "name": "John Doe",
  "picture": null,
  "level": 1,
  "points": 0,
  "membership": "free",
  "role": "member",
  "created_at": "2026-04-15T10:30:00Z"
}
```

**Error Responses**:
- `400 Bad Request` - Email already registered
- `422 Validation Error` - Invalid input data
- `429 Too Many Requests` - Too many registration attempts

---

### Logout

**Endpoint**: `POST /auth/logout`
**Authentication**: Required
**Rate Limiting**: 10 requests per minute

**Request**: Include session token in cookies

**Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

**Error Responses**:
- `401 Unauthorized` - Not authenticated

---

### Get Current User

**Endpoint**: `GET /auth/me`
**Authentication**: Required
**Rate Limiting**: 60 requests per minute

**Response** (200 OK):
```json
{
  "user_id": "user_abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://example.com/avatar.jpg",
  "level": 1,
  "points": 150,
  "membership": "vip",
  "role": "member",
  "created_at": "2026-04-15T10:30:00Z"
}
```

---

## 🎯 Phase 1 Development System

### Get All Stages

**Endpoint**: `GET /development/stages`
**Authentication**: Required
**Rate Limiting**: 30 requests per minute

**Response** (200 OK):
```json
[
  {
    "stage_id": "stage_1",
    "stage_number": 1,
    "name": "New Rep",
    "title": "Build Foundation",
    "objective": "Build fundamental sales skills and mindset",
    "key_skills": ["Product knowledge", "Basic communication", "Time management"],
    "required_tracks": ["track_1"],
    "points_required": 150,
    "typical_duration": "1-2 weeks",
    "exit_criteria": "Complete Track 1 and earn 150 points"
  }
]
```

---

### Get All Tracks

**Endpoint**: `GET /development/tracks`
**Authentication**: Required
**Rate Limiting**: 30 requests per minute

**Query Parameters**:
- `active`: boolean (optional) - Filter by active status

**Response** (200 OK):
```json
[
  {
    "track_id": "track_1",
    "track_number": 1,
    "name": "Pro Mindset",
    "purpose": "Develop the champion mindset needed for vacation club sales",
    "outcome": "Sales reps who think like champions and perform consistently",
    "total_duration": 48,
    "modules": []
  }
]
```

---

### Get Track Details

**Endpoint**: `GET /development/tracks/{track_id}`
**Authentication**: Required
**Rate Limiting**: 30 requests per minute

**Path Parameters**:
- `track_id` (required): Track ID (e.g., `track_1`)

**Response** (200 OK):
```json
{
  "track_id": "track_1",
  "track_number": 1,
  "name": "Pro Mindset",
  "purpose": "Develop the champion mindset needed for vacation club sales",
  "outcome": "Sales reps who think like champions and perform consistently",
  "modules": [
    {
      "content_id": "mod_1_1",
      "module_number": "1.1",
      "title": "Introduction: The Pro Mindset",
      "description": "Learn what separates average performers from top producers",
      "duration": 8,
      "video_url": "https://youtu.be/wDjfOy5aks8",
      "key_move": "Adopt the 'Next Rep' mindset - every interaction is a fresh start",
      "completed": false,
      "completion_date": null
    }
  ]
}
```

---

### Get Content Details

**Endpoint**: `GET /development/content/{content_id}`
**Authentication**: Required
**Rate Limiting**: 30 requests per minute

**Path Parameters**:
- `content_id` (required): Content ID (e.g., `mod_1_1`)

**Response** (200 OK):
```json
{
  "content_id": "mod_1_1",
  "title": "Introduction: The Pro Mindset",
  "description": "Learn what separates average performers from top producers",
  "type": "video",
  "duration": 8,
  "video_url": "https://youtu.be/wDjfOy5aks8",
  "key_move": "Adopt the 'Next Rep' mindset - every interaction is a fresh start",
  "tags": ["mindset", "foundation"],
  "difficulty": "beginner",
  "completed": false
}
```

---

### Mark Content as Complete

**Endpoint**: `POST /development/content/{content_id}/complete`
**Authentication**: Required
**Rate Limiting**: 10 requests per minute

**Path Parameters**:
- `content_id` (required): Content ID

**Request Body**:
```json
{
  "time_spent": 480
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "points_earned": 10,
  "new_total": 160,
  "streak_updated": true,
  "readiness_score": 45
}
```

**Error Responses**:
- `404 Not Found` - Content not found
- `400 Bad Request` - Already completed

---

### Get Deal Breakdowns

**Endpoint**: `GET /development/breakdowns`
**Authentication**: Required
**Rate Limiting**: 30 requests per minute

**Query Parameters**:
- `tag`: string (optional) - Filter by tag
- `status`: string (optional) - Filter by status (lost, won)

**Response** (200 OK):
```json
[
  {
    "breakdown_id": "bd_1",
    "title": "Lost Control After Price Reveal",
    "status": "lost",
    "scenario": "Great rapport built, strong value presentation, price reveal at $28K...",
    "root_cause": "Price reveal timing issue - no trial close before price",
    "what_happened": "Rep lost control, couldn't recover",
    "key_takeaway": "Always trial close before revealing price",
    "video_url": null,
    "related_modules": ["mod_3_5"],
    "tags": ["price", "control", "closing"]
  }
]
```

---

### Mark Breakdown as Reviewed

**Endpoint**: `POST /development/breakdowns/{breakdown_id}/review`
**Authentication**: Required
**Rate Limiting**: 10 requests per minute

**Path Parameters**:
- `breakdown_id` (required): Breakdown ID

**Response** (200 OK):
```json
{
  "status": "success",
  "points_earned": 5,
  "reviewed_count": 3,
  "completion": "20%"
}
```

---

### Get Quick Wins

**Endpoint**: `GET /development/quickwins`
**Authentication**: Required
**Rate Limiting**: 30 requests per minute

**Query Parameters**:
- `tag`: string (optional) - Filter by tag
- `situation`: string (optional) - Filter by situation

**Response** (200 OK):
```json
[
  {
    "quick_win_id": "qw_1",
    "title": "How to Answer 'We Need to Think About It'",
    "situation": "closing_help",
    "duration": 3,
    "tactic": "The 'Think About It' objection usually means they don't see enough value yet...",
    "example_dialogue": "Rep: 'I completely understand you want to think about this...'",
    "tags": ["objections", "closing", "think_about_it"],
    "applied": false
  }
]
```

---

### Apply Quick Win

**Endpoint**: `POST /development/quickwins/{quick_win_id}/apply`
**Authentication**: Required
**Rate Limiting**: 10 requests per minute

**Path Parameters**:
- `quick_win_id` (required): Quick Win ID

**Response** (200 OK):
```json
{
  "status": "success",
  "points_earned": 3,
  "applied_count": 12,
  "readiness_score": 47
}
```

---

### Get User Progress

**Endpoint**: `GET /development/progress`
**Authentication**: Required
**Rate Limiting**: 60 requests per minute

**Response** (200 OK):
```json
{
  "user_id": "user_abc123",
  "readiness_score": 45,
  "stages_completed": 1,
  "current_stage": "stage_2",
  "points": 160,
  "level": 1,
  "training_streak": 5,
  "modules_completed": 16,
  "breakdowns_reviewed": 3,
  "quick_wins_applied": 12,
  "badges": ["First Steps"],
  "next_module": {
    "module_id": "mod_1_2",
    "title": "The Performance Mindset"
  }
}
```

---

### Get Badges

**Endpoint**: `GET /development/badges`
**Authentication**: Required
**Rate Limiting**: 30 requests per minute

**Response** (200 OK):
```json
[
  {
    "badge_id": "first_steps",
    "name": "First Steps",
    "description": "Complete your first training module",
    "icon": "🎯",
    "requirement_type": "content_count",
    "requirement_value": "1",
    "earned": true,
    "earned_at": "2026-04-15T10:30:00Z"
  }
]
```

---

## 💳 Payments & Subscriptions

### Create Checkout Session

**Endpoint**: `POST /payments/create-checkout`
**Authentication**: Required
**Rate Limiting**: 5 requests per minute

**Request Body**:
```json
{
  "price_id": "price_1",
  "success_url": "https://vcsa.com/success",
  "cancel_url": "https://vcsa.com/membership",
  "metadata": {
    "user_id": "user_abc123"
  }
}
```

**Response** (200 OK):
```json
{
  "checkout_session_id": "cs_test_abc123",
  "url": "https://checkout.stripe.com/pay/cs_test_abc123"
}
```

---

### Webhook Endpoint

**Endpoint**: `POST /payments/webhook`
**Authentication**: None (Stripe-to-server)
**Rate Limiting**: None (handled by Stripe)

**Headers**:
- `stripe-signature`: Stripe signature for verification

**Events Handled**:
- `checkout.session.completed` - User completes checkout
- `customer.subscription.created` - New subscription created
- `customer.subscription.updated` - Subscription updated
- `customer.subscription.deleted` - Subscription canceled
- `invoice.payment_succeeded` - Payment successful
- `invoice.payment_failed` - Payment failed

**Response** (200 OK):
```json
{
  "status": "success",
  "event_type": "checkout.session.completed"
}
```

---

## 👥 Community

### Get Community Feed

**Endpoint**: `GET /community/feed`
**Authentication**: Required
**Rate Limiting**: 30 requests per minute

**Query Parameters**:
- `limit`: integer (optional) - Number of posts (default: 20)
- `offset`: integer (optional) - Offset for pagination

**Response** (200 OK):
```json
[
  {
    "post_id": "post_1",
    "user_id": "user_xyz789",
    "user_name": "Jane Smith",
    "user_picture": "https://example.com/avatar.jpg",
    "content": "Just closed my first deal using the 'Think About It' tactic! 🎉",
    "likes": ["user_abc123", "user_xyz789"],
    "comments_count": 3,
    "pinned": false,
    "created_at": "2026-04-15T10:30:00Z"
  }
]
```

---

### Create Post

**Endpoint**: `POST /community/posts`
**Authentication**: Required
**Rate Limiting**: 5 requests per minute

**Request Body**:
```json
{
  "content": "Just closed my first deal using the 'Think About It' tactic! 🎉"
}
```

**Response** (200 OK):
```json
{
  "post_id": "post_2",
  "status": "success",
  "likes_count": 0
}
```

---

## 📅 Events

### Get Events

**Endpoint**: `GET /events`
**Authentication**: Required
**Rate Limiting**: 30 requests per minute

**Query Parameters**:
- `vip_only`: boolean (optional) - Filter by VIP requirement
- `upcoming`: boolean (optional) - Only upcoming events

**Response** (200 OK):
```json
[
  {
    "event_id": "event_1",
    "title": "Masterclass: Advanced Closing Techniques",
    "description": "Learn advanced closing techniques from top performers",
    "speaker": "John Smith",
    "speaker_image": "https://example.com/speaker.jpg",
    "event_type": "masterclass",
    "start_time": "2026-05-01T14:00:00Z",
    "join_link": "https://zoom.us/j/123456789",
    "recording_url": "https://example.com/recording",
    "vip_only": false,
    "created_at": "2026-04-15T10:30:00Z"
  }
]
```

---

## 📚 Resources

### Get Resources

**Endpoint**: `GET /resources`
**Authentication**: Required
**Rate Limiting**: 30 requests per minute

**Query Parameters**:
- `category`: string (optional) - Filter by category
- `resource_type`: string (optional) - Filter by type
- `difficulty`: string (optional) - Filter by difficulty

**Response** (200 OK):
```json
[
  {
    "resource_id": "res_1",
    "title": "Objection Handling Framework",
    "description": "Complete framework for handling common objections",
    "resource_type": "framework",
    "category": "objections",
    "content": "Text content OR file URL",
    "file_url": "https://s3.vcsa.com/objections.pdf",
    "file_type": "pdf",
    "tags": ["objections", "framework"],
    "difficulty": "intermediate",
    "usage_count": 234,
    "created_at": "2026-04-15T10:30:00Z"
  }
]
```

---

## 🔐 Error Codes

| Code | Description | Retry |
|------|-------------|-------|
| 200 | Success | No |
| 201 | Created | No |
| 400 | Bad Request | Fix request |
| 401 | Unauthorized | Authenticate |
| 403 | Forbidden | Check permissions |
| 404 | Not Found | Verify URL |
| 422 | Validation Error | Fix input |
| 429 | Too Many Requests | Wait |
| 500 | Server Error | Retry later |

---

## 📊 Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/auth/*` | 5-10/min | 1 minute |
| `/development/*` | 30/min | 1 minute |
| `/community/*` | 10/min | 1 minute |
| `/payments/*` | 5/min | 1 minute |
| `/events/*` | 30/min | 1 minute |
| `/resources/*` | 30/min | 1 minute |

---

## 🧪 Testing Examples

### cURL Examples

**Login**:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@vcsa.com","password":"demo123"}' \
  -c cookies.txt
```

**Get Stages**:
```bash
curl http://localhost:8000/api/development/stages \
  -H "Cookie: session_token=your_token" \
  | jq '.'
```

**Complete Module**:
```bash
curl -X POST http://localhost:8000/api/development/content/mod_1_1/complete \
  -H "Cookie: session_token=your_token" \
  -H "Content-Type: application/json" \
  -d '{"time_spent": 480}' \
  | jq '.'
```

---

## 📈 Usage Examples

### Complete User Journey

```python
import requests

BASE_URL = "http://localhost:8000/api"

# 1. Login
session = requests.Session()
login_response = session.post(f"{BASE_URL}/auth/login", json={
    "email": "demo@vcsa.com",
    "password": "demo123"
})
user_data = login_response.json()

# 2. Get stages
stages = session.get(f"{BASE_URL}/development/stages").json()

# 3. Get track details
track = session.get(f"{BASE_URL}/development/tracks/track_1").json()

# 4. Complete module
complete = session.post(f"{BASE_URL}/development/content/mod_1_1/complete").json()

# 5. Check progress
progress = session.get(f"{BASE_URL}/development/progress").json()

print(f"Readiness Score: {progress['readiness_score']}%")
```

---

## 🔗 Postman Collection

A complete Postman collection is available for testing all endpoints:

- **VCSA API.postman_collection** - Complete API collection
- **Environment Variables**: Pre-configured for development
- **Authentication**: Auto-generated session tokens
- **Examples**: Pre-configured requests for all endpoints

---

**Last Updated**: April 15, 2026
**API Version**: 1.0.0
**Documentation Version**: 1.0

For more information, see:
- [PRODUCTION_PLAN.md](./PRODUCTION_PLAN.md) - Production roadmap
- [TASK_TRACKING.md](./TASK_TRACKING.md) - Task tracking
- [USER_FLOWS.md](./USER_FLOWS.md) - User journey documentation