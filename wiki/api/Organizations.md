# API - Organizations & Schools

Complete API documentation for the multi-tenant organization and school management system.

## 🔗 Base URL

```
http://localhost:8000/api
```

---

## 📋 Overview

VCSA supports multi-tenant architecture where organizations can create and manage multiple training schools. Each school has its own:

- Branding customization
- Content library
- Team members
- Training settings
- AI assistant configuration

---

## 🏢 Organizations

### POST /organizations

Create a new organization.

**Request**:
```http
POST /api/organizations
Cookie: access_token=<jwt_token>
Content-Type: application/json

{
  "name": "Acme Sales Training",
  "slug": "acme-sales",
  "logo_url": "https://example.com/logo.png"
}
```

**Request Body Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | Organization name |
| slug | string | Yes | URL-friendly identifier (unique) |
| logo_url | string | No | Organization logo URL |

**Response** (201):
```json
{
  "organization_id": "507f1f77bcf86cd799439011",
  "name": "Acme Sales Training",
  "slug": "acme-sales",
  "logo_url": "https://example.com/logo.png",
  "created_by": "507f1f77bcf86cd799439012",
  "created_at": "2026-03-20T10:30:00Z"
}
```

---

### GET /organizations

Get all organizations for current user.

**Request**:
```http
GET /api/organizations
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
[
  {
    "organization_id": "507f1f77bcf86cd799439011",
    "name": "Acme Sales Training",
    "slug": "acme-sales",
    "logo_url": "https://example.com/logo.png",
    "member_count": 15,
    "school_count": 3,
    "role": "admin",
    "created_at": "2026-03-20T10:30:00Z"
  }
]
```

---

### GET /organizations/{org_id}

Get organization details.

**Request**:
```http
GET /api/organizations/507f1f77bcf86cd799439011
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
{
  "organization_id": "507f1f77bcf86cd799439011",
  "name": "Acme Sales Training",
  "slug": "acme-sales",
  "logo_url": "https://example.com/logo.png",
  "settings": {
    "primary_color": "#D4AF37",
    "secondary_color": "#1E3A8A",
    "custom_domain": "training.acme.com"
  },
  "member_count": 15,
  "school_count": 3,
  "role": "admin",
  "created_at": "2026-03-20T10:30:00Z"
}
```

---

### PUT /organizations/{org_id}

Update organization settings.

**Request**:
```http
PUT /api/organizations/507f1f77bcf86cd799439011
Cookie: access_token=<jwt_token>
Content-Type: application/json

{
  "name": "Acme Training Academy",
  "logo_url": "https://example.com/new-logo.png",
  "settings": {
    "primary_color": "#FF5733",
    "secondary_color": "#1E3A8A"
  }
}
```

**Response** (200):
```json
{
  "message": "Organization updated successfully",
  "organization": {
    "organization_id": "507f1f77bcf86cd799439011",
    "name": "Acme Training Academy",
    "logo_url": "https://example.com/new-logo.png",
    "settings": {
      "primary_color": "#FF5733",
      "secondary_color": "#1E3A8A"
    }
  }
}
```

---

### DELETE /organizations/{org_id}

Delete an organization.

**Request**:
```http
DELETE /api/organizations/507f1f77bcf86cd799439011
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
{
  "message": "Organization deleted successfully"
}
```

---

## 🎓 Schools

### POST /organizations/{org_id}/schools

Create a new school within an organization.

**Request**:
```http
POST /api/organizations/507f1f77bcf86cd799439011/schools
Cookie: access_token=<jwt_token>
Content-Type: application/json

{
  "name": "Timeshare Sales Academy",
  "description": "Premium training for vacation club sales professionals",
  "logo_url": "https://example.com/school-logo.png",
  "settings": {
    "primary_color": "#D4AF37",
    "secondary_color": "#1E3A8A",
    "accent_color": "#10B981"
  }
}
```

**Request Body Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | School name |
| description | string | No | School description |
| logo_url | string | No | School logo URL |
| settings | object | No | Branding settings (colors, etc.) |

**Response** (201):
```json
{
  "school_id": "507f1f77bcf86cd799439013",
  "organization_id": "507f1f77bcf86cd799439011",
  "name": "Timeshare Sales Academy",
  "description": "Premium training for vacation club sales professionals",
  "logo_url": "https://example.com/school-logo.png",
  "settings": {
    "primary_color": "#D4AF37",
    "secondary_color": "#1E3A8A",
    "accent_color": "#10B981"
  },
  "student_count": 0,
  "course_count": 0,
  "created_at": "2026-03-20T10:30:00Z"
}
```

---

### GET /organizations/{org_id}/schools

Get all schools for an organization.

**Request**:
```http
GET /api/organizations/507f1f77bcf86cd799439011/schools
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
[
  {
    "school_id": "507f1f77bcf86cd799439013",
    "name": "Timeshare Sales Academy",
    "description": "Premium training for vacation club sales professionals",
    "logo_url": "https://example.com/school-logo.png",
    "student_count": 45,
    "course_count": 12,
    "created_at": "2026-03-20T10:30:00Z"
  }
]
```

---

### GET /schools/{school_id}

Get school details.

**Request**:
```http
GET /api/schools/507f1f77bcf86cd799439013
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
{
  "school_id": "507f1f77bcf86cd799439013",
  "organization_id": "507f1f77bcf86cd799439011",
  "name": "Timeshare Sales Academy",
  "description": "Premium training for vacation club sales professionals",
  "logo_url": "https://example.com/school-logo.png",
  "settings": {
    "primary_color": "#D4AF37",
    "secondary_color": "#1E3A8A",
    "accent_color": "#10B981",
    "features": {
      "ai_assistant": true,
      "community": true,
      "certificates": true
    },
    "limits": {
      "max_students": 100,
      "max_courses": 50
    }
  },
  "student_count": 45,
  "course_count": 12,
  "created_at": "2026-03-20T10:30:00Z"
}
```

---

### PUT /schools/{school_id}

Update school settings.

**Request**:
```http
PUT /api/schools/507f1f77bcf86cd799439013
Cookie: access_token=<jwt_token>
Content-Type: application/json

{
  "name": "Vacation Club Sales Academy",
  "description": "Updated description",
  "settings": {
    "primary_color": "#FF5733",
    "features": {
      "ai_assistant": true,
      "community": false,
      "certificates": true
    }
  }
}
```

**Response** (200):
```json
{
  "message": "School updated successfully",
  "school": {
    "school_id": "507f1f77bcf86cd799439013",
    "name": "Vacation Club Sales Academy",
    "description": "Updated description",
    "settings": {
      "primary_color": "#FF5733",
      "features": {
        "ai_assistant": true,
        "community": false,
        "certificates": true
      }
    }
  }
}
```

---

### DELETE /schools/{school_id}

Delete a school.

**Request**:
```http
DELETE /api/schools/507f1f77bcf86cd799439013
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
{
  "message": "School deleted successfully"
}
```

---

## 👥 Team Management

### POST /organizations/{org_id}/members

Add a member to an organization.

**Request**:
```http
POST /api/organizations/507f1f77bcf86cd799439011/members
Cookie: access_token=<jwt_token>
Content-Type: application/json

{
  "email": "newmember@example.com",
  "role": "member"
}
```

**Request Body Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | Member email address |
| role | string | Yes | Member role (admin, member) |

**Response** (201):
```json
{
  "message": "Member added successfully",
  "membership": {
    "organization_id": "507f1f77bcf86cd799439011",
    "user_id": "507f1f77bcf86cd799439014",
    "email": "newmember@example.com",
    "role": "member",
    "joined_at": "2026-03-20T10:30:00Z"
  }
}
```

---

### GET /organizations/{org_id}/members

Get all members of an organization.

**Request**:
```http
GET /api/organizations/507f1f77bcf86cd799439011/members
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
[
  {
    "user_id": "507f1f77bcf86cd799439012",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "joined_at": "2026-03-01T10:30:00Z"
  },
  {
    "user_id": "507f1f77bcf86cd799439014",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "member",
    "joined_at": "2026-03-20T10:30:00Z"
  }
]
```

---

### DELETE /organizations/{org_id}/members/{user_id}

Remove a member from an organization.

**Request**:
```http
DELETE /api/organizations/507f1f77bcf86cd799439011/members/507f1f77bcf86cd799439014
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
{
  "message": "Member removed successfully"
}
```

---

## 🤖 AI Assistant Configuration

### PUT /schools/{school_id}/ai-assistant

Configure AI assistant for a school.

**Request**:
```http
PUT /api/schools/507f1f77bcf86cd799439013/ai-assistant
Cookie: access_token=<jwt_token>
Content-Type: application/json

{
  "enabled": true,
  "name": "Sales Coach AI",
  "personality": "friendly and professional",
  "knowledge_base": ["sales_techniques", "objection_handling"],
  "custom_instructions": "Focus on consultative selling approaches"
}
```

**Request Body Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| enabled | boolean | Yes | Enable/disable AI assistant |
| name | string | No | AI assistant name |
| personality | string | No | AI personality description |
| knowledge_base | array | No | Topics AI should know about |
| custom_instructions | string | No | Custom behavior instructions |

**Response** (200):
```json
{
  "message": "AI assistant configured successfully",
  "ai_assistant": {
    "enabled": true,
    "name": "Sales Coach AI",
    "personality": "friendly and professional",
    "knowledge_base": ["sales_techniques", "objection_handling"],
    "custom_instructions": "Focus on consultative selling approaches"
  }
}
```

---

### GET /schools/{school_id}/ai-assistant

Get AI assistant configuration.

**Request**:
```http
GET /api/schools/507f1f77bcf86cd799439013/ai-assistant
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
{
  "enabled": true,
  "name": "Sales Coach AI",
  "personality": "friendly and professional",
  "knowledge_base": ["sales_techniques", "objection_handling"],
  "custom_instructions": "Focus on consultative selling approaches",
  "usage_stats": {
    "total_interactions": 234,
    "avg_rating": 4.5
  }
}
```

---

## 📊 Analytics

### GET /schools/{school_id}/analytics

Get school analytics and metrics.

**Request**:
```http
GET /api/schools/507f1f77bcf86cd799439013/analytics
Cookie: access_token=<jwt_token>
```

**Query Parameters**:
- `start_date` (optional): Start date for analytics (ISO 8601)
- `end_date` (optional): End date for analytics (ISO 8601)

**Response** (200):
```json
{
  "period": {
    "start_date": "2026-03-01T00:00:00Z",
    "end_date": "2026-03-20T23:59:59Z"
  },
  "students": {
    "total": 45,
    "active": 32,
    "new": 8
  },
  "engagement": {
    "total_completions": 128,
    "avg_completion_rate": 0.68,
    "total_time_spent": 34560
  },
  "courses": {
    "total": 12,
    "published": 10
  }
}
```

---

## 🧪 Testing Examples

### Create Organization
```bash
curl -X POST http://localhost:8000/api/organizations \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Acme Sales Training",
    "slug": "acme-sales"
  }'
```

### Create School
```bash
curl -X POST http://localhost:8000/api/organizations/507f1f77bcf86cd799439011/schools \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Timeshare Sales Academy",
    "description": "Premium training for vacation club sales professionals"
  }'
```

### Get School Details
```bash
curl -X GET http://localhost:8000/api/schools/507f1f77bcf86cd799439013 \
  -b cookies.txt
```

---

## 📚 Related Documentation

- [Authentication API](Auth.md)
- [Development System API](Development.md)
- [Community API](Community.md)
- [Organization Frontend Guide](../development/Frontend.md#organizations)
