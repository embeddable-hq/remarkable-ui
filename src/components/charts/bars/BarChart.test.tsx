import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BarChart } from './BarChart';

vi.mock('react-chartjs-2', () => ({
  Bar: vi.fn(({ onClick }: { onClick?: React.MouseEventHandler<HTMLCanvasElement> }) => (
    <canvas data-testid="bar-chart" onClick={onClick} />
  )),
}));

vi.mock('../chartjs.utils', () => ({
  getSegmentIndexClicked: vi.fn(() => 1),
}));

const MOCK_DATA = {
  labels: ['Jan', 'Feb'],
  datasets: [{ data: [10, 20], label: 'Revenue' }],
};

describe('BarChart', () => {
  describe('rendering', () => {
    it('renders the chart canvas', () => {
      render(<BarChart data={MOCK_DATA} />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('onSegmentClick', () => {
    it('calls onSegmentClick with the clicked segment index', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<BarChart data={MOCK_DATA} onSegmentClick={handleClick} />);

      await user.click(screen.getByTestId('bar-chart'));

      expect(handleClick).toHaveBeenCalledWith(1);
    });

    it('does not throw when onSegmentClick is not provided', async () => {
      const user = userEvent.setup();

      render(<BarChart data={MOCK_DATA} />);

      await expect(user.click(screen.getByTestId('bar-chart'))).resolves.not.toThrow();
    });
  });
});
