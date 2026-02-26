import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DateRangePicker } from './DateRangePicker';

const JUNE_VALUE = { from: new Date('2024-06-01T00:00:00.000Z') };

describe('DateRangePicker', () => {
  it('renders the calendar', () => {
    render(<DateRangePicker value={JUNE_VALUE} onChange={vi.fn()} />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('shows the month of the from date', () => {
    render(<DateRangePicker value={JUNE_VALUE} onChange={vi.fn()} />);

    expect(screen.getByRole('grid', { name: /june 2024/i })).toBeInTheDocument();
  });

  it('renders the correct number of month grids', () => {
    render(<DateRangePicker value={JUNE_VALUE} numberOfMonths={2} onChange={vi.fn()} />);

    expect(screen.getAllByRole('grid')).toHaveLength(2);
  });

  it('renders day buttons for the given month', () => {
    render(<DateRangePicker value={JUNE_VALUE} onChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /june 15/i })).toBeInTheDocument();
  });

  it('calls onChange when selecting the start of a range', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<DateRangePicker value={JUNE_VALUE} onChange={handleChange} />);

    await user.click(screen.getByRole('button', { name: /june 10/i }));

    expect(handleChange).toHaveBeenCalledOnce();
  });

  it('calls onChange with a complete range when two dates are selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<DateRangePicker value={JUNE_VALUE} onChange={handleChange} />);

    await user.click(screen.getByRole('button', { name: /june 5/i }));
    await user.click(screen.getByRole('button', { name: /june 20/i }));

    const lastCall = handleChange.mock.calls.at(-1)?.[0];
    expect(lastCall?.from).toBeDefined();
    expect(lastCall?.to).toBeDefined();
  });

  it('sets end of day UTC on the to date', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<DateRangePicker value={JUNE_VALUE} onChange={handleChange} />);

    await user.click(screen.getByRole('button', { name: /june 5/i }));
    await user.click(screen.getByRole('button', { name: /june 20/i }));

    const lastCall = handleChange.mock.calls.at(-1)?.[0];
    const to: Date = lastCall!.to;
    expect(to.getUTCHours()).toBe(23);
    expect(to.getUTCMinutes()).toBe(59);
    expect(to.getUTCSeconds()).toBe(59);
    expect(to.getUTCMilliseconds()).toBe(999);
  });

  it('navigates to the next month when the next chevron is clicked', async () => {
    const user = userEvent.setup();

    render(<DateRangePicker value={JUNE_VALUE} onChange={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /go to the next month/i }));

    expect(screen.getByRole('grid', { name: /july 2024/i })).toBeInTheDocument();
  });

  it('calls onChange with undefined when the only selected date is clicked again', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const value = {
      from: new Date('2024-06-10T00:00:00.000Z'),
      to: new Date('2024-06-10T23:59:59.999Z'),
    };

    render(<DateRangePicker value={value} onChange={handleChange} />);

    await user.click(screen.getByRole('button', { name: /june 10/i }));

    expect(handleChange).toHaveBeenCalledWith(undefined);
  });

  it('marks the from date as selected', () => {
    const value = {
      from: new Date('2024-06-05T00:00:00.000Z'),
      to: new Date('2024-06-20T23:59:59.999Z'),
    };

    render(<DateRangePicker value={value} onChange={vi.fn()} />);

    const startCell = screen.getByRole('button', { name: /june 5/i }).closest('[aria-selected]');
    expect(startCell).toHaveAttribute('aria-selected', 'true');
  });

  it('marks the to date as selected', () => {
    const value = {
      from: new Date('2024-06-05T00:00:00.000Z'),
      to: new Date('2024-06-20T23:59:59.999Z'),
    };

    render(<DateRangePicker value={value} onChange={vi.fn()} />);

    const endCell = screen.getByRole('button', { name: /june 20/i }).closest('[aria-selected]');
    expect(endCell).toHaveAttribute('aria-selected', 'true');
  });
});
