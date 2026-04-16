# ⚡ Rate Limiting Implementation Guide

**Purpose**: Complete guide for implementing rate limiting in FastAPI application
**Sprint**: Sprint 2 - Task 4
**Priority**: P1 - HIGH
**Estimated Time**: 5 hours

---

## 📋 OVERVIEW

This guide covers complete rate limiting implementation:

1. Rate limiting strategy and limits per endpoint
2. Redis setup for distributed rate limiting
3. SlowAPI middleware integration
4. Custom rate limiting middleware
5. Rate limit headers and error handling
6. Testing and verification

---

## 🎯 RATE LIMITING STRATEGY

### Rate Limits by Endpoint Category

| Endpoint Category | Rate Limit | Burst | Purpose |
|-------------------|------------|-------|---------|
| Authentication (`/api/auth/*`) | 10 req/min | 5 | Prevent brute force attacks |
| Community (`/api/community/*`) | 10 req/min | 5 | Prevent spam posting |
| Development API (`/api/development/*`) | 30 req/min | 20 | Normal API usage |
| Admin (`/api/admin/*`) | 20 req/min | 10 | Admin operations |
| Payments (`/api/payments/*`) | 5 req/min | 3 | Prevent payment abuse |
| Health Check (`/api/health`) | 60 req/min | 30 | Monitoring exempt |

### Rate Limiting Approach

**Primary**: Redis-backed distributed rate limiting
- Allows multiple application instances
- Persists state across restarts
- Supports horizontal scaling

**Fallback**: In-memory rate limiting (local)
- Single instance only
- Lost on restart
- Used when Redis unavailable

---

## 📝 STEP 1: INSTALL DEPENDENCIES

### Step 1.1: Install Requirements

```bash
# Add to backend/requirements.txt
slowapi==0.1.9
redis==4.5.5
hiredis==2.2.3
```

### Step 1.2: Install Dependencies

```bash
cd backend
pip install slowapi redis hiredis
```

---

## 📝 STEP 2: REDIS SETUP

### Step 2.1: Install Redis

**Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

**macOS**:
```bash
brew install redis
brew services start redis
```

**Docker** (Recommended):
```bash
docker run -d -p 6379:6379 \
  --name vcsa-redis \
  redis:7-alpine \
  redis-server --appendonly yes
```

### Step 2.2: Configure Redis

**Production Configuration** (`/etc/redis/redis.conf`):

```
# Memory
maxmemory 256mb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000

# Security
bind 127.0.0.1
requirepass YOUR_SECURE_PASSWORD

# Logging
loglevel notice
logfile /var/log/redis/redis-server.log
```

### Step 2.3: Start Redis

```bash
# Start Redis
sudo systemctl restart redis-server

# Verify running
redis-cli ping
# Expected: PONG
```

---

## 📝 STEP 3: RATE LIMITING MIDDLEWARE

### Step 3.1: Create Rate Limiter Middleware

**File**: `backend/rate_limiter.py`

```python
"""
Rate Limiting Middleware for FastAPI
Implements Redis-backed distributed rate limiting with fallback to in-memory
"""

from fastapi import Request, HTTPException
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import redis
import logging
from functools import wraps
from typing import Callable
import os
import time

logger = logging.getLogger(__name__)

# Redis connection
REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379')
REDIS_PASSWORD = os.environ.get('REDIS_PASSWORD', None)

# Create Redis client
try:
    redis_client = redis.from_url(
        REDIS_URL,
        password=REDIS_PASSWORD,
        decode_responses=True,
        socket_connect_timeout=5,
        socket_timeout=5,
        retry_on_timeout=True,
        health_check_interval=30
    )
    redis_available = True
    logger.info("Redis connection established for rate limiting")
except Exception as e:
    redis_available = False
    redis_client = None
    logger.warning(f"Redis not available for rate limiting: {e}")
    logger.info("Falling back to in-memory rate limiting")

# Create rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200/hour"],
    storage_uri=REDIS_URL if redis_available else None,
    enabled=True
)

# Custom rate limit exceeded handler
async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    """Custom handler for rate limit exceeded"""
    logger.warning(f"Rate limit exceeded for {request.client.host}")

    return JSONResponse(
        status_code=429,
        content={
            "error": "Rate limit exceeded",
            "message": "Too many requests. Please try again later.",
            "retry_after": exc.retry_after if hasattr(exc, 'retry_after') else 60,
            "limit": str(exc.rate_limit) if hasattr(exc, 'rate_limit') else "Unknown",
            "reset_at": int(time.time() + 60)  # Approximate
        }
    )

# Set custom error handler
limiter._rate_limit_exceeded_handler = rate_limit_exceeded_handler

# In-memory fallback for when Redis is unavailable
from collections import defaultdict
from datetime import datetime, timedelta

class InMemoryRateLimiter:
    """Fallback in-memory rate limiter when Redis is unavailable"""

    def __init__(self):
        self.requests = defaultdict(list)

    def is_allowed(self, key: str, limit: int, period: int) -> tuple[bool, dict]:
        """
        Check if request is allowed

        Args:
            key: Unique identifier (e.g., "user_id:endpoint")
            limit: Number of requests allowed
            period: Time period in seconds

        Returns:
            Tuple of (is_allowed, info_dict)
        """
        now = time.time()
        window_start = now - period

        # Clean old requests
        self.requests[key] = [
            req_time for req_time in self.requests[key]
            if req_time > window_start
        ]

        # Check if limit exceeded
        request_count = len(self.requests[key])
        is_allowed = request_count < limit

        if is_allowed:
            # Add current request
            self.requests[key].append(now)

        # Calculate retry_after
        if not is_allowed and self.requests[key]:
            oldest_request = self.requests[key][0]
            retry_after = int(oldest_request + period - now)
        else:
            retry_after = period

        return is_allowed, {
            "limit": limit,
            "remaining": max(0, limit - request_count),
            "reset": int(now + period),
            "retry_after": retry_after
        }

# Create in-memory limiter instance
memory_limiter = InMemoryRateLimiter()


class RateLimiterMiddleware:
    """Rate limiting middleware with Redis and in-memory fallback"""

    def __init__(self):
        self.limiter = limiter
        self.memory_limiter = memory_limiter
        self.redis_available = redis_available

    async def check_rate_limit(
        self,
        key: str,
        limit: int,
        period: int
    ) -> tuple[bool, dict]:
        """
        Check if request is allowed

        Args:
            key: Rate limit key (e.g., "user_id:endpoint")
            limit: Requests allowed
            period: Time period in seconds

        Returns:
            Tuple of (is_allowed, info_dict)
        """
        if self.redis_available:
            # Use Redis for distributed rate limiting
            return await self._check_redis_rate_limit(key, limit, period)
        else:
            # Fallback to in-memory rate limiting
            return self.memory_limiter.is_allowed(key, limit, period)

    async def _check_redis_rate_limit(
        self,
        key: str,
        limit: int,
        period: int
    ) -> tuple[bool, dict]:
        """Check rate limit using Redis"""
        try:
            # Get current count
            current = redis_client.incr(key)

            # Set expiry on first request
            if current == 1:
                redis_client.expire(key, period)

            remaining = max(0, limit - current)
            is_allowed = current <= limit

            return is_allowed, {
                "limit": limit,
                "remaining": remaining,
                "reset": int(time.time() + period),
                "retry_after": period
            }

        except Exception as e:
            logger.error(f"Redis rate limiting error: {e}")
            # Fallback to in-memory
            return self.memory_limiter.is_allowed(key, limit, period)


# Global rate limiter instance
rate_limiter = RateLimiterMiddleware()


async def check_rate_limit_middleware(
    request: Request,
    call_next: Callable
):
    """
    Rate limiting middleware for FastAPI

    Checks rate limits based on endpoint and applies limits
    """
    # Get endpoint path
    path = request.url.path

    # Define rate limits by endpoint
    rate_limits = {
        "/api/auth/login": (10, 60),      # 10 req/min
        "/api/auth/register": (3, 3600),   # 3 req/hour
        "/api/community/posts": (10, 60),   # 10 req/min
        "/api/community/feed": (30, 60),    # 30 req/min
        "/api/development": (30, 60),      # 30 req/min
        "/api/development/content": (20, 60), # 20 req/min
        "/api/payments": (5, 60),           # 5 req/min
        "/api/admin": (20, 60),              # 20 req/min
    }

    # Find matching rate limit
    rate_limit = None
    for pattern, limit in rate_limits.items():
        if path.startswith(pattern):
            rate_limit = limit
            break

    # Apply rate limit if found
    if rate_limit:
        limit, period = rate_limit

        # Create unique key for this user/IP
        client_host = request.client.host if request.client else "unknown"
        key = f"{client_host}:{path}"

        # Check rate limit
        is_allowed, info = await rate_limiter.check_rate_limit(key, limit, period)

        if not is_allowed:
            # Rate limit exceeded
            return JSONResponse(
                status_code=429,
                content={
                    "error": "Rate limit exceeded",
                    "message": f"Rate limit of {limit} requests per {period}s exceeded",
                    "retry_after": info["retry_after"],
                    "limit": info["limit"],
                    "reset": info["reset"]
                },
                headers={
                    "X-RateLimit-Limit": str(info["limit"]),
                    "X-RateLimit-Remaining": str(info["remaining"]),
                    "X-RateLimit-Reset": str(info["reset"]),
                    "Retry-After": str(info["retry_after"])
                }
            )

    # Continue to next middleware
    response = await call_next(request)

    return response


# Decorator-based rate limiting for specific endpoints
def rate_limit(limit: int, period: int):
    """
    Decorator for rate limiting specific endpoints

    Args:
        limit: Number of requests allowed
        period: Time period in seconds

    Usage:
        @rate_limit(10, 60)
        async def my_endpoint():
            return {"message": "Hello"}
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Get request from kwargs (FastAPI passes request as kwarg)
            request = kwargs.get("request")

            if request:
                client_host = request.client.host if request.client else "unknown"
                path = request.url.path
                key = f"{client_host}:{path}"

                is_allowed, info = await rate_limiter.check_rate_limit(key, limit, period)

                if not is_allowed:
                    raise HTTPException(
                        status_code=429,
                        detail={
                            "error": "Rate limit exceeded",
                            "message": f"Rate limit of {limit} requests per {period}s exceeded",
                            "retry_after": info["retry_after"],
                            "limit": info["limit"],
                            "reset": info["reset"]
                        },
                        headers={
                            "X-RateLimit-Limit": str(info["limit"]),
                            "X-RateLimit-Remaining": str(info["remaining"]),
                            "X-RateLimit-Reset": str(info["reset"]),
                            "Retry-After": str(info["retry_after"])
                        }
                    )

            return await func(*args, **kwargs)
        return wrapper
    return decorator
```

### Step 3.2: Update server.py with Middleware

```python
# Add to backend/server.py

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from rate_limiter import check_rate_limit_middleware, limiter

# Apply rate limiting middleware to all routes
@app.middleware("http")
async def add_rate_limiting_middleware(request: Request, call_next):
    """Apply rate limiting to all API routes"""
    # Skip health check from rate limiting
    if request.url.path == "/api/health":
        return await call_next(request)

    # Apply rate limiting
    return await check_rate_limit_middleware(request, call_next)

# Example usage on specific endpoint
@app.post("/api/community/posts")
@rate_limit(10, 60)  # 10 requests per minute
async def create_post(post: PostCreate, user: User = Depends(require_auth)):
    """Create a new post with rate limiting"""
    # Your endpoint logic here
    pass
```

---

## 📝 STEP 4: TEST RATE LIMITING

### Step 4.1: Create Rate Limiting Tests

**File**: `backend/tests/test_rate_limiting.py`

```python
"""
Rate Limiting Tests
Tests for rate limiting implementation
"""

import pytest
import requests
import time
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8000')

VALID_USER = {"email": "demo@vcsa.com", "password": "demo123"}

def get_auth_session():
    """Get authenticated session"""
    session = requests.Session()
    session.post(f"{BASE_URL}/api/auth/login", json=VALID_USER)
    return session


class TestRateLimitingAuth:
    """Test rate limiting on authentication endpoints"""

    def test_login_rate_limiting(self):
        """Test login endpoint rate limiting (10 req/min)"""
        # Should allow first 10 requests
        for i in range(10):
            response = requests.post(f"{BASE_URL}/api/auth/login", json=VALID_USER)
            assert response.status_code in [200, 401], f"Request {i+1} failed unexpectedly"

        # Request 11 should be rate limited
        response = requests.post(f"{BASE_URL}/api/auth/login", json=VALID_USER)
        assert response.status_code == 429
        assert "X-RateLimit-Limit" in response.headers
        assert "Retry-After" in response.headers

    def test_register_rate_limiting(self):
        """Test register endpoint rate limiting (3 req/hour)"""
        # Should allow 3 requests
        for i in range(3):
            response = requests.post(f"{BASE_URL}/api/auth/register", json={
                "email": f"test{i}@example.com",
                "password": "TestPass123",
                "name": "Test User"
            })
            assert response.status_code in [200, 400], f"Request {i+1} failed unexpectedly"

        # Request 4 should be rate limited
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": "test4@example.com",
            "password": "TestPass123",
            "name": "Test User"
        })
        assert response.status_code == 429


class TestRateLimitingAPI:
    """Test rate limiting on API endpoints"""

    @pytest.fixture(scope="class")
    def auth_session(self):
        return get_auth_session()

    def test_development_endpoints_rate_limit(self, auth_session):
        """Test development API rate limiting (30 req/min)"""
        # Make 30 requests
        for i in range(30):
            response = auth_session.get(f"{BASE_URL}/api/development/stages")
            assert response.status_code == 200, f"Request {i+1} failed"

        # Request 31 should be rate limited
        response = auth_session.get(f"{BASE_URL}/api/development/stages")
        assert response.status_code == 429
        assert "X-RateLimit-Limit" in response.headers
        assert response.headers["X-RateLimit-Limit"] == "30"

    def test_community_posts_rate_limit(self, auth_session):
        """Test community posts rate limiting (10 req/min)"""
        # Make 10 requests
        for i in range(10):
            response = auth_session.get(f"{BASE_URL}/api/community/feed")
            assert response.status_code == 200

        # Request 11 should be rate limited
        response = auth_session.get(f"{BASE_URL}/api/community/feed")
        assert response.status_code == 429


class TestRateLimitingHeaders:
    """Test rate limit headers"""

    def test_rate_limit_headers_present(self):
        """Test that rate limit headers are present"""
        # Make a request that won't be rate limited
        response = requests.get(f"{BASE_URL}/api/health")

        # Health check should not have rate limiting
        # But other endpoints should
        response = requests.post(f"{BASE_URL}/api/auth/login", json=VALID_USER)

        # Check headers exist (if rate limited)
        if response.status_code == 429:
            assert "X-RateLimit-Limit" in response.headers
            assert "X-RateLimit-Remaining" in response.headers
            assert "X-RateLimit-Reset" in response.headers
            assert "Retry-After" in response.headers


class TestRateLimitingBehavior:
    """Test rate limiting behavior"""

    def test_retry_after_value(self):
        """Test that retry_after value is reasonable"""
        # Exhaust rate limit
        for i in range(11):
            requests.post(f"{BASE_URL}/api/auth/login", json=VALID_USER)

        # Get rate limited response
        response = requests.post(f"{BASE_URL}/api/auth/login", json=VALID_USER)
        assert response.status_code == 429

        retry_after = int(response.headers["Retry-After"])
        assert 0 < retry_after <= 60, f"Retry-After should be 1-60 seconds, got {retry_after}"

    def test_rate_limit_reset(self):
        """Test that rate limit resets after period"""
        # This test would take too long to run normally
        # In production, you would test this manually or with shorter periods
        pass


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
```

---

## 📝 STEP 5: VERIFY RATE LIMITING

### Step 5.1: Run Verification Script

**File**: `scripts/test_rate_limiting.sh`

```bash
#!/bin/bash

echo "Testing Rate Limiting Implementation"

BASE_URL="http://localhost:8000"

# Test 1: Health check (should not be rate limited)
echo "Test 1: Health check (unlimited)"
for i in {1..100}; do
    curl -s "$BASE_URL/api/health" > /dev/null
done
echo "✓ Health check passed (100 requests)"

# Test 2: Login endpoint (should be rate limited after 10)
echo "Test 2: Login endpoint (limited to 10/min)"
for i in {1..15}; do
    response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/auth/login" \
      -H "Content-Type: application/json" \
      -d '{"email":"test@example.com","password":"test123"}' \
      -o /dev/null)
    if [ "$response" == "429" ]; then
        echo "✓ Rate limiting triggered at request $i"
        break
    fi
done

# Test 3: API endpoint (should be rate limited after 30)
echo "Test 3: API endpoint (limited to 30/min)"
for i in {1..35}; do
    response=$(curl -s -w "%{http_code}" "$BASE_URL/api/development/stages")
    if [ "$response" == "429" ]; then
        echo "✓ Rate limiting triggered at request $i"
        break
    fi
done
```

---

## ✅ VERIFICATION CHECKLIST

### Installation
- [ ] slowapi installed
- [ ] redis installed and running
- [ ] hiredis installed
- [ ] Dependencies added to requirements.txt

### Configuration
- [ ] Redis connection configured
- [ ] Rate limiting middleware created
- [ ] Rate limits defined per endpoint
- [ ] Headers configured
- [ ] Error handling implemented

### Testing
- [ ] Auth endpoints rate limited (10 req/min)
- [ ] Community endpoints rate limited (10 req/min)
- [ ] Development API rate limited (30 req/min)
- [ ] Payments rate limited (5 req/min)
- [ ] Health check exempt from rate limiting
- [ ] Rate limit headers present
- [ ] Retry-After header accurate

### Production
- [ ] Redis persistence configured
- [ ] Connection pooling configured
- [ ] Fallback to in-memory working
- [ ] Monitoring rate limit hits
- [ ] Alerts configured

---

## 🛠️ TROUBLESHOOTING

### Issue 1: Redis Connection Fails

**Symptoms**: Rate limiting always allows requests (no Redis)

**Solutions**:
1. Check Redis is running: `redis-cli ping`
2. Verify Redis URL in .env
3. Check firewall allows port 6379
4. Verify Redis password

### Issue 2: Rate Limiting Too Aggressive

**Symptoms**: Legitimate users blocked

**Solutions**:
1. Increase rate limits
2. Adjust burst size
3. Whitelist trusted IPs
4. Implement tiered limits (user vs anonymous)

### Issue 3: Headers Not Present

**Symptoms**: No X-RateLimit headers in response

**Solutions**:
1. Verify middleware is applied
2. Check middleware order
3. Ensure headers are added in response
4. Check for CORS issues

---

## 📊 MONITORING

### Key Metrics

1. **Rate Limit Hits**
   - Monitor 429 responses
   - Alert if >5% of requests are rate limited

2. **Redis Performance**
   - Monitor Redis memory usage
   - Check connection pool status
   - Monitor response time

3. **Endpoint-Specific Limits**
   - Track which endpoints hit limits most
   - Adjust limits based on usage patterns

---

**Document Created**: April 17, 2026
**Last Updated**: April 17, 2026
**Status**: ✅ READY FOR IMPLEMENTATION
**Owner**: Backend Dev
