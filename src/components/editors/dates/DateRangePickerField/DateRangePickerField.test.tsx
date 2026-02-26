import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DateRangePickerField } from './DateRangePickerField';

const JUNE_RANGE = {
  from: new Date('2024-06-01T00:00:00.000Z'),
  to: new Date('2024-06-30T23:59:59.999Z'),
};

const openDropdown = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: /select options/i }));
};

describe('DateRangePickerField', () => {
  describe('rendering', () => {
    it('renders the trigger button', () => {
      render(<DateRangePickerField onChange={vi.fn()} />);

      expect(screen.getByRole('button', { name: /select options/i })).toBeInTheDocument();
    });

    it('shows the default placeholder when no value is provided', () => {
      render(<DateRangePickerField onChange={vi.fn()} />);

      expect(screen.getByText('Select')).toBeInTheDocument();
    });

    it('shows a custom placeholder', () => {
      render(<DateRangePickerField placeholder="Choose dates" onChange={vi.fn()} />);

      expect(screen.getByText('Choose dates')).toBeInTheDocument();
    });

    it('renders the field label', () => {
      render(<DateRangePickerField label="Date range" onChange={vi.fn()} />);

      expect(screen.getByText('Date range')).toBeInTheDocument();
    });

    it('shows the displayValue when provided', () => {
      render(
        <DateRangePickerField
          displayValue="Jan 1 – Jan 31"
          value={JUNE_RANGE}
          onChange={vi.fn()}
        />,
      );

      expect(screen.getByText('Jan 1 – Jan 31')).toBeInTheDocument();
    });

    it('shows the error message', () => {
      render(<DateRangePickerField errorMessage="Date is required" onChange={vi.fn()} />);

      expect(screen.getByText('Date is required')).toBeInTheDocument();
    });

    it('does not show the calendar initially', () => {
      render(<DateRangePickerField onChange={vi.fn()} />);

      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });
  });

  describe('dropdown', () => {
    it('shows the calendar when the trigger is clicked', async () => {
      const user = userEvent.setup();
      render(<DateRangePickerField onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('shows the Apply button inside the dropdown', async () => {
      const user = userEvent.setup();
      render(<DateRangePickerField onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
    });

    it('shows a custom submitLabel', async () => {
      const user = userEvent.setup();
      render(<DateRangePickerField submitLabel="Confirm" onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });

    it('does not open when disabled', async () => {
      const user = userEvent.setup();
      render(<DateRangePickerField disabled onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });

    it('renders multiple month grids when numberOfMonths is set', async () => {
      const user = userEvent.setup();
      render(<DateRangePickerField value={JUNE_RANGE} numberOfMonths={2} onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.getAllByRole('grid')).toHaveLength(2);
    });
  });

  describe('Apply button', () => {
    it('is disabled when no date has been selected', async () => {
      const user = userEvent.setup();
      render(<DateRangePickerField onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
    });

    it('is disabled when the selection matches the current value', async () => {
      const user = userEvent.setup();
      render(<DateRangePickerField value={JUNE_RANGE} onChange={vi.fn()} />);

      await openDropdown(user);

      expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
    });

    it('becomes enabled after selecting a different range', async () => {
      const user = userEvent.setup();
      render(<DateRangePickerField value={JUNE_RANGE} onChange={vi.fn()} />);

      await openDropdown(user);
      await user.click(screen.getByRole('button', { name: /june 5/i }));
      await user.click(screen.getByRole('button', { name: /june 20/i }));

      expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled();
    });
  });

  describe('onChange', () => {
    it('calls onChange with the selected range when Apply is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<DateRangePickerField value={JUNE_RANGE} onChange={handleChange} />);

      await openDropdown(user);
      await user.click(screen.getByRole('button', { name: /june 5/i }));
      await user.click(screen.getByRole('button', { name: /june 20/i }));
      await user.click(screen.getByRole('button', { name: 'Apply' }));

      expect(handleChange).toHaveBeenCalledOnce();
      const arg = handleChange.mock.calls.at(0)?.[0];
      expect(arg?.from).toBeDefined();
      expect(arg?.to).toBeDefined();
    });

    it('closes the dropdown after Apply is clicked', async () => {
      const user = userEvent.setup();
      render(<DateRangePickerField value={JUNE_RANGE} onChange={vi.fn()} />);

      await openDropdown(user);
      await user.click(screen.getByRole('button', { name: /june 5/i }));
      await user.click(screen.getByRole('button', { name: /june 20/i }));
      await user.click(screen.getByRole('button', { name: 'Apply' }));

      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });

    it('does not call onChange when the dropdown is closed without applying', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<DateRangePickerField value={JUNE_RANGE} onChange={handleChange} />);

      await openDropdown(user);
      await user.click(screen.getByRole('button', { name: /june 5/i }));
      await user.keyboard('{Escape}');

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('reverts the selection when the dropdown is closed without applying', async () => {
      const user = userEvent.setup();
      render(<DateRangePickerField value={JUNE_RANGE} onChange={vi.fn()} />);

      await openDropdown(user);
      await user.click(screen.getByRole('button', { name: /june 5/i }));
      await user.click(screen.getByRole('button', { name: /june 20/i }));
      await user.keyboard('{Escape}');

      await openDropdown(user);

      expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
    });

    it('calls onChange with undefined when the clear button is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <DateRangePickerField
          value={JUNE_RANGE}
          clearable
          displayValue="Jun 1 – Jun 30"
          onChange={handleChange}
        />,
      );

      const trigger = screen.getByRole('button', { name: /select options/i });
      const [clearIcon] = trigger.querySelectorAll('svg');
      await user.pointer({ target: clearIcon, keys: '[MouseLeft>]' });

      expect(handleChange).toHaveBeenCalledWith(undefined);
    });
  });
});
