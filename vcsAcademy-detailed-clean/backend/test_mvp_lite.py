"""
MVP Lite API Testing Script
Tests all endpoints and verifies functionality
"""
import asyncio
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"
DEMO_USER = {
    "email": "demo@vcsa.com",
    "password": "demo123"
}

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_success(msg):
    print(f"{Colors.GREEN}✓{Colors.END} {msg}")

def print_error(msg):
    print(f"{Colors.RED}✗{Colors.END} {msg}")

def print_info(msg):
    print(f"{Colors.BLUE}ℹ{Colors.END} {msg}")

def print_warning(msg):
    print(f"{Colors.YELLOW}⚠{Colors.END} {msg}")

def print_header(msg):
    print(f"\n{Colors.BOLD}{msg}{Colors.END}")
    print("=" * 60)

class MVPAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.token = None
        self.passed = 0
        self.failed = 0
        self.tests = []

    def test_endpoint(self, name, method, endpoint, data=None, headers=None):
        """Test a single endpoint"""
        try:
            url = f"{self.base_url}{endpoint}"

            if method == "GET":
                response = requests.get(url, headers=headers)
            elif method == "POST":
                response = requests.post(url, json=data, headers=headers)
            elif method == "PUT":
                response = requests.put(url, json=data, headers=headers)

            # Check if response is successful
            if response.status_code in [200, 201]:
                print_success(f"{name}: {response.status_code}")
                self.passed += 1
                return True, response.json()
            else:
                print_error(f"{name}: {response.status_code} - {response.text[:100]}")
                self.failed += 1
                return False, None

        except requests.exceptions.ConnectionError:
            print_error(f"{name}: Connection refused - Backend not running")
            self.failed += 1
            return False, None
        except Exception as e:
            print_error(f"{name}: {str(e)}")
            self.failed += 1
            return False, None

    def test_health_check(self):
        """Test health check endpoint"""
        print_header("Testing Health Check")
        success, data = self.test_endpoint(
            "Health Check",
            "GET",
            "/api/health"
        )
        if success:
            print_info(f"Status: {data.get('status')}")
            print_info(f"MongoDB: {data['services'].get('mongodb')}")

    def test_authentication(self):
        """Test authentication endpoints"""
        print_header("Testing Authentication")

        # Test login
        success, data = self.test_endpoint(
            "Login",
            "POST",
            "/api/auth/login",
            DEMO_USER
        )

        if success and data:
            self.token = data.get("access_token")
            print_success(f"Token received: {self.token[:20]}...")
        else:
            print_warning("Could not get token - some tests will be skipped")
            return False

        return True

    def test_dashboard_endpoints(self):
        """Test dashboard endpoints"""
        if not self.token:
            print_warning("Skipping dashboard tests - no authentication token")
            return

        print_header("Testing Dashboard Endpoints")

        headers = {"Authorization": f"Bearer {self.token}"}

        # Test Strategy endpoint
        success, data = self.test_endpoint(
            "Strategy Panel",
            "GET",
            "/api/dashboard/strategy",
            headers=headers
        )
        if success and data:
            print_info(f"Monthly Objective: ${data['monthly_objective']['current_income']}")

        # Test Performance endpoint
        success, data = self.test_endpoint(
            "Daily Performance",
            "GET",
            "/api/dashboard/performance",
            headers=headers
        )
        if success and data:
            print_info(f"Tours Completed: {data['tours_completed']}")

        # Test Log Tour endpoint
        tour_data = {
            "time": "10:00 AM",
            "outcome": "Sale",
            "volume": 5000.0,
            "duration": 45
        }
        self.test_endpoint(
            "Log Tour",
            "POST",
            "/api/dashboard/performance/tour",
            tour_data,
            headers=headers
        )

    def test_training_endpoints(self):
        """Test training endpoints"""
        if not self.token:
            print_warning("Skipping training tests - no authentication token")
            return

        print_header("Testing Training Endpoints")

        headers = {"Authorization": f"Bearer {self.token}"}

        # Test Get Session Detail
        success, data = self.test_endpoint(
            "Session Detail",
            "GET",
            "/api/dashboard/training/session/session-1",
            headers=headers
        )
        if success and data:
            print_info(f"Session: {data['title']}")
            print_info(f"Category: {data['category']}")

        # Test Mark Complete
        self.test_endpoint(
            "Mark Session Complete",
            "POST",
            "/api/dashboard/training/session/session-1/complete",
            headers=headers
        )

    def test_coaching_endpoints(self):
        """Test coaching endpoints"""
        if not self.token:
            print_warning("Skipping coaching tests - no authentication token")
            return

        print_header("Testing Coaching Endpoints")

        headers = {"Authorization": f"Bearer {self.token}"}

        # Test Get Events
        success, data = self.test_endpoint(
            "Coaching Events",
            "GET",
            "/api/dashboard/coaching/events",
            headers=headers
        )
        if success and data:
            print_info(f"Events: {len(data)} events")

        # Test Group Coaching
        success, data = self.test_endpoint(
            "Group Coaching",
            "GET",
            "/api/dashboard/coaching/group",
            headers=headers
        )
        if success and data:
            print_info(f"Group Sessions: {len(data)} sessions")

        # Test Role Play
        self.test_endpoint(
            "Role Play Sessions",
            "GET",
            "/api/dashboard/coaching/roleplay",
            headers=headers
        )

        # Test Q&A
        self.test_endpoint(
            "Q&A Sessions",
            "GET",
            "/api/dashboard/coaching/qa",
            headers=headers
        )

        # Test Register for Event
        self.test_endpoint(
            "Register for Event",
            "POST",
            "/api/dashboard/coaching/events/1/register",
            headers=headers
        )

        # Test Submit Question
        question_data = {"question": "How do I handle price objections?"}
        self.test_endpoint(
            "Submit Q&A Question",
            "POST",
            "/api/dashboard/coaching/qa/question",
            question_data,
            headers=headers
        )

    def test_resources_endpoints(self):
        """Test resources endpoints"""
        if not self.token:
            print_warning("Skipping resources tests - no authentication token")
            return

        print_header("Testing Resources Endpoints")

        headers = {"Authorization": f"Bearer {self.token}"}

        # Test Get Resources
        success, data = self.test_endpoint(
            "Get Resources",
            "GET",
            "/api/resources",
            headers=headers
        )
        if success and data:
            print_info(f"Resources: {len(data)} resources")

    def run_all_tests(self):
        """Run all API tests"""
        print(f"\n{Colors.BOLD}{'='*60}")
        print(f"VCSA MVP Lite - API Testing Suite")
        print(f"{'='*60}{Colors.END}")
        print(f"Base URL: {self.base_url}")
        print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print()

        # Health check
        self.test_health_check()

        # Authentication
        if self.test_authentication():
            # Dashboard
            self.test_dashboard_endpoints()

            # Training
            self.test_training_endpoints()

            # Coaching
            self.test_coaching_endpoints()

            # Resources
            self.test_resources_endpoints()

        # Print summary
        self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print_header("Test Summary")
        total = self.passed + self.failed
        pass_rate = (self.passed / total * 100) if total > 0 else 0

        print(f"Total Tests: {total}")
        print(f"{Colors.GREEN}Passed: {self.passed}{Colors.END}")
        print(f"{Colors.RED}Failed: {self.failed}{Colors.END}")
        print(f"Pass Rate: {pass_rate:.1f}%")
        print()

        if self.failed == 0:
            print(f"{Colors.GREEN}{Colors.BOLD}🎉 All tests passed!{Colors.END}")
        else:
            print(f"{Colors.YELLOW}{self.failed} test(s) failed - check logs above{Colors.END}")

        print()
        print(f"Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

def main():
    """Main entry point"""
    tester = MVPAPITester()
    tester.run_all_tests()

if __name__ == "__main__":
    main()
