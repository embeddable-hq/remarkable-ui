import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LineChart } from './LineChart';

vi.mock('react-chartjs-2', async () => {
  const { forwardRef } = await import('react');
  return {
    Line: forwardRef(
      (
        { onClick }: { onClick?: React.MouseEventHandler<HTMLCanvasElement> },
        ref: React.Ref<HTMLCanvasElement>,
      ) => <canvas data-testid="line-chart" onClick={onClick} ref={ref} />,
    ),
    getElementAtEvent: vi.fn(() => []),
    getElementsAtEvent: vi.fn(() => []),
    getDatasetAtEvent: vi.fn(() => []),
  };
});

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

  describe('onClick', () => {
    it('calls onClick with the event and chartRef', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<LineChart data={MOCK_DATA} onClick={handleClick} />);

      await user.click(screen.getByTestId('line-chart'));

      expect(handleClick).toHaveBeenCalledWith({
        event: expect.objectContaining({ type: 'click' }),
        elementAtEvent: [],
        elementsAtEvent: [],
        datasetAtEvent: [],
      });
    });

    it('does not throw when onClick is not provided', async () => {
      const user = userEvent.setup();

      render(<LineChart data={MOCK_DATA} />);

      await expect(user.click(screen.getByTestId('line-chart'))).resolves.not.toThrow();
    });
  });
});
