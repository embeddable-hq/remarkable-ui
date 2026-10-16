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
    it('renders a labelled clear button when valueLabel and isClearable are set', () => {
      render(<SelectFieldTrigger valueLabel="Something" isClearable onClear={vi.fn()} />);

      expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    });

    it('does not render the clear button without a value', () => {
      render(<SelectFieldTrigger isClearable onClear={vi.fn()} />);

      expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
    });

    it('uses a custom clearLabel', () => {
      render(
        <SelectFieldTrigger
          valueLabel="x"
          isClearable
          clearLabel="Remove filter"
          onClear={vi.fn()}
        />,
      );

      expect(screen.getByRole('button', { name: 'Remove filter' })).toBeInTheDocument();
    });

    it('is a sibling of the trigger, not nested inside it', () => {
      render(<SelectFieldTrigger valueLabel="Something" isClearable onClear={vi.fn()} />);

      const clear = screen.getByRole('button', { name: 'Clear' });
      expect(clear.closest('button:not([aria-label="Clear"])')).toBeNull();
    });

    it('calls onClear on click', async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();
      render(<SelectFieldTrigger valueLabel="Something" isClearable onClear={handleClear} />);

      await user.click(screen.getByRole('button', { name: 'Clear' }));

      expect(handleClear).toHaveBeenCalledOnce();
    });

    it('is reachable and activatable by keyboard', async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();
      render(<SelectFieldTrigger valueLabel="Something" isClearable onClear={handleClear} />);

      await user.tab();
      await user.tab();
      expect(screen.getByRole('button', { name: 'Clear' })).toHaveFocus();
      await user.keyboard('{Enter}');

      expect(handleClear).toHaveBeenCalledOnce();
    });

    it('moves focus back to the trigger after clearing', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <SelectFieldTrigger valueLabel="Something" isClearable onClear={vi.fn()} />,
      );

      await user.click(screen.getByRole('button', { name: 'Clear' }));
      rerender(<SelectFieldTrigger isClearable onClear={vi.fn()} />);

      expect(screen.getByRole('button', { name: 'Select' })).toHaveFocus();
    });

    it('moves focus back to the ghost trigger after clearing', async () => {
      const user = userEvent.setup();
      render(
        <SelectFieldTrigger variant="ghost" valueLabel="Something" isClearable onClear={vi.fn()} />,
      );

      await user.click(screen.getByRole('button', { name: 'Clear' }));

      expect(screen.getByRole('button', { name: /Something/ })).toHaveFocus();
    });

    it('works with the ghost variant', async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();
      render(
        <SelectFieldTrigger
          variant="ghost"
          valueLabel="Something"
          isClearable
          onClear={handleClear}
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Clear' }));

      expect(handleClear).toHaveBeenCalledOnce();
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
