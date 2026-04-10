import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ScatterChart } from './ScatterChart';

vi.mock('react-chartjs-2', () => ({
  Scatter: vi.fn(({ onClick }: { onClick?: React.MouseEventHandler<HTMLCanvasElement> }) => (
    <canvas data-testid="scatter-chart" onClick={onClick} />
  )),
}));

vi.mock('../chartjs.utils', () => ({
  getScatterPointClicked: vi.fn(() => ({ datasetIndex: 0, index: 1 })),
}));

const MOCK_DATA = {
  datasets: [
    {
      label: 'S',
      data: [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
      ],
    },
  ],
};

describe('ScatterChart', () => {
  describe('rendering', () => {
    it('renders the chart canvas', () => {
      render(<ScatterChart data={MOCK_DATA} />);

      expect(screen.getByTestId('scatter-chart')).toBeInTheDocument();
    });
  });

  describe('onPointClick', () => {
    it('calls onPointClick with the clicked point hit', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<ScatterChart data={MOCK_DATA} onPointClick={handleClick} />);

      await user.click(screen.getByTestId('scatter-chart'));

      expect(handleClick).toHaveBeenCalledWith({ datasetIndex: 0, index: 1 });
    });

    it('does not throw when onPointClick is not provided', async () => {
      const user = userEvent.setup();

      render(<ScatterChart data={MOCK_DATA} />);

      await expect(user.click(screen.getByTestId('scatter-chart'))).resolves.toBeUndefined();
    });
  });
});
