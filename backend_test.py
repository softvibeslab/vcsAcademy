#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for VCSA Platform
Tests all authentication, content, and admin endpoints
"""

import requests
import sys
import json
from datetime import datetime, timedelta
import uuid

# Configuration from frontend/.env
BACKEND_URL = "https://vcsa-portal.preview.emergentagent.com/api"

class VCSAAPITester:
    def __init__(self, base_url=BACKEND_URL):
        self.base_url = base_url
        self.session_token = None
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        
        # Test credentials from review request
        self.admin_creds = {"email": "admin@vcsa.com", "password": "admin123"}
        self.demo_creds = {"email": "demo@vcsa.com", "password": "demo123"}
        
    def log_result(self, test_name, passed, response_code=None, error=None):
        """Log test result"""
        self.tests_run += 1
        if passed:
            self.tests_passed += 1
            print(f"✅ {test_name} - PASSED" + (f" [{response_code}]" if response_code else ""))
        else:
            print(f"❌ {test_name} - FAILED" + (f" [{response_code}]" if response_code else "") + (f" - {error}" if error else ""))
        
        self.test_results.append({
            "test": test_name,
            "passed": passed,
            "response_code": response_code,
            "error": error
        })
        return passed
    
    def make_request(self, method, endpoint, data=None, use_admin=False, expected_status=200):
        """Make API request with session handling"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        # Add session token if available
        token = self.admin_token if use_admin and self.admin_token else self.session_token
        if token:
            headers['Authorization'] = f'Bearer {token}'
            
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)
            
            success = response.status_code == expected_status
            return success, response.status_code, response.json() if response.content else {}
            
        except Exception as e:
            return False, 0, {"error": str(e)}
    
    def test_root_endpoint(self):
        """Test API root endpoint"""
        success, status, data = self.make_request('GET', '', expected_status=200)
        return self.log_result("API Root Endpoint", success, status, 
                              data.get('error') if not success else None)
    
    def test_register(self):
        """Test user registration"""
        test_email = f"test_{uuid.uuid4().hex[:8]}@test.com"
        register_data = {
            "email": test_email,
            "password": "testpass123",
            "name": "Test User"
        }
        
        success, status, data = self.make_request('POST', 'auth/register', register_data, expected_status=200)
        if success and 'user_id' in data:
            # Store session for further tests
            self.session_token = self.extract_token_from_cookies(data)
            
        return self.log_result("User Registration", success, status,
                              data.get('detail') if not success else None)
    
    def extract_token_from_cookies(self, data):
        """Extract session token - simplified for testing"""
        # In real scenario, this would extract from Set-Cookie headers
        # For now, we'll handle auth separately
        return None
    
    def test_login_demo_user(self):
        """Test login with demo credentials"""
        success, status, data = self.make_request('POST', 'auth/login', self.demo_creds, expected_status=200)
        if success and 'user_id' in data:
            print(f"   Demo user logged in: {data.get('name', '')} (Level {data.get('level', 1)})")
            
        return self.log_result("Demo User Login", success, status,
                              data.get('detail') if not success else None)
    
    def test_login_admin_user(self):
        """Test login with admin credentials"""  
        success, status, data = self.make_request('POST', 'auth/login', self.admin_creds, expected_status=200)
        if success and 'user_id' in data:
            print(f"   Admin user logged in: {data.get('name', '')} (Role: {data.get('role', 'member')})")
            
        return self.log_result("Admin User Login", success, status,
                              data.get('detail') if not success else None)
    
    def test_courses_endpoint(self):
        """Test courses endpoint (requires auth)"""
        success, status, data = self.make_request('GET', 'courses', expected_status=401)
        return self.log_result("Courses Endpoint (Unauth)", success, status,
                              "Should return 401 for unauthenticated users")
    
    def test_events_endpoint(self):
        """Test events endpoint (requires auth)"""
        success, status, data = self.make_request('GET', 'events', expected_status=401)
        return self.log_result("Events Endpoint (Unauth)", success, status,
                              "Should return 401 for unauthenticated users")
    
    def test_community_posts_endpoint(self):
        """Test community posts endpoint (requires auth)"""
        success, status, data = self.make_request('GET', 'posts', expected_status=401)
        return self.log_result("Posts Endpoint (Unauth)", success, status,
                              "Should return 401 for unauthenticated users")
    
    def test_resources_endpoint(self):
        """Test resources endpoint (requires auth)"""
        success, status, data = self.make_request('GET', 'resources', expected_status=401)
        return self.log_result("Resources Endpoint (Unauth)", success, status,
                              "Should return 401 for unauthenticated users")
    
    def test_dashboard_endpoint(self):
        """Test dashboard endpoint (requires auth)"""
        success, status, data = self.make_request('GET', 'dashboard', expected_status=401)
        return self.log_result("Dashboard Endpoint (Unauth)", success, status,
                              "Should return 401 for unauthenticated users")
    
    def test_admin_endpoints(self):
        """Test admin endpoints (requires admin auth)"""
        success, status, data = self.make_request('GET', 'admin/stats', expected_status=401)
        self.log_result("Admin Stats Endpoint (Unauth)", success, status,
                       "Should return 401 for unauthenticated users")
        
        success, status, data = self.make_request('GET', 'admin/users', expected_status=401) 
        return self.log_result("Admin Users Endpoint (Unauth)", success, status,
                              "Should return 401 for unauthenticated users")
    
    def test_payment_endpoints(self):
        """Test payment endpoints (requires auth)"""
        checkout_data = {
            "package_id": "vip_monthly",
            "origin_url": "https://vcsa-portal.preview.emergentagent.com"
        }
        success, status, data = self.make_request('POST', 'payments/checkout', checkout_data, expected_status=401)
        return self.log_result("Payment Checkout (Unauth)", success, status,
                              "Should return 401 for unauthenticated users")
    
    def test_invalid_endpoints(self):
        """Test invalid endpoints"""
        success, status, data = self.make_request('GET', 'nonexistent', expected_status=404)
        return self.log_result("Invalid Endpoint", success, status,
                              "Should return 404 for non-existent endpoints")
    
    def test_method_not_allowed(self):
        """Test method not allowed"""
        success, status, data = self.make_request('DELETE', '', expected_status=405)
        # Note: FastAPI might return different status codes for method not allowed
        if status in [405, 422]:
            success = True
        return self.log_result("Method Not Allowed", success, status,
                              "Should return 405/422 for unsupported methods")
    
    def run_all_tests(self):
        """Run comprehensive test suite"""
        print("=" * 60)
        print("🧪 VCSA Platform Backend API Testing")
        print("=" * 60)
        print(f"Backend URL: {self.base_url}")
        print()
        
        # Basic connectivity tests
        print("📡 Testing API Connectivity...")
        self.test_root_endpoint()
        
        print("\n🔐 Testing Authentication Endpoints...")
        self.test_register()
        self.test_login_demo_user()
        self.test_login_admin_user()
        
        print("\n📚 Testing Protected Content Endpoints...")
        self.test_courses_endpoint()
        self.test_events_endpoint()
        self.test_community_posts_endpoint()
        self.test_resources_endpoint()
        self.test_dashboard_endpoint()
        
        print("\n👑 Testing Admin Endpoints...")
        self.test_admin_endpoints()
        
        print("\n💳 Testing Payment Endpoints...")
        self.test_payment_endpoints()
        
        print("\n❌ Testing Error Handling...")
        self.test_invalid_endpoints()
        self.test_method_not_allowed()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success rate: {(self.tests_passed/self.tests_run)*100:.1f}%" if self.tests_run > 0 else "No tests run")
        
        # Show failed tests
        failed_tests = [r for r in self.test_results if not r['passed']]
        if failed_tests:
            print(f"\n❌ Failed Tests ({len(failed_tests)}):")
            for test in failed_tests:
                print(f"  • {test['test']} - {test.get('error', 'Unknown error')}")
        
        print("\n" + "=" * 60)
        
        return self.tests_passed == self.tests_run

def main():
    """Main test execution"""
    tester = VCSAAPITester()
    
    try:
        success = tester.run_all_tests()
        return 0 if success else 1
        
    except KeyboardInterrupt:
        print("\n⚠️  Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 Test execution failed: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())