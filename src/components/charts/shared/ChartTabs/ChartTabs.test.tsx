import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ChartTabs } from './ChartTabs';
import type { ChartTabsItemProps } from './ChartTabsItem/ChartTabsItem';

const mockHandleScrollLeft = vi.fn();
const mockHandleScrollRight = vi.fn();
let mockCanScrollLeft = false;
let mockCanScrollRight = false;

vi.mock('../../../../hooks/useHorizontalScroll.hooks', () => ({
  useHorizontalScroll: () => ({
    scrollRef: { current: null },
    canScrollLeft: mockCanScrollLeft,
    canScrollRight: mockCanScrollRight,
    handleScrollLeft: mockHandleScrollLeft,
    handleScrollRight: mockHandleScrollRight,
  }),
}));

vi.mock('../../../shared/ActionIcon/ActionIcon', () => ({
  ActionIcon: ({ icon: Icon, onClick }: { icon: React.ComponentType; onClick: () => void }) => (
    <button onClick={onClick}>
      <Icon />
    </button>
  ),
}));

vi.mock('@tabler/icons-react', () => ({
  IconChevronLeft: () => <span data-testid="icon-chevron-left" />,
  IconChevronRight: () => <span data-testid="icon-chevron-right" />,
}));

const makeItem = (id: string, label: string, value: number): ChartTabsItemProps => ({
  id,
  label,
  value,
  onClick: vi.fn(),
});

const items: ChartTabsItemProps[] = [
  makeItem('revenue', 'Revenue', 100),
  makeItem('cost', 'Cost', 50),
];

describe('ChartTabs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCanScrollLeft = false;
    mockCanScrollRight = false;
  });

  it('renders a tab for each item', () => {
    render(<ChartTabs items={items} value="revenue" onChange={vi.fn()} />);

    expect(screen.getByRole('tab', { name: /revenue/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /cost/i })).toBeInTheDocument();
  });

  it('applies tabActive class only to the active tab', () => {
    render(<ChartTabs items={items} value="revenue" onChange={vi.fn()} />);

    expect(screen.getByRole('tab', { name: /revenue/i }).className).toContain('active');
    expect(screen.getByRole('tab', { name: /cost/i }).className).not.toContain('active');
  });

  it('displays the value for each tab', () => {
    render(<ChartTabs items={items} value="revenue" onChange={vi.fn()} />);

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('calls onChange with the item id when a tab is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<ChartTabs items={items} value="revenue" onChange={onChange} />);

    await user.click(screen.getByRole('tab', { name: /cost/i }));
    expect(onChange).toHaveBeenCalledWith('cost');
  });

  it('shows left scroll button when canScrollLeft is true', () => {
    mockCanScrollLeft = true;

    render(<ChartTabs items={items} value="revenue" onChange={vi.fn()} />);

    expect(screen.getByTestId('icon-chevron-left')).toBeInTheDocument();
  });

  it('shows right scroll button when canScrollRight is true', () => {
    mockCanScrollRight = true;

    render(<ChartTabs items={items} value="revenue" onChange={vi.fn()} />);

    expect(screen.getByTestId('icon-chevron-right')).toBeInTheDocument();
  });

  it('hides scroll buttons when scroll is not needed', () => {
    render(<ChartTabs items={items} value="revenue" onChange={vi.fn()} />);

    expect(screen.queryByTestId('icon-chevron-left')).not.toBeInTheDocument();
    expect(screen.queryByTestId('icon-chevron-right')).not.toBeInTheDocument();
  });

  it('calls handleScrollLeft when left scroll button is clicked', async () => {
    mockCanScrollLeft = true;
    const user = userEvent.setup();

    render(<ChartTabs items={items} value="revenue" onChange={vi.fn()} />);

    await user.click(screen.getByTestId('icon-chevron-left').closest('button')!);
    expect(mockHandleScrollLeft).toHaveBeenCalledTimes(1);
  });

  it('calls handleScrollRight when right scroll button is clicked', async () => {
    mockCanScrollRight = true;
    const user = userEvent.setup();

    render(<ChartTabs items={items} value="revenue" onChange={vi.fn()} />);

    await user.click(screen.getByTestId('icon-chevron-right').closest('button')!);
    expect(mockHandleScrollRight).toHaveBeenCalledTimes(1);
  });
});
