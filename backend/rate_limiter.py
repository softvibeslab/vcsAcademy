"""
════════════════════════════════════════════════════════════════
VCSA Rate Limiter Middleware
════════════════════════════════════════════════════════════════

Redis-backed distributed rate limiting with in-memory fallback.

Author: VCSA DevOps Team
Created: April 2026
Status: Production Ready
════════════════════════════════════════════════════════════════
"""

from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from typing import Optional, Dict, Tuple, Callable
from functools import wraps
from datetime import datetime, timedelta
import time
import asyncio
import logging
from collections import defaultdict
import os

logger = logging.getLogger(__name__)

# Try to import Redis (optional - fallback to in-memory)
try:
    import redis
    from redis.asyncio import Redis as AsyncRedis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
    logger.warning("Redis not installed - using in-memory rate limiting")


# ═══════════════════════════════════════════════════════════════
# RATE LIMIT CONFIGURATION
# ═══════════════════════════════════════════════════════════════

RATE_LIMITS = {
    # Category: (requests per period, period in seconds)
    "auth": (10, 60),           # 10 requests per minute
    "community": (10, 60),      # 10 requests per minute
    "development": (30, 60),    # 30 requests per minute
    "admin": (20, 60),          # 20 requests per minute
    "payments": (5, 60),        # 5 requests per minute
    "health": (60, 60),         # 60 requests per minute
    "default": (20, 60),        # 20 requests per minute
}

# Endpoint categorization
ENDPOINT_CATEGORIES = {
    # Authentication endpoints
    "/api/auth/login": "auth",
    "/api/auth/register": "auth",
    "/api/auth/logout": "auth",
    "/api/auth/forgot-password": "auth",
    "/api/auth/reset-password": "auth",

    # Community endpoints
    "/api/community": "community",
    "/api/community/posts": "community",
    "/api/comments": "community",

    # Development/Training endpoints
    "/api/development": "development",
    "/api/development/stages": "development",
    "/api/development/tracks": "development",
    "/api/development/modules": "development",
    "/api/development/progress": "development",

    # Admin endpoints
    "/api/admin": "admin",
    "/api/admin/users": "admin",
    "/api/admin/stats": "admin",

    # Payment endpoints
    "/api/payments": "payments",
    "/api/payments/webhook": "payments",
    "/api/payments/checkout": "payments",

    # Health endpoints
    "/api/health": "health",
    "/health": "health",
}


# ═══════════════════════════════════════════════════════════════
# IN-MEMORY FALLBACK RATE LIMITER
# ═══════════════════════════════════════════════════════════════

class InMemoryRateLimiter:
    """In-memory rate limiter for when Redis is unavailable"""

    def __init__(self):
        self.requests: Dict[str, list] = defaultdict(list)
        self.cleanup_interval = 300  # 5 minutes
        self.last_cleanup = time.time()

    def _cleanup_old_entries(self):
        """Remove old entries to prevent memory leaks"""
        now = time.time()
        if now - self.last_cleanup > self.cleanup_interval:
            cutoff = now - 3600  # Remove entries older than 1 hour
            for key in list(self.requests.keys()):
                self.requests[key] = [
                    ts for ts in self.requests[key] if ts > cutoff
                ]
                if not self.requests[key]:
                    del self.requests[key]
            self.last_cleanup = now

    def is_allowed(self, key: str, limit: int, period: int) -> Tuple[bool, dict]:
        """
        Check if request is allowed under rate limit

        Args:
            key: Unique identifier for rate limit bucket
            limit: Max requests allowed
            period: Time period in seconds

        Returns:
            (is_allowed, info_dict)
        """
        self._cleanup_old_entries()

        now = time.time()
        window_start = now - period

        # Get existing requests for this key
        request_times = self.requests[key]

        # Filter out old requests outside the time window
        recent_requests = [ts for ts in request_times if ts > window_start]

        # Check if limit exceeded
        if len(recent_requests) >= limit:
            # Calculate retry time
            oldest_request = min(recent_requests)
            retry_after = int(oldest_request + period - now) + 1

            return False, {
                "limit": limit,
                "remaining": 0,
                "reset": int(oldest_request + period),
                "retry_after": retry_after,
            }

        # Add current request
        recent_requests.append(now)
        self.requests[key] = recent_requests

        return True, {
            "limit": limit,
            "remaining": limit - len(recent_requests),
            "reset": int(now + period),
            "retry_after": 0,
        }


# ═══════════════════════════════════════════════════════════════
# REDIS-BACKED RATE LIMITER
# ═══════════════════════════════════════════════════════════════

class RedisRateLimiter:
    """Redis-backed distributed rate limiter"""

    def __init__(self, redis_url: Optional[str] = None):
        self.redis_url = redis_url or os.environ.get("REDIS_URL", "redis://localhost:6379")
        self.redis_client: Optional[AsyncRedis] = None
        self.enabled = False

    async def initialize(self):
        """Initialize Redis connection"""
        if not REDIS_AVAILABLE:
            logger.warning("Redis not available - using in-memory fallback")
            return

        try:
            self.redis_client = AsyncRedis.from_url(
                self.redis_url,
                encoding="utf-8",
                decode_responses=True,
            )
            # Test connection
            await self.redis_client.ping()
            self.enabled = True
            logger.info(f"Redis rate limiter connected: {self.redis_url}")
        except Exception as e:
            logger.error(f"Redis connection failed: {e} - using in-memory fallback")
            self.enabled = False

    async def close(self):
        """Close Redis connection"""
        if self.redis_client:
            await self.redis_client.close()
            self.enabled = False

    def _get_key(self, identifier: str) -> str:
        """Generate Redis key for rate limit"""
        return f"rate_limit:{identifier}"

    async def is_allowed(
        self,
        identifier: str,
        limit: int,
        period: int
    ) -> Tuple[bool, dict]:
        """
        Check if request is allowed using Redis

        Args:
            identifier: Unique identifier (e.g., "ip:endpoint")
            limit: Max requests allowed
            period: Time period in seconds

        Returns:
            (is_allowed, info_dict)
        """
        if not self.enabled:
            # Fallback to in-memory if Redis unavailable
            return InMemoryRateLimiter().is_allowed(identifier, limit, period)

        try:
            key = self._get_key(identifier)
            now = time.time()

            # Use Redis pipeline for atomic operations
            pipe = self.redis_client.pipeline()

            # Remove old entries
            pipe.zremrangebyscore(key, 0, now - period)

            # Count current requests
            pipe.zcard(key)

            # Add current request
            pipe.zadd(key, {str(now): now})

            # Set expiry
            pipe.expire(key, period)

            results = await pipe.execute()

            current_count = results[1]

            if current_count >= limit:
                # Get oldest request timestamp
                oldest = await self.redis_client.zrange(key, 0, 0, withscores=True)
                if oldest:
                    retry_after = int(oldest[0][1] + period - now) + 1
                else:
                    retry_after = period

                return False, {
                    "limit": limit,
                    "remaining": 0,
                    "reset": int(now + period),
                    "retry_after": retry_after,
                }

            return True, {
                "limit": limit,
                "remaining": limit - current_count - 1,
                "reset": int(now + period),
                "retry_after": 0,
            }

        except Exception as e:
            logger.error(f"Redis rate limit check failed: {e}")
            # Fallback to in-memory
            return InMemoryRateLimiter().is_allowed(identifier, limit, period)


# ═══════════════════════════════════════════════════════════════
# RATE LIMITER MIDDLEWARE
# ═══════════════════════════════════════════════════════════════

class RateLimiterMiddleware(BaseHTTPMiddleware):
    """FastAPI middleware for rate limiting"""

    def __init__(self, app, redis_url: Optional[str] = None):
        super().__init__(app)
        self.redis_limiter = RedisRateLimiter(redis_url)
        self.memory_limiter = InMemoryRateLimiter()
        self._initialized = False

    async def startup(self):
        """Initialize Redis connection on startup"""
        try:
            await self.redis_limiter.initialize()
            self._initialized = True
        except Exception as e:
            logger.error(f"Rate limiter initialization failed: {e}")
            self._initialized = True

    async def shutdown(self):
        """Cleanup on shutdown"""
        await self.redis_limiter.close()

    def _get_category(self, path: str) -> str:
        """Determine rate limit category from path"""
        # Exact match
        if path in ENDPOINT_CATEGORIES:
            return ENDPOINT_CATEGORIES[path]

        # Prefix match
        for pattern, category in ENDPOINT_CATEGORIES.items():
            if path.startswith(pattern):
                return category

        return "default"

    def _get_client_identifier(self, request: Request) -> str:
        """Get unique identifier for client"""
        # Try to get user ID from session (if authenticated)
        # Otherwise fall back to IP address

        # For now, use IP address
        client_ip = request.client.host if request.client else "unknown"

        # Add X-Forwarded-For support for proxies
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            client_ip = forwarded_for.split(",")[0].strip()

        return f"{client_ip}:{request.url.path}"

    async def dispatch(self, request: Request, call_next):
        """Process request through rate limiter"""
        # Skip rate limiting for health checks (high frequency allowed)
        if request.url.path in ["/health", "/api/health", "/docs", "/redoc"]:
            return await call_next(request)

        # Get rate limit category
        category = self._get_category(request.url.path)
        limit, period = RATE_LIMITS.get(category, RATE_LIMITS["default"])

        # Get client identifier
        identifier = self._get_client_identifier(request)

        # Check rate limit
        if self.redis_limiter.enabled:
            is_allowed, info = await self.redis_limiter.is_allowed(
                identifier, limit, period
            )
        else:
            is_allowed, info = self.memory_limiter.is_allowed(
                identifier, limit, period
            )

        # Add rate limit headers
        headers = {
            "X-RateLimit-Limit": str(info["limit"]),
            "X-RateLimit-Remaining": str(info["remaining"]),
            "X-RateLimit-Reset": str(info["reset"]),
        }

        if not is_allowed:
            logger.warning(
                f"Rate limit exceeded for {identifier} "
                f"(category: {category}, limit: {limit}/{period}s)"
            )
            headers["Retry-After"] = str(info["retry_after"])
            return JSONResponse(
                status_code=429,
                content={
                    "detail": {
                        "message": "Rate limit exceeded. Please retry later.",
                        "retry_after": info["retry_after"],
                        "limit": info["limit"],
                        "period": period,
                    }
                },
                headers=headers,
            )

        # Process request
        response = await call_next(request)

        # Add rate limit headers to response
        for key, value in headers.items():
            response.headers[key] = value

        return response


# ═══════════════════════════════════════════════════════════════
# DECORATOR-BASED RATE LIMITING
# ═══════════════════════════════════════════════════════════════

def rate_limit(limit: int, period: int, key_func: Optional[Callable] = None):
    """
    Decorator for rate limiting specific endpoints

    Args:
        limit: Max requests allowed
        period: Time period in seconds
        key_func: Optional function to generate rate limit key

    Example:
        @rate_limit(5, 60)  # 5 requests per minute
        async def my_endpoint(request: Request):
            return {"message": "Hello"}
    """

    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Get request from kwargs
            request = kwargs.get("request")
            if not request:
                # Try to get from args
                for arg in args:
                    if isinstance(arg, Request):
                        request = arg
                        break

            if not request:
                # No request object, skip rate limiting
                return await func(*args, **kwargs)

            # Generate rate limit key
            if key_func:
                key = key_func(request)
            else:
                client_ip = request.client.host if request.client else "unknown"
                key = f"{client_ip}:{request.url.path}"

            # Check rate limit (use in-memory for decorator-based)
            limiter = InMemoryRateLimiter()
            is_allowed, info = limiter.is_allowed(key, limit, period)

            if not is_allowed:
                raise HTTPException(
                    status_code=429,
                    detail={
                        "message": "Rate limit exceeded",
                        "retry_after": info["retry_after"],
                    },
                )

            return await func(*args, **kwargs)

        return wrapper

    return decorator


# ═══════════════════════════════════════════════════════════════
# UTILITY FUNCTIONS
# ═══════════════════════════════════════════════════════════════

async def check_rate_limit(
    identifier: str,
    limit: int,
    period: int,
    redis_url: Optional[str] = None,
) -> Tuple[bool, dict]:
    """
    Standalone function to check rate limit

    Args:
        identifier: Unique identifier for rate limit bucket
        limit: Max requests allowed
        period: Time period in seconds
        redis_url: Optional Redis URL (uses in-memory if not provided)

    Returns:
        (is_allowed, info_dict)
    """
    if redis_url and REDIS_AVAILABLE:
        limiter = RedisRateLimiter(redis_url)
        await limiter.initialize()
        try:
            return await limiter.is_allowed(identifier, limit, period)
        finally:
            await limiter.close()
    else:
        limiter = InMemoryRateLimiter()
        return limiter.is_allowed(identifier, limit, period)


def get_rate_limits() -> dict:
    """Get current rate limit configuration"""
    return RATE_LIMITS.copy()


def set_rate_limit(category: str, limit: int, period: int):
    """
    Override rate limit for a category

    Args:
        category: Category name
        limit: Max requests
        period: Time period in seconds
    """
    RATE_LIMITS[category] = (limit, period)
    logger.info(f"Rate limit updated: {category} = {limit}/{period}s")


# ═══════════════════════════════════════════════════════════════
# EXPORTS
# ═══════════════════════════════════════════════════════════════

__all__ = [
    "RateLimiterMiddleware",
    "rate_limit",
    "check_rate_limit",
    "get_rate_limits",
    "set_rate_limit",
    "InMemoryRateLimiter",
    "RedisRateLimiter",
]
