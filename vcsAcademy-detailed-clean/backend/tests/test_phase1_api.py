"""
VCSA Phase 1 API Tests
Testing Top Producer Development System APIs:
- Tracks (6 modules per track)
- Deal Breakdowns (15 total)
- Quick Wins (20 total)
- Progress, Badges, Bookmarks
- Mark Complete functionality
- Readiness Score calculation
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
DEMO_USER = {"email": "demo@vcsa.com", "password": "demo123"}
ADMIN_USER = {"email": "admin@vcsa.com", "password": "admin123"}


class TestAuth:
    """Authentication tests"""
    
    @pytest.fixture(scope="class")
    def session(self):
        return requests.Session()
    
    def test_api_root(self, session):
        """Test API is accessible"""
        response = session.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"API root response: {data}")
    
    def test_demo_user_login(self, session):
        """Test demo user can login"""
        response = session.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER)
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == DEMO_USER["email"]
        assert "user_id" in data
        print(f"Demo user logged in: {data['email']}")


class TestPhase1Tracks:
    """Track API tests - verify 6 modules per track"""
    
    @pytest.fixture(scope="class")
    def auth_session(self):
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER)
        if response.status_code != 200:
            pytest.skip("Login failed")
        return session
    
    def test_get_all_tracks(self, auth_session):
        """Verify 6 tracks exist"""
        response = auth_session.get(f"{BASE_URL}/api/development/tracks")
        assert response.status_code == 200
        tracks = response.json()
        assert len(tracks) == 6, f"Expected 6 tracks, got {len(tracks)}"
        
        track_names = [t["name"] for t in tracks]
        print(f"Tracks found: {track_names}")
    
    def test_track_1_has_6_modules(self, auth_session):
        """Track 1 should have exactly 6 modules"""
        response = auth_session.get(f"{BASE_URL}/api/development/tracks/track_1")
        assert response.status_code == 200
        track = response.json()
        
        assert track["name"] == "Pro Mindset"
        assert "modules" in track
        assert len(track["modules"]) == 6, f"Track 1 should have 6 modules, got {len(track['modules'])}"
        
        # Verify module numbers are 1.1 through 1.6
        module_numbers = [m["module_number"] for m in track["modules"]]
        expected = ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6"]
        assert module_numbers == expected, f"Module numbers mismatch: {module_numbers}"
        print(f"Track 1 modules verified: {module_numbers}")
    
    def test_track_2_has_6_modules(self, auth_session):
        """Track 2 should have exactly 6 modules"""
        response = auth_session.get(f"{BASE_URL}/api/development/tracks/track_2")
        assert response.status_code == 200
        track = response.json()
        
        assert track["name"] == "Discovery & Control"
        assert len(track["modules"]) == 6
        print(f"Track 2 '{track['name']}' has {len(track['modules'])} modules")
    
    def test_all_tracks_have_6_modules(self, auth_session):
        """All 6 tracks should have exactly 6 modules each"""
        response = auth_session.get(f"{BASE_URL}/api/development/tracks")
        tracks = response.json()
        
        for track in tracks:
            track_detail = auth_session.get(f"{BASE_URL}/api/development/tracks/{track['track_id']}").json()
            module_count = len(track_detail.get("modules", []))
            assert module_count == 6, f"Track {track['name']} should have 6 modules, got {module_count}"
            print(f"Track {track['track_number']} '{track['name']}': {module_count} modules - OK")
    
    def test_track_1_module_has_video_url(self, auth_session):
        """First module should have real YouTube video URL"""
        response = auth_session.get(f"{BASE_URL}/api/development/tracks/track_1")
        track = response.json()
        
        first_module = track["modules"][0]
        assert first_module["content_id"] == "mod_1_1"
        assert first_module["video_url"] == "https://youtu.be/wDjfOy5aks8"
        assert first_module["key_move"] is not None
        print(f"Module 1.1 video URL: {first_module['video_url']}")
    
    def test_modules_have_key_move(self, auth_session):
        """All modules should have a key_move field"""
        response = auth_session.get(f"{BASE_URL}/api/development/tracks/track_1")
        track = response.json()
        
        for module in track["modules"]:
            assert "key_move" in module, f"Module {module['content_id']} missing key_move"
            assert module["key_move"] is not None, f"Module {module['content_id']} has null key_move"
            print(f"Module {module['module_number']} key_move: {module['key_move'][:50]}...")


class TestDealBreakdowns:
    """Deal Breakdowns API tests - verify 15 breakdowns with tags and search"""
    
    @pytest.fixture(scope="class")
    def auth_session(self):
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER)
        if response.status_code != 200:
            pytest.skip("Login failed")
        return session
    
    def test_get_all_breakdowns(self, auth_session):
        """Verify 15 deal breakdowns exist"""
        response = auth_session.get(f"{BASE_URL}/api/development/breakdowns")
        assert response.status_code == 200
        breakdowns = response.json()
        
        assert len(breakdowns) == 15, f"Expected 15 deal breakdowns, got {len(breakdowns)}"
        print(f"Deal breakdowns count: {len(breakdowns)}")
    
    def test_breakdowns_have_required_fields(self, auth_session):
        """Each breakdown should have required fields"""
        response = auth_session.get(f"{BASE_URL}/api/development/breakdowns")
        breakdowns = response.json()
        
        required_fields = ["content_id", "title", "description", "tags", "scenario", 
                         "what_happened", "control_analysis", "better_move", "key_move"]
        
        for breakdown in breakdowns[:3]:  # Test first 3
            for field in required_fields:
                assert field in breakdown, f"Breakdown {breakdown['content_id']} missing {field}"
        print("Breakdown structure verified")
    
    def test_breakdowns_have_tags(self, auth_session):
        """Breakdowns should have tags for filtering"""
        response = auth_session.get(f"{BASE_URL}/api/development/breakdowns")
        breakdowns = response.json()
        
        all_tags = set()
        for breakdown in breakdowns:
            assert "tags" in breakdown
            assert isinstance(breakdown["tags"], list)
            all_tags.update(breakdown["tags"])
        
        print(f"Breakdown tags found: {all_tags}")
        assert len(all_tags) > 3, "Expected multiple different tags"
    
    def test_get_single_breakdown(self, auth_session):
        """Get single breakdown by ID"""
        response = auth_session.get(f"{BASE_URL}/api/development/breakdowns/breakdown_1")
        assert response.status_code == 200
        breakdown = response.json()
        
        assert breakdown["content_id"] == "breakdown_1"
        assert "title" in breakdown
        print(f"Breakdown 1: {breakdown['title']}")


class TestQuickWins:
    """Quick Wins API tests - verify 20 quick wins with tags and filtering"""
    
    @pytest.fixture(scope="class")
    def auth_session(self):
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER)
        if response.status_code != 200:
            pytest.skip("Login failed")
        return session
    
    def test_get_all_quickwins(self, auth_session):
        """Verify 20 quick wins exist"""
        response = auth_session.get(f"{BASE_URL}/api/development/quickwins")
        assert response.status_code == 200
        quickwins = response.json()
        
        assert len(quickwins) == 20, f"Expected 20 quick wins, got {len(quickwins)}"
        print(f"Quick wins count: {len(quickwins)}")
    
    def test_quickwins_have_required_fields(self, auth_session):
        """Each quick win should have required fields"""
        response = auth_session.get(f"{BASE_URL}/api/development/quickwins")
        quickwins = response.json()
        
        required_fields = ["content_id", "title", "description", "tags", 
                         "situation", "the_move", "example", "key_move"]
        
        for qw in quickwins[:3]:  # Test first 3
            for field in required_fields:
                assert field in qw, f"Quick win {qw['content_id']} missing {field}"
        print("Quick win structure verified")
    
    def test_quickwins_have_tags(self, auth_session):
        """Quick wins should have tags for filtering"""
        response = auth_session.get(f"{BASE_URL}/api/development/quickwins")
        quickwins = response.json()
        
        all_tags = set()
        for qw in quickwins:
            assert "tags" in qw
            assert isinstance(qw["tags"], list)
            all_tags.update(qw["tags"])
        
        print(f"Quick win tags found: {all_tags}")
        assert len(all_tags) > 3, "Expected multiple different tags"
    
    def test_quickwins_filter_by_tag(self, auth_session):
        """Filter quick wins by tag"""
        response = auth_session.get(f"{BASE_URL}/api/development/quickwins?tag=before_tour")
        assert response.status_code == 200
        quickwins = response.json()
        
        for qw in quickwins:
            assert "before_tour" in qw["tags"], f"Quick win {qw['content_id']} doesn't have before_tour tag"
        print(f"Found {len(quickwins)} quick wins with 'before_tour' tag")
    
    def test_get_single_quickwin(self, auth_session):
        """Get single quick win by ID"""
        response = auth_session.get(f"{BASE_URL}/api/development/quickwins/qw_1")
        assert response.status_code == 200
        qw = response.json()
        
        assert qw["content_id"] == "qw_1"
        assert "title" in qw
        print(f"Quick Win 1: {qw['title']}")


class TestProgressAndCompletion:
    """Progress tracking, Mark Complete, and Streak tests"""
    
    @pytest.fixture(scope="class")
    def auth_session(self):
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER)
        if response.status_code != 200:
            pytest.skip("Login failed")
        return session
    
    def test_get_progress(self, auth_session):
        """Get user progress"""
        response = auth_session.get(f"{BASE_URL}/api/development/progress")
        assert response.status_code == 200
        progress_data = response.json()
        
        assert "progress" in progress_data
        assert "readiness_score" in progress_data
        assert "stats" in progress_data
        
        stats = progress_data["stats"]
        assert "modules_completed" in stats
        assert "total_modules" in stats
        assert "breakdowns_reviewed" in stats
        assert "total_breakdowns" in stats
        assert "quickwins_applied" in stats
        assert "total_quickwins" in stats
        assert "training_streak" in stats
        
        print(f"Readiness Score: {progress_data['readiness_score']}")
        print(f"Stats: {stats}")
    
    def test_progress_has_tracks_progress(self, auth_session):
        """Progress should track each track separately"""
        response = auth_session.get(f"{BASE_URL}/api/development/progress")
        progress_data = response.json()
        
        progress = progress_data["progress"]
        assert "tracks_progress" in progress
        tracks = progress["tracks_progress"]
        
        # Should have all 6 tracks
        expected_tracks = ["track_1", "track_2", "track_3", "track_4", "track_5", "track_6"]
        for track_id in expected_tracks:
            assert track_id in tracks, f"Missing track {track_id} in progress"
        print(f"Track progress: {tracks}")
    
    def test_mark_module_complete(self, auth_session):
        """Mark a module as complete and verify streak/points"""
        # Use a test module
        content_id = "mod_1_1"
        response = auth_session.post(f"{BASE_URL}/api/development/content/{content_id}/complete")
        assert response.status_code == 200
        
        result = response.json()
        assert "success" in result
        assert "points_earned" in result
        assert "streak" in result
        
        print(f"Module completed: points={result['points_earned']}, streak={result['streak']}")
    
    def test_mark_breakdown_reviewed(self, auth_session):
        """Mark a breakdown as reviewed via legacy endpoint"""
        response = auth_session.post(f"{BASE_URL}/api/development/breakdowns/breakdown_1/review")
        assert response.status_code == 200
        
        result = response.json()
        assert "success" in result or result.get("success") == True
        print(f"Breakdown reviewed: {result}")
    
    def test_mark_quickwin_applied(self, auth_session):
        """Mark a quick win as applied via legacy endpoint"""
        response = auth_session.post(f"{BASE_URL}/api/development/quickwins/qw_1/apply")
        assert response.status_code == 200
        
        result = response.json()
        assert "success" in result or result.get("success") == True
        print(f"Quick win applied: {result}")
    
    def test_readiness_score_calculation(self, auth_session):
        """Verify readiness score is calculated and in valid range"""
        response = auth_session.get(f"{BASE_URL}/api/development/progress")
        progress_data = response.json()
        
        readiness = progress_data["readiness_score"]
        assert isinstance(readiness, int), f"Readiness should be int, got {type(readiness)}"
        assert 0 <= readiness <= 100, f"Readiness should be 0-100, got {readiness}"
        
        print(f"Readiness score: {readiness}%")


class TestBadges:
    """Badge system tests"""
    
    @pytest.fixture(scope="class")
    def auth_session(self):
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER)
        if response.status_code != 200:
            pytest.skip("Login failed")
        return session
    
    def test_get_all_badges(self, auth_session):
        """Get all badge definitions"""
        response = auth_session.get(f"{BASE_URL}/api/development/badges")
        assert response.status_code == 200
        badges = response.json()
        
        assert len(badges) == 11, f"Expected 11 badges, got {len(badges)}"
        
        badge_names = [b["name"] for b in badges]
        print(f"Badges: {badge_names}")
    
    def test_badges_have_criteria(self, auth_session):
        """Each badge should have criteria for earning"""
        response = auth_session.get(f"{BASE_URL}/api/development/badges")
        badges = response.json()
        
        required_fields = ["badge_id", "name", "description", "criteria", 
                         "criteria_type", "criteria_value", "icon"]
        
        for badge in badges:
            for field in required_fields:
                assert field in badge, f"Badge {badge.get('badge_id', 'unknown')} missing {field}"
        print("Badge structure verified")
    
    def test_badge_criteria_types(self, auth_session):
        """Verify different badge criteria types exist"""
        response = auth_session.get(f"{BASE_URL}/api/development/badges")
        badges = response.json()
        
        criteria_types = set(b["criteria_type"] for b in badges)
        expected_types = {"track_complete", "content_count", "streak", "score_threshold", "stage"}
        
        assert criteria_types == expected_types, f"Expected {expected_types}, got {criteria_types}"
        print(f"Badge criteria types: {criteria_types}")


class TestBookmarks:
    """Bookmark/Watch Later functionality tests"""
    
    @pytest.fixture(scope="class")
    def auth_session(self):
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER)
        if response.status_code != 200:
            pytest.skip("Login failed")
        return session
    
    def test_create_bookmark(self, auth_session):
        """Create a bookmark"""
        response = auth_session.post(
            f"{BASE_URL}/api/development/bookmarks",
            json={"content_id": "mod_1_2", "tag": "before_tour"}
        )
        assert response.status_code == 200
        result = response.json()
        assert result.get("success") == True
        print(f"Bookmark created: {result}")
    
    def test_get_bookmarks(self, auth_session):
        """Get user bookmarks"""
        response = auth_session.get(f"{BASE_URL}/api/development/bookmarks")
        assert response.status_code == 200
        bookmarks = response.json()
        
        assert isinstance(bookmarks, list)
        print(f"User has {len(bookmarks)} bookmarks")
    
    def test_delete_bookmark(self, auth_session):
        """Delete a bookmark"""
        # First create one to delete
        auth_session.post(
            f"{BASE_URL}/api/development/bookmarks",
            json={"content_id": "mod_1_3", "tag": "general"}
        )
        
        # Then delete it
        response = auth_session.delete(f"{BASE_URL}/api/development/bookmarks/mod_1_3")
        assert response.status_code == 200
        print("Bookmark deleted successfully")


class TestStages:
    """Stage system tests"""
    
    @pytest.fixture(scope="class")
    def auth_session(self):
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=DEMO_USER)
        if response.status_code != 200:
            pytest.skip("Login failed")
        return session
    
    def test_get_all_stages(self, auth_session):
        """Get all stage definitions"""
        response = auth_session.get(f"{BASE_URL}/api/development/stages")
        assert response.status_code == 200
        stages = response.json()
        
        assert len(stages) == 4, f"Expected 4 stages, got {len(stages)}"
        
        stage_titles = [s["title"] for s in stages]
        expected = ["New Rep", "Developing Rep", "Performing Rep", "Consistent Top Producer"]
        assert stage_titles == expected, f"Stage titles mismatch: {stage_titles}"
        print(f"Stages: {stage_titles}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
