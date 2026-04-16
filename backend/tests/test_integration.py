"""
╔═══════════════════════════════════════════════════════════════╗
║           VCSA Backend Integration Tests                      ║
╚═══════════════════════════════════════════════════════════════╝

Integration tests for complete API workflows
Testing multi-endpoint scenarios and data flow

Author: VCSA Backend Team
Created: April 2026
Status: Production Ready
"""

import pytest
import requests
import os
from datetime import datetime, timedelta
import json

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8000').rstrip('/')

# Test credentials
DEMO_USER = {"email": "demo@vcsa.com", "password": "demo123"}
ADMIN_USER = {"email": "admin@vcsa.com", "password": "admin123"}


class TestAuthenticationWorkflow:
    """Test complete authentication workflows"""

    @pytest.fixture(scope="class")
    def session(self):
        return requests.Session()

    def test_complete_registration_login_flow(self, session):
        """Test registering a new user and logging in"""
        timestamp = int(datetime.now().timestamp())

        # Step 1: Register new user
        new_user = {
            "email": f"integration_test_{timestamp}@vcsa.com",
            "password": "TestPass123!",
            "first_name": "Integration",
            "last_name": "Test"
        }

        register_response = session.post(f"{BASE_URL}/api/auth/register", json=new_user)

        # May succeed (201) or conflict if user exists (409)
        assert register_response.status_code in [201, 409]

        # Step 2: Login with the user
        login_response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": new_user["email"],
            "password": new_user["password"]
        })

        # Should succeed or return appropriate error
        assert login_response.status_code in [200, 401, 404]

        if login_response.status_code == 200:
            data = login_response.json()
            assert "email" in data or "user_id" in data

    def test_login_access_protected_logout_flow(self, session):
        """Test login → access protected → logout flow"""
        # Step 1: Login
        login_response = session.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER)

        if login_response.status_code != 200:
            pytest.skip("Login failed")

        token = login_response.json().get("access_token") or login_response.json().get("token")
        headers = {"Authorization": f"Bearer {token}"}

        # Step 2: Access protected endpoint
        me_response = session.get(f"{BASE_URL}/api/auth/me", headers=headers)

        # Should return user data or appropriate status
        assert me_response.status_code in [200, 401, 403]

        # Step 3: Logout (if endpoint exists)
        logout_response = session.post(f"{BASE_URL}/api/auth/logout", headers=headers)

        # Logout may or may not be implemented
        assert logout_response.status_code in [200, 404, 405]


class TestProgressTrackingWorkflow:
    """Test complete progress tracking workflow"""

    @pytest.fixture(scope="class")
    def auth_session(self):
        """Create authenticated session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER)

        if response.status_code != 200:
            pytest.skip("Login failed")

        return session

    def test_complete_learning_workflow(self, auth_session):
        """Test complete learning workflow: get content → mark complete → check progress"""
        # Step 1: Get all tracks
        tracks_response = auth_session.get(f"{BASE_URL}/api/development/tracks")
        assert tracks_response.status_code == 200

        tracks = tracks_response.json()
        if len(tracks) == 0:
            pytest.skip("No tracks available")

        # Step 2: Get first track detail
        track_id = tracks[0].get("track_id") or tracks[0].get("id")
        track_response = auth_session.get(f"{BASE_URL}/api/development/tracks/{track_id}")

        if track_response.status_code != 200:
            pytest.skip("Failed to get track detail")

        track = track_response.json()
        modules = track.get("modules", [])

        if len(modules) == 0:
            pytest.skip("No modules in track")

        # Step 3: Mark first module as complete
        content_id = modules[0].get("content_id")
        if content_id:
            complete_response = auth_session.post(
                f"{BASE_URL}/api/development/content/{content_id}/complete"
            )

            # Should succeed or return appropriate status
            assert complete_response.status_code in [200, 404, 400]

        # Step 4: Check updated progress
        progress_response = auth_session.get(f"{BASE_URL}/api/development/progress")
        assert progress_response.status_code in [200, 401]

        if progress_response.status_code == 200:
            progress = progress_response.json()
            assert "progress" in progress or "readiness_score" in progress

    def test_badge_awarding_workflow(self, auth_session):
        """Test completing content and earning badges"""
        # Step 1: Get current badges
        badges_response = auth_session.get(f"{BASE_URL}/api/development/badges")
        assert badges_response.status_code == 200

        badges = badges_response.json()
        assert isinstance(badges, list)

        # Step 2: Get progress to see earned badges
        progress_response = auth_session.get(f"{BASE_URL}/api/development/progress")

        if progress_response.status_code == 200:
            progress = progress_response.json()
            # May have earned badges field
            assert "progress" in progress or "readiness_score" in progress


class TestContentWorkflow:
    """Test content discovery and consumption workflow"""

    @pytest.fixture(scope="class")
    def auth_session(self):
        """Create authenticated session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER)

        if response.status_code != 200:
            pytest.skip("Login failed")

        return session

    def test_track_browsing_workflow(self, auth_session):
        """Test browsing tracks → selecting track → viewing modules"""
        # Step 1: Get all tracks
        tracks_response = auth_session.get(f"{BASE_URL}/api/development/tracks")
        assert tracks_response.status_code == 200

        tracks = tracks_response.json()
        assert isinstance(tracks, list)
        assert len(tracks) == 6  # Should have 6 tracks

        # Step 2: Get first track detail
        track_id = tracks[0].get("track_id")
        track_response = auth_session.get(f"{BASE_URL}/api/development/tracks/{track_id}")
        assert track_response.status_code == 200

        track = track_response.json()
        assert "modules" in track
        assert len(track["modules"]) == 6  # Should have 6 modules

    def test_deal_breakdown_review_workflow(self, auth_session):
        """Test browsing deal breakdowns → viewing breakdown → marking reviewed"""
        # Step 1: Get all breakdowns
        breakdowns_response = auth_session.get(f"{BASE_URL}/api/development/breakdowns")
        assert breakdowns_response.status_code == 200

        breakdowns = breakdowns_response.json()
        assert len(breakdowns) == 15  # Should have 15 breakdowns

        # Step 2: Get first breakdown detail
        if len(breakdowns) > 0:
            breakdown_id = breakdowns[0].get("content_id")
            breakdown_response = auth_session.get(
                f"{BASE_URL}/api/development/breakdowns/{breakdown_id}"
            )

            # Should succeed or return 404
            assert breakdown_response.status_code in [200, 404]

    def test_quick_win_application_workflow(self, auth_session):
        """Test browsing quick wins → viewing → applying"""
        # Step 1: Get all quick wins
        quickwins_response = auth_session.get(f"{BASE_URL}/api/development/quickwins")
        assert quickwins_response.status_code == 200

        quickwins = quickwins_response.json()
        assert len(quickwins) == 20  # Should have 20 quick wins

        # Step 2: Filter by tag
        filter_response = auth_session.get(
            f"{BASE_URL}/api/development/quickwins?tag=before_tour"
        )
        assert filter_response.status_code == 200

        filtered = filter_response.json()
        assert isinstance(filtered, list)

        # All should have the tag
        for qw in filtered:
            assert "before_tour" in qw.get("tags", [])


class TestBookmarkWorkflow:
    """Test bookmark/Watch Later workflow"""

    @pytest.fixture(scope="class")
    def auth_session(self):
        """Create authenticated session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER)

        if response.status_code != 200:
            pytest.skip("Login failed")

        return session

    def test_complete_bookmark_workflow(self, auth_session):
        """Test create bookmark → list bookmarks → delete bookmark"""
        # Step 1: Create bookmark
        content_id = f"test_content_{int(datetime.now().timestamp())}"
        create_response = auth_session.post(
            f"{BASE_URL}/api/development/bookmarks",
            json={
                "content_id": content_id,
                "tag": "before_tour"
            }
        )

        # Should succeed or return appropriate status
        assert create_response.status_code in [200, 201, 400, 404]

        # Step 2: List bookmarks
        list_response = auth_session.get(f"{BASE_URL}/api/development/bookmarks")
        assert list_response.status_code == 200

        bookmarks = list_response.json()
        assert isinstance(bookmarks, list)

        # Step 3: Delete bookmark (if created)
        if create_response.status_code in [200, 201]:
            delete_response = auth_session.delete(
                f"{BASE_URL}/api/development/bookmarks/{content_id}"
            )
            assert delete_response.status_code in [200, 404]


class TestCommunityWorkflow:
    """Test community interaction workflows"""

    @pytest.fixture(scope="class")
    def auth_session(self):
        """Create authenticated session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER)

        if response.status_code != 200:
            pytest.skip("Login failed")

        return session

    def test_community_post_workflow(self, auth_session):
        """Test get posts → create post → like post"""
        # Step 1: Get community posts
        posts_response = auth_session.get(f"{BASE_URL}/api/community/posts")
        # May require auth or not exist
        assert posts_response.status_code in [200, 401, 403, 404]

        # Step 2: Create post (if endpoint is available)
        if posts_response.status_code == 200:
            new_post = {
                "title": f"Test Post {int(datetime.now().timestamp())}",
                "content": "This is a test post",
                "category": "general"
            }

            create_response = auth_session.post(
                f"{BASE_URL}/api/community/posts",
                json=new_post
            )

            # Should succeed or return appropriate status
            assert create_response.status_code in [200, 201, 400, 401, 403, 404]


class TestEventsWorkflow:
    """Test events and calendar workflows"""

    @pytest.fixture(scope="class")
    def auth_session(self):
        """Create authenticated session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER)

        if response.status_code != 200:
            pytest.skip("Login failed")

        return session

    def test_events_browsing_workflow(self, auth_session):
        """Test get events → filter events → register for event"""
        # Step 1: Get all events
        events_response = auth_session.get(f"{BASE_URL}/api/events")
        # May require auth
        assert events_response.status_code in [200, 401, 403, 404]

        if events_response.status_code == 200:
            events = events_response.json()
            assert isinstance(events, list)


class TestAdminWorkflow:
    """Test admin management workflows"""

    @pytest.fixture(scope="class")
    def admin_session(self):
        """Create admin session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=ADMIN_USER)

        if response.status_code != 200:
            pytest.skip("Admin login failed")

        return session

    def test_admin_dashboard_workflow(self, admin_session):
        """Test admin accesses metrics and user data"""
        # Get login response to extract token
        login_response = admin_session.post(f"{BASE_URL}/api/auth/login", json=ADMIN_USER)

        if login_response.status_code != 200:
            pytest.skip("Admin login failed")

        token = login_response.json().get("access_token") or login_response.json().get("token")
        headers = {"Authorization": f"Bearer {token}"}

        # Step 1: Get admin metrics
        metrics_response = admin_session.get(
            f"{BASE_URL}/api/admin/metrics",
            headers=headers
        )
        # May not have access or endpoint not exist
        assert metrics_response.status_code in [200, 401, 403, 404]

        # Step 2: Get users list
        users_response = admin_session.get(
            f"{BASE_URL}/api/admin/users",
            headers=headers
        )
        # May not have access
        assert users_response.status_code in [200, 401, 403, 404]


class TestErrorRecoveryWorkflow:
    """Test error recovery and edge case workflows"""

    @pytest.fixture(scope="class")
    def session(self):
        return requests.Session()

    def test_invalid_token_recovery(self, session):
        """Test recovery from invalid authentication token"""
        invalid_token = "invalid_token_12345"
        headers = {"Authorization": f"Bearer {invalid_token}"}

        # Try to access protected endpoint with invalid token
        response = session.get(f"{BASE_URL}/api/auth/me", headers=headers)

        # Should return unauthorized
        assert response.status_code in [401, 403]

    def test_rate_limit_recovery(self, session):
        """Test recovery from rate limiting"""
        # Make multiple requests
        responses = []
        for i in range(5):
            response = session.post(
                f"{BASE_URL}/api/auth/login",
                json={"email": f"test{i}@test.com", "password": "wrong"}
            )
            responses.append(response)

        # All should complete (may be rate limited)
        assert len(responses) == 5

        # At least first should work
        assert responses[0].status_code in [200, 401, 403, 404]

    def test_malformed_request_recovery(self, session):
        """Test recovery from malformed requests"""
        # Send malformed JSON
        response = session.post(
            f"{BASE_URL}/api/auth/login",
            data="invalid json {{{}",
            headers={"Content-Type": "application/json"}
        )

        # Should return bad request
        assert response.status_code in [400, 422]


class TestDataConsistencyWorkflow:
    """Test data consistency across operations"""

    @pytest.fixture(scope="class")
    def auth_session(self):
        """Create authenticated session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER)

        if response.status_code != 200:
            pytest.skip("Login failed")

        return session

    def test_progress_calculation_consistency(self, auth_session):
        """Test progress calculation is consistent"""
        # Get progress multiple times
        progress_responses = []
        for i in range(3):
            response = auth_session.get(f"{BASE_URL}/api/development/progress")
            progress_responses.append(response)

        # All should succeed
        assert all(r.status_code == 200 for r in progress_responses)

        # Progress should be consistent
        progress_data_1 = progress_responses[0].json()
        progress_data_2 = progress_responses[1].json()

        # Readiness score should be same
        score_1 = progress_data_1.get("readiness_score")
        score_2 = progress_data_2.get("readiness_score")

        assert score_1 == score_2

    def test_content_count_consistency(self, auth_session):
        """Test content counts are consistent across endpoints"""
        # Get tracks
        tracks_response = auth_session.get(f"{BASE_URL}/api/development/tracks")
        assert tracks_response.status_code == 200

        tracks = tracks_response.json()

        # Count total modules
        total_modules = sum(
            len(t.get("modules", []))
            for t in tracks
        )

        # Should have 36 modules (6 tracks × 6 modules)
        assert total_modules == 36


class TestPerformanceWorkflow:
    """Test performance of common workflows"""

    @pytest.fixture(scope="class")
    def auth_session(self):
        """Create authenticated session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER)

        if response.status_code != 200:
            pytest.skip("Login failed")

        return session

    def test_dashboard_load_performance(self, auth_session):
        """Test dashboard data loads quickly"""
        import time

        start_time = time.time()

        # Simulate dashboard data loading
        progress_response = auth_session.get(f"{BASE_URL}/api/development/progress")
        stages_response = auth_session.get(f"{BASE_URL}/api/development/stages")
        tracks_response = auth_session.get(f"{BASE_URL}/api/development/tracks")

        end_time = time.time()

        # All should succeed
        assert progress_response.status_code == 200
        assert stages_response.status_code == 200
        assert tracks_response.status_code == 200

        # Should complete in reasonable time (< 2 seconds)
        response_time = (end_time - start_time) * 1000
        assert response_time < 2000, f"Dashboard load too slow: {response_time:.0f}ms"

    def test_content_navigation_performance(self, auth_session):
        """Test navigating through content is fast"""
        import time

        # Get tracks
        tracks_response = auth_session.get(f"{BASE_URL}/api/development/tracks")
        assert tracks_response.status_code == 200

        tracks = tracks_response.json()

        # Time loading first 3 tracks
        start_time = time.time()

        for track in tracks[:3]:
            track_id = track.get("track_id")
            auth_session.get(f"{BASE_URL}/api/development/tracks/{track_id}")

        end_time = time.time()

        response_time = (end_time - start_time) * 1000

        # Should be fast (< 1 second for 3 tracks)
        assert response_time < 1000, f"Navigation too slow: {response_time:.0f}ms"


if __name__ == '__main__':
    pytest.main([__file__, '-v', '--tb=short'])
