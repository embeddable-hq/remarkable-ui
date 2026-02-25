import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { InputField } from './InputField';
import { MockIcon } from '../../../../test/MockIcon';

describe('InputField', () => {
  describe('rendering', () => {
    it('renders an input with the given value', () => {
      render(<InputField value="hello" onChange={vi.fn()} />);

      expect(screen.getByDisplayValue('hello')).toBeInTheDocument();
    });

    it('renders placeholder text', () => {
      render(<InputField placeholder="Search..." onChange={vi.fn()} />);

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<InputField label="Name" onChange={vi.fn()} />);

      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('renders start icon when provided', () => {
      render(<InputField startIcon={MockIcon} onChange={vi.fn()} />);

      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });
  });

  describe('onChange', () => {
    it('calls onChange with new value when user types', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<InputField value="" onChange={handleChange} />);

      await user.type(screen.getByRole('textbox'), 'hello');

      expect(handleChange).toHaveBeenCalledWith('h');
    });
  });

  describe('clearable', () => {
    it('calls onChange with empty string when clear icon is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      const { container } = render(
        <InputField value="some text" clearable onChange={handleChange} />,
      );

      const clearIcon = container.querySelector('.clearIconVisible');
      expect(clearIcon).toBeInTheDocument();

      await user.click(clearIcon!);

      expect(handleChange).toHaveBeenCalledWith('');
    });
  });

  describe('error state', () => {
    it('shows error message when errorMessage is provided', () => {
      render(<InputField errorMessage="Required field" onChange={vi.fn()} />);

      expect(screen.getByText('Required field')).toBeInTheDocument();
    });

    it('does not show error feedback when errorMessage is not provided', () => {
      render(<InputField onChange={vi.fn()} />);

      expect(screen.queryByText('Required field')).not.toBeInTheDocument();
    });
  });

  describe('disabled', () => {
    it('disables the input when disabled prop is true', () => {
      render(<InputField disabled onChange={vi.fn()} />);

      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to the input element', () => {
      const ref = createRef<HTMLInputElement>();

      render(<InputField ref={ref} onChange={vi.fn()} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });
});
