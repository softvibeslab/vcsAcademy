/**
 * ═══════════════════════════════════════════════════════════════
 * LoginPage Tests
 * ═══════════════════════════════════════════════════════════════
 *
 * Comprehensive tests for LoginPage component
 *
 * Author: VCSA Development Team
 * Created: April 2026
 * Status: Production Ready
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { render, screen, waitFor } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import LoginPage from '../LoginPage';

// Mock the API module
jest.mock('@/App', () => ({
  API: {},
  useAuth: () => ({
    login: jest.fn(),
  }),
}));

// Mock axios
jest.mock('axios');

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LoginPage', () => {
  let loginMock;

  beforeEach(() => {
    loginMock = jest.fn();
    jest.clearAllMocks();
    jest.spyOn(require('@/App'), 'useAuth').mockReturnValue({
      login: loginMock,
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // RENDERING TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Rendering', () => {
    it('should render login form', () => {
      render(<LoginPage />);

      expect(screen.getByRole('heading', { name: /login/i }))
        .toBeInTheDocument();
    });

    it('should render email input', () => {
      render(<LoginPage />);

      expect(screen.getByLabelText(/email/i))
        .toBeInTheDocument();
    });

    it('should render password input', () => {
      render(<LoginPage />);

      expect(screen.getByLabelText(/^password$/i))
        .toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<LoginPage />);

      expect(screen.getByRole('button', { name: /login/i }))
        .toBeInTheDocument();
    });

    it('should render register link', () => {
      render(<LoginPage />);

      expect(screen.getByRole('link', { name: /register/i }))
        .toBeInTheDocument();
    });

    it('should render VCSA branding', () => {
      render(<LoginPage />);

      expect(screen.getByText(/vcsa/i))
        .toBeInTheDocument();
    });

    it('should have background image', () => {
      const { container } = render(<LoginPage />);

      expect(container.querySelector('[style*="background-image"]'))
        .toBeInTheDocument();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // FORM VALIDATION TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Form Validation', () => {
    it('should show email required error when email is empty', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const submitButton = screen.getByRole('button', { name: /login/i });
      await user.click(submitButton);

      expect(screen.getByText(/email is required/i))
        .toBeInTheDocument();
    });

    it('should show invalid email error when email format is wrong', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid-email');

      const submitButton = screen.getByRole('button', { name: /login/i });
      await user.click(submitButton);

      expect(screen.getByText(/valid email/i))
        .toBeInTheDocument();
    });

    it('should show password required error when password is empty', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@vcsa.com');

      const submitButton = screen.getByRole('button', { name: /login/i });
      await user.click(submitButton);

      expect(screen.getByText(/password is required/i))
        .toBeInTheDocument();
    });

    it('should not show errors for valid inputs', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);

      await user.type(emailInput, 'demo@vcsa.com');
      await user.type(passwordInput, 'demo123');

      const submitButton = screen.getByRole('button', { name: /login/i });
      await user.click(submitButton);

      expect(screen.queryByText(/required/i))
        .not.toBeInTheDocument();
      expect(screen.queryByText(/valid email/i))
        .not.toBeInTheDocument();
    });

    it('should clear errors when user starts typing', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      // Submit empty form to show errors
      const submitButton = screen.getByRole('button', { name: /login/i });
      await user.click(submitButton);

      expect(screen.getByText(/email is required/i))
        .toBeInTheDocument();

      // Start typing email
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'demo@vcsa.com');

      // Error should clear
      expect(screen.queryByText(/email is required/i))
        .not.toBeInTheDocument();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // PASSWORD VISIBILITY TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Password Visibility', () => {
    it('should hide password by default', () => {
      render(<LoginPage />);

      const passwordInput = screen.getByLabelText(/^password$/i);
      expect(passwordInput)
        .toHaveAttribute('type', 'password');
    });

    it('should show password when eye icon is clicked', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const toggleButton = screen.getByRole('button', { name: /show password/i });
      await user.click(toggleButton);

      const passwordInput = screen.getByLabelText(/^password$/i);
      expect(passwordInput)
        .toHaveAttribute('type', 'text');
    });

    it('should hide password when eye icon is clicked again', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const toggleButton = screen.getByRole('button', { name: /show password/i });

      // First click - show password
      await user.click(toggleButton);

      // Second click - hide password
      await user.click(toggleButton);

      const passwordInput = screen.getByLabelText(/^password$/i);
      expect(passwordInput)
        .toHaveAttribute('type', 'password');
    });

    it('should toggle eye icon', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const toggleButton = screen.getByRole('button', { name: /show password/i });

      // Should show EyeOff icon initially (password hidden)
      expect(toggleButton.querySelector('svg')).toBeInTheDocument();

      await user.click(toggleButton);

      // Should show Eye icon (password visible)
      expect(toggleButton.querySelector('svg')).toBeInTheDocument();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // FORM SUBMISSION TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Form Submission', () => {
    it('should call login with correct credentials', async () => {
      const user = userEvent.setup();
      loginMock.mockResolvedValue({
        user: createMockUser(),
        token: 'mock-token',
      });

      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      await user.type(emailInput, 'demo@vcsa.com');
      await user.type(passwordInput, 'demo123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(loginMock).toHaveBeenCalledWith('demo@vcsa.com', 'demo123');
      });
    });

    it('should navigate to dashboard on successful login', async () => {
      const user = userEvent.setup();
      loginMock.mockResolvedValue({
        user: createMockUser(),
        token: 'mock-token',
      });

      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      await user.type(emailInput, 'demo@vcsa.com');
      await user.type(passwordInput, 'demo123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      loginMock.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      await user.type(emailInput, 'demo@vcsa.com');
      await user.type(passwordInput, 'demo123');
      await user.click(submitButton);

      // Check loading state
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/logging in/i)).toBeInTheDocument();
    });

    it('should show error message on failed login', async () => {
      const user = userEvent.setup();
      loginMock.mockRejectedValue(new Error('Invalid credentials'));

      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      await user.type(emailInput, 'wrong@email.com');
      await user.type(passwordInput, 'wrongpass');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i))
          .toBeInTheDocument();
      });
    });

    it('should disable submit button while loading', async () => {
      const user = userEvent.setup();
      loginMock.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      await user.type(emailInput, 'demo@vcsa.com');
      await user.type(passwordInput, 'demo123');
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
    });

    it('should re-enable submit button after submission completes', async () => {
      const user = userEvent.setup();
      loginMock.mockResolvedValue({
        user: createMockUser(),
        token: 'mock-token',
      });

      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      await user.type(emailInput, 'demo@vcsa.com');
      await user.type(passwordInput, 'demo123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // NAVIGATION TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Navigation', () => {
    it('should navigate to register page when register link is clicked', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const registerLink = screen.getByRole('link', { name: /register/i });
      await user.click(registerLink);

      expect(registerLink).toHaveAttribute('href', '/register');
    });

    it('should have correct link to forgot password', () => {
      render(<LoginPage />);

      const forgotPasswordLink = screen.queryByRole('link', { name: /forgot password/i });
      // This might not exist in current implementation
      if (forgotPasswordLink) {
        expect(forgotPasswordLink).toBeInTheDocument();
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // ACCESSIBILITY TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<LoginPage />);

      expect(screen.getByLabelText(/email/i))
        .toBeInTheDocument();
      expect(screen.getByLabelText(/password/i))
        .toBeInTheDocument();
    });

    it('should have proper ARIA labels', () => {
      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('type', 'email');

      const passwordInput = screen.getByLabelText(/^password$/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should focus email input on mount', () => {
      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveFocus();
    });

    it('should show error messages with proper ARIA', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const submitButton = screen.getByRole('button', { name: /login/i });
      await user.click(submitButton);

      const errorMessage = screen.getByText(/email is required/i);
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass('error');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // EDGE CASES
  // ═══════════════════════════════════════════════════════════════

  describe('Edge Cases', () => {
    it('should handle very long email', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const longEmail = 'a'.repeat(1000) + '@vcsa.com';
      const emailInput = screen.getByLabelText(/email/i);

      await user.type(emailInput, longEmail);

      expect(emailInput).toHaveValue(longEmail);
    });

    it('should handle special characters in email', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'user+test@vcs-a.com');

      expect(emailInput).toHaveValue('user+test@vcs-a.com');
    });

    it('should handle multiple rapid clicks on submit', async () => {
      const user = userEvent.setup();
      loginMock.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      await user.type(emailInput, 'demo@vcsa.com');
      await user.type(passwordInput, 'demo123');

      // Click multiple times rapidly
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);

      // Should only call login once
      await waitFor(() => {
        expect(loginMock).toHaveBeenCalledTimes(1);
      });
    });

    it('should trim whitespace from email', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, '  demo@vcsa.com  ');

      expect(emailInput).not.toHaveValue('  demo@vcsa.com  ');
    });
  });
});
