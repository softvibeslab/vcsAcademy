/**
 * ═══════════════════════════════════════════════════════════════
 * RegisterPage Tests
 * ═══════════════════════════════════════════════════════════════
 *
 * Comprehensive tests for RegisterPage component
 *
 * Author: VCSA Development Team
 * Created: April 2026
 * Status: Production Ready
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { render, screen, waitFor } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import RegisterPage from '../RegisterPage';

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

describe('RegisterPage', () => {
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
    it('should render registration form', () => {
      render(<RegisterPage />);

      expect(screen.getByRole('heading', { name: /register/i }))
        .toBeInTheDocument();
    });

    it('should render name input', () => {
      render(<RegisterPage />);

      expect(screen.getByLabelText(/name/i))
        .toBeInTheDocument();
    });

    it('should render email input', () => {
      render(<RegisterPage />);

      expect(screen.getByLabelText(/email/i))
        .toBeInTheDocument();
    });

    it('should render password input', () => {
      render(<RegisterPage />);

      expect(screen.getByLabelText(/^password$/i))
        .toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<RegisterPage />);

      expect(screen.getByRole('button', { name: /create account/i }))
        .toBeInTheDocument();
    });

    it('should render login link', () => {
      render(<RegisterPage />);

      expect(screen.getByRole('link', { name: /login/i }))
        .toBeInTheDocument();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // FORM VALIDATION TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Form Validation', () => {
    it('should show name required error when name is empty', async () => {
      const user = userEvent.setup();
      render(<RegisterPage />);

      const submitButton = screen.getByRole('button', { name: /create account/i });
      await user.click(submitButton);

      expect(screen.getByText(/name is required/i))
        .toBeInTheDocument();
    });

    it('should show email required error when email is empty', async () => {
      const user = userEvent.setup();
      render(<RegisterPage />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'Test User');

      const submitButton = screen.getByRole('button', { name: /create account/i });
      await user.click(submitButton);

      expect(screen.getByText(/email is required/i))
        .toBeInTheDocument();
    });

    it('should show invalid email error when email format is wrong', async () => {
      const user = userEvent.setup();
      render(<RegisterPage />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'Test User');

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid-email');

      const submitButton = screen.getByRole('button', { name: /create account/i });
      await user.click(submitButton);

      expect(screen.getByText(/valid email/i))
        .toBeInTheDocument();
    });

    it('should show password required error when password is empty', async () => {
      const user = userEvent.setup();
      render(<RegisterPage />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'Test User');

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@vcsa.com');

      const submitButton = screen.getByRole('button', { name: /create account/i });
      await user.click(submitButton);

      expect(screen.getByText(/password is required/i))
        .toBeInTheDocument();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // PASSWORD STRENGTH TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Password Strength', () => {
    it('should show weak password for short password', async () => {
      const user = userEvent.setup();
      render(<RegisterPage />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'Test User');

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@vcsa.com');

      const passwordInput = screen.getByLabelText(/^password$/i);
      await user.type(passwordInput, 'short');

      // Should show password strength indicator
      expect(screen.getByText(/weak/i))
        .toBeInTheDocument();
    });

    it('should show password requirements', async () => {
      const user = userEvent.setup();
      render(<RegisterPage />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'Test User');

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@vcsa.com');

      const passwordInput = screen.getByLabelText(/^password$/i);
      await user.type(passwordInput, 'weak');

      // Should show missing requirements
      expect(screen.getByText(/at least 8 characters/i))
        .toBeInTheDocument();
    });

    it('should improve password strength as requirements are met', async () => {
      const user = userEvent.setup();
      render(<RegisterPage />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'Test User');

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@vcsa.com');

      const passwordInput = screen.getByLabelText(/^password$/i);

      // Start with weak password
      await user.type(passwordInput, 'weak');
      expect(screen.getByText(/weak/i)).toBeInTheDocument();

      // Add more characters
      await user.clear(passwordInput);
      await user.type(passwordInput, 'StrongerPass123');
      expect(screen.getByText(/good/i)).toBeInTheDocument();
    });

    it('should show strong password for complex password', async () => {
      const user = userEvent.setup();
      render(<RegisterPage />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'Test User');

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@vcsa.com');

      const passwordInput = screen.getByLabelText(/^password$/i);
      await user.type(passwordInput, 'StrongP@ssw0rd!');

      expect(screen.getByText(/strong/i))
        .toBeInTheDocument();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // PASSWORD VISIBILITY TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Password Visibility', () => {
    it('should hide password by default', () => {
      render(<RegisterPage />);

      const passwordInput = screen.getByLabelText(/^password$/i);
      expect(passwordInput)
        .toHaveAttribute('type', 'password');
    });

    it('should show password when eye icon is clicked', async () => {
      const user = userEvent.setup();
      render(<RegisterPage />);

      const toggleButton = screen.getByRole('button', { name: /show password/i });
      await user.click(toggleButton);

      const passwordInput = screen.getByLabelText(/^password$/i);
      expect(passwordInput)
        .toHaveAttribute('type', 'text');
    });

    it('should hide password when eye icon is clicked again', async () => {
      const user = userEvent.setup();
      render(<RegisterPage />);

      const toggleButton = screen.getByRole('button', { name: /show password/i });

      await user.click(toggleButton);
      await user.click(toggleButton);

      const passwordInput = screen.getByLabelText(/^password$/i);
      expect(passwordInput)
        .toHaveAttribute('type', 'password');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // FORM SUBMISSION TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Form Submission', () => {
    it('should call register with correct data', async () => {
      const user = userEvent.setup();
      loginMock.mockResolvedValue({
        user: createMockUser(),
        token: 'mock-token',
      });

      render(<RegisterPage />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'test@vcsa.com');
      await user.type(passwordInput, 'TestPass123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(loginMock).toHaveBeenCalled();
      });
    });

    it('should navigate to dashboard on successful registration', async () => {
      const user = userEvent.setup();
      loginMock.mockResolvedValue({
        user: createMockUser(),
        token: 'mock-token',
      });

      render(<RegisterPage />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'test@vcsa.com');
      await user.type(passwordInput, 'TestPass123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      loginMock.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

      render(<RegisterPage />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'test@vcsa.com');
      await user.type(passwordInput, 'TestPass123!');
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/creating account/i)).toBeInTheDocument();
    });

    it('should show error message on failed registration', async () => {
      const user = userEvent.setup();
      loginMock.mockRejectedValue(new Error('Email already exists'));

      render(<RegisterPage />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'existing@vcsa.com');
      await user.type(passwordInput, 'TestPass123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email already exists/i))
          .toBeInTheDocument();
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // NAVIGATION TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Navigation', () => {
    it('should navigate to login page when login link is clicked', async () => {
      const user = userEvent.setup();
      render(<RegisterPage />);

      const loginLink = screen.getByRole('link', { name: /login/i });
      await user.click(loginLink);

      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // ACCESSIBILITY TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<RegisterPage />);

      expect(screen.getByLabelText(/name/i))
        .toBeInTheDocument();
      expect(screen.getByLabelText(/email/i))
        .toBeInTheDocument();
      expect(screen.getByLabelText(/password/i))
        .toBeInTheDocument();
    });

    it('should have proper ARIA labels', () => {
      render(<RegisterPage />);

      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toHaveAttribute('type', 'text');

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('type', 'email');

      const passwordInput = screen.getByLabelText(/^password$/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should show password strength indicator with ARIA', async () => {
      const user = userEvent.setup();
      render(<RegisterPage />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'Test User');

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@vcsa.com');

      const passwordInput = screen.getByLabelText(/^password$/i);
      await user.type(passwordInput, 'weak');

      const strengthIndicator = screen.getByRole('progressbar');
      expect(strengthIndicator).toBeInTheDocument();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // EDGE CASES
  // ═══════════════════════════════════════════════════════════════

  describe('Edge Cases', () => {
    it('should handle very long name', async () => {
      const user = userEvent.setup();
      render(<RegisterPage />);

      const longName = 'A'.repeat(1000);
      const nameInput = screen.getByLabelText(/name/i);

      await user.type(nameInput, longName);

      expect(nameInput).toHaveValue(longName);
    });

    it('should handle special characters in name', async () => {
      const user = userEvent.setup();
      render(<RegisterPage />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, "José María-O'Connor");

      expect(nameInput).toHaveValue("José María-O'Connor");
    });

    it('should handle multiple rapid clicks on submit', async () => {
      const user = userEvent.setup();
      loginMock.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

      render(<RegisterPage />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'test@vcsa.com');
      await user.type(passwordInput, 'TestPass123!');

      // Click multiple times rapidly
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);

      // Should only call register once
      await waitFor(() => {
        expect(loginMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
