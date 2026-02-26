import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NumberField } from './NumberField';

describe('NumberField', () => {
  describe('rendering', () => {
    it('renders with the default placeholder', () => {
      render(<NumberField onChange={vi.fn()} />);

      expect(screen.getByPlaceholderText('Enter number')).toBeInTheDocument();
    });

    it('renders with a custom placeholder', () => {
      render(<NumberField placeholder="Enter age" onChange={vi.fn()} />);

      expect(screen.getByPlaceholderText('Enter age')).toBeInTheDocument();
    });

    it('renders with the given value', () => {
      render(<NumberField value={42} onChange={vi.fn()} />);

      expect(screen.getByRole('spinbutton')).toHaveValue(42);
    });

    it('renders empty when value is null', () => {
      render(<NumberField value={null} onChange={vi.fn()} />);

      expect(screen.getByRole('spinbutton')).toHaveValue(null);
    });

    it('renders the label', () => {
      render(<NumberField label="Age" onChange={vi.fn()} />);

      expect(screen.getByText('Age')).toBeInTheDocument();
    });

    it('renders the error message', () => {
      render(<NumberField errorMessage="Value is required" onChange={vi.fn()} />);

      expect(screen.getByText('Value is required')).toBeInTheDocument();
    });

    it('is disabled when the disabled prop is set', () => {
      render(<NumberField disabled onChange={vi.fn()} />);

      expect(screen.getByRole('spinbutton')).toBeDisabled();
    });
  });

  describe('onChange', () => {
    it('calls onChange with a number when a valid value is typed', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<NumberField onChange={handleChange} />);

      await user.type(screen.getByRole('spinbutton'), '5');

      expect(handleChange).toHaveBeenCalledWith(5);
    });

    it('calls onChange with null when the input is cleared', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<NumberField value={42} onChange={handleChange} />);

      await user.clear(screen.getByRole('spinbutton'));

      expect(handleChange).toHaveBeenCalledWith(null);
    });

    it('calls onChange with a decimal value', () => {
      const handleChange = vi.fn();
      render(<NumberField onChange={handleChange} />);

      fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '3.14' } });

      expect(handleChange).toHaveBeenCalledWith(3.14);
    });

    it('calls onChange with a negative value', () => {
      const handleChange = vi.fn();
      render(<NumberField onChange={handleChange} />);

      fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '-10' } });

      expect(handleChange).toHaveBeenCalledWith(-10);
    });
  });
});
