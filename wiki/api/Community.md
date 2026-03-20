# API - Community & Content

Complete API documentation for community features, courses, and content management.

## 🔗 Base URL

```
http://localhost:8000/api
```

---

## 📚 Courses & Lessons

### GET /courses

Get all available courses.

**Request**:
```http
GET /api/courses
Cookie: access_token=<jwt_token>
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | No | Filter by category (course, masterclass, workshop, interview) |
| min_level | integer | No | Minimum user level required |
| vip_only | boolean | No | VIP only courses |

**Response** (200):
```json
[
  {
    "course_id": "507f1f77bcf86cd799439020",
    "title": "Advanced Closing Techniques",
    "description": "Master the art of closing vacation club sales",
    "thumbnail": "https://example.com/thumbnail.jpg",
    "category": "course",
    "min_level": 2,
    "vip_only": true,
    "lessons_count": 8,
    "duration_minutes": 120,
    "created_at": "2026-03-01T10:30:00Z"
  }
]
```

---

### GET /courses/{course_id}

Get course details with lessons.

**Request**:
```http
GET /api/courses/507f1f77bcf86cd799439020
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
{
  "course_id": "507f1f77bcf86cd799439020",
  "title": "Advanced Closing Techniques",
  "description": "Master the art of closing vacation club sales",
  "thumbnail": "https://example.com/thumbnail.jpg",
  "category": "course",
  "min_level": 2,
  "vip_only": true,
  "lessons": [
    {
      "lesson_id": "507f1f77bcf86cd799439021",
      "title": "The Assumptive Close",
      "description": "Learn to assume the sale confidently",
      "video_url": "https://www.youtube.com/embed/xxx",
      "duration_minutes": 15,
      "order": 1,
      "is_completed": false
    }
  ],
  "created_at": "2026-03-01T10:30:00Z"
}
```

---

### POST /courses

Create a new course (admin only).

**Request**:
```http
POST /api/courses
Cookie: access_token=<jwt_token>
Content-Type: application/json

{
  "title": "New Sales Course",
  "description": "Course description",
  "thumbnail": "https://example.com/thumb.jpg",
  "category": "course",
  "min_level": 1,
  "vip_only": false
}
```

**Response** (201):
```json
{
  "message": "Course created successfully",
  "course": {
    "course_id": "507f1f77bcf86cd799439022",
    "title": "New Sales Course",
    "description": "Course description",
    "thumbnail": "https://example.com/thumb.jpg",
    "category": "course",
    "min_level": 1,
    "vip_only": false,
    "created_at": "2026-03-20T10:30:00Z"
  }
}
```

---

### POST /courses/{course_id}/lessons

Add a lesson to a course (admin only).

**Request**:
```http
POST /api/courses/507f1f77bcf86cd799439020/lessons
Cookie: access_token=<jwt_token>
Content-Type: application/json

{
  "title": "Lesson Title",
  "description": "Lesson description",
  "video_url": "https://www.youtube.com/embed/xxx",
  "duration_minutes": 15
}
```

**Response** (201):
```json
{
  "message": "Lesson created successfully",
  "lesson": {
    "lesson_id": "507f1f77bcf86cd799439023",
    "title": "Lesson Title",
    "description": "Lesson description",
    "video_url": "https://www.youtube.com/embed/xxx",
    "duration_minutes": 15,
    "order": 9
  }
}
```

---

### POST /lessons/{lesson_id}/complete

Mark a lesson as completed.

**Request**:
```http
POST /api/lessons/507f1f77bcf86cd799439021/complete
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
{
  "message": "Lesson completed successfully",
  "points_earned": 5,
  "updated_progress": {
    "completed_lessons": 15,
    "total_points": 200
  }
}
```

---

## 💬 Community Posts

### GET /posts

Get community posts.

**Request**:
```http
GET /api/posts
Cookie: access_token=<jwt_token>
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| limit | integer | No | Number of posts to return (default: 20) |
| skip | integer | No | Number of posts to skip (pagination) |

**Response** (200):
```json
[
  {
    "post_id": "507f1f77bcf86cd799439030",
    "author": {
      "user_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "picture": "https://example.com/avatar.jpg"
    },
    "content": "Just closed my first deal using the assumptive close technique!",
    "likes_count": 12,
    "comments_count": 3,
    "is_liked": false,
    "created_at": "2026-03-20T10:30:00Z"
  }
]
```

---

### POST /posts

Create a new post.

**Request**:
```http
POST /api/posts
Cookie: access_token=<jwt_token>
Content-Type: application/json

{
  "content": "Just closed my first deal using the assumptive close technique!"
}
```

**Response** (201):
```json
{
  "message": "Post created successfully",
  "post": {
    "post_id": "507f1f77bcf86cd799439031",
    "content": "Just closed my first deal using the assumptive close technique!",
    "author": {
      "user_id": "507f1f77bcf86cd799439012",
      "name": "John Doe"
    },
    "likes_count": 0,
    "comments_count": 0,
    "created_at": "2026-03-20T10:30:00Z"
  }
}
```

---

### POST /posts/{post_id}/like

Like a post.

**Request**:
```http
POST /api/posts/507f1f77bcf86cd799439030/like
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
{
  "message": "Post liked successfully",
  "likes_count": 13
}
```

---

### DELETE /posts/{post_id}/like

Unlike a post.

**Request**:
```http
DELETE /api/posts/507f1f77bcf86cd799439030/like
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
{
  "message": "Post unliked successfully",
  "likes_count": 12
}
```

---

### POST /posts/{post_id}/comments

Add a comment to a post.

**Request**:
```http
POST /api/posts/507f1f77bcf86cd799439030/comments
Cookie: access_token=<jwt_token>
Content-Type: application/json

{
  "content": "Congratulations! Which technique worked best?"
}
```

**Response** (201):
```json
{
  "message": "Comment created successfully",
  "comment": {
    "comment_id": "507f1f77bcf86cd799439032",
    "post_id": "507f1f77bcf86cd799439030",
    "author": {
      "user_id": "507f1f77bcf86cd799439012",
      "name": "John Doe"
    },
    "content": "Congratulations! Which technique worked best?",
    "created_at": "2026-03-20T10:30:00Z"
  }
}
```

---

### GET /posts/{post_id}/comments

Get comments for a post.

**Request**:
```http
GET /api/posts/507f1f77bcf86cd799439030/comments
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
[
  {
    "comment_id": "507f1f77bcf86cd799439032",
    "author": {
      "user_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "picture": "https://example.com/avatar2.jpg"
    },
    "content": "Congratulations! Which technique worked best?",
    "created_at": "2026-03-20T10:35:00Z"
  }
]
```

---

## 📅 Events

### GET /events

Get upcoming events.

**Request**:
```http
GET /api/events
Cookie: access_token=<jwt_token>
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| upcoming | boolean | No | Show only upcoming events (default: true) |
| limit | integer | No | Number of events to return (default: 10) |

**Response** (200):
```json
[
  {
    "event_id": "507f1f77bcf86cd799439040",
    "title": "VCSA Live Masterclass: Advanced Objection Handling",
    "description": "Join us for a deep dive into handling tough objections",
    "date": "2026-04-15T14:00:00Z",
    "location": "Virtual (Zoom)",
    "registration_link": "https://zoom.us/j/123456789",
    "is_registered": false,
    "capacity": 100,
    "registered_count": 45
  }
]
```

---

### POST /events

Create a new event (admin only).

**Request**:
```http
POST /api/events
Cookie: access_token=<jwt_token>
Content-Type: application/json

{
  "title": "VCSA Live Masterclass",
  "description": "Event description",
  "date": "2026-04-15T14:00:00Z",
  "location": "Virtual (Zoom)",
  "registration_link": "https://zoom.us/j/123456789",
  "capacity": 100
}
```

**Response** (201):
```json
{
  "message": "Event created successfully",
  "event": {
    "event_id": "507f1f77bcf86cd799439041",
    "title": "VCSA Live Masterclass",
    "description": "Event description",
    "date": "2026-04-15T14:00:00Z",
    "location": "Virtual (Zoom)",
    "registration_link": "https://zoom.us/j/123456789",
    "capacity": 100,
    "registered_count": 0
  }
}
```

---

### POST /events/{event_id}/register

Register for an event.

**Request**:
```http
POST /api/events/507f1f77bcf86cd799439040/register
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
{
  "message": "Successfully registered for event",
  "registration": {
    "event_id": "507f1f77bcf86cd799439040",
    "user_id": "507f1f77bcf86cd799439012",
    "registered_at": "2026-03-20T10:30:00Z"
  }
}
```

---

## 📦 Resources

### GET /resources

Get downloadable resources.

**Request**:
```http
GET /api/resources
Cookie: access_token=<jwt_token>
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | No | Filter by category (scripts, templates, guides, etc.) |

**Response** (200):
```json
[
  {
    "resource_id": "507f1f77bcf86cd799439050",
    "title": "Objection Handling Script Book",
    "description": "Comprehensive scripts for handling common objections",
    "file_url": "https://example.com/scripts.pdf",
    "file_type": "pdf",
    "file_size_mb": 2.5,
    "category": "scripts",
    "download_count": 234,
    "created_at": "2026-03-01T10:30:00Z"
  }
]
```

---

### POST /resources

Upload a new resource (admin only).

**Request**:
```http
POST /api/resources
Cookie: access_token=<jwt_token>
Content-Type: application/json

{
  "title": "New Resource",
  "description": "Resource description",
  "file_url": "https://example.com/file.pdf",
  "file_type": "pdf",
  "category": "guides"
}
```

**Response** (201):
```json
{
  "message": "Resource created successfully",
  "resource": {
    "resource_id": "507f1f77bcf86cd799439051",
    "title": "New Resource",
    "description": "Resource description",
    "file_url": "https://example.com/file.pdf",
    "file_type": "pdf",
    "category": "guides",
    "download_count": 0,
    "created_at": "2026-03-20T10:30:00Z"
  }
}
```

---

## 🧪 Testing Examples

### Get Courses
```bash
curl -X GET "http://localhost:8000/api/courses?category=course" \
  -b cookies.txt
```

### Create Post
```bash
curl -X POST http://localhost:8000/api/posts \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "content": "Just closed my first deal!"
  }'
```

### Like Post
```bash
curl -X POST http://localhost:8000/api/posts/507f1f77bcf86cd799439030/like \
  -b cookies.txt
```

### Get Events
```bash
curl -X GET "http://localhost:8000/api/events?upcoming=true" \
  -b cookies.txt
```

---

## 📚 Related Documentation

- [Authentication API](Auth.md)
- [Development System API](Development.md)
- [Organizations API](Organizations.md)
