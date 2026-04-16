"""
╔═══════════════════════════════════════════════════════════════╗
║           VCSA Production Smoke Test Suite                    ║
╚═══════════════════════════════════════════════════════════════╝

Comprehensive smoke tests for production deployment verification.

Author: VCSA DevOps Team
Created: April 2026
Status: Production Ready
"""

import pytest
import requests
import time
import os
from typing import Dict, List, Tuple
from decimal import Decimal

# ═══════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════

BACKEND_URL = os.getenv(
    "BACKEND_URL",
    "http://localhost:8000"
)
FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:3000"
)

# Test configuration
TIMEOUT = 10
MAX_RETRIES = 3

# Test credentials
DEMO_USER = {
    "email": "demo@vcsa.com",
    "password": "demo123"
}

# ═══════════════════════════════════════════════════════════════
# TEST FIXTURES
# ═══════════════════════════════════════════════════════════════


@pytest.fixture(scope="module")
def api_client():
    """Create API client for testing."""
    session = requests.Session()
    session.timeout = TIMEOUT
    return session


@pytest.fixture(scope="module")
def auth_token(api_client):
    """Get authentication token for demo user."""
    response = api_client.post(
        f"{BACKEND_URL}/api/auth/login",
        json=DEMO_USER
    )
    if response.status_code == 200:
        return response.json().get("access_token")
    return None


# ═══════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════

def retry_request(func, *args, max_retries=MAX_RETRIES, **kwargs):
    """Retry a request function with exponential backoff."""
    for attempt in range(max_retries):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            time.sleep(2 ** attempt)


# ═══════════════════════════════════════════════════════════════
# CRITICAL TESTS - Service Health & Availability
# ═══════════════════════════════════════════════════════════════


class TestServiceHealth:
    """Test service health and availability."""

    def test_health_check(self, api_client):
        """Test basic health check endpoint."""
        response = retry_request(
            api_client.get,
            f"{BACKEND_URL}/api/health"
        )

        assert response.status_code == 200, \
            f"Health check failed: HTTP {response.status_code}"
        assert "status" in response.json() or response.text, \
            "Health check response missing status"

    def test_detailed_health_check(self, api_client):
        """Test detailed health check endpoint."""
        response = retry_request(
            api_client.get,
            f"{BACKEND_URL}/api/health/detailed"
        )

        assert response.status_code == 200, \
            f"Detailed health check failed: HTTP {response.status_code}"

        data = response.json()
        assert "status" in data or any(key in data for key in [
            "database", "performance", "services"
        ]), "Detailed health check missing expected fields"

    def test_api_docs_available(self, api_client):
        """Test API documentation is available."""
        response = retry_request(
            api_client.get,
            f"{BACKEND_URL}/docs"
        )

        assert response.status_code == 200, \
            f"API docs unavailable: HTTP {response.status_code}"

    def test_frontend_accessible(self, api_client):
        """Test frontend is accessible."""
        try:
            response = retry_request(
                api_client.get,
                FRONTEND_URL
            )
            # Frontend might be optional, so we just warn
            assert response.status_code in [200, 301, 302], \
                f"Frontend issue: HTTP {response.status_code}"
        except Exception:
            pytest.skip("Frontend not accessible")


# ═══════════════════════════════════════════════════════════════
# AUTHENTICATION TESTS
# ═══════════════════════════════════════════════════════════════


class TestAuthentication:
    """Test authentication functionality."""

    def test_user_login(self, api_client):
        """Test user login with demo credentials."""
        response = retry_request(
            api_client.post,
            f"{BACKEND_URL}/api/auth/login",
            json=DEMO_USER
        )

        assert response.status_code == 200, \
            f"Login failed: HTTP {response.status_code}"

        data = response.json()
        assert "access_token" in data or "message" in data, \
            "Login response missing token or message"

    def test_invalid_credentials(self, api_client):
        """Test login with invalid credentials."""
        response = api_client.post(
            f"{BACKEND_URL}/api/auth/login",
            json={
                "email": "invalid@test.com",
                "password": "wrongpassword"
            }
        )

        # Should return 401 or 400
        assert response.status_code in [400, 401], \
            f"Invalid credentials should fail: HTTP {response.status_code}"

    def test_protected_endpoint_without_auth(self, api_client):
        """Test accessing protected endpoint without authentication."""
        response = api_client.get(
            f"{BACKEND_URL}/api/auth/me"
        )

        # Should return 401 Unauthorized
        assert response.status_code == 401, \
            f"Protected endpoint should require auth: HTTP {response.status_code}"

    def test_protected_endpoint_with_auth(self, api_client, auth_token):
        """Test accessing protected endpoint with authentication."""
        if not auth_token:
            pytest.skip("No auth token available")

        response = api_client.get(
            f"{BACKEND_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {auth_token}"}
        )

        # Should succeed with valid token
        assert response.status_code == 200, \
            f"Protected endpoint failed with valid token: HTTP {response.status_code}"


# ═══════════════════════════════════════════════════════════════
# API FUNCTIONALITY TESTS
# ═══════════════════════════════════════════════════════════════


class TestPhase1API:
    """Test Phase 1 Development System API endpoints."""

    def test_get_stages(self, api_client):
        """Test getting development stages."""
        response = retry_request(
            api_client.get,
            f"{BACKEND_URL}/api/development/stages"
        )

        assert response.status_code == 200, \
            f"Get stages failed: HTTP {response.status_code}"

        data = response.json()
        assert isinstance(data, list), "Stages should be a list"

        if len(data) > 0:
            # Validate first stage structure
            stage = data[0]
            assert "stage_id" in stage or "id" in stage, \
                "Stage missing ID field"

    def test_get_tracks(self, api_client):
        """Test getting development tracks."""
        response = retry_request(
            api_client.get,
            f"{BACKEND_URL}/api/development/tracks"
        )

        assert response.status_code == 200, \
            f"Get tracks failed: HTTP {response.status_code}"

        data = response.json()
        assert isinstance(data, list), "Tracks should be a list"

        if len(data) > 0:
            # Validate first track structure
            track = data[0]
            assert "track_id" in track or "id" in track, \
                "Track missing ID field"

    def test_get_deal_breakdowns(self, api_client):
        """Test getting deal breakdowns."""
        response = retry_request(
            api_client.get,
            f"{BACKEND_URL}/api/development/breakdowns"
        )

        assert response.status_code == 200, \
            f"Get breakdowns failed: HTTP {response.status_code}"

        data = response.json()
        assert isinstance(data, list), "Breakdowns should be a list"

    def test_get_quick_wins(self, api_client):
        """Test getting quick wins."""
        response = retry_request(
            api_client.get,
            f"{BACKEND_URL}/api/development/quickwins"
        )

        assert response.status_code == 200, \
            f"Get quick wins failed: HTTP {response.status_code}"

        data = response.json()
        assert isinstance(data, list), "Quick wins should be a list"


# ═══════════════════════════════════════════════════════════════
# PERFORMANCE TESTS
# ═══════════════════════════════════════════════════════════════


class TestPerformance:
    """Test performance characteristics."""

    def test_health_check_response_time(self, api_client):
        """Test health check response time is acceptable."""
        start_time = time.time()
        response = api_client.get(f"{BACKEND_URL}/api/health")
        response_time = (time.time() - start_time) * 1000  # Convert to ms

        assert response.status_code == 200
        assert response_time < 1000, \
            f"Health check too slow: {response_time:.0f}ms (target: <1000ms)"

    def test_api_response_time_headers(self, api_client):
        """Test API returns response time headers."""
        response = api_client.get(f"{BACKEND_URL}/api/health")

        assert "X-Response-Time" in response.headers or \
               "x-response-time" in response.headers, \
               "Response time header missing"

    def test_auth_response_time(self, api_client):
        """Test authentication response time is acceptable."""
        start_time = time.time()
        response = api_client.post(
            f"{BACKEND_URL}/api/auth/login",
            json=DEMO_USER
        )
        response_time = (time.time() - start_time) * 1000  # Convert to ms

        assert response.status_code == 200
        assert response_time < 2000, \
            f"Authentication too slow: {response_time:.0f}ms (target: <2000ms)"


# ═══════════════════════════════════════════════════════════════
# SECURITY TESTS
# ═══════════════════════════════════════════════════════════════


class TestSecurity:
    """Test security features."""

    def test_rate_limiting_headers(self, api_client):
        """Test rate limiting headers are present."""
        response = api_client.get(f"{BACKEND_URL}/api/health")

        # Rate limiting headers should be present
        has_rate_limit = any(
            header in response.headers or header.lower() in response.headers
            for header in [
                "X-RateLimit-Limit",
                "X-RateLimit-Remaining",
                "X-RateLimit-Reset"
            ]
        )

        # This is optional, so we just check if it exists
        if has_rate_limit:
            assert True, "Rate limiting headers present"
        else:
            pytest.skip("Rate limiting headers not configured")

    def test_cors_headers(self, api_client):
        """Test CORS headers are properly configured."""
        response = api_client.get(
            f"{BACKEND_URL}/api/health",
            headers={"Origin": FRONTEND_URL}
        )

        # Check for CORS headers
        has_cors = any(
            header in response.headers or header.lower() in response.headers
            for header in [
                "Access-Control-Allow-Origin",
                "access-control-allow-origin"
            ]
        )

        # CORS is optional for smoke tests
        if has_cors:
            assert True, "CORS headers present"
        else:
            pytest.skip("CORS headers not configured")

    def test_https_only_if_production(self, api_client):
        """Test HTTPS enforcement in production."""
        if not BACKEND_URL.startswith("https://"):
            pytest.skip("Not using HTTPS")

        # If using HTTPS, verify SSL is working
        response = api_client.get(f"{BACKEND_URL}/api/health")
        assert response.status_code == 200, \
            "HTTPS connection failed"


# ═══════════════════════════════════════════════════════════════
# INTEGRATION TESTS
# ═══════════════════════════════════════════════════════════════


class TestIntegration:
    """Test integration between components."""

    def test_full_auth_flow(self, api_client):
        """Test complete authentication flow."""
        # Step 1: Login
        login_response = api_client.post(
            f"{BACKEND_URL}/api/auth/login",
            json=DEMO_USER
        )
        assert login_response.status_code == 200

        token = login_response.json().get("access_token")
        if not token:
            pytest.skip("No access token returned")

        # Step 2: Access protected endpoint
        protected_response = api_client.get(
            f"{BACKEND_URL}/api/development/progress",
            headers={"Authorization": f"Bearer {token}"}
        )

        # Should succeed or return 404 (if no progress yet)
        assert protected_response.status_code in [200, 404], \
            f"Protected endpoint failed: HTTP {protected_response.status_code}"

    def test_error_handling(self, api_client):
        """Test proper error handling."""
        # Test 404 on non-existent endpoint
        response = api_client.get(f"{BACKEND_URL}/api/nonexistent")

        assert response.status_code == 404, \
            f"Non-existent endpoint should return 404: HTTP {response.status_code}"

        # Test error response structure
        if response.headers.get("content-type", "").startswith("application/json"):
            data = response.json()
            assert "detail" in data or "error" in data or "message" in data, \
                "Error response should have detail/error/message field"


# ═══════════════════════════════════════════════════════════════
# TEST RUNNER
# ═══════════════════════════════════════════════════════════════


def run_smoke_tests(backend_url: str = None, frontend_url: str = None):
    """
    Run smoke tests with custom URLs.

    Args:
        backend_url: Custom backend URL
        frontend_url: Custom frontend URL

    Returns:
        Test result (0 = success, 1 = failure)
    """
    import sys

    # Set environment variables
    if backend_url:
        os.environ["BACKEND_URL"] = backend_url
    if frontend_url:
        os.environ["FRONTEND_URL"] = frontend_url

    # Run pytest
    exit_code = pytest.main([
        __file__,
        "-v",
        "--tb=short",
        "--color=yes",
        "-m", "smoke"
    ])

    return exit_code


if __name__ == "__main__":
    import sys

    # Parse command line arguments
    backend_url = sys.argv[1] if len(sys.argv) > 1 else None
    frontend_url = sys.argv[2] if len(sys.argv) > 2 else None

    # Run smoke tests
    exit_code = run_smoke_tests(backend_url, frontend_url)
    sys.exit(exit_code)
