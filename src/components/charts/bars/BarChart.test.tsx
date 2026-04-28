import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BarChart } from './BarChart';

vi.mock('react-chartjs-2', async () => {
  const { forwardRef } = await import('react');
  return {
    Bar: forwardRef(
      (
        { onClick }: { onClick?: React.MouseEventHandler<HTMLCanvasElement> },
        ref: React.Ref<HTMLCanvasElement>,
      ) => <canvas data-testid="bar-chart" onClick={onClick} ref={ref} />,
    ),
    getElementAtEvent: vi.fn(() => []),
    getElementsAtEvent: vi.fn(() => []),
    getDatasetAtEvent: vi.fn(() => []),
  };
});

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

  describe('onClick', () => {
    it('calls onClick with the event and chartRef', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<BarChart data={MOCK_DATA} onClick={handleClick} />);

      await user.click(screen.getByTestId('bar-chart'));

      expect(handleClick).toHaveBeenCalledWith({
        event: expect.objectContaining({ type: 'click' }),
        elementAtEvent: [],
        elementsAtEvent: [],
        datasetAtEvent: [],
      });
    });

    it('does not throw when onClick is not provided', async () => {
      const user = userEvent.setup();

      render(<BarChart data={MOCK_DATA} />);

      await expect(user.click(screen.getByTestId('bar-chart'))).resolves.not.toThrow();
    });
  });
});
