import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DonutChart } from './DonutChart';

vi.mock('react-chartjs-2', async () => {
  const { forwardRef } = await import('react');
  return {
    Pie: forwardRef(
      (
        { onClick }: { onClick?: React.MouseEventHandler<HTMLCanvasElement> },
        ref: React.Ref<HTMLCanvasElement>,
      ) => <canvas data-testid="donut-chart" onClick={onClick} ref={ref} />,
    ),
    getElementAtEvent: vi.fn(() => []),
    getElementsAtEvent: vi.fn(() => []),
    getDatasetAtEvent: vi.fn(() => []),
  };
});

vi.mock('../../../../hooks/useResizeObserver.hook', () => ({
  useResizeObserver: vi.fn(() => ({ width: 400, height: 300 })),
}));

const MOCK_DATA = {
  labels: ['A', 'B'],
  datasets: [{ data: [60, 40] }],
};

describe('DonutChart', () => {
  describe('rendering', () => {
    it('renders the chart when container has sufficient size', () => {
      render(<DonutChart data={MOCK_DATA} />);

      expect(screen.getByTestId('donut-chart')).toBeInTheDocument();
    });

    it('does not render the chart when container is too small', async () => {
      const { useResizeObserver } = await import('../../../../hooks/useResizeObserver.hook');
      vi.mocked(useResizeObserver).mockReturnValueOnce({ width: 5, height: 5 });

      render(<DonutChart data={MOCK_DATA} />);

      expect(screen.queryByTestId('donut-chart')).not.toBeInTheDocument();
    });
  });

  describe('onClick', () => {
    it('calls onClick with the event and chartRef', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<DonutChart data={MOCK_DATA} onClick={handleClick} />);

      await user.click(screen.getByTestId('donut-chart'));

      expect(handleClick).toHaveBeenCalledWith({
        event: expect.objectContaining({ type: 'click' }),
        elementAtEvent: [],
        elementsAtEvent: [],
        datasetAtEvent: [],
      });
    });

    it('does not throw when onClick is not provided', async () => {
      const user = userEvent.setup();

      render(<DonutChart data={MOCK_DATA} />);

      await expect(user.click(screen.getByTestId('donut-chart'))).resolves.not.toThrow();
    });
  });
});
