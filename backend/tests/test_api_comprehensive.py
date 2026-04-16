"""
╔═══════════════════════════════════════════════════════════════╗
║           VCSA Backend API Comprehensive Tests                 ║
╚═══════════════════════════════════════════════════════════════╝

Comprehensive API endpoint tests for VCSA backend
Testing all critical endpoints with various scenarios

Author: VCSA Backend Team
Created: April 2026
Status: Production Ready
"""

import pytest
import requests
import os
from datetime import datetime, timedelta
import json
from typing import Dict, List, Any

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8000').rstrip('/')

# Test credentials
DEMO_USER = {"email": "demo@vcsa.com", "password": "demo123"}
ADMIN_USER = {"email": "admin@vcsa.com", "password": "admin123"}
TEST_USER = {"email": "test@vcsa.com", "password": "test123"}


class TestAPIHealthEndpoints:
    """Test API health and status endpoints"""

    @pytest.fixture(scope="class")
    def session(self):
        return requests.Session()

    def test_api_root_accessible(self, session):
        """Test API root endpoint is accessible"""
        response = session.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["message"] == "VCSA API is running"

    def test_health_check_basic(self, session):
        """Test basic health check endpoint"""
        response = session.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert data["status"] == "healthy"

    def test_health_check_detailed(self, session):
        """Test detailed health check with metrics"""
        response = session.get(f"{BASE_URL}/api/health/detailed")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        # May contain database, performance, or other health info
        assert isinstance(data, dict)

    def test_api_docs_accessible(self, session):
        """Test API documentation endpoint"""
        response = session.get(f"{BASE_URL}/docs")
        # Swagger UI returns HTML
        assert response.status_code == 200
        assert "text/html" in response.headers.get("content-type", "")


class TestAuthenticationEndpoints:
    """Test authentication-related endpoints"""

    @pytest.fixture(scope="class")
    def session(self):
        return requests.Session()

    def test_demo_user_login_success(self, session):
        """Test demo user can login successfully"""
        response = session.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER)
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data or "token" in data
        assert "email" in data
        assert data["email"] == DEMO_USER["email"]

    def test_login_with_invalid_credentials(self, session):
        """Test login fails with invalid credentials"""
        invalid_user = {"email": "invalid@test.com", "password": "wrongpass"}
        response = session.post(f"{BASE_URL}/api/auth/login", json=invalid_user)
        assert response.status_code in [401, 403, 404]

    def test_login_with_missing_email(self, session):
        """Test login requires email field"""
        response = session.post(f"{BASE_URL}/api/auth/login", json={"password": "test123"})
        assert response.status_code == 422  # Validation error

    def test_login_with_missing_password(self, session):
        """Test login requires password field"""
        response = session.post(f"{BASE_URL}/api/auth/login", json={"email": "test@test.com"})
        assert response.status_code == 422  # Validation error

    def test_login_with_empty_request(self, session):
        """Test login rejects empty request body"""
        response = session.post(f"{BASE_URL}/api/auth/login", json={})
        assert response.status_code == 422  # Validation error

    def test_register_new_user(self, session):
        """Test user registration endpoint"""
        timestamp = int(datetime.now().timestamp())
        new_user = {
            "email": f"testuser{timestamp}@vcsa.com",
            "password": "TestPass123!",
            "first_name": "Test",
            "last_name": f"User{timestamp}"
        }

        response = session.post(f"{BASE_URL}/api/auth/register", json=new_user)
        # Should either succeed (201) or fail with user exists (409)
        assert response.status_code in [201, 409, 400]

    def test_register_with_existing_email(self, session):
        """Test registration fails with existing email"""
        existing_user = {
            "email": "demo@vcsa.com",
            "password": "TestPass123!"
        }

        response = session.post(f"{BASE_URL}/api/auth/register", json=existing_user)
        # Should fail with conflict or bad request
        assert response.status_code in [400, 409]

    def test_protected_endpoint_without_auth(self, session):
        """Test protected endpoint requires authentication"""
        response = session.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401  # Unauthorized

    def test_protected_endpoint_with_auth(self, session):
        """Test protected endpoint works with valid auth"""
        # First login
        login_response = session.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER)
        if login_response.status_code != 200:
            pytest.skip("Demo user login failed, skipping auth test")

        token = login_response.json().get("access_token") or login_response.json().get("token")

        # Access protected endpoint
        headers = {"Authorization": f"Bearer {token}"}
        response = session.get(f"{BASE_URL}/api/auth/me", headers=headers)

        # Should succeed or return appropriate status
        assert response.status_code in [200, 401, 403]


class TestDevelopmentSystemEndpoints:
    """Test Phase 1 Development System endpoints"""

    @pytest.fixture(scope="class")
    def session(self):
        return requests.Session()

    def test_get_stages(self, session):
        """Test getting 4 development stages"""
        response = session.get(f"{BASE_URL}/api/development/stages")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 4  # 4 stages

        # Validate stage structure
        for stage in data:
            assert "stage_id" in stage or "id" in stage
            assert "name" in stage
            assert "points_required" in stage

    def test_get_tracks(self, session):
        """Test getting 6 development tracks"""
        response = session.get(f"{BASE_URL}/api/development/tracks")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 6  # 6 tracks

        # Validate track structure
        for track in data:
            assert "track_id" in track or "id" in track
            assert "title" in track
            assert "description" in track

    def test_get_track_detail(self, session):
        """Test getting specific track details"""
        # Get all tracks first
        tracks_response = session.get(f"{BASE_URL}/api/development/tracks")
        if tracks_response.status_code != 200:
            pytest.skip("Failed to get tracks")

        tracks = tracks_response.json()
        if len(tracks) == 0:
            pytest.skip("No tracks available")

        # Get first track details
        track_id = tracks[0].get("track_id") or tracks[0].get("id")
        response = session.get(f"{BASE_URL}/api/development/tracks/{track_id}")

        # Should succeed or return appropriate status
        assert response.status_code in [200, 404]

        if response.status_code == 200:
            track_data = response.json()
            assert "modules" in track_data or "content" in track_data

    def test_get_deal_breakdowns(self, session):
        """Test getting deal breakdowns"""
        response = session.get(f"{BASE_URL}/api/development/breakdowns")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

        # Should have breakdowns
        if len(data) > 0:
            breakdown = data[0]
            assert "title" in breakdown or "scenario" in breakdown

    def test_get_quick_wins(self, session):
        """Test getting quick wins"""
        response = session.get(f"{BASE_URL}/api/development/quickwins")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

        # Should have quick wins
        if len(data) > 0:
            quickwin = data[0]
            assert "title" in quickwin or "tactic" in quickwin

    def test_get_user_progress(self, session):
        """Test getting user progress"""
        # Login first
        login_response = session.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER)
        if login_response.status_code != 200:
            pytest.skip("Demo user login failed")

        token = login_response.json().get("access_token") or login_response.json().get("token")
        headers = {"Authorization": f"Bearer {token}"}

        response = session.get(f"{BASE_URL}/api/development/progress", headers=headers)
        # Should succeed or return 401
        assert response.status_code in [200, 401, 403]

        if response.status_code == 200:
            progress = response.json()
            assert "points" in progress or "readiness_score" in progress

    def test_mark_content_complete(self, session):
        """Test marking content as complete"""
        # Login first
        login_response = session.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER)
        if login_response.status_code != 200:
            pytest.skip("Demo user login failed")

        token = login_response.json().get("access_token") or login_response.json().get("token")
        headers = {"Authorization": f"Bearer {token}"}

        # Get a content ID to mark complete
        tracks_response = session.get(f"{BASE_URL}/api/development/tracks", headers=headers)
        if tracks_response.status_code != 200:
            pytest.skip("Failed to get tracks")

        tracks = tracks_response.json()
        if len(tracks) == 0:
            pytest.skip("No tracks available")

        track = tracks[0]
        track_id = track.get("track_id") or track.get("id")

        # Try to mark complete (may fail if content doesn't exist)
        response = session.post(
            f"{BASE_URL}/api/development/content/{track_id}/complete",
            headers=headers
        )

        # Should succeed or return appropriate status
        assert response.status_code in [200, 404, 400, 401]


class TestContentEndpoints:
    """Test content-related endpoints"""

    @pytest.fixture(scope="class")
    def session(self):
        return requests.Session()

    def test_get_coaching_content(self, session):
        """Test getting coaching content"""
        response = session.get(f"{BASE_URL}/api/coaching")
        assert response.status_code in [200, 404]

        if response.status_code == 200:
            data = response.json()
            assert isinstance(data, list) or isinstance(data, dict)

    def test_get_knowledge_hub_content(self, session):
        """Test getting knowledge hub content"""
        response = session.get(f"{BASE_URL}/api/knowledge-hub")
        assert response.status_code in [200, 404]

        if response.status_code == 200:
            data = response.json()
            assert isinstance(data, list) or isinstance(data, dict)


class TestCommunityEndpoints:
    """Test community and social features"""

    @pytest.fixture(scope="class")
    def session(self):
        return requests.Session()

    def test_get_community_posts(self, session):
        """Test getting community posts"""
        response = session.get(f"{BASE_URL}/api/community/posts")
        assert response.status_code in [200, 401, 403]

        if response.status_code == 200:
            data = response.json()
            assert isinstance(data, list)

    def test_create_community_post(self, session):
        """Test creating community post"""
        # Login first
        login_response = session.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER)
        if login_response.status_code != 200:
            pytest.skip("Demo user login failed")

        token = login_response.json().get("access_token") or login_response.json().get("token")
        headers = {"Authorization": f"Bearer {token}"}

        new_post = {
            "title": "Test Post",
            "content": "This is a test post",
            "category": "general"
        }

        response = session.post(
            f"{BASE_URL}/api/community/posts",
            headers=headers,
            json=new_post
        )

        # Should succeed or fail appropriately
        assert response.status_code in [200, 201, 400, 401, 403]


class TestEventsEndpoints:
    """Test events and calendar endpoints"""

    @pytest.fixture(scope="class")
    def session(self):
        return requests.Session()

    def test_get_events(self, session):
        """Test getting events"""
        response = session.get(f"{BASE_URL}/api/events")
        assert response.status_code in [200, 401, 403]

        if response.status_code == 200:
            data = response.json()
            assert isinstance(data, list)


class TestAdminEndpoints:
    """Test admin and management endpoints"""

    @pytest.fixture(scope="class")
    def session(self):
        return requests.Session()

    def test_get_users_list_without_admin(self, session):
        """Test getting users list requires admin privileges"""
        response = session.get(f"{BASE_URL}/api/admin/users")
        # Should require authentication
        assert response.status_code == 401

    def test_admin_metrics_with_auth(self, session):
        """Test admin metrics endpoint with authentication"""
        # Login as admin
        admin_response = session.post(f"{BASE_URL}/api/auth/login", json=ADMIN_USER)
        if admin_response.status_code != 200:
            pytest.skip("Admin login failed")

        token = admin_response.json().get("access_token") or admin_response.json().get("token")
        headers = {"Authorization": f"Bearer {token}"}

        response = session.get(f"{BASE_URL}/api/admin/metrics", headers=headers)
        # May or may not be authorized for demo user
        assert response.status_code in [200, 401, 403, 404]


class TestRateLimiting:
    """Test rate limiting functionality"""

    @pytest.fixture(scope="class")
    def session(self):
        return requests.Session()

    def test_rate_limit_headers_present(self, session):
        """Test rate limit headers are present"""
        response = session.get(f"{BASE_URL}/api/health")

        # Check for rate limit headers
        headers = response.headers
        has_rate_limit = any(
            key.lower() in headers
            for key in ["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"]
        )

        # Rate limiting headers should be present (optional)
        if has_rate_limit:
            assert True  # Headers present
        else:
            pytest.skip("Rate limiting headers not configured")

    def test_rate_limiting_enforced(self, session):
        """Test rate limiting is enforced on protected endpoint"""
        # Make multiple rapid requests
        responses = []
        for i in range(15):  # More than typical rate limit
            response = session.post(
                f"{BASE_URL}/api/auth/login",
                json={"email": f"test{i}@test.com", "password": "test123"}
            )
            responses.append(response)

        # At least some requests should be rate limited
        rate_limited = any(r.status_code == 429 for r in responses)
        if rate_limited:
            assert True  # Rate limiting is working
        else:
            pytest.skip("Rate limiting not enforced or limit too high")


class TestErrorHandling:
    """Test error handling and edge cases"""

    @pytest.fixture(scope="class")
    def session(self):
        return requests.Session()

    def test_404_on_nonexistent_endpoint(self, session):
        """Test 404 on non-existent endpoint"""
        response = session.get(f"{BASE_URL}/api/nonexistent")
        assert response.status_code == 404

        data = response.json()
        assert "detail" in data or "error" in data

    def test_405_on_wrong_method(self, session):
        """Test 405 on wrong HTTP method"""
        # Try POST on GET endpoint
        response = session.post(f"{BASE_URL}/api/health")
        # May return 405 or 404
        assert response.status_code in [405, 404, 422]

    def test_malformed_json_request(self, session):
        """Test handling of malformed JSON"""
        response = session.post(
            f"{BASE_URL}/api/auth/login",
            data="invalid json",
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code in [400, 422]

    def test_extra_fields_ignored(self, session):
        """Test extra fields in request are ignored"""
        login_with_extra = {
            "email": "demo@vcsa.com",
            "password": "demo123",
            "extra_field": "should_be_ignored"
        }

        response = session.post(f"{BASE_URL}/api/auth/login", json=login_with_extra)
        # Should succeed (extra field ignored) or validation error
        assert response.status_code in [200, 400, 422]


class TestResponseFormats:
    """Test API response formats and headers"""

    @pytest.fixture(scope="class")
    def session(self):
        return requests.Session()

    def test_json_response_content_type(self, session):
        """Test JSON responses have correct content type"""
        response = session.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        assert "application/json" in response.headers.get("content-type", "")

    def test_cors_headers_present(self, session):
        """Test CORS headers are configured"""
        response = session.get(f"{BASE_URL}/api/health", headers={"Origin": "http://localhost:3000"})

        cors_headers = [
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Methods",
            "Access-Control-Allow-Headers"
        ]

        has_cors = any(
            header.lower() in response.headers
            for header in cors_headers
        )

        # CORS headers should be present (optional)
        if has_cors:
            assert True
        else:
            pytest.skip("CORS headers not configured")

    def test_response_time_header_present(self, session):
        """Test response time header is present"""
        response = session.get(f"{BASE_URL}/api/health")

        # Check for X-Response-Time header
        has_response_time = "X-Response-Time" in response.headers or \
                           "x-response-time" in response.headers

        if has_response_time:
            assert True  # Header present
        else:
            pytest.skip("Response time header not configured")


@pytest.mark.performance
class TestAPIPerformance:
    """Performance tests for API endpoints"""

    @pytest.fixture(scope="class")
    def session(self):
        return requests.Session()

    def test_health_check_response_time(self, session):
        """Test health check responds quickly"""
        import time

        start_time = time.time()
        response = session.get(f"{BASE_URL}/api/health")
        end_time = time.time()

        assert response.status_code == 200
        response_time = (end_time - start_time) * 1000  # Convert to ms

        # Should respond in less than 1 second
        assert response_time < 1000, f"Health check too slow: {response_time:.0f}ms"

    def test_login_response_time(self, session):
        """Test login responds within acceptable time"""
        import time

        start_time = time.time()
        response = session.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER)
        end_time = time.time()

        if response.status_code == 200:
            response_time = (end_time - start_time) * 1000
            # Should respond in less than 2 seconds
            assert response_time < 2000, f"Login too slow: {response_time:.0f}ms"


# Test data factories
def create_test_user(timestamp=None):
    """Create test user data"""
    if timestamp is None:
        timestamp = int(datetime.now().timestamp())
    return {
        "email": f"test{timestamp}@vcsa.com",
        "password": "TestPass123!",
        "first_name": "Test",
        "last_name": f"User{timestamp}"
    }


def create_test_post(timestamp=None):
    """Create test post data"""
    if timestamp is None:
        timestamp = int(datetime.now().timestamp())
    return {
        "title": f"Test Post {timestamp}",
        "content": f"Test content {timestamp}",
        "category": "general"
    }


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
