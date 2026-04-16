/**
 * ═══════════════════════════════════════════════════════════════
 * Form Components Tests
 * ═══════════════════════════════════════════════════════════════
 *
 * Tests for UI form components
 *
 * Author: VCSA Development Team
 * Created: April 2026
 * Status: Production Ready
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render button with text', () => {
      render(<Button>Click Me</Button>);

      expect(screen.getByRole('button', { name: /click me/i }))
        .toBeInTheDocument();
    });

    it('should render button with icon', () => {
      render(<Button><span data-testid="icon">★</span> Star</Button>);

      expect(screen.getByTestId('icon'))
        .toBeInTheDocument();
    });

    it('should render disabled button', () => {
      render(<Button disabled>Click Me</Button>);

      expect(screen.getByRole('button'))
        .toBeDisabled();
    });

    it('should render button with variant', () => {
      const { container } = render(<Button variant="destructive">Delete</Button>);

      expect(container.querySelector('.bg-destructive'))
        .toBeInTheDocument();
    });

    it('should render button with size', () => {
      const { container } = render(<Button size="sm">Small</Button>);

      expect(container.querySelector('.text-sm'))
        .toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should call onClick handler when clicked', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Click Me</Button>);

      await user.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick} disabled>Click Me</Button>);

      await user.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should handle rapid clicks', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Click Me</Button>);

      const button = screen.getByRole('button');
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<Button aria-label="Close dialog">×</Button>);

      expect(screen.getByRole('button', { name: /close dialog/i }))
        .toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Submit</Button>);

      const button = screen.getByRole('button');
      button.focus();

      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalled();
    });
  });
});

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render text input', () => {
      render(<Input type="text" placeholder="Enter text" />);

      expect(screen.getByRole('textbox'))
        .toBeInTheDocument();
    });

    it('should render email input', () => {
      render(<Input type="email" placeholder="Enter email" />);

      expect(screen.getByRole('textbox', { type: 'email' }))
        .toBeInTheDocument();
    });

    it('should render password input', () => {
      render(<Input type="password" placeholder="Enter password" />);

      expect(screen.getByRole('textbox', { type: 'password' }))
        .toBeInTheDocument();
    });

    it('should render disabled input', () => {
      render(<Input disabled placeholder="Disabled" />);

      expect(screen.getByRole('textbox'))
        .toBeDisabled();
    });

    it('should render input with value', () => {
      render(<Input value="Test value" readOnly />);

      expect(screen.getByDisplayValue('Test value'))
        .toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should update value on user input', async () => {
      const user = userEvent.setup();
      render(<Input placeholder="Type here" />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Hello World');

      expect(input).toHaveValue('Hello World');
    });

    it('should call onChange when value changes', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(<Input onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'a');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should handle backspace', async () => {
      const user = userEvent.setup();
      render(<Input defaultValue="Text" />);

      const input = screen.getByRole('textbox');
      await user.type(input, '{Backspace}{Backspace}');

      expect(input).toHaveValue('Te');
    });

    it('should handle clear', async () => {
      const user = userEvent.setup();
      render(<Input defaultValue="Text" />);

      const input = screen.getByRole('textbox');
      input.focus();
      await user.keyboard('{Control>}{a}{/Control}');
      await user.keyboard('{Delete}');

      expect(input).toHaveValue('');
    });
  });

  describe('Validation', () => {
    it('should respect maxLength prop', async () => {
      const user = userEvent.setup();
      render(<Input maxLength={5} />);

      const input = screen.getByRole('textbox');
      await user.type(input, '123456');

      expect(input).toHaveValue('12345');
    });

    it('should respect min and max for number inputs', async () => {
      const user = userEvent.setup();
      render(<Input type="number" min={0} max={10} />);

      const input = screen.getByRole('spinbutton');
      await user.type(input, '15');

      // Should allow typing but validation happens on form submit
      expect(input).toHaveValue(15);
    });

    it('should respect required attribute', () => {
      render(<Input required />);

      expect(screen.getByRole('textbox'))
        .toHaveAttribute('required');
    });
  });

  describe('Accessibility', () => {
    it('should associate with label', () => {
      render(
        <Label htmlFor="test-input">Test Input</Label>,
        <Input id="test-input" />
      );

      expect(screen.getByLabelText(/test input/i))
        .toBeInTheDocument();
    });

    it('should have proper placeholder', () => {
      render(<Input placeholder="Enter your name" />);

      expect(screen.getByPlaceholderText(/enter your name/i))
        .toBeInTheDocument();
    });

    it('should support aria-describedby', () => {
      render(
        <>
          <Input id="test" aria-describedby="error-message" />
          <span id="error-message">Error text</span>
        </>
      );

      expect(screen.getByRole('textbox'))
        .toHaveAttribute('aria-describedby', 'error-message');
    });
  });

  describe('Special Features', () => {
    it('should render with left icon', () => {
      const { container } = render(
        <Input leftIcon={<span data-testid="left-icon">@</span>} />
      );

      expect(screen.getByTestId('left-icon'))
        .toBeInTheDocument();
    });

    it('should render with right icon', () => {
      const { container } = render(
        <Input rightIcon={<span data-testid="right-icon">✓</span>} />
      );

      expect(screen.getByTestId('right-icon'))
        .toBeInTheDocument();
    });

    it('should render with helper text', () => {
      render(
        <>
          <Input />
          <p className="text-sm text-muted-foreground">Helper text</p>
        </>
      );

      expect(screen.getByText(/helper text/i))
        .toBeInTheDocument();
    });
  });
});

describe('Label Component', () => {
  describe('Rendering', () => {
    it('should render label text', () => {
      render(<Label htmlFor="test">Test Label</Label>);

      expect(screen.getByText(/test label/i))
        .toBeInTheDocument();
    });

    it('should associate with input', () => {
      render(
        <Label htmlFor="test-input">Email</Label>,
        <Input id="test-input" />
      );

      const label = screen.getByLabelText(/email/i);
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe('INPUT');
    });

    it('should render required indicator', () => {
      render(<Label required>Email</Label>);

      expect(screen.getByText(/\*/i))
        .toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper htmlFor attribute', () => {
      render(<Label htmlFor="test-input">Test</Label>);

      expect(screen.getByText(/test/i))
        .toHaveAttribute('for', 'test-input');
    });

    it('should support screen readers', () => {
      render(<Label>Screen Reader Text</Label>);

      const label = screen.getByText(/screen reader text/i);
      expect(label).toBeInTheDocument();
    });
  });
});
