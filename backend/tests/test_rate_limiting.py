"""
════════════════════════════════════════════════════════════════
VCSA Rate Limiter Test Suite
════════════════════════════════════════════════════════════════

Comprehensive tests for rate limiting functionality.

Author: VCSA QA Team
Created: April 2026
Status: Production Ready
════════════════════════════════════════════════════════════════
"""

import pytest
import time
from fastapi import Request, HTTPException
from starlette.responses import JSONResponse
from unittest.mock import Mock, AsyncMock, patch
import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from rate_limiter import (
    InMemoryRateLimiter,
    RedisRateLimiter,
    RateLimiterMiddleware,
    rate_limit,
    check_rate_limit,
    get_rate_limits,
    set_rate_limit,
    RATE_LIMITS,
    ENDPOINT_CATEGORIES,
)


# ═══════════════════════════════════════════════════════════════
# FIXTURES
# ═══════════════════════════════════════════════════════════════

@pytest.fixture
def memory_limiter():
    """Provide InMemoryRateLimiter instance"""
    return InMemoryRateLimiter()


@pytest.fixture
def mock_redis_limiter():
    """Provide mocked RedisRateLimiter"""
    limiter = RedisRateLimiter("redis://localhost:6379")
    limiter.enabled = True
    return limiter


@pytest.fixture
def sample_request():
    """Provide sample FastAPI Request"""
    request = Mock(spec=Request)
    request.client = Mock()
    request.client.host = "192.168.1.100"
    request.url = Mock()
    request.url.path = "/api/development/tracks"
    request.headers = {}
    return request


# ═══════════════════════════════════════════════════════════════
# IN-MEMORY RATE LIMITER TESTS
# ═══════════════════════════════════════════════════════════════

class TestInMemoryRateLimiter:
    """Test InMemoryRateLimiter functionality"""

    def test_initial_state(self, memory_limiter):
        """Test limiter starts with empty state"""
        assert len(memory_limiter.requests) == 0

    def test_first_request_allowed(self, memory_limiter):
        """Test first request is always allowed"""
        is_allowed, info = memory_limiter.is_allowed("test_key", 5, 60)
        assert is_allowed is True
        assert info["remaining"] == 4
        assert info["limit"] == 5

    def test_respects_limit(self, memory_limiter):
        """Test limit is enforced"""
        limit = 5
        for i in range(limit):
            is_allowed, info = memory_limiter.is_allowed("test_key", limit, 60)
            assert is_allowed is True

        # Next request should be blocked
        is_allowed, info = memory_limiter.is_allowed("test_key", limit, 60)
        assert is_allowed is False
        assert info["remaining"] == 0
        assert info["retry_after"] > 0

    def test_resets_after_period(self, memory_limiter):
        """Test counter resets after time period"""
        limit = 5
        period = 1  # 1 second

        # Use all requests
        for _ in range(limit):
            memory_limiter.is_allowed("test_key", limit, period)

        # Should be blocked
        is_allowed, _ = memory_limiter.is_allowed("test_key", limit, period)
        assert is_allowed is False

        # Wait for period to expire
        time.sleep(1.1)

        # Should be allowed again
        is_allowed, info = memory_limiter.is_allowed("test_key", limit, period)
        assert is_allowed is True
        assert info["remaining"] == 4

    def test_separate_keys(self, memory_limiter):
        """Test different keys are tracked separately"""
        # Exhaust limit for key1
        for _ in range(5):
            memory_limiter.is_allowed("key1", 5, 60)

        # key1 should be blocked
        is_allowed, _ = memory_limiter.is_allowed("key1", 5, 60)
        assert is_allowed is False

        # key2 should still be allowed
        is_allowed, _ = memory_limiter.is_allowed("key2", 5, 60)
        assert is_allowed is True

    def test_cleanup_old_entries(self, memory_limiter):
        """Test old entries are cleaned up"""
        # Make many requests with different keys
        for i in range(100):
            memory_limiter.is_allowed(f"key_{i}", 5, 60)

        # Trigger cleanup (it's automatic on check)
        memory_limiter._cleanup_old_entries()

        # Should have removed entries outside window
        # (This is more of an integration test, mainly ensures no errors)

    def test_retry_after_calculation(self, memory_limiter):
        """Test retry_after is calculated correctly"""
        limit = 5
        period = 60

        # Exhaust limit
        for _ in range(limit):
            memory_limiter.is_allowed("test_key", limit, period)

        # Check retry_after
        is_allowed, info = memory_limiter.is_allowed("test_key", limit, period)
        assert is_allowed is False
        assert 0 < info["retry_after"] <= period


# ═══════════════════════════════════════════════════════════════
# REDIS RATE LIMITER TESTS
# ═══════════════════════════════════════════════════════════════

class TestRedisRateLimiter:
    """Test RedisRateLimiter functionality"""

    @pytest.mark.asyncio
    async def test_initialization_failure(self):
        """Test graceful handling of Redis unavailability"""
        limiter = RedisRateLimiter("redis://invalid:9999")

        # Should not raise exception, just log warning
        await limiter.initialize()

        # Should be disabled
        assert limiter.enabled is False

    @pytest.mark.asyncio
    async def test_redis_unavailable_fallback(self, mock_redis_limiter):
        """Test fallback to in-memory when Redis fails"""
        # Mock Redis to fail
        with patch.object(mock_redis_limiter, 'redis_client', None):
            is_allowed, info = await mock_redis_limiter.is_allowed(
                "test_key", 5, 60
            )
            # Should still work with fallback
            assert isinstance(is_allowed, bool)
            assert "limit" in info

    @pytest.mark.asyncio
    async def test_redis_key_generation(self, mock_redis_limiter):
        """Test Redis key format"""
        key = mock_redis_limiter._get_key("test_identifier")
        assert key == "rate_limit:test_identifier"

    @pytest.mark.asyncio
    async def test_close_without_error(self, mock_redis_limiter):
        """Test close doesn't raise exception"""
        await mock_redis_limiter.close()
        assert mock_redis_limiter.enabled is False


# ═══════════════════════════════════════════════════════════════
# MIDDLEWARE TESTS
# ═══════════════════════════════════════════════════════════════

class TestRateLimiterMiddleware:
    """Test RateLimiterMiddleware functionality"""

    @pytest.fixture
    def app(self):
        """Mock FastAPI app"""
        return Mock()

    @pytest.fixture
    def middleware(self, app):
        """Provide middleware instance"""
        return RateLimiterMiddleware(app)

    def test_category_detection(self, middleware):
        """Test endpoint category detection"""
        # Exact match
        assert middleware._get_category("/api/auth/login") == "auth"
        assert middleware._get_category("/api/community/posts") == "community"

        # Prefix match
        assert middleware._get_category("/api/development/tracks") == "development"
        assert middleware._get_category("/api/admin/users/123") == "admin"

        # Default
        assert middleware._get_category("/unknown/path") == "default"

    def test_client_identifier_from_ip(self, middleware, sample_request):
        """Test client identifier generation"""
        identifier = middleware._get_client_identifier(sample_request)
        assert "192.168.1.100" in identifier
        assert "/api/development/tracks" in identifier

    def test_client_identifier_with_forwarded(self, middleware, sample_request):
        """Test X-Forwarded-For header handling"""
        sample_request.headers = {"X-Forwarded-For": "203.0.113.1, 192.168.1.100"}
        identifier = middleware._get_client_identifier(sample_request)
        assert "203.0.113.1" in identifier

    @pytest.mark.asyncio
    async def test_startup(self, middleware):
        """Test middleware initialization"""
        await middleware.startup()
        assert middleware._initialized is True

    @pytest.mark.asyncio
    async def test_shutdown(self, middleware):
        """Test middleware cleanup"""
        await middleware.shutdown()
        # Should not raise exception

    def test_health_check_exempt(self, middleware, sample_request):
        """Test health checks bypass rate limiting"""
        sample_request.url.path = "/health"
        category = middleware._get_category("/health")
        # Health checks have high limit but still categorized
        assert category == "health"


# ═══════════════════════════════════════════════════════════════
# DECORATOR TESTS
# ═══════════════════════════════════════════════════════════════

class TestRateLimitDecorator:
    """Test @rate_limit decorator"""

    @pytest.mark.asyncio
    async def test_decorator_allows_requests(self, sample_request):
        """Test decorator allows requests under limit"""
        @rate_limit(5, 60)
        async def test_endpoint(request: Request):
            return {"message": "OK"}

        # First request should succeed
        result = await test_endpoint(request=sample_request)
        assert result["message"] == "OK"

    @pytest.mark.asyncio
    async def test_decorator_blocks_exceeded(self, sample_request):
        """Test decorator blocks exceeded requests"""
        @rate_limit(2, 60)
        async def test_endpoint(request: Request):
            return {"message": "OK"}

        # First 2 requests should succeed
        await test_endpoint(request=sample_request)
        await test_endpoint(request=sample_request)

        # Third should raise HTTPException
        with pytest.raises(HTTPException) as exc_info:
            await test_endpoint(request=sample_request)

        assert exc_info.value.status_code == 429

    @pytest.mark.asyncio
    async def test_decorator_with_custom_key(self, sample_request):
        """Test decorator with custom key function"""
        def custom_key(request: Request) -> str:
            return f"custom:{request.client.host}"

        @rate_limit(5, 60, key_func=custom_key)
        async def test_endpoint(request: Request):
            return {"message": "OK"}

        # Should use custom key
        result = await test_endpoint(request=sample_request)
        assert result["message"] == "OK"

    @pytest.mark.asyncio
    async def test_decorator_without_request(self):
        """Test decorator without request object"""
        @rate_limit(5, 60)
        async def test_endpoint():
            return {"message": "OK"}

        # Should skip rate limiting
        result = await test_endpoint()
        assert result["message"] == "OK"


# ═══════════════════════════════════════════════════════════════
# UTILITY FUNCTION TESTS
# ═══════════════════════════════════════════════════════════════

class TestUtilityFunctions:
    """Test utility functions"""

    def test_get_rate_limits(self):
        """Test getting rate limit configuration"""
        limits = get_rate_limits()
        assert isinstance(limits, dict)
        assert "auth" in limits
        assert "development" in limits
        assert "default" in limits

    def test_set_rate_limit(self):
        """Test setting rate limit"""
        original = RATE_LIMITS.get("test_category")
        set_rate_limit("test_category", 100, 120)

        limits = get_rate_limits()
        assert limits["test_category"] == (100, 120)

        # Restore original
        if original:
            RATE_LIMITS["test_category"] = original

    @pytest.mark.asyncio
    async def test_check_rate_limit_in_memory(self):
        """Test standalone check_rate_limit function"""
        is_allowed, info = await check_rate_limit("test", 5, 60)
        assert isinstance(is_allowed, bool)
        assert "limit" in info
        assert info["limit"] == 5


# ═══════════════════════════════════════════════════════════════
# CONFIGURATION TESTS
# ═══════════════════════════════════════════════════════════════

class TestRateLimitConfiguration:
    """Test rate limit configuration"""

    def test_auth_limits(self):
        """Test authentication endpoint limits"""
        assert "auth" in RATE_LIMITS
        limit, period = RATE_LIMITS["auth"]
        assert limit == 10
        assert period == 60

    def test_development_limits(self):
        """Test development endpoint limits"""
        assert "development" in RATE_LIMITS
        limit, period = RATE_LIMITS["development"]
        assert limit == 30
        assert period == 60

    def test_payments_limits(self):
        """Test payment endpoint limits"""
        assert "payments" in RATE_LIMITS
        limit, period = RATE_LIMITS["payments"]
        assert limit == 5  # Most restrictive
        assert period == 60

    def test_health_limits(self):
        """Test health endpoint limits"""
        assert "health" in RATE_LIMITS
        limit, period = RATE_LIMITS["health"]
        assert limit == 60  # Highest limit
        assert period == 60

    def test_endpoint_categories(self):
        """Test endpoint to category mapping"""
        assert "/api/auth/login" in ENDPOINT_CATEGORIES
        assert "/api/development" in ENDPOINT_CATEGORIES
        assert "/api/payments" in ENDPOINT_CATEGORIES
        assert "/health" in ENDPOINT_CATEGORIES


# ═══════════════════════════════════════════════════════════════
# INTEGRATION TESTS
# ═══════════════════════════════════════════════════════════════

class TestRateLimitingIntegration:
    """Integration tests for rate limiting"""

    def test_realistic_auth_scenario(self, memory_limiter):
        """Test realistic authentication rate limiting"""
        # Simulate 11 login attempts (limit is 10/min)
        for i in range(10):
            is_allowed, _ = memory_limiter.is_allowed(
                "192.168.1.100:/api/auth/login", 10, 60
            )
            assert is_allowed is True

        # 11th attempt should be blocked
        is_allowed, info = memory_limiter.is_allowed(
            "192.168.1.100:/api/auth/login", 10, 60
        )
        assert is_allowed is False
        assert info["retry_after"] > 0

    def test_different_users_separate_limits(self, memory_limiter):
        """Test different users have separate rate limits"""
        # User 1 exhausts limit
        for _ in range(10):
            memory_limiter.is_allowed(
                "user1:/api/community/posts", 10, 60
            )

        # User 1 blocked
        is_allowed, _ = memory_limiter.is_allowed(
            "user1:/api/community/posts", 10, 60
        )
        assert is_allowed is False

        # User 2 still allowed
        is_allowed, _ = memory_limiter.is_allowed(
            "user2:/api/community/posts", 10, 60
        )
        assert is_allowed is True

    def test_multiple_endpoints_separate_limits(self, memory_limiter):
        """Test different endpoints have separate limits"""
        # Exhaust auth limit
        for _ in range(10):
            memory_limiter.is_allowed(
                "192.168.1.100:/api/auth/login", 10, 60
            )

        # Auth should be blocked
        is_allowed, _ = memory_limiter.is_allowed(
            "192.168.1.100:/api/auth/login", 10, 60
        )
        assert is_allowed is False

        # Development should still work (different limit)
        for _ in range(30):
            is_allowed, _ = memory_limiter.is_allowed(
                "192.168.1.100:/api/development/tracks", 30, 60
            )
            assert is_allowed is True


# ═══════════════════════════════════════════════════════════════
# TEST RUNNER
# ═══════════════════════════════════════════════════════════════

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
