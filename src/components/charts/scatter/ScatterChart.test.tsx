import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ScatterChart } from './ScatterChart';

vi.mock('react-chartjs-2', async () => {
  const { forwardRef } = await import('react');
  return {
    Scatter: forwardRef(
      (
        { onClick }: { onClick?: React.MouseEventHandler<HTMLCanvasElement> },
        ref: React.Ref<HTMLCanvasElement>,
      ) => <canvas data-testid="scatter-chart" onClick={onClick} ref={ref} />,
    ),
    getElementAtEvent: vi.fn(() => []),
    getElementsAtEvent: vi.fn(() => []),
    getDatasetAtEvent: vi.fn(() => []),
  };
});

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

  describe('onClick', () => {
    it('calls onClick with the event and chartRef', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<ScatterChart data={MOCK_DATA} onClick={handleClick} />);

      await user.click(screen.getByTestId('scatter-chart'));

      expect(handleClick).toHaveBeenCalledWith({
        event: expect.objectContaining({ type: 'click' }),
        elementAtEvent: [],
        elementsAtEvent: [],
        datasetAtEvent: [],
      });
    });

    it('does not throw when onClick is not provided', async () => {
      const user = userEvent.setup();

      render(<ScatterChart data={MOCK_DATA} />);

      await expect(user.click(screen.getByTestId('scatter-chart'))).resolves.toBeUndefined();
    });
  });
});
