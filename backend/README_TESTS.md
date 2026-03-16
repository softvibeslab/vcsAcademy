# Backend Test Suite

## Quick Start

```bash
cd backend
pytest -v
```

## Test Files

- `test_phase1_api.py` - Comprehensive Phase 1 API tests (465 lines)

## Coverage Areas

### Authentication
- ✅ API accessibility
- ✅ Demo user login
- ✅ Admin user login

### Phase 1 Development System
- ✅ 6 Training Tracks (6 modules each)
- ✅ 15 Deal Breakdowns
- ✅ 20 Quick Wins
- ✅ Progress tracking
- ✅ Readiness Score calculation
- ✅ Badge system (11 badges)
- ✅ Bookmark functionality
- ✅ 4-Stage progression

## Running Specific Tests

```bash
# All tests
pytest

# With coverage
pytest --cov=. --cov-report=html

# Specific file
pytest tests/test_phase1_api.py

# Specific test class
pytest tests/test_phase1_api.py::TestAuth

# Specific test
pytest tests/test_phase1_api.py::TestAuth::test_demo_user_login

# Verbose output
pytest -v
```

## Requirements

- Python 3.9+
- pytest (installed via requirements.txt)
- requests (installed via requirements.txt)

## Environment

Tests use `REACT_APP_BACKEND_URL` environment variable. Set it before running:

```bash
export REACT_APP_BACKEND_URL=http://localhost:8000
pytest
```

## Test Credentials

- **Demo User**: demo@vcsa.com / demo123
- **Admin**: admin@vcsa.com / admin123

## Writing New Tests

```python
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestNewFeature:
    @pytest.fixture(scope="class")
    def auth_session(self):
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@vcsa.com",
            "password": "demo123"
        })
        if response.status_code != 200:
            pytest.skip("Login failed")
        return session

    def test_new_endpoint(self, auth_session):
        response = auth_session.get(f"{BASE_URL}/api/new-endpoint")
        assert response.status_code == 200
```

---

**Last Updated**: March 16, 2026
**Total Tests**: 40+
**Coverage**: ~40% of backend code
