# API - Authentication

Complete authentication API documentation for VCSA.

## 🔗 Base URL

```
http://localhost:8000/api/auth
```

---

## 📋 Endpoints

### POST /register

Register a new user account.

**Request**:
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Request Body Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | User email address (must be unique) |
| password | string | Yes | User password (min 6 characters) |
| name | string | Yes | User display name |

**Response** (200):
```json
{
  "message": "User registered successfully",
  "user": {
    "user_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "level": 1,
    "points": 0,
    "membership": "free",
    "role": "member",
    "created_at": "2026-03-20T10:30:00Z"
  }
}
```

**Response** (400):
```json
{
  "detail": "Email already registered"
}
```

---

### POST /login

Authenticate user and create session.

**Request**:
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200):
```json
{
  "message": "Login successful",
  "user": {
    "user_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "level": 1,
    "points": 150,
    "membership": "free",
    "role": "member",
    "picture": "https://example.com/avatar.jpg"
  }
}
```

**Cookies Set**:
```
access_token=<jwt_token>; HttpOnly; Path=/; SameSite=lax
```

**Response** (401):
```json
{
  "detail": "Invalid email or password"
}
```

---

### POST /logout

Logout user and clear session.

**Request**:
```http
POST /api/auth/logout
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
{
  "message": "Logged out successfully"
}
```

**Cookies Cleared**:
```
access_token=; Max-Age=0; Path=/; SameSite=lax
```

---

### GET /me

Get current authenticated user information.

**Request**:
```http
GET /api/auth/me
Cookie: access_token=<jwt_token>
```

**Response** (200):
```json
{
  "user_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "John Doe",
  "level": 2,
  "points": 350,
  "membership": "vip",
  "role": "member",
  "picture": "https://example.com/avatar.jpg",
  "created_at": "2026-03-01T10:30:00Z"
}
```

**Response** (401):
```json
{
  "detail": "Not authenticated"
}
```

---

### POST /google

Authenticate with Google OAuth.

**Request**:
```http
POST /api/auth/google
Content-Type: application/json

{
  "token": "google_oauth_token"
}
```

**Request Body Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| token | string | Yes | Google OAuth access token |

**Response** (200):
```json
{
  "message": "Google authentication successful",
  "user": {
    "user_id": "507f1f77bcf86cd799439011",
    "email": "user@gmail.com",
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/...",
    "level": 1,
    "points": 0,
    "membership": "free",
    "role": "member",
    "created_at": "2026-03-20T10:30:00Z"
  },
  "is_new_user": false
}
```

**Response** (401):
```json
{
  "detail": "Invalid Google token"
}
```

---

### POST /demo

Login as demo user for testing.

**Request**:
```http
POST /api/auth/demo
```

**Response** (200):
```json
{
  "message": "Demo user login successful",
  "user": {
    "user_id": "507f1f77bcf86cd799439011",
    "email": "demo@vcsa.com",
    "name": "Demo User",
    "level": 2,
    "points": 350,
    "membership": "vip",
    "role": "member"
  }
}
```

---

## 🔐 Authentication Flow

### 1. Email/Password Flow

```
User → POST /api/auth/register
     ← Creates account, returns user data

User → POST /api/auth/login
     ← Validates credentials, sets httpOnly JWT cookie

User → GET /api/auth/me
     ← Returns current user (validates JWT from cookie)
```

### 2. Google OAuth Flow

```
User → Google Sign-In (frontend)
     ← Google OAuth token

User → POST /api/auth/google
     ← Validates token with Google, creates/updates user, sets cookie
```

### 3. Session Management

- **JWT Token**: Stored in httpOnly cookie (not accessible via JavaScript)
- **Token Expiration**: 7 days
- **Token Refresh**: Automatic re-issue on API calls
- **Logout**: Clears cookie via Set-Cookie with Max-Age=0

---

## 🔒 Security Features

### Password Security
- Passwords hashed with bcrypt
- Minimum 6 characters
- No plain text storage

### JWT Token Security
- HttpOnly cookies (prevents XSS attacks)
- SameSite=lax (prevents CSRF attacks)
- Signed with secret key
- Claims include user_id and expiration

### OAuth Security
- Token validation with Google API
- Token information caching
- Automatic account creation/update

---

## 📊 Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request (invalid input, email exists) |
| 401 | Unauthorized (invalid credentials, missing token) |
| 500 | Internal Server Error |

---

## 🧪 Testing Examples

### Register New User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -b cookies.txt
```

### Logout
```bash
curl -X POST http://localhost:8000/api/auth/logout \
  -b cookies.txt
```

---

## 📚 Related Documentation

- [Development System API](Development.md)
- [Community API](Community.md)
- [Frontend Auth Implementation](../development/Frontend.md#authentication)
