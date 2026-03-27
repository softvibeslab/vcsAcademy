# Frontend Test Suite

## Quick Start

```bash
cd frontend
npm install  # First time only
npm test     # Watch mode
npm run test:ci  # CI mode (once)
```

## Test Files

- `src/__tests__/components/AuthContext.test.js` - Auth context & hooks
- `src/__tests__/pages/DashboardPage.test.js` - Dashboard functionality
- `src/__tests__/pages/TopProducerPath.test.js` - Phase 1 system

## Configuration

- `jest.config.js` - Jest configuration
- `src/setupTests.js` - Test environment setup

## Running Tests

```bash
# Watch mode (interactive)
npm test

# Run all tests once
npm run test:ci

# Run with coverage
npm run test:ci -- --coverage

# Run specific test file
npm test -- AuthContext.test.js

# Run tests matching pattern
npm test -- --testNamePattern="should render"
```

## Coverage Goals

- **Critical paths**: 80%+ (auth, progress, payments)
- **UI components**: 60%+
- **Utilities/helpers**: 90%+
- **Overall**: 70%+

## Current Status

- ✅ Test infrastructure set up
- ✅ Auth context tested
- ✅ Dashboard page tested
- ✅ Top Producer Path tested
- ⏳ More component tests needed
- ⏳ Integration tests needed

## Writing New Tests

### Component Test Example

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/App';
import MyComponent from '@/components/MyComponent';
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

describe('MyComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should fetch data on mount', async () => {
    axios.get.mockResolvedValue({ data: { items: [] } });
    renderWithProviders(<MyComponent />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/items');
    });
  });
});
```

### Page Test Example

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/App';
import MyPage from '@/pages/MyPage';

jest.mock('@/components/layout/DashboardLayout', () => ({
  DashboardLayout: ({ children }) => <div>{children}</div>,
}));

describe('MyPage', () => {
  it('should render page title', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <MyPage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Page Title')).toBeInTheDocument();
    });
  });
});
```

## Best Practices

1. **Test user behavior, not implementation**
   - ✅ "Click button → expect form to submit"
   - ❌ "Component has submitButton property"

2. **Use data-testid for dynamic content**
   ```jsx
   <button data-testid="submit-button">Submit</button>
   ```
   ```javascript
   screen.getByTestId('submit-button')
   ```

3. **Mock external dependencies**
   ```javascript
   jest.mock('axios');
   jest.mock('@/components/layout/DashboardLayout');
   ```

4. **Test loading and error states**
   ```javascript
   it('should show loading spinner', () => {
     axios.get.mockImplementation(() => new Promise(() => {}));
     render(<MyComponent />);
     expect(screen.getByTestId('spinner')).toBeInTheDocument();
   });
   ```

5. **Use waitFor for async operations**
   ```javascript
   await waitFor(() => {
     expect(screen.getByText('Loaded')).toBeInTheDocument();
   });
   ```

## Troubleshooting

### Module Not Found Errors

Check `jest.config.js` moduleNameMapper:

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

### Tests Timing Out

Increase timeout:

```javascript
await waitFor(
  () => expect(element).toBeInTheDocument(),
  { timeout: 5000 }
);
```

### Mock Not Working

Clear mocks before each test:

```javascript
beforeEach(() => {
  jest.clearAllMocks();
});
```

## Dependencies

- @testing-library/react
- @testing-library/jest-dom
- @testing-library/user-event
- jest (included with CRA)

---

**Last Updated**: March 16, 2026
**Total Tests**: 3 test files, 20+ test cases
**Coverage**: ~5% (just getting started)
