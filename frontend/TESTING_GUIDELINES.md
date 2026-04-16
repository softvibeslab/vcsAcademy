# 🧪 VCSA Frontend Testing Guidelines

**Purpose**: Comprehensive guide for testing VCSA frontend application
**Sprint**: Sprint 3 - Quality & Features
**Priority**: P0 - CRITICAL
**Status**: 🟢 Production Ready

---

## 📋 TESTING PHILOSOPHY

### Core Principles

1. **Test What Matters**: Focus on user-facing functionality and business logic
2. **Keep Tests Simple**: Tests should be easy to read and maintain
3. **Test Behavior, Not Implementation**: Focus on what the code does, not how
4. **Fast Feedback**: Tests should run quickly and provide clear feedback
5. **Maintainability**: Tests should be easy to update when code changes

### Testing Pyramid

```
                    ▲
                   /  \
                  / E2E \          ← Few tests, slow, expensive
                 /──────\
                /        \
               /Integration\       ← Moderate tests, medium speed
              /────────────\
             /              \
            /   Unit Tests    \    ← Many tests, fast, cheap
           /__________________\
```

**Target Distribution**:
- Unit Tests: 70% (component logic, utilities, hooks)
- Integration Tests: 20% (component interactions, API calls)
- E2E Tests: 10% (critical user flows)

---

## 🎯 TESTING COVERAGE TARGETS

### Current vs Target

| Category | Current | Target | Priority |
|----------|---------|--------|----------|
| **Authentication** | 0% | 90% | P0 |
| **Dashboard** | 0% | 80% | P0 |
| **Phase 1 System** | 5% | 75% | P0 |
| **Forms & Validation** | 0% | 85% | P1 |
| **Navigation** | 0% | 70% | P1 |
| **Components** | 0% | 60% | P2 |
| **Utilities** | 0% | 80% | P2 |

### Overall Targets

```
✅ Statements: 70%+
✅ Branches: 70%+
✅ Functions: 70%+
✅ Lines: 70%+
```

---

## 🛠️ TESTING FRAMEWORK

### Tools & Libraries

```json
{
  "testing-framework": "Jest",
  "component-testing": "React Testing Library",
  "user-interaction": "@testing-library/user-event",
  "mocking": "jest.mock",
  "coverage": "Istanbul (built-in)",
  "e2e-testing": "Playwright (future)"
}
```

### Test Utilities Location

```
frontend/
├── src/
│   ├── test-utils/          # Custom test utilities
│   │   └── index.js         # Main test utilities
│   ├── __tests__/           # Test files
│   │   ├── components/      # Component tests
│   │   ├── pages/           # Page tests
│   │   └── utils/           # Utility tests
│   └── setupTests.js        # Jest setup
├── jest.config.js           # Jest configuration
└── __mocks__/               # Mock files
    └── fileMock.js          # File import mock
```

---

## 📝 TEST STRUCTURE & CONVENTIONS

### File Naming

```
Test files should be named:
- ComponentName.test.jsx
- ComponentName.spec.jsx
- __tests__/ComponentName.jsx

Located:
- Next to component: ComponentName.test.jsx
- In __tests__ directory: __tests__/ComponentName.jsx
```

### Test Structure

```javascript
/**
 * ComponentName.test.jsx
 *
 * Description: Brief description of what's being tested
 */

// 1. Imports
import React from 'react';
import { render, screen } from '@/test-utils';
import { ComponentName } from './ComponentName';

// 2. Describe block
describe('ComponentName', () => {

  // 3. BeforeEach/AfterEach if needed
  beforeEach(() => {
    // Setup before each test
  });

  // 4. Test cases
  describe('when rendered', () => {
    it('should display the component', () => {
      // Arrange
      const props = { /* test props */ };

      // Act
      render(<ComponentName {...props} />);

      // Assert
      expect(screen.getByText('Expected Text')).toBeInTheDocument();
    });
  });

  // 5. Edge cases
  describe('edge cases', () => {
    it('should handle empty state', () => {
      // Test implementation
    });
  });
});
```

### Test Organization

```javascript
// Good: Organized by feature
describe('LoginForm', () => {
  describe('initial render', () => {
    it('should show email input', () => {});
    it('should show password input', () => {});
    it('should show submit button', () => {});
  });

  describe('form validation', () => {
    it('should validate email format', () => {});
    it('should require password', () => {});
  });

  describe('form submission', () => {
    it('should call login on submit', () => {});
    it('should show error on failure', () => {});
  });
});

// Avoid: Disorganized tests
describe('LoginForm', () => {
  it('should show email input', () => {});
  it('should call login on submit', () => {});
  it('should validate email format', () => {});
  // Mixed concerns - hard to follow
});
```

---

## 🧪 WRITING EFFECTIVE TESTS

### DO's and DON'T's

#### ✅ DO:

1. **Test User Behavior**
```javascript
// Good: Tests what the user sees
it('should display success message after login', () => {
  render(<LoginPage />);
  userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
  userEvent.type(screen.getByLabelText('Password'), 'password123');
  userEvent.click(screen.getByRole('button', { name: 'Login' }));

  expect(screen.getByText('Login successful')).toBeInTheDocument();
});
```

2. **Use Descriptive Test Names**
```javascript
// Good: Clear and descriptive
it('should disable submit button when form is invalid', () => {});

// Bad: Vague
it('should work', () => {});
```

3. **Test One Thing Per Test**
```javascript
// Good: Single responsibility
it('should validate email format', () => {});
it('should validate password length', () => {});

// Bad: Multiple assertions
it('should validate form', () => {
  // Tests email, password, and phone all in one test
});
```

4. **Use waitFor for Async Operations**
```javascript
// Good: Proper async handling
it('should load user data', async () => {
  render(<UserProfile />);

  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

#### ❌ DON'T:

1. **Test Implementation Details**
```javascript
// Bad: Tests internal state
it('should set loading state to true', () => {
  const component = render(<LoginForm />);
  expect(component.state.loading).toBe(true);
});

// Good: Tests what user sees
it('should show loading spinner', () => {
  render(<LoginForm />);
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});
```

2. **Use fragile selectors**
```javascript
// Bad: Class names can change
expect(container.querySelector('.login-form')).toBeInTheDocument();

// Good: User-facing queries
expect(screen.getByRole('form', { name: 'Login' })).toBeInTheDocument();
```

3. **Test Third-Party Libraries**
```javascript
// Bad: Tests the library, not your code
it('should call useState hook', () => {
  // Don't test React hooks
});

// Good: Tests your component behavior
it('should update counter when button is clicked', () => {
  // Tests your logic
});
```

---

## 🔧 COMMON TESTING SCENARIOS

### 1. Testing User Authentication

```javascript
describe('Authentication Flow', () => {
  it('should login user with valid credentials', async () => {
    render(<LoginPage />);

    userEvent.type(screen.getByLabelText('Email'), 'demo@vcsa.com');
    userEvent.type(screen.getByLabelText('Password'), 'demo123');
    userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Welcome back')).toBeInTheDocument();
    });
  });

  it('should display error with invalid credentials', async () => {
    render(<LoginPage />);

    userEvent.type(screen.getByLabelText('Email'), 'invalid@test.com');
    userEvent.type(screen.getByLabelText('Password'), 'wrongpass');
    userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
```

### 2. Testing Form Validation

```javascript
describe('Form Validation', () => {
  it('should show error for invalid email', () => {
    render(<RegisterPage />);

    userEvent.type(screen.getByLabelText('Email'), 'invalid-email');
    userEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
  });

  it('should require password to be at least 8 characters', () => {
    render(<RegisterPage />);

    userEvent.type(screen.getByLabelText('Password'), 'short');
    userEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
  });
});
```

### 3. Testing API Integration

```javascript
describe('API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and display user progress', async () => {
    const mockProgress = createMockProgress();
    global.fetch = mockApiSuccess(mockProgress);

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('150 Points')).toBeInTheDocument();
      expect(screen.getByText('65% Readiness')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    global.fetch = mockApiError('Network error', 500);

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Unable to load data')).toBeInTheDocument();
    });
  });
});
```

### 4. Testing Navigation

```javascript
describe('Navigation', () => {
  it('should navigate to track detail when clicking track', () => {
    renderWithProviders(<TopProducerPath />);

    userEvent.click(screen.getByText('Pro Mindset'));

    expect(window.location.pathname).toBe('/track/pro-mindset');
  });

  it('should redirect to login when accessing protected route', () => {
    renderWithProviders(<TrackDetailPage />, {
      user: null // Not authenticated
    });

    expect(window.location.pathname).toBe('/login');
  });
});
```

---

## 📊 COVERAGE REPORTING

### Generate Coverage Report

```bash
# Run tests with coverage
yarn test:ci

# Generate HTML report
yarn test:ci -- --coverage

# View HTML report
open coverage/index.html
```

### Coverage Thresholds

```javascript
// In jest.config.js
coverageThreshold: {
  global: {
    statements: 70,
    branches: 70,
    functions: 70,
    lines: 70,
  },
},
```

### Improving Low Coverage

```bash
# 1. Run coverage to see what's missing
yarn test:ci -- --coverage

# 2. Open HTML report
open coverage/index.html

# 3. Look for red files (low coverage)

# 4. Click on file to see uncovered lines

# 5. Write tests for uncovered code
```

---

## 🚀 TEST SCRIPTS

### Available Scripts

```json
{
  "scripts": {
    "test": "craco test",
    "test:ci": "craco test --watchAll=false --coverage",
    "test:watch": "craco test --watch",
    "test:debug": "craco test --debug",
    "test:update": "craco test --updateSnapshot"
  }
}
```

### Usage Examples

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage (CI mode)
yarn test:ci

# Run specific test file
yarn test LoginPage.test.jsx

# Run tests matching pattern
yarn test --testNamePattern="Authentication"

# Update snapshots
yarn test:update
```

---

## 🐛 DEBUGGING TESTS

### Common Issues & Solutions

#### 1. Test Timeout

```javascript
// Problem: Test times out
it('should load data', async () => {
  // Test fails with timeout
});

// Solution: Increase timeout or fix async handling
it('should load data', async () => {
  const { result } = renderHook(() => useUserData());

  await waitFor(() => {
    expect(result.current.data).toBeDefined();
  }, { timeout: 5000 }); // Increase timeout
});
```

#### 2. Mock Not Working

```javascript
// Problem: Mock not being used
jest.mock('./api', () => ({
  fetchData: jest.fn(),
}));

// Solution: Mock correctly
import { fetchData } from './api';

jest.mock('./api', () => ({
  fetchData: jest.fn(() => Promise.resolve({ data: 'mock' })),
}));
```

#### 3. Act Warning

```javascript
// Problem: Warning about updates not wrapped in act
function TestComponent() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(1); // Warning: Not wrapped in act()
  }, []);
  return <div>{count}</div>;
}

// Solution: Use waitFor
it('should update count', async () => {
  render(<TestComponent />);

  await waitFor(() => {
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
```

---

## 📚 BEST PRACTICES

### 1. Test Isolation

```javascript
// Good: Each test is independent
describe('Component', () => {
  beforeEach(() => {
    // Reset state before each test
    jest.clearAllMocks();
  });

  it('test 1', () => {
    // Fresh state
  });

  it('test 2', () => {
    // Fresh state
  });
});

// Bad: Tests depend on each other
it('test 1', () => {
  // Modifies global state
});

it('test 2', () => {
  // Assumes test 1 ran first
});
```

### 2. Meaningful Assertions

```javascript
// Good: Clear assertion message
expect(userEmail).toBe('test@example.com');

// Better: With custom message
expect(userEmail).toBe('test@example.com'); // Email should match

// Best: Descriptive error
expect(userEmail)
  .toBe('test@example.com');
```

### 3. Test Data Management

```javascript
// Good: Use factory functions
const createMockUser = (overrides = {}) => ({
  id: '123',
  name: 'Test User',
  email: 'test@example.com',
  ...overrides,
});

it('should display user name', () => {
  const user = createMockUser({ name: 'Custom Name' });
  render(<UserProfile user={user} />);
  expect(screen.getByText('Custom Name')).toBeInTheDocument();
});

// Bad: Hardcoded test data
it('should display user name', () => {
  const user = { id: '123', name: 'Test User', email: 'test@example.com' };
  render(<UserProfile user={user} />);
  expect(screen.getByText('Test User')).toBeInTheDocument();
});
```

---

## ✅ CHECKLIST FOR NEW TESTS

Before marking a test as complete, verify:

- [ ] Test has a clear, descriptive name
- [ ] Test follows the Arrange-Act-Assert pattern
- [ ] Test is isolated (no dependencies on other tests)
- [ ] Test covers user behavior, not implementation
- [ ] Test handles edge cases
- [ ] Test has meaningful assertions
- [ ] Test is fast (runs in < 100ms)
- [ ] Test is properly mocked (no real API calls)
- [ ] Test follows project conventions
- [ ] Test is documented if complex

---

## 🎯 NEXT STEPS

1. **Review Existing Tests**: Check current test coverage
2. **Write Critical Path Tests**: Focus on authentication and core flows
3. **Add Component Tests**: Test UI components
4. **Improve Coverage**: Target 70%+ coverage
5. **Set up CI**: Automate test running
6. **Monitor Coverage**: Keep coverage high

---

**Document Version**: 1.0
**Last Updated**: April 2026
**Maintained By**: Frontend Team
**Status**: ✅ Production Ready
