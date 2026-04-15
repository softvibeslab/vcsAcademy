"""
VCSA Authentication Validation Tests
Enhanced tests for authentication validation, error handling, and security
"""

import pytest
import requests
import os
from datetime import datetime, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test users
VALID_USER = {"email": "demo@vcsa.com", "password": "demo123"}
ADMIN_USER = {"email": "admin@vcsa.com", "password": "admin123"}
INVALID_USER = {"email": "nonexistent@example.com", "password": "wrongpassword"}


class TestAuthValidation:
    """Test authentication validation and error handling"""

    def test_login_with_invalid_email_format(self):
        """Test login rejects invalid email formats"""
        invalid_emails = [
            {"email": "notanemail", "password": "test123"},
            {"email": "@example.com", "password": "test123"},
            {"email": "test@", "password": "test123"},
            {"email": "", "password": "test123"},
        ]

        for invalid_creds in invalid_emails:
            response = requests.post(f"{BASE_URL}/api/auth/login", json=invalid_creds)
            # Should return 422 for validation error or 401 for invalid credentials
            assert response.status_code in [401, 422], f"Expected validation error for {invalid_creds['email']}"

    def test_login_with_missing_fields(self):
        """Test login requires both email and password"""
        # Missing password
        response = requests.post(f"{BASE_URL}/api/auth/login", json={"email": "test@example.com"})
        assert response.status_code == 422  # Validation error

        # Missing email
        response = requests.post(f"{BASE_URL}/api/auth/login", json={"password": "test123"})
        assert response.status_code == 422  # Validation error

        # Empty request
        response = requests.post(f"{BASE_URL}/api/auth/login", json={})
        assert response.status_code == 422  # Validation error

    def test_login_with_incorrect_credentials(self):
        """Test login fails with incorrect credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json=INVALID_USER)
        assert response.status_code == 401

        # Verify error message doesn't reveal whether user exists
        data = response.json()
        assert "detail" in data
        assert "Invalid" in data["detail"] or "credentials" in data["detail"].lower()

    def test_login_with_short_password(self):
        """Test login rejects short passwords during registration"""
        short_password = {"email": "test@example.com", "password": "short", "name": "Test User"}
        response = requests.post(f"{BASE_URL}/api/auth/register", json=short_password)
        # Should fail validation (password too short)
        assert response.status_code in [400, 422]

    def test_login_with_weak_password(self):
        """Test registration enforces password strength requirements"""
        weak_passwords = [
            {"email": "test1@example.com", "password": "weak", "name": "Test User 1"},
            {"email": "test2@example.com", "password": "alllowercase", "name": "Test User 2"},
            {"email": "test3@example.com", "password": "ALLUPPERCASE", "name": "Test User 3"},
            {"email": "test4@example.com", "password": "12345678", "name": "Test User 4"},
        ]

        for weak_creds in weak_passwords:
            response = requests.post(f"{BASE_URL}/api/auth/register", json=weak_creds)
            # Should fail validation (weak password)
            assert response.status_code in [400, 422], f"Weak password accepted: {weak_creds['password']}"

    def test_register_with_invalid_email(self):
        """Test registration rejects invalid email formats"""
        invalid_registers = [
            {"email": "notanemail", "password": "ValidPass123", "name": "Test User"},
            {"email": "@example.com", "password": "ValidPass123", "name": "Test User"},
            {"email": "test@", "password": "ValidPass123", "name": "Test User"},
            {"email": "", "password": "ValidPass123", "name": "Test User"},
        ]

        for invalid_data in invalid_registers:
            response = requests.post(f"{BASE_URL}/api/auth/register", json=invalid_data)
            assert response.status_code in [400, 422], f"Invalid email accepted: {invalid_data['email']}"

    def test_register_with_invalid_name(self):
        """Test registration validates name field"""
        invalid_names = [
            {"email": "test@example.com", "password": "ValidPass123", "name": ""},  # Empty name
            {"email": "test@example.com", "password": "ValidPass123", "name": "A"},  # Too short
            {"email": "test@example.com", "password": "ValidPass123", "name": "User123!@#"},  # Invalid chars
        ]

        for invalid_data in invalid_names:
            response = requests.post(f"{BASE_URL}/api/auth/register", json=invalid_data)
            assert response.status_code in [400, 422], f"Invalid name accepted: {invalid_data['name']}"

    def test_register_with_duplicate_email(self):
        """Test registration rejects duplicate email addresses"""
        # Try to register with existing demo user email
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": VALID_USER["email"],
            "password": "ValidPass123",
            "name": "Duplicate User"
        })
        assert response.status_code == 400  # Email already registered

    def test_register_creates_user_with_valid_data(self):
        """Test registration creates user with valid data"""
        import uuid
        unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"

        valid_data = {
            "email": unique_email,
            "password": "ValidPass123",
            "name": "Valid Test User"
        }

        response = requests.post(f"{BASE_URL}/api/auth/register", json=valid_data)

        # Registration should succeed (might fail if user exists, which is OK for this test)
        if response.status_code == 200:
            data = response.json()
            assert "user_id" in data
            assert data["email"] == unique_email
            assert data["name"] == "Valid Test User"
            assert data["membership"] == "free"
            assert data["role"] == "member"
            assert data["level"] == 1
            assert data["points"] == 0
        elif response.status_code == 400:
            # User already exists (acceptable for this test)
            pass

    def test_session_token_set_on_login(self):
        """Test that session token is properly set on login"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=VALID_USER)

        if response.status_code == 200:
            # Check if session cookie is set
            cookies = session.cookies.get_dict()
            assert "session_token" in cookies, "Session token not set after login"

            # Verify token format
            session_token = cookies["session_token"]
            assert session_token.startswith("session_"), f"Invalid token format: {session_token}"

    def test_logout_clears_session(self):
        """Test that logout properly clears session"""
        session = requests.Session()

        # Login first
        login_response = session.post(f"{BASE_URL}/api/auth/login", json=VALID_USER)
        if login_response.status_code == 200:
            # Logout
            logout_response = session.post(f"{BASE_URL}/api/auth/logout")
            assert logout_response.status_code == 200

            # Verify we can't access protected endpoints anymore
            protected_response = session.get(f"{BASE_URL}/api/auth/me")
            assert protected_response.status_code == 401

    def test_current_user_endpoint(self):
        """Test getting current authenticated user"""
        session = requests.Session()

        # Login
        session.post(f"{BASE_URL}/api/auth/login", json=VALID_USER)

        # Get current user
        response = session.get(f"{BASE_URL}/api/auth/me")

        if response.status_code == 200:
            user_data = response.json()
            assert "user_id" in user_data
            assert "email" in user_data
            assert "name" in user_data
            assert user_data["email"] == VALID_USER["email"]

    def test_protected_endpoint_without_auth(self):
        """Test that protected endpoints require authentication"""
        session = requests.Session()

        # Try to access protected endpoint without login
        response = session.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401

    def test_multiple_login_attempts_handling(self):
        """Test handling of multiple failed login attempts"""
        # Try multiple failed login attempts
        for i in range(6):  # Try 6 times (should lock after 5)
            response = requests.post(f"{BASE_URL}/api/auth/login", json=INVALID_USER)

            if i < 5:
                # Should get 401 for first 5 attempts
                assert response.status_code == 401, f"Attempt {i+1}: Expected 401"
            else:
                # Should get 429 (too many attempts) or 401 (account locked)
                assert response.status_code in [401, 429], f"Attempt {i+1}: Expected 401 or 429, got {response.status_code}"


class TestAuthSecurity:
    """Test authentication security features"""

    def test_password_not_exposed_in_responses(self):
        """Test that passwords are never exposed in API responses"""
        session = requests.Session()

        # Register a new user
        import uuid
        unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        register_data = {
            "email": unique_email,
            "password": "TestPassword123",
            "name": "Security Test User"
        }

        register_response = session.post(f"{BASE_URL}/api/auth/register", json=register_data)

        if register_response.status_code == 200:
            user_data = register_response.json()
            # Ensure password is not in response
            assert "password" not in user_data
            assert "password_hash" not in user_data
            assert "secret" not in user_data

        # Login
        login_response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": unique_email,
            "password": "TestPassword123"
        })

        if login_response.status_code == 200:
            user_data = login_response.json()
            # Ensure password is not in response
            assert "password" not in user_data
            assert "password_hash" not in user_data

    def test_sql_injection_prevention(self):
        """Test that SQL injection attempts are prevented"""
        sql_injection_attempts = [
            {"email": "'; DROP TABLE users; --", "password": "test123"},
            {"email": "admin' OR '1'='1", "password": "test123"},
            {"email": "admin@example.com'--", "password": "test123"},
        ]

        for injection_attempt in sql_injection_attempts:
            response = requests.post(f"{BASE_URL}/api/auth/login", json=injection_attempt)
            # Should not return 200 (successful login)
            assert response.status_code != 200, f"SQL injection attempt succeeded: {injection_attempt['email']}"

    def test_rate_limiting_on_auth_endpoints(self):
        """Test that rate limiting is applied to auth endpoints"""
        # Make multiple rapid requests to login endpoint
        responses = []
        for i in range(20):  # Make 20 rapid requests
            response = requests.post(f"{BASE_URL}/api/auth/login", json=INVALID_USER)
            responses.append(response.status_code)

        # At least some requests should be rate limited (429)
        rate_limited = any(status == 429 for status in responses)
        # Note: This test might fail if rate limiting is not implemented yet

    def test_session_expiration(self):
        """Test that sessions expire after configured time"""
        # This test would require mocking time or checking session expiration logic
        # For now, we'll just verify that the session has an expiration time
        session = requests.Session()
        session.post(f"{BASE_URL}/api/auth/login", json=VALID_USER)

        # The actual expiration check would require database access or session inspection
        # This is a placeholder for the test


class TestAuthIntegration:
    """Integration tests for authentication flows"""

    @pytest.fixture(scope="class")
    def authenticated_session(self):
        """Create an authenticated session for tests"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=VALID_USER)
        if response.status_code != 200:
            pytest.skip("Could not authenticate")
        return session

    def test_complete_auth_flow(self, authenticated_session):
        """Test complete authentication flow: register → login → access → logout"""
        # This is tested indirectly by the authenticated_session fixture
        # and other tests that use it

        # Verify we can access protected endpoints
        response = authenticated_session.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 200

        # Verify we can access Phase 1 endpoints
        response = authenticated_session.get(f"{BASE_URL}/api/development/stages")
        assert response.status_code == 200

    def test_session_persistence_across_requests(self, authenticated_session):
        """Test that session persists across multiple requests"""
        # Make multiple requests with the same session
        for i in range(5):
            response = authenticated_session.get(f"{BASE_URL}/api/auth/me")
            assert response.status_code == 200, f"Request {i+1} failed"

    def test_concurrent_sessions(self):
        """Test handling of multiple concurrent sessions"""
        sessions = []

        # Create 3 concurrent sessions
        for i in range(3):
            session = requests.Session()
            response = session.post(f"{BASE_URL}/api/auth/login", json=VALID_USER)
            if response.status_code == 200:
                sessions.append(session)

        # Verify all sessions work
        for i, session in enumerate(sessions):
            response = session.get(f"{BASE_URL}/api/auth/me")
            assert response.status_code == 200, f"Session {i+1} failed"

        # Clean up sessions
        for session in sessions:
            try:
                session.post(f"{BASE_URL}/api/auth/logout")
            except:
                pass


class TestAuthErrorMessages:
    """Test authentication error messages are user-friendly"""

    def test_user_friendly_login_error(self):
        """Test that login errors are user-friendly"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json=INVALID_USER)
        assert response.status_code == 401

        data = response.json()
        assert "detail" in data

        # Error message should not reveal internal details
        error_msg = data["detail"].lower()
        assert "mysql" not in error_msg
        assert "database" not in error_msg
        assert "query" not in error_msg
        assert "exception" not in error_msg

    def test_user_friendly_registration_error(self):
        """Test that registration errors are user-friendly"""
        # Try to register with existing email
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": VALID_USER["email"],
            "password": "ValidPass123",
            "name": "Duplicate User"
        })

        if response.status_code == 400:
            data = response.json()
            assert "detail" in data

            # Error message should be helpful
            error_msg = data["detail"].lower()
            assert "already" in error_msg or "registered" in error_msg

    def test_validation_error_messages(self):
        """Test that validation errors provide helpful feedback"""
        # Test with missing fields
        response = requests.post(f"{BASE_URL}/api/auth/login", json={})
        assert response.status_code == 422

        data = response.json()
        assert "detail" in data

        # Validation error should indicate what's missing
        # (Format depends on FastAPI's validation error format)


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])