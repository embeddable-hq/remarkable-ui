import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TextField } from './TextField';

describe('TextField', () => {
  describe('rendering', () => {
    it('renders with the default placeholder', () => {
      render(<TextField onChange={vi.fn()} />);

      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders with a custom placeholder', () => {
      render(<TextField placeholder="Search..." onChange={vi.fn()} />);

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('renders with the given value', () => {
      render(<TextField value="Hello" onChange={vi.fn()} />);

      expect(screen.getByRole('textbox')).toHaveValue('Hello');
    });

    it('renders the label', () => {
      render(<TextField label="Name" onChange={vi.fn()} />);

      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('renders the error message', () => {
      render(<TextField errorMessage="This field is required" onChange={vi.fn()} />);

      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('is disabled when the disabled prop is set', () => {
      render(<TextField disabled onChange={vi.fn()} />);

      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });

  describe('character count', () => {
    it('does not show the character count when maxLength is not provided', () => {
      render(<TextField value="Hello" onChange={vi.fn()} />);

      expect(screen.queryByText(/characters/i)).not.toBeInTheDocument();
    });

    it('shows the character count when maxLength is provided', () => {
      render(<TextField value="Hello" maxLength={100} onChange={vi.fn()} />);

      expect(screen.getByText('5/100 Characters')).toBeInTheDocument();
    });

    it('shows zero count when value is empty', () => {
      render(<TextField value="" maxLength={50} onChange={vi.fn()} />);

      expect(screen.getByText('0/50 Characters')).toBeInTheDocument();
    });
  });

  describe('onChange', () => {
    it('calls onChange with the typed text', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<TextField onChange={handleChange} />);

      await user.type(screen.getByRole('textbox'), 'H');

      expect(handleChange).toHaveBeenCalledWith('H');
    });

    it('calls onChange when the input is cleared', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<TextField value="Hello" onChange={handleChange} />);

      await user.clear(screen.getByRole('textbox'));

      expect(handleChange).toHaveBeenCalledWith('');
    });
  });
});
