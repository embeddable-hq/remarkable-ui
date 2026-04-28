import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PieChart } from './PieChart';

vi.mock('react-chartjs-2', async () => {
  const { forwardRef } = await import('react');
  return {
    Pie: forwardRef(
      (
        { onClick }: { onClick?: React.MouseEventHandler<HTMLCanvasElement> },
        ref: React.Ref<HTMLCanvasElement>,
      ) => <canvas data-testid="pie-chart" onClick={onClick} ref={ref} />,
    ),
    getElementAtEvent: vi.fn(() => []),
    getElementsAtEvent: vi.fn(() => []),
    getDatasetAtEvent: vi.fn(() => []),
  };
});

const MOCK_DATA = {
  labels: ['X', 'Y', 'Z'],
  datasets: [{ data: [30, 30, 40] }],
};

describe('PieChart', () => {
  describe('rendering', () => {
    it('renders the chart canvas', () => {
      render(<PieChart data={MOCK_DATA} />);

      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });
  });

  describe('onClick', () => {
    it('calls onClick with the event and chartRef', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<PieChart data={MOCK_DATA} onClick={handleClick} />);

      await user.click(screen.getByTestId('pie-chart'));

      expect(handleClick).toHaveBeenCalledWith({
        event: expect.objectContaining({ type: 'click' }),
        elementAtEvent: [],
        elementsAtEvent: [],
        datasetAtEvent: [],
      });
    });

    it('does not throw when onClick is not provided', async () => {
      const user = userEvent.setup();

      render(<PieChart data={MOCK_DATA} />);

      await expect(user.click(screen.getByTestId('pie-chart'))).resolves.not.toThrow();
    });
  });
});
