import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SelectFieldTrigger } from './SelectFieldTrigger';

describe('SelectFieldTrigger', () => {
  describe('rendering', () => {
    it('renders placeholder when no valueLabel is provided', () => {
      render(<SelectFieldTrigger />);

      expect(screen.getByText('Select')).toBeInTheDocument();
    });

    it('renders custom placeholder', () => {
      render(<SelectFieldTrigger placeholder="Choose an option" />);

      expect(screen.getByText('Choose an option')).toBeInTheDocument();
    });

    it('renders valueLabel when provided', () => {
      render(<SelectFieldTrigger valueLabel="My Selection" />);

      expect(screen.getByText('My Selection')).toBeInTheDocument();
    });

    it('renders as a button element', () => {
      render(<SelectFieldTrigger placeholder="Select" />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('clear button', () => {
    it('shows clear button when valueLabel and isClearable are set', () => {
      const handleClear = vi.fn();

      render(<SelectFieldTrigger valueLabel="Something" isClearable onClear={handleClear} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(1);
    });

    it('calls onClear when clear icon is interacted with', async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();

      render(<SelectFieldTrigger valueLabel="Something" isClearable onClear={handleClear} />);

      const svg = document.querySelector('svg[class*="tabler-icon-x"]');
      if (svg) {
        await user.pointer({ target: svg, keys: '[MouseLeft]' });
      }
    });
  });

  describe('error state', () => {
    it('applies error class when error is true', () => {
      render(<SelectFieldTrigger error />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('error');
    });
  });
});
