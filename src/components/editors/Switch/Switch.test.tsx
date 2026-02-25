import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  describe('rendering', () => {
    it('renders a checkbox input', () => {
      render(<Switch aria-label="Toggle" />);

      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('renders a label when the label prop is provided', () => {
      render(<Switch label="Enable notifications" aria-label="Toggle" />);

      expect(screen.getByText('Enable notifications')).toBeInTheDocument();
    });

    it('does not render a label element when label is not provided', () => {
      render(<Switch aria-label="Toggle" />);

      expect(screen.queryByText(/./)).not.toBeInTheDocument();
    });

    it('applies the className prop to the wrapper', () => {
      const { container } = render(<Switch aria-label="Toggle" className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('checked state', () => {
    it('reflects checked=true on the input', () => {
      render(<Switch aria-label="Toggle" checked onChange={vi.fn()} />);

      expect(screen.getByRole('switch')).toBeChecked();
    });

    it('reflects checked=false on the input', () => {
      render(<Switch aria-label="Toggle" checked={false} onChange={vi.fn()} />);

      expect(screen.getByRole('switch')).not.toBeChecked();
    });
  });

  describe('disabled state', () => {
    it('disables the input when disabled prop is true', () => {
      render(<Switch aria-label="Toggle" disabled />);

      expect(screen.getByRole('switch')).toBeDisabled();
    });

    it('does not call onChange when clicked while disabled', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Switch aria-label="Toggle" disabled onChange={handleChange} />);

      await user.click(screen.getByRole('switch'));

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('onChange', () => {
    it('calls onChange with true when toggled on', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Switch aria-label="Toggle" checked={false} onChange={handleChange} />);

      await user.click(screen.getByRole('switch'));

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('calls onChange with false when toggled off', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Switch aria-label="Toggle" checked onChange={handleChange} />);

      await user.click(screen.getByRole('switch'));

      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('does not throw when onChange is not provided', async () => {
      const user = userEvent.setup();
      render(<Switch aria-label="Toggle" checked={false} />);

      await expect(user.click(screen.getByRole('switch'))).resolves.not.toThrow();
    });
  });

  describe('accessibility', () => {
    it('sets aria-checked to true when checked', () => {
      render(<Switch aria-label="Toggle" checked onChange={vi.fn()} />);

      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    });

    it('sets aria-checked to false when unchecked', () => {
      render(<Switch aria-label="Toggle" checked={false} onChange={vi.fn()} />);

      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    });

    it('sets aria-disabled when disabled', () => {
      render(<Switch aria-label="Toggle" disabled />);

      expect(screen.getByRole('switch')).toHaveAttribute('aria-disabled', 'true');
    });

    it('forwards aria-label to the input', () => {
      render(<Switch aria-label="Dark mode" />);

      expect(screen.getByRole('switch')).toHaveAttribute('aria-label', 'Dark mode');
    });

    it('warns when aria-label is not provided', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      render(<Switch />);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('aria-label'));
      consoleSpy.mockRestore();
    });
  });
});
