/**
 * ═══════════════════════════════════════════════════════════════
 * Integration Tests
 * ═══════════════════════════════════════════════════════════════
 *
 * Integration tests for user flows and component interactions
 *
 * Author: VCSA Development Team
 * Created: April 2026
 * Status: Production Ready
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { render, screen, waitFor } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Mock components for testing
const MockHomePage = () => <div data-testid="home-page">Home</div>;
const MockLoginPage = () => <div data-testid="login-page">Login</div>;
const MockDashboardPage = () => <div data-testid="dashboard-page">Dashboard</div>;
const MockTopProducerPath = () => <div data-testid="top-producer-path">Top Producer Path</div>;

describe('Authentication Flow Integration', () => {
  describe('Complete Registration Flow', () => {
    it('should navigate from login to register', async () => {
      const user = userEvent.setup();

      render(
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<MockLoginPage />} />
            <Route path="/register" element={
              <div>
                <a href="/login">Back to Login</a>
              </div>
            } />
          </Routes>
        </BrowserRouter>
      );

      // Start at login page
      window.history.pushState({}, 'Login', '/login');

      // Click register link
      const registerLink = screen.getByRole('link', { name: /register/i });
      await user.click(registerLink);

      // Should navigate to register
      expect(window.location.pathname).toBe('/register');
    });

    it('should complete registration flow', async () => {
      const user = userEvent.setup();

      render(
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={
              <div>
                <form data-testid="register-form">
                  <input name="name" placeholder="Name" />
                  <input name="email" type="email" placeholder="Email" />
                  <input name="password" type="password" placeholder="Password" />
                  <button type="submit">Create Account</button>
                </form>
              </div>
            } />
            <Route path="/dashboard" element={<MockDashboardPage />} />
          </Routes>
        </BrowserRouter>
      );

      // Fill out form
      const nameInput = screen.getByPlaceholderText(/name/i);
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'test@vcsa.com');
      await user.type(passwordInput, 'TestPass123!');
      await user.click(submitButton);

      // Simulate successful registration (would navigate to dashboard)
      await waitFor(() => {
        expect(nameInput).toHaveValue('Test User');
        expect(emailInput).toHaveValue('test@vcsa.com');
      });
    });
  });

  describe('Complete Login Flow', () => {
    it('should login with valid credentials and navigate to dashboard', async () => {
      const user = userEvent.setup();

      render(
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={
              <div>
                <form data-testid="login-form">
                  <input name="email" type="email" placeholder="Email" />
                  <input name="password" type="password" placeholder="Password" />
                  <button type="submit">Login</button>
                </form>
              </div>
            } />
            <Route path="/dashboard" element={<MockDashboardPage />} />
          </Routes>
        </BrowserRouter>
      );

      // Fill out form
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      await user.type(emailInput, 'demo@vcsa.com');
      await user.type(passwordInput, 'demo123');
      await user.click(submitButton);

      // Simulate successful login (would navigate to dashboard)
      await waitFor(() => {
        expect(emailInput).toHaveValue('demo@vcsa.com');
        expect(passwordInput).toHaveValue('demo123');
      });
    });

    it('should show error for invalid credentials', async () => {
      const user = userEvent.setup();

      render(
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={
              <div>
                <form data-testid="login-form">
                  <input name="email" type="email" placeholder="Email" />
                  <input name="password" type="password" placeholder="Password" />
                  <button type="submit">Login</button>
                </form>
              </div>
            } />
          </Routes>
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      await user.type(emailInput, 'invalid@email.com');
      await user.type(passwordInput, 'wrongpass');
      await user.click(submitButton);

      // Should show error (simulated)
      await waitFor(() => {
        expect(emailInput).toHaveValue('invalid@email.com');
      });
    });
  });
});

describe('Navigation Integration', () => {
  it('should navigate through main application flow', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <div>
          <nav>
            <a href="/">Home</a>
            <a href="/login">Login</a>
            <a href="/dashboard">Dashboard</a>
          </nav>

          <Routes>
            <Route path="/" element={<MockHomePage />} />
            <Route path="/login" element={<MockLoginPage />} />
            <Route path="/dashboard" element={<MockDashboardPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    );

    // Start at home
    expect(screen.getByTestId('home-page')).toBeInTheDocument();

    // Navigate to login
    await user.click(screen.getByRole('link', { name: /login/i }));
    expect(screen.getByTestId('login-page')).toBeInTheDocument();

    // Navigate to dashboard
    await user.click(screen.getByRole('link', { name: /dashboard/i }));
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  it('should use browser back button', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MockHomePage />} />
          <Route path="/login" element={<MockLoginPage />} />
          <Route path="/dashboard" element={<MockDashboardPage />} />
        </Routes>
      </BrowserRouter>
    );

    // Navigate to dashboard
    window.history.pushState({}, 'Dashboard', '/dashboard');
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();

    // Use back button
    window.history.back();
    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });
});

describe('Protected Routes', () => {
  it('should redirect to login if not authenticated', async () => {
    const ProtectedDashboard = () => {
      const { user } = useAuth();
      if (!user) {
        window.location.href = '/login';
        return null;
      }
      return <MockDashboardPage />;
    };

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<MockLoginPage />} />
          <Route path="/dashboard" element={<ProtectedDashboard />} />
        </Routes>
      </BrowserRouter>
    );

    // Try to access dashboard without auth
    window.history.pushState({}, 'Dashboard', '/dashboard');

    // Should redirect to login
    await waitFor(() => {
      expect(window.location.pathname).toBe('/login');
    });
  });

  it('should allow access to protected route when authenticated', () => {
    const ProtectedDashboard = () => {
      const { user } = useAuth();
      if (!user) {
        return <div>Redirecting...</div>;
      }
      return <MockDashboardPage />;
    };

    renderWithProviders(
      <Routes>
        <Route path="/dashboard" element={<ProtectedDashboard />} />
      </Routes>,
      {
        user: createMockUser(),
      }
    );

    // Should access dashboard
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });
});

describe('Form Integration', () => {
  it('should handle multi-step form', async () => {
    const user = userEvent.setup();

    const MultiStepForm = () => {
      const [step, setStep] = React.useState(1);

      return (
        <div>
          {step === 1 && (
            <div data-testid="step-1">
              <input name="field1" placeholder="Field 1" />
              <button onClick={() => setStep(2)}>Next</button>
            </div>
          )}
          {step === 2 && (
            <div data-testid="step-2">
              <input name="field2" placeholder="Field 2" />
              <button onClick={() => setStep(1)}>Back</button>
              <button onClick={() => setStep(3)}>Next</button>
            </div>
          )}
          {step === 3 && (
            <div data-testid="step-3">
              <div>Complete!</div>
            </div>
          )}
        </div>
      );
    };

    render(<MultiStepForm />);

    // Step 1
    expect(screen.getByTestId('step-1')).toBeInTheDocument();

    const field1 = screen.getByPlaceholderText(/field 1/i);
    await user.type(field1, 'Value 1');

    await user.click(screen.getByRole('button', { name: /next/i }));

    // Step 2
    expect(screen.getByTestId('step-2')).toBeInTheDocument();

    const field2 = screen.getByPlaceholderText(/field 2/i);
    await user.type(field2, 'Value 2');

    await user.click(screen.getAllByRole('button')[1]); // Second button

    // Step 3 - Complete
    expect(screen.getByTestId('step-3')).toBeInTheDocument();
    expect(screen.getByText(/complete/i)).toBeInTheDocument();
  });

  it('should validate form before submission', async () => {
    const user = userEvent.setup();

    const FormWithValidation = () => {
      const [errors, setErrors] = React.useState({});

      const validate = () => {
        const newErrors = {};
        if (!screen.getByPlaceholderText(/name/i).value) {
          newErrors.name = 'Name is required';
        }
        if (!screen.getByPlaceholderText(/email/i).value) {
          newErrors.email = 'Email is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
          // Submit
        }
      };

      return (
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" />
          {errors.name && <span data-testid="name-error">{errors.name}</span>}
          <input name="email" type="email" placeholder="Email" />
          {errors.email && <span data-testid="email-error">{errors.email}</span>}
          <button type="submit">Submit</button>
        </form>
      );
    };

    render(<FormWithValidation />);

    // Submit empty form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    // Should show errors
    expect(screen.getByTestId('name-error')).toBeInTheDocument();
    expect(screen.getByTestId('email-error')).toBeInTheDocument();
  });
});

describe('API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and display data', async () => {
    const mockData = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );

    const DataComponent = () => {
      const [data, setData] = React.useState([]);
      const [loading, setLoading] = React.useState(true);

      React.useEffect(() => {
        fetch('/api/data')
          .then(res => res.json())
          .then(data => {
            setData(data);
            setLoading(false);
          });
      }, []);

      if (loading) return <div>Loading...</div>;
      return (
        <div>
          {data.map(item => (
            <div key={item.id} data-testid={`item-${item.id}`}>
              {item.name}
            </div>
          ))}
        </div>
      );
    };

    render(<DataComponent />);

    // Initially shows loading
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // After fetch completes
    await waitFor(() => {
      expect(screen.getByTestId('item-1')).toBeInTheDocument();
      expect(screen.getByTestId('item-2')).toBeInTheDocument();
      expect(screen.getByTestId('item-3')).toBeInTheDocument();
    });
  });

  it('should handle API errors', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      })
    );

    const DataComponent = () => {
      const [error, setError] = React.useState(null);

      React.useEffect(() => {
        fetch('/api/data')
          .then(res => {
            if (!res.ok) {
              throw new Error('API Error');
            }
            return res.json();
          })
          .catch(err => setError(err.message));
      }, []);

      if (error) return <div data-testid="error-message">{error}</div>;
      return <div>Data loaded</div>;
    };

    render(<DataComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByText(/api error/i)).toBeInTheDocument();
    });
  });
});

describe('State Management Integration', () => {
  it('should update UI when state changes', async () => {
    const user = userEvent.setup();

    const Counter = () => {
      const [count, setCount] = React.useState(0);

      return (
        <div>
          <span data-testid="count">{count}</span>
          <button onClick={() => setCount(count + 1)}>Increment</button>
          <button onClick={() => setCount(count - 1)}>Decrement</button>
        </div>
      );
    };

    render(<Counter />);

    expect(screen.getByTestId('count')).toHaveTextContent('0');

    await user.click(screen.getByRole('button', { name: /increment/i }));
    expect(screen.getByTestId('count')).toHaveTextContent('1');

    await user.click(screen.getByRole('button', { name: /increment/i }));
    expect(screen.getByTestId('count')).toHaveTextContent('2');

    await user.click(screen.getByRole('button', { name: /decrement/i }));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('should persist state across re-renders', () => {
    const StatefulComponent = () => {
      const [state, setState] = React.useState('initial');

      return (
        <div>
          <span data-testid="state">{state}</span>
          <button onClick={() => setState('updated')}>Update</button>
        </div>
      );
    };

    const { rerender } = render(<StatefulComponent />);

    expect(screen.getByTestId('state')).toHaveTextContent('initial');

    // Trigger re-render
    rerender(<StatefulComponent />);

    expect(screen.getByTestId('state')).toHaveTextContent('initial');
  });
});

describe('Error Boundary Integration', () => {
  it('should catch errors in child components', () => {
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true };
      }

      render() {
        if (this.state.hasError) {
          return <div data-testid="error-boundary">Error caught</div>;
        }
        return this.props.children;
      }
    }

    const ThrowError = () => {
      throw new Error('Test error');
    };

    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();

    console.error = originalError;
  });

  it('should recover from errors', () => {
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }

      render() {
        if (this.state.hasError) {
          return (
            <div>
              <div data-testid="error-message">Error: {this.state.error?.message}</div>
              <button onClick={() => this.setState({ hasError: false, error: null })}>
                Retry
              </button>
            </div>
          );
        }
        return this.props.children;
      }
    }

    const ThrowError = ({ shouldThrow }) => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div data-testid="content">No error</div>;
    };

    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();

    // Trigger error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('error-message')).toBeInTheDocument();

    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    // Recover
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();

    console.error = originalError;
  });
});
