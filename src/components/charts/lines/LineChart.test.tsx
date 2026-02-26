import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LineChart } from './LineChart';

vi.mock('react-chartjs-2', () => ({
  Line: vi.fn(({ onClick }: { onClick?: React.MouseEventHandler<HTMLCanvasElement> }) => (
    <canvas data-testid="line-chart" onClick={onClick} />
  )),
}));

vi.mock('../chartjs.utils', () => ({
  getSegmentIndexClicked: vi.fn(() => 0),
}));

const MOCK_DATA = {
  labels: ['Jan', 'Feb', 'Mar'],
  datasets: [{ data: [5, 15, 10], label: 'Sales' }],
};

describe('LineChart', () => {
  describe('rendering', () => {
    it('renders the chart canvas', () => {
      render(<LineChart data={MOCK_DATA} />);

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  describe('onSegmentClick', () => {
    it('calls onSegmentClick with the clicked segment index', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<LineChart data={MOCK_DATA} onSegmentClick={handleClick} />);

      await user.click(screen.getByTestId('line-chart'));

      expect(handleClick).toHaveBeenCalledWith(0);
    });

    it('does not throw when onSegmentClick is not provided', async () => {
      const user = userEvent.setup();

      render(<LineChart data={MOCK_DATA} />);

      await expect(user.click(screen.getByTestId('line-chart'))).resolves.not.toThrow();
    });
  });
});
