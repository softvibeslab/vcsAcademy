# VCSA Testing Guide

## Overview

This document covers the testing infrastructure for the VCSA platform, including both backend (Python/pytest) and frontend (React/Jest) testing.

## Backend Testing (FastAPI)

### Setup

Backend uses **pytest** for testing. Dependencies are already installed in `requirements.txt`.

```bash
cd backend
pip install -r requirements.txt
```

### Running Tests

```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_phase1_api.py

# Run specific test class
pytest tests/test_phase1_api.py::TestAuth

# Run specific test
pytest tests/test_phase1_api.py::TestAuth::test_demo_user_login

# Run with coverage
pytest --cov=. --cov-report=html
```

### Test Structure

```
backend/
├── tests/
│   └── test_phase1_api.py    # Phase 1 API tests
└── pytest.ini                # Pytest configuration (if needed)
```

### Current Test Coverage

**Backend Tests**: `test_phase1_api.py` (465 lines)

Covers:
- ✅ Authentication (login, API access)
- ✅ Phase 1 Tracks (6 tracks × 6 modules)
- ✅ Deal Breakdowns (15 scenarios)
- ✅ Quick Wins (20 tactics)
- ✅ Progress tracking and Readiness Score
- ✅ Badge system (11 badges)
- ✅ Bookmarks/Watch Later
- ✅ Stages (4-stage progression)

### Writing New Backend Tests

```python
# tests/test_new_feature.py
import pytest
import requests

BASE_URL = "http://localhost:8000"

class TestNewFeature:
    @pytest.fixture(scope="class")
    def auth_session(self):
        """Create authenticated session for tests"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": "demo@vcsa.com",
            "password": "demo123"
        })
        if response.status_code != 200:
            pytest.skip("Login failed")
        return session

    def test_something(self, auth_session):
        """Test description"""
        response = auth_session.get(f"{BASE_URL}/api/endpoint")
        assert response.status_code == 200
        data = response.json()
        assert "key" in data
```

## Frontend Testing (React)

### Setup

Frontend uses **Jest** and **React Testing Library**. Dependencies added to `package.json`:

```bash
cd frontend
npm install
```

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:ci

# Run with coverage
npm run test:ci -- --coverage
```

### Test Structure

```
frontend/
├── src/
│   ├── __tests__/
│   │   ├── components/
│   │   │   └── AuthContext.test.js
│   │   └── pages/
│   │       ├── DashboardPage.test.js
│   │       └── TopProducerPath.test.js
│   └── setupTests.js
└── jest.config.js
```

### Current Test Coverage

**Frontend Tests**: Just created (3 test files)

- ✅ `AuthContext.test.js` - Authentication context and hooks
- ✅ `DashboardPage.test.js` - Main dashboard functionality
- ✅ `TopProducerPath.test.js` - Phase 1 system

### Writing New Frontend Tests

```javascript
// src/__tests__/pages/NewPage.test.js
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/App';
import NewPage from '@/pages/NewPage';
import axios from 'axios';

jest.mock('axios');

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('NewPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render page title', async () => {
    renderWithProviders(<NewPage />);

    await waitFor(() => {
      expect(screen.getByText('Page Title')).toBeInTheDocument();
    });
  });
});
```

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd backend
          pytest --cov=. --cov-report=xml

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd frontend
          npm install
      - name: Run tests
        run: |
          cd frontend
          npm run test:ci
```

## Best Practices

### Backend Testing

1. **Use fixtures** for common setup (authentication, test data)
2. **Mock external dependencies** (database, APIs)
3. **Test edge cases** (empty results, errors, boundary conditions)
4. **Keep tests independent** (each test should work alone)
5. **Use descriptive test names** (`test_user_login_with_invalid_credentials`)

### Frontend Testing

1. **Test user behavior, not implementation** (click button → expect result)
2. **Mock API calls** with jest.mock('axios')
3. **Use waitFor** for async operations
4. **Test loading states and error states**
5. **Use data-testid** for selecting elements when text content varies

## Coverage Goals

### Current Coverage
- Backend: ~40% (basic API coverage)
- Frontend: ~5% (just getting started)

### Target Coverage
- **Critical paths**: 80%+ (auth, progress, payments)
- **UI components**: 60%+
- **Utilities/helpers**: 90%+
- **Overall**: 70%+

## Next Steps

1. ✅ Backend tests already comprehensive
2. ✅ Frontend test infrastructure created
3. ⏳ Add more frontend component tests
4. ⏳ Add integration tests (full user flows)
5. ⏳ Add E2E tests (Playwright/Cypress)
6. ⏳ Setup CI/CD pipeline
7. ⏳ Achieve 70%+ coverage

## Troubleshooting

### Backend Tests

**Issue**: Tests fail with database connection error
**Solution**: Mock database operations or use test database

```python
# In conftest.py
@pytest.fixture
def mock_db():
    # Mock database operations
    with patch('server.db') as mock:
        yield mock
```

### Frontend Tests

**Issue**: "Cannot find module '@/...'"
**Solution**: Check jest.config.js moduleNameMapper

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

**Issue**: Test times out
**Solution**: Increase timeout or check for infinite loops

```javascript
it('should load data', async () => {
  await waitFor(
    () => expect(screen.getByText('Loaded')).toBeInTheDocument(),
    { timeout: 5000 }
  );
});
```

## Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [React Testing Library](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/)
- [VCSA API Reference](./docs/wiki/API-Reference.md)

---

**Last Updated**: March 16, 2026
**Status**: Testing Infrastructure Complete | More Tests Needed
