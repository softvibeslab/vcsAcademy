/**
 * ═══════════════════════════════════════════════════════════════
 * Example Component Test
 * ═══════════════════════════════════════════════════════════════
 *
 * Example test demonstrating best practices for VCSA testing
 *
 * Author: VCSA Development Team
 * Created: April 2026
 * Status: Production Ready
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { render, screen, waitFor } from '@/test-utils';
import userEvent from '@testing-library/user-event';

// Example component to test
const ExampleButton = ({ onClick, children, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn"
    >
      {children}
    </button>
  );
};

/**
 * Example Component Tests
 */
describe('ExampleButton', () => {

  // ═══════════════════════════════════════════════════════════════
  // BASIC RENDERING TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('when rendered', () => {
    it('should display the button text', () => {
      render(<ExampleButton>Click Me</ExampleButton>);

      expect(screen.getByRole('button', { name: /click me/i }))
        .toBeInTheDocument();
    });

    it('should have correct class name', () => {
      const { container } = render(<ExampleButton>Click Me</ExampleButton>);

      expect(container.querySelector('.btn'))
        .toBeInTheDocument();
    });

    it('should not be disabled by default', () => {
      render(<ExampleButton>Click Me</ExampleButton>);

      expect(screen.getByRole('button'))
        .not.toBeDisabled();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // INTERACTION TESTS
  // ═══════════════════════════════════════════════════════════════

  describe('when clicked', () => {
    it('should call onClick handler', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(
        <ExampleButton onClick={handleClick}>
          Click Me
        </ExampleButton>
      );

      await user.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(
        <ExampleButton onClick={handleClick} disabled>
          Click Me
        </ExampleButton>
      );

      await user.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // PROP VARIATIONS
  // ═══════════════════════════════════════════════════════════════

  describe('when disabled', () => {
    it('should be disabled', () => {
      render(<ExampleButton disabled>Click Me</ExampleButton>);

      expect(screen.getByRole('button'))
        .toBeDisabled();
    });

    it('should have disabled attribute', () => {
      render(<ExampleButton disabled>Click Me</ExampleButton>);

      expect(screen.getByRole('button'))
        .toHaveAttribute('disabled');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // EDGE CASES
  // ═══════════════════════════════════════════════════════════════

  describe('edge cases', () => {
    it('should handle empty text', () => {
      render(<ExampleButton></ExampleButton>);

      expect(screen.getByRole('button'))
        .toBeInTheDocument();
    });

    it('should handle long text', () => {
      const longText = 'A'.repeat(1000);
      render(<ExampleButton>{longText}</ExampleButton>);

      expect(screen.getByRole('button'))
        .toHaveTextContent(longText);
    });

    it('should handle special characters', () => {
      const specialText = 'Button with émojis 🎉 and spëcial çharacters';
      render(<ExampleButton>{specialText}</ExampleButton>);

      expect(screen.getByRole('button'))
        .toHaveTextContent(specialText);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // ASYNC OPERATIONS
  // ═══════════════════════════════════════════════════════════════

  describe('async operations', () => {
    it('should handle async click handler', async () => {
      const handleClick = jest.fn(() =>
        Promise.resolve('clicked')
      );
      const user = userEvent.setup();

      render(
        <ExampleButton onClick={handleClick}>
          Click Me
        </ExampleButton>
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(handleClick).toHaveBeenCalledTimes(1);
      });
    });

    it('should show loading state during async operation', async () => {
      const AsyncButton = () => {
        const [loading, setLoading] = React.useState(false);

        const handleClick = async () => {
          setLoading(true);
          await new Promise(resolve => setTimeout(resolve, 1000));
          setLoading(false);
        };

        return (
          <button onClick={handleClick} disabled={loading}>
            {loading ? 'Loading...' : 'Click Me'}
          </button>
        );
      };

      const user = userEvent.setup();
      render(<AsyncButton />);

      await user.click(screen.getByRole('button'));

      expect(screen.getByText('Loading...'))
        .toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Click Me'))
          .toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });
});

/**
 * Example: Testing with custom render function
 */
describe('ExampleButton with Providers', () => {
  it('should work with custom render', () => {
    const { container } = renderWithProviders(
      <ExampleButton>Click Me</ExampleButton>,
      {
        theme: 'dark',
        user: createMockUser(),
      }
    );

    expect(container.querySelector('.btn'))
      .toBeInTheDocument();
  });
});

/**
 * Example: Testing with mocked API
 */
describe('ExampleButton with API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call API on click', async () => {
    const mockApiCall = mockApiSuccess({ success: true });
    const user = userEvent.setup();

    // Assuming component makes API call on click
    render(<ExampleButton onClick={mockApiCall}>Submit</ExampleButton>);

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockApiCall).toHaveBeenCalled();
    });
  });

  it('should handle API errors', async () => {
    const mockApiCall = mockApiError('Network error', 500);
    const user = userEvent.setup();

    render(<ExampleButton onClick={mockApiCall}>Submit</ExampleButton>);

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockApiCall).toHaveBeenCalled();
    });
  });
});

/**
 * Example: Snapshot testing (optional)
 */
describe('ExampleButton snapshots', () => {
  it('should match snapshot', () => {
    const { container } = render(<ExampleButton>Click Me</ExampleButton>);

    expect(container.firstChild)
      .toMatchSnapshot();
  });

  it('should match snapshot when disabled', () => {
    const { container } = render(
      <ExampleButton disabled>Click Me</ExampleButton>
    );

    expect(container.firstChild)
      .toMatchSnapshot();
  });
});

// Export example for reuse
export { ExampleButton };
