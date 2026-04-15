"""
VCSA Edge Cases and Error Handling Tests
Tests for edge cases, boundary conditions, and error scenarios
"""

import pytest
import requests
import os
from datetime import datetime, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

VALID_USER = {"email": "demo@vcsa.com", "password": "demo123"}


class TestEdgeCases:
    """Test edge cases and boundary conditions"""

    @pytest.fixture(scope="class")
    def auth_session(self):
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=VALID_USER)
        if response.status_code != 200:
            pytest.skip("Could not authenticate")
        return session

    def test_empty_string_inputs(self):
        """Test handling of empty string inputs"""
        # Test with various endpoints that accept string inputs
        test_cases = [
            (f"{BASE_URL}/api/auth/login", {"email": "", "password": ""}),
        ]

        for url, data in test_cases:
            response = requests.post(url, json=data)
            # Should return validation error (422) or auth error (401)
            assert response.status_code in [400, 401, 422], f"Empty strings accepted for {url}"

    def test_very_long_string_inputs(self):
        """Test handling of very long string inputs"""
        long_string = "a" * 10000  # 10,000 characters

        # Test with various endpoints
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": f"test{long_string}@example.com",
            "password": "test123"
        })

        # Should handle gracefully (not crash)
        assert response.status_code in [400, 401, 422], "Long strings caused crash"

    def test_special_characters_in_inputs(self):
        """Test handling of special characters in inputs"""
        special_char_inputs = [
            {"email": "test@example.com", "password": "🔥🔥🔥"},
            {"email": "test@example.com", "password': '<script>alert("xss")</script>'},
            {"email': '"><script>alert("xss")</script>@example.com', "password": "test123"},
            {"email": "test@example.com", "password": "'; DROP TABLE users; --"},
        ]

        for input_data in special_char_inputs:
            response = requests.post(f"{BASE_URL}/api/auth/login", json=input_data)
            # Should handle gracefully (not crash or allow SQL injection)
            assert response.status_code in [400, 401, 422], f"Special chars not handled: {input_data}"

    def test_unicode_characters(self):
        """Test handling of Unicode characters in inputs"""
        unicode_inputs = [
            {"email": "test@example.com", "password": "пароль123"},  # Russian
            {"email": "test@example.com", "password": "密碼123"},     # Chinese
            {"email": "test@example.com", "password": "كلمة123"},    # Arabic
            {"email": "test@example.com", "password": "émoticön123"},  # Accented
        ]

        for input_data in unicode_inputs:
            response = requests.post(f"{BASE_URL}/api/auth/login", json=input_data)
            # Should handle Unicode gracefully
            # (will probably fail auth, but shouldn't crash)
            assert response.status_code in [200, 400, 401, 422], f"Unicode not handled: {input_data['password'][:10]}"

    def test_numeric_values_in_string_fields(self):
        """Test handling of numeric values where strings are expected"""
        # Try to login with numeric email
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": 12345,
            "password": "test123"
        })
        # Should handle gracefully (validation error)
        assert response.status_code in [400, 401, 422], "Numeric in string field not handled"

    def test_null_values_in_required_fields(self):
        """Test handling of null values in required fields"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": None,
            "password": "test123"
        })
        # Should handle gracefully (validation error)
        assert response.status_code in [400, 401, 422], "Null value not handled"

    def test_array_values_in_string_fields(self):
        """Test handling of array values where strings are expected"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ["test@example.com"],
            "password": "test123"
        })
        # Should handle gracefully (validation error)
        assert response.status_code in [400, 401, 422], "Array value not handled"

    def test_object_values_in_string_fields(self):
        """Test handling of object values where strings are expected"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": {"email": "test@example.com"},
            "password": "test123"
        })
        # Should handle gracefully (validation error)
        assert response.status_code in [400, 401, 422], "Object value not handled"

    def test_boolean_values_in_string_fields(self):
        """Test handling of boolean values where strings are expected"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": True,
            "password": "test123"
        })
        # Should handle gracefully (validation error)
        assert response.status_code in [400, 401, 422], "Boolean value not handled"


class TestBoundaryConditions:
    """Test boundary conditions and limits"""

    @pytest.fixture(scope="class")
    def auth_session(self):
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=VALID_USER)
        if response.status_code != 200:
            pytest.skip("Could not authenticate")
        return session

    def test_minimum_password_length(self, auth_session):
        """Test minimum password length boundary"""
        # Password too short
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": "boundary_test@example.com",
            "password": "Short1",
            "name": "Boundary Test"
        })
        # Should fail validation
        assert response.status_code in [400, 422]

    def test_maximum_field_lengths(self):
        """Test maximum field length boundaries"""
        max_length_string = "a" * 1000  # Very long string

        # Test with name field
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": "test@example.com",
            "password": "ValidPass123",
            "name": max_length_string
        })
        # Should handle gracefully (either accept or reject, but not crash)
        assert response.status_code in [200, 400, 422], "Max length not handled"

    def test_exact_boundary_values(self):
        """Test exact boundary values (min, max, etc.)"""
        # Test with exactly minimum valid password length
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": "boundary@example.com",
            "password": "Abcd1234",  # Exactly 8 characters
            "name": "Boundary User"
        })

        # Should either succeed or fail with clear validation
        assert response.status_code in [200, 400, 422]

    def test_zero_and_negative_values(self):
        """Test handling of zero and negative numeric values"""
        # Test with numeric endpoints that might accept zero/negative values
        # (This would require knowing which endpoints accept numeric input)

        # For now, test with user progress endpoints if they exist
        session = requests.Session()
        session.post(f"{BASE_URL}/api/auth/login", json=VALID_USER)

        # Try to complete a module with negative points (should fail)
        response = session.post(f"{BASE_URL}/api/development/content/mod_1_1/complete", json={
            "points": -10
        })
        # Should handle gracefully
        assert response.status_code in [400, 422, 404], "Negative points not handled"

    def test_very_large_numeric_values(self):
        """Test handling of very large numeric values"""
        session = requests.Session()
        session.post(f"{BASE_URL}/api/auth/login", json=VALID_USER)

        # Try to set very large numeric values
        large_number = 999999999999999999999

        # Test with progress update if available
        # (This would require knowing which endpoints accept numeric input)
        response = session.post(f"{BASE_URL}/api/development/content/mod_1_1/complete", json={
            "points": large_number
        })
        # Should handle gracefully
        assert response.status_code in [200, 400, 422, 404], "Large number not handled"


class TestErrorHandling:
    """Test error handling and graceful degradation"""

    def test_404_errors(self):
        """Test 404 error handling for non-existent resources"""
        session = requests.Session()
        session.post(f"{BASE_URL}/api/auth/login", json=VALID_USER)

        # Try to access non-existent track
        response = session.get(f"{BASE_URL}/api/development/tracks/nonexistent_track")
        assert response.status_code == 404

        # Verify error message is user-friendly
        data = response.json()
        assert "detail" in data

    def test_405_method_not_allowed(self):
        """Test 405 error handling for wrong HTTP methods"""
        # Try to use GET on POST endpoint
        response = requests.get(f"{BASE_URL}/api/auth/login")
        assert response.status_code == 405

    def test_415_unsupported_media_type(self):
        """Test 415 error handling for wrong content type"""
        # Try to send XML instead of JSON
        xml_data = '<user><email>test@example.com</email><password>test123</password></user>'
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            data=xml_data,
            headers={"Content-Type": "application/xml"}
        )
        # Should handle gracefully (405 or 415)
        assert response.status_code in [405, 415, 422], "Unsupported media type not handled"

    def test_malformed_json(self):
        """Test handling of malformed JSON requests"""
        # Send invalid JSON
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            data='{"email": "test@example.com", "password": "test123}',  # Missing closing brace
            headers={"Content-Type": "application/json"}
        )
        # Should handle gracefully
        assert response.status_code in [400, 422], "Malformed JSON not handled"

    def test_extra_fields_in_request(self):
        """Test handling of extra unexpected fields in requests"""
        # Send request with extra fields
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "test@example.com",
            "password": "test123",
            "extra_field": "should_be_ignored",
            "another_extra": 12345
        })
        # Should handle gracefully (either ignore or validate)
        assert response.status_code in [200, 400, 401, 422], "Extra fields not handled"

    def test_missing_content_type_header(self):
        """Test handling of missing Content-Type header"""
        # Send JSON without Content-Type header
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "test@example.com", "password": "test123"},
            headers={}
        )
        # Should handle gracefully (many APIs default to JSON)
        assert response.status_code in [200, 400, 401, 415, 422], "Missing Content-Type not handled"

    def test_concurrent_requests(self):
        """Test handling of concurrent requests to the same endpoint"""
        import threading

        results = []
        errors = []

        def make_request():
            try:
                response = requests.get(f"{BASE_URL}/api/development/stages")
                results.append(response.status_code)
            except Exception as e:
                errors.append(str(e))

        # Create 10 concurrent requests
        threads = []
        for _ in range(10):
            thread = threading.Thread(target=make_request)
            threads.append(thread)
            thread.start()

        # Wait for all threads to complete
        for thread in threads:
            thread.join()

        # All requests should complete without errors
        assert len(errors) == 0, f"Concurrent requests failed: {errors}"

        # Most requests should succeed
        success_count = sum(1 for status in results if status == 200)
        assert success_count >= 8, f"Too many concurrent requests failed: {success_count}/10 succeeded"


class TestDataConsistency:
    """Test data consistency and integrity"""

    @pytest.fixture(scope="class")
    def auth_session(self):
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=VALID_USER)
        if response.status_code != 200:
            pytest.skip("Could not authenticate")
        return session

    def test_data_types_in_responses(self, auth_session):
        """Test that response data has correct data types"""
        # Get stages
        response = auth_session.get(f"{BASE_URL}/api/development/stages")
        assert response.status_code == 200

        stages = response.json()
        assert isinstance(stages, list)

        if len(stages) > 0:
            first_stage = stages[0]
            # Verify field types
            assert isinstance(first_stage.get("stage_id"), str)
            assert isinstance(first_stage.get("stage_number"), int)
            assert isinstance(first_stage.get("points_required"), (int, float))
            assert isinstance(first_stage.get("name"), str)

    def test_required_fields_present(self, auth_session):
        """Test that required fields are present in responses"""
        # Get tracks
        response = auth_session.get(f"{BASE_URL}/api/development/tracks")
        assert response.status_code == 200

        tracks = response.json()
        assert isinstance(tracks, list)

        if len(tracks) > 0:
            first_track = tracks[0]
            # Verify required fields exist
            required_fields = ["track_id", "name", "modules"]
            for field in required_fields:
                assert field in first_track, f"Required field '{field}' missing from track"

    def test_no_null_required_fields(self, auth_session):
        """Test that required fields are not null"""
        # Get modules
        response = auth_session.get(f"{BASE_URL}/api/development/tracks/track_1")
        assert response.status_code == 200

        track = response.json()
        if "modules" in track and len(track["modules"]) > 0:
            first_module = track["modules"][0]
            # Critical fields should not be null
            assert first_module.get("content_id") is not None
            assert first_module.get("title") is not None
            assert first_module.get("description") is not None


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])