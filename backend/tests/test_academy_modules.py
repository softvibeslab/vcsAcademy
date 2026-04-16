"""
VCSA Academy Modules API Tests
Testing Academy Module Management System endpoints:
- Public bootstrap
- Admin bootstrap
- CRUD operations for module items
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_USER = {"email": "admin@vcsa.com", "password": "admin123"}
DEMO_USER = {"email": "demo@vcsa.com", "password": "demo123"}


class TestAcademyModulesPublic:
    """Public endpoint tests"""

    @pytest.fixture(scope="class")
    def session(self):
        return requests.Session()

    def test_public_bootstrap(self, session):
        """Test public bootstrap endpoint"""
        response = session.get(f"{BASE_URL}/api/academy/public/bootstrap")
        assert response.status_code == 200
        data = response.json()

        # Verify response structure
        assert "dashboard" in data
        assert "modules" in data

        # Verify dashboard structure
        dashboard = data["dashboard"]
        assert "repName" in dashboard
        assert "metrics" in dashboard
        assert len(dashboard["metrics"]) > 0

        # Verify modules structure
        modules = data["modules"]
        assert "strategy" in modules
        assert "topProducerPath" in modules
        assert "coaching" in modules
        assert "resources" in modules

        print(f"✅ Public bootstrap: {len(modules)} module categories loaded")


class TestAcademyModulesAdmin:
    """Admin endpoint tests - require authentication"""

    @pytest.fixture(scope="class")
    def admin_session(self):
        """Create authenticated admin session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=ADMIN_USER)
        if response.status_code != 200:
            pytest.skip("Admin login failed")
        return session

    def test_admin_bootstrap(self, admin_session):
        """Test admin bootstrap endpoint"""
        response = admin_session.get(f"{BASE_URL}/api/academy/admin/bootstrap")
        assert response.status_code == 200
        data = response.json()

        # Verify response structure
        assert "dashboard" in data
        assert "modules" in data

        # Admin should see all modules including unpublished
        modules = data["modules"]
        total_items = sum(len(module_list) for module_list in modules.values())
        assert total_items > 0

        print(f"✅ Admin bootstrap: {total_items} total items (including unpublished)")

    def test_create_module_item(self, admin_session):
        """Test creating a new module item"""
        new_item = {
            "title": "Test Module Item",
            "type": "Test",
            "summary": "Test summary for API testing",
            "audience": "rep",
            "owner": "QA Team",
            "status": "draft",
            "cadence": "As needed",
            "format": "Test",
            "tags": ["test", "api"],
            "published": False
        }

        response = admin_session.post(
            f"{BASE_URL}/api/academy/admin/modules/strategy",
            json=new_item
        )

        assert response.status_code == 200 or response.status_code == 201
        data = response.json()

        # Verify created item structure
        assert "id" in data
        assert "title" in data
        assert data["title"] == "Test Module Item"
        assert "module_key" in data
        assert data["module_key"] == "strategy"

        print(f"✅ Created module item: {data['id']}")

        return data["id"]  # Return for cleanup

    def test_update_module_item(self, admin_session):
        """Test updating an existing module item"""
        # First, create an item to update
        new_item = {
            "title": "Item to Update",
            "type": "Test",
            "summary": "Original summary",
            "audience": "rep",
            "owner": "QA Team",
            "status": "draft",
            "cadence": "As needed",
            "format": "Test",
            "tags": ["test"],
            "published": False
        }

        create_response = admin_session.post(
            f"{BASE_URL}/api/academy/admin/modules/coaching",
            json=new_item
        )
        assert create_response.status_code in [200, 201]
        created_item = create_response.json()
        item_id = created_item["id"]

        # Update the item
        update_data = {
            "title": "Updated Title",
            "summary": "Updated summary",
            "status": "live"
        }

        update_response = admin_session.put(
            f"{BASE_URL}/api/academy/admin/modules/coaching/{item_id}",
            json=update_data
        )

        assert update_response.status_code == 200
        updated_item = update_response.json()

        # Verify updates
        assert updated_item["title"] == "Updated Title"
        assert updated_item["summary"] == "Updated summary"
        assert updated_item["status"] == "live"

        print(f"✅ Updated module item: {item_id}")

    def test_delete_module_item(self, admin_session):
        """Test deleting a module item"""
        # First, create an item to delete
        new_item = {
            "title": "Item to Delete",
            "type": "Test",
            "summary": "This will be deleted",
            "audience": "rep",
            "owner": "QA Team",
            "status": "draft",
            "cadence": "As needed",
            "format": "Test",
            "tags": ["test"],
            "published": False
        }

        create_response = admin_session.post(
            f"{BASE_URL}/api/academy/admin/modules/resources",
            json=new_item
        )
        assert create_response.status_code in [200, 201]
        created_item = create_response.json()
        item_id = created_item["id"]

        # Delete the item
        delete_response = admin_session.delete(
            f"{BASE_URL}/api/academy/admin/modules/resources/{item_id}"
        )

        assert delete_response.status_code == 200
        result = delete_response.json()
        assert "success" in result
        assert result["success"] is True

        print(f"✅ Deleted module item: {item_id}")

    def test_invalid_module_key(self, admin_session):
        """Test that invalid module keys return appropriate error"""
        # Try to get a non-existent module (should return 404 or appropriate error)
        response = admin_session.get(f"{BASE_URL}/api/academy/admin/modules/invalid_key")
        # Should be 404 (not found) or 405 (method not allowed for GET on collection)
        assert response.status_code in [404, 405]

    def test_unauthorized_access(self):
        """Test that unauthorized requests are rejected"""
        session = requests.Session()
        response = session.get(f"{BASE_URL}/api/academy/admin/bootstrap")
        # Should redirect or return 401/403
        assert response.status_code in [401, 403, 302, 307]


class TestAcademyModulesData:
    """Data validation tests"""

    @pytest.fixture(scope="class")
    def session(self):
        return requests.Session()

    def test_default_module_categories(self, session):
        """Test that all 4 default module categories exist"""
        response = session.get(f"{BASE_URL}/api/academy/public/bootstrap")
        assert response.status_code == 200
        data = response.json()
        modules = data["modules"]

        # Verify all 4 categories exist
        assert "strategy" in modules
        assert "topProducerPath" in modules
        assert "coaching" in modules
        assert "resources" in modules

        # Each category should have items
        for category_name, category_items in modules.items():
            assert len(category_items) > 0, f"Category {category_name} is empty"
            print(f"✅ Category '{category_name}': {len(category_items)} items")

    def test_module_item_structure(self, session):
        """Test that all module items have required fields"""
        response = session.get(f"{BASE_URL}/api/academy/public/bootstrap")
        assert response.status_code == 200
        data = response.json()
        modules = data["modules"]

        # Check each item has required fields
        required_fields = ["id", "title", "type", "summary", "audience", "owner", "status", "cadence", "format"]

        for category_name, category_items in modules.items():
            for item in category_items:
                for field in required_fields:
                    assert field in item, f"Item {item.get('id')} missing field: {field}"

        print(f"✅ All module items have required fields: {required_fields}")

    def test_published_filtering(self, session):
        """Test that public bootstrap only shows published items"""
        response = session.get(f"{BASE_URL}/api/academy/public/bootstrap")
        assert response.status_code == 200
        data = response.json()
        modules = data["modules"]

        # All items in public bootstrap should be published
        for category_name, category_items in modules.items():
            for item in category_items:
                # Public endpoint should only show published items
                if item.get("published") is not None:
                    assert item["published"] is True, f"Unpublished item in public bootstrap: {item['id']}"

        print("✅ Public bootstrap only shows published items")


if __name__ == "__main__":
    # Run tests
    pytest.main([__file__, "-v", "--tb=short"])
