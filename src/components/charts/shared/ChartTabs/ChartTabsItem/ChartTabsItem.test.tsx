import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ChartTabsItem } from './ChartTabsItem';

describe('ChartTabsItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the label', () => {
    render(<ChartTabsItem id="revenue" label="Revenue" value={100} onClick={vi.fn()} />);

    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders the value', () => {
    render(<ChartTabsItem id="revenue" label="Revenue" value={42} onClick={vi.fn()} />);

    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders a string value', () => {
    render(<ChartTabsItem id="revenue" label="Revenue" value="$1,000" onClick={vi.fn()} />);

    expect(screen.getByText('$1,000')).toBeInTheDocument();
  });

  it('renders slot content', () => {
    render(
      <ChartTabsItem
        id="revenue"
        label="Revenue"
        value={100}
        onClick={vi.fn()}
        slot={<span>extra content</span>}
      />,
    );

    expect(screen.getByText('extra content')).toBeInTheDocument();
  });

  it('sets the button id based on the id prop', () => {
    render(<ChartTabsItem id="revenue" label="Revenue" value={100} onClick={vi.fn()} />);

    expect(screen.getByRole('button')).toHaveAttribute('id', 'chart-kpi-tab-revenue');
  });

  it('calls onClick when the button is clicked', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<ChartTabsItem id="revenue" label="Revenue" value={100} onClick={onClick} />);

    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
