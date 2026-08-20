import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FunnelChart } from './FunnelChart';
import { funnelDataMock } from './funnel.mock';

vi.mock('react-chartjs-2', async () => {
  const { forwardRef } = await import('react');
  return {
    Chart: forwardRef(
      (
        { onClick }: { onClick?: React.MouseEventHandler<HTMLCanvasElement> },
        ref: React.Ref<HTMLCanvasElement>,
      ) => <canvas data-testid="funnel-chart" onClick={onClick} ref={ref} />,
    ),
    getElementAtEvent: vi.fn(() => []),
    getElementsAtEvent: vi.fn(() => []),
    getDatasetAtEvent: vi.fn(() => []),
  };
});

const MOCK_DATA = funnelDataMock;

describe('FunnelChart', () => {
  describe('rendering', () => {
    it('renders the chart canvas', () => {
      render(<FunnelChart data={MOCK_DATA} />);

      expect(screen.getByTestId('funnel-chart')).toBeInTheDocument();
    });
  });

  describe('onClick', () => {
    it('calls onClick with the event and chartRef', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<FunnelChart data={MOCK_DATA} onClick={handleClick} />);

      await user.click(screen.getByTestId('funnel-chart'));

      expect(handleClick).toHaveBeenCalledWith({
        event: expect.objectContaining({ type: 'click' }),
        elementAtEvent: [],
        elementsAtEvent: [],
        datasetAtEvent: [],
      });
    });

    it('does not throw when onClick is not provided', async () => {
      const user = userEvent.setup();

      render(<FunnelChart data={MOCK_DATA} />);

      await expect(user.click(screen.getByTestId('funnel-chart'))).resolves.not.toThrow();
    });
  });
});
