# Testing Guide

Complete testing guide for VCSA frontend and backend applications.

## 📚 Table of Contents

- [Overview](#overview)
- [Backend Testing (pytest)](#backend-testing-pytest)
- [Frontend Testing (Jest)](#frontend-testing-jest)
- [Integration Testing](#integration-testing)
- [E2E Testing](#e2e-testing)
- [Testing Best Practices](#testing-best-practices)

---

## 🎯 Overview

VCSA uses a comprehensive testing approach:

- **Backend**: pytest with Python
- **Frontend**: Jest + React Testing Library
- **Coverage Target**: 70%+ overall

### Running All Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
yarn test:ci
```

---

## 🧪 Backend Testing (pytest)

### Setup

```bash
cd backend
pip install pytest pytest-asyncio pytest-cov httpx
```

### Test Structure

```
backend/tests/
├── __init__.py
├── conftest.py              # Shared fixtures
├── test_phase1_api.py       # Phase 1 API tests
├── test_auth.py             # Authentication tests
├── test_users.py            # User management tests
└── test_database.py         # Database operation tests
```

### Fixtures (`conftest.py`)

```python
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from motor.motor_asyncio import AsyncIOMotorClient
from server import app

# Test database
TEST_MONGO_URL = "mongodb://localhost:27017"
TEST_DB_NAME = "vcsa_test"

@pytest.fixture
async def test_db():
    """Create test database connection"""
    client = AsyncIOMotorClient(TEST_MONGO_URL)
    db = client[TEST_DB_NAME]

    # Clean up before tests
    await client.drop_database(TEST_DB_NAME)

    yield db

    # Clean up after tests
    await client.drop_database(TEST_DB_NAME)
    client.close()

@pytest_asyncio.fixture
async def test_client(test_db):
    """Create test HTTP client with test database"""
    # Patch app's database connection
    app.state.db = test_db

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as client:
        yield client

@pytest.fixture
def test_user_data():
    """Sample user data for testing"""
    return {
        "email": "test@example.com",
        "password": "test123",
        "name": "Test User"
    }

@pytest_asyncio.fixture
async def authenticated_user(test_client, test_user_data):
    """Create and authenticate a test user"""
    # Register user
    response = await test_client.post("/api/auth/register", json=test_user_data)
    assert response.status_code == 200

    # Login to get token
    login_response = await test_client.post("/api/auth/login", json={
        "email": test_user_data["email"],
        "password": test_user_data["password"]
    })

    token = login_response.json().get("token")
    return {
        "user": response.json()["user"],
        "token": token
    }
```

### API Endpoint Tests

```python
# tests/test_phase1_api.py

import pytest
from httpx import AsyncClient

class TestPhase1API:
    """Test Phase 1 Development System API"""

    async def test_get_stages(self, test_client):
        """Test GET /api/development/stages"""
        response = await test_client.get("/api/development/stages")

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 4
        assert data[0]["id"] == 1
        assert data[0]["name"] == "New Rep"

    async def test_get_tracks(self, test_client):
        """Test GET /api/development/tracks"""
        response = await test_client.get("/api/development/tracks")

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 6
        assert "id" in data[0]
        assert "title" in data[0]
        assert "modules_count" in data[0]

    async def test_get_track_detail(self, test_client):
        """Test GET /api/development/tracks/{id}"""
        response = await test_client.get("/api/development/tracks/1")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == 1
        assert "modules" in data
        assert len(data["modules"]) == 6

    async def test_complete_module_requires_auth(self, test_client):
        """Test that module completion requires authentication"""
        response = await test_client.post("/api/development/modules/module_1_1/complete")

        assert response.status_code == 401

    async def test_complete_module_success(self, test_client, authenticated_user):
        """Test successful module completion"""
        headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

        response = await test_client.post(
            "/api/development/modules/module_1_1/complete",
            headers=headers
        )

        assert response.status_code == 200
        data = response.json()
        assert "points_earned" in data
        assert data["points_earned"] == 10

    async def test_get_progress(self, test_client, authenticated_user):
        """Test GET /api/development/progress"""
        headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

        response = await test_client.get("/api/development/progress", headers=headers)

        assert response.status_code == 200
        data = response.json()
        assert "current_stage" in data
        assert "readiness_score" in data
        assert "points" in data

    async def test_get_badges(self, test_client, authenticated_user):
        """Test GET /api/development/badges"""
        headers = {"Authorization": f"Bearer {authenticated_user['token']}"}

        response = await test_client.get("/api/development/badges", headers=headers)

        assert response.status_code == 200
        data = response.json()
        assert "awarded" in data
        assert "available" in data

    async def test_create_bookmark(self, test_client, authenticated_user):
        """Test POST /api/development/bookmarks"""
        headers = {"Authorization": f"Bearer {authenticated_user['token']}"}
        bookmark_data = {
            "content_id": "module_1_1",
            "content_type": "module",
            "tags": ["before_tour", "objections"],
            "notes": "Review before next tour"
        }

        response = await test_client.post(
            "/api/development/bookmarks",
            headers=headers,
            json=bookmark_data
        )

        assert response.status_code == 201
        data = response.json()
        assert data["content_id"] == "module_1_1"
        assert "before_tour" in data["tags"]
```

### Database Tests

```python
# tests/test_database.py

import pytest
from datetime import datetime

class TestDatabase:
    """Test database operations"""

    async def test_create_user(self, test_db):
        """Test user creation"""
        user_data = {
            "email": "test@example.com",
            "password_hash": "$2b$12$hash",
            "name": "Test User",
            "created_at": datetime.utcnow()
        }

        result = await test_db.users.insert_one(user_data)
        assert result.inserted_id

        # Verify user was created
        user = await test_db.users.find_one({"_id": result.inserted_id})
        assert user["email"] == "test@example.com"

    async def test_user_email_unique(self, test_db):
        """Test that email is unique"""
        user_data = {
            "email": "test@example.com",
            "password_hash": "$2b$12$hash",
            "name": "Test User"
        }

        await test_db.users.insert_one(user_data)

        # Try to insert duplicate email
        with pytest.raises(Exception):  # DuplicateKeyError
            await test_db.users.insert_one(user_data)

    async def test_update_user_progress(self, test_db):
        """Test updating user progress"""
        user_id = "507f1f77bcf86cd799439011"

        progress_data = {
            "user_id": user_id,
            "current_stage": 1,
            "readiness_score": 45,
            "points": 160
        }

        result = await test_db.user_progress.update_one(
            {"user_id": user_id},
            {"$set": progress_data},
            upsert=True
        )

        assert result.modified_count == 1 or result.upserted_id

        # Verify update
        progress = await test_db.user_progress.find_one({"user_id": user_id})
        assert progress["points"] == 160
```

### Running Backend Tests

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_phase1_api.py

# Run specific test
pytest tests/test_phase1_api.py::TestPhase1API::test_get_stages

# Run with coverage
pytest --cov=. --cov-report=html

# Run with verbose output
pytest -v

# Run only failed tests from last run
pytest --lf

# Run tests in parallel (faster)
pytest -n auto
```

---

## ⚛️ Frontend Testing (Jest)

### Setup

```bash
cd frontend
yarn test:ci
```

### Test Structure

```
frontend/src/__tests__/
├── components/
│   ├── AuthContext.test.js
│   └── DashboardLayout.test.js
└── pages/
    ├── DashboardPage.test.js
    └── TopProducerPath.test.js
```

### Component Tests

```javascript
// src/__tests__/components/AuthContext.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Test component
const TestComponent = () => {
  const { user, loading, login } = useAuth();
  return (
    <div>
      {loading && <div>Loading...</div>}
      {user && <div>Welcome, {user.name}</div>}
      {!user && !loading && <div>Please login</div>}
      <button onClick={() => login('test@example.com', 'test123')}>
        Login
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();

    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          user: {
            user_id: '123',
            email: 'test@example.com',
            name: 'Test User'
          }
        })
      })
    );
  });

  test('renders loading state initially', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders user data when authenticated', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Welcome, Test User')).toBeInTheDocument();
    });
  });

  test('calls login API when login button clicked', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    loginButton.click();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/login'),
        expect.any(Object)
      );
    });
  });
});
```

### Page Tests

```javascript
// src/__tests__/pages/DashboardPage.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from '@/pages/DashboardPage';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock API calls
jest.mock('@/services/api', () => ({
  getProgress: () => Promise.resolve({
    current_stage: 2,
    readiness_score: 65,
    points: 350,
    training_streak: 7
  }),
  getStages: () => Promise.resolve([
    { id: 1, name: 'New Rep', points_required: 150 },
    { id: 2, name: 'Developing Rep', points_required: 300 }
  ])
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('DashboardPage', () => {
  test('renders dashboard header', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('displays user progress', async () => {
    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('65%')).toBeInTheDocument(); // readiness score
      expect(screen.getByText('350')).toBeInTheDocument(); // points
    });
  });

  test('displays current stage badge', async () => {
    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Developing Rep')).toBeInTheDocument();
    });
  });
});
```

### Integration Tests

```javascript
// src/__tests__/integration/CompleteModuleFlow.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import TrackDetailPage from '@/pages/TrackDetailPage';
import { AuthProvider } from '@/contexts/AuthContext';

describe('Complete Module Flow', () => {
  test('allows user to complete a module', async () => {
    renderWithProviders(<TrackDetailPage trackId={1} />);

    // Wait for modules to load
    await waitFor(() => {
      expect(screen.getByText('The Elite Sales Mindset')).toBeInTheDocument();
    });

    // Click complete button
    const completeButton = screen.getByText('Mark Complete');
    fireEvent.click(completeButton);

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText('Module completed!')).toBeInTheDocument();
    });

    // Verify points awarded
    await waitFor(() => {
      expect(screen.getByText('+10 points')).toBeInTheDocument();
    });
  });
});
```

### Running Frontend Tests

```bash
# Watch mode (development)
yarn test

# CI mode (run once)
yarn test:ci

# With coverage
yarn test:ci -- --coverage

# Run specific test file
yarn test DashboardPage.test.js

# Run tests matching pattern
yarn test --testNamePattern="should display"
```

---

## 🔄 Integration Testing

### API Integration Tests

```python
# tests/integration/test_end_to_end.py

import pytest
from httpx import AsyncClient

class TestEndToEnd:
    """Test complete user flows"""

    async def test_new_user_journey(self, test_client):
        """Test complete journey from signup to first module completion"""

        # 1. Register
        response = await test_client.post("/api/auth/register", json={
            "email": "newuser@example.com",
            "password": "password123",
            "name": "New User"
        })
        assert response.status_code == 200

        # 2. Login
        login_response = await test_client.post("/api/auth/login", json={
            "email": "newuser@example.com",
            "password": "password123"
        })
        assert login_response.status_code == 200
        token = login_response.json()["token"]

        headers = {"Authorization": f"Bearer {token}"}

        # 3. Get stages
        stages_response = await test_client.get("/api/development/stages", headers=headers)
        assert stages_response.status_code == 200
        assert len(stages_response.json()) == 4

        # 4. Get tracks
        tracks_response = await test_client.get("/api/development/tracks", headers=headers)
        assert tracks_response.status_code == 200

        # 5. Complete first module
        complete_response = await test_client.post(
            "/api/development/modules/module_1_1/complete",
            headers=headers
        )
        assert complete_response.status_code == 200
        assert complete_response.json()["points_earned"] == 10

        # 6. Check progress
        progress_response = await test_client.get("/api/development/progress", headers=headers)
        assert progress_response.status_code == 200
        progress = progress_response.json()
        assert progress["points"] == 10
        assert progress["current_stage"] == 1

        # 7. Check badges
        badges_response = await test_client.get("/api/development/badges", headers=headers)
        assert badges_response.status_code == 200
        badges = badges_response.json()
        assert "first_module" in [b["id"] for b in badges["awarded"]]
```

---

## 🎭 E2E Testing (Playwright)

### Setup

```bash
npm install -D @playwright/test
```

### E2E Tests

```javascript
// e2e/user-journey.spec.js

import { test, expect } from '@playwright/test';

test.describe('New User Journey', () => {
  test('complete sign-up and first module', async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:3000');

    // Click sign up
    await page.click('text=Sign Up');

    // Fill registration form
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'test123');
    await page.fill('[name="name"]', 'Test User');
    await page.click('button[type="submit"]');

    // Wait for dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    await expect(page.locator('text=Welcome')).toBeVisible();

    // Navigate to Top Producer Path
    await page.click('text=Top Producer Path');

    // Click first track
    await page.click('text=Pro Mindset');

    // Complete first module
    await page.click('text=Mark Complete');

    // Verify completion
    await expect(page.locator('text=Module completed')).toBeVisible();
    await expect(page.locator('text=+10 points')).toBeVisible();
  });

  test('bookmark content for later', async ({ page }) => {
    // Login and navigate to content
    await page.goto('http://localhost:3000/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'test123');
    await page.click('button[type="submit"]');

    // Navigate to a module
    await page.click('text=Top Producer Path');
    await page.click('text=Pro Mindset');

    // Click bookmark button
    await page.click('[aria-label="Bookmark"]');

    // Select tags
    await page.click('text=Before Tour');
    await page.click('text=Objections');
    await page.click('text=Save');

    // Verify bookmark
    await page.click('text=Watch Later');
    await expect(page.locator('text=Pro Mindset')).toBeVisible();
  });
});
```

### Running E2E Tests

```bash
# Run all E2E tests
npx playwright test

# Run headed (show browser)
npx playwright test --headed

# Run specific test
npx playwright test user-journey.spec.js
```

---

## 📋 Testing Best Practices

### Backend Testing

1. **Test Isolation**: Each test should be independent
   ```python
   # Good
   @pytest_asyncio.fixture
   async def fresh_db(test_db):
       await test_db.users.delete_many({})
       yield test_db

   # Bad - tests depend on each other
   def test_step_1():
       # Creates data
   def test_step_2():
       # Depends on step_1 data
   ```

2. **Use Fixtures**: Reuse setup code
   ```python
   @pytest.fixture
   def authenticated_client(test_client):
       # Login and return authenticated client
       return client_with_token
   ```

3. **Mock External Services**: Don't call real APIs
   ```python
   # Good
   @patch('requests.post')
   def test_stripe_payment(mock_post):
       mock_post.return_value.status_code = 200

   # Bad - charges real card
   def test_stripe_payment():
       stripe.PaymentIntent.create(amount=1000)
   ```

### Frontend Testing

1. **Test User Behavior**: Test what users see and do
   ```javascript
   // Good
   test('user can complete module', () => {
     fireEvent.click(screen.getByText('Complete'))
     expect(screen.getByText('Success')).toBeInTheDocument()
   })

   // Bad - tests implementation
   test('useState updates', () => {
     // Don't test React internals
   })
   ```

2. **Use waitFor**: For async operations
   ```javascript
   // Good
   await waitFor(() => {
     expect(screen.getByText('Loaded')).toBeInTheDocument()
   })

   // Bad - race condition
   expect(screen.getByText('Loaded')).toBeInTheDocument()
   ```

3. **Mock API Calls**: Don't make real requests
   ```javascript
   // Good
   jest.mock('@/services/api', () => ({
     getProgress: () => ({ points: 100 })
   }))

   // Bad - makes real API call
   test('displays points', () => {
     // Calls real API
   })
   ```

### General Best Practices

1. **Descriptive Test Names**:
   ```python
   # Good
   def test_complete_module_increases_points_by_10():

   # Bad
   def test_points():
   ```

2. **Arrange-Act-Assert Pattern**:
   ```python
   def test_complete_module():
       # Arrange
       user = create_test_user()
       initial_points = user.points

       # Act
       complete_module(user, "module_1_1")

       # Assert
       assert user.points == initial_points + 10
   ```

3. **One Assertion Per Test** (mostly):
   ```python
   # Good
   def test_complete_module_awards_points():
       assert result.points == 10

   def test_complete_module_sets_completion_date():
       assert result.completed_at is not None

   # Acceptable for closely related checks
   def test_complete_module_updates_progress():
       assert result.points == 10
       assert result.completed_at is not None
   ```

---

## 📊 Coverage Reports

### Backend Coverage

```bash
pytest --cov=. --cov-report=html

# View report
open htmlcov/index.html
```

### Frontend Coverage

```bash
yarn test:ci -- --coverage

# View report
open coverage/lcov-report/index.html
```

### Coverage Targets

| Component | Target | Current |
|-----------|--------|---------|
| Backend API | 70% | ~40% |
| Frontend Components | 70% | ~5% |
| Overall | 70% | ~25% |

---

## 📚 Related Documentation

- [Frontend Development](Frontend.md)
- [Backend Development](Backend.md)
- [API Documentation](../api/Development.md)
