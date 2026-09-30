import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getElementAtEvent } from 'react-chartjs-2';
import { ChartData, ChartOptions, LegendItem } from 'chart.js';
import { describe, expect, it, vi } from 'vitest';
import { FunnelChart } from './FunnelChart';
import { funnelDataMock } from './funnel.mock';

const chartPropsSpy = vi.fn();

vi.mock('react-chartjs-2', async () => {
  const { forwardRef } = await import('react');
  return {
    Chart: forwardRef(
      (
        props: {
          onClick?: React.MouseEventHandler<HTMLCanvasElement>;
          data: ChartData<'funnel'>;
          options: ChartOptions<'funnel'>;
        },
        ref: React.Ref<HTMLCanvasElement>,
      ) => {
        chartPropsSpy(props);
        return <canvas data-testid="funnel-chart" onClick={props.onClick} ref={ref} />;
      },
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

      await user.click(screen.getByTestId('funnel-chart'));
    });
  });

  describe('legend click', () => {
    const getLatestChartProps = () =>
      chartPropsSpy.mock.calls.at(-1)?.[0] as {
        data: ChartData<'funnel'>;
        options: ChartOptions<'funnel'>;
      };

    const clickLegendItem = (index: number) => {
      const { options } = getLatestChartProps();
      const onClick = options.plugins?.legend?.onClick as (
        event: unknown,
        legendItem: LegendItem,
        legend: unknown,
      ) => void;
      act(() => onClick({}, { index } as LegendItem, {}));
    };

    it('removes the clicked stage from the rendered data instead of shrinking it', () => {
      chartPropsSpy.mockClear();
      render(<FunnelChart data={MOCK_DATA} />);

      clickLegendItem(1);

      const { data } = getLatestChartProps();
      expect(data.labels).toEqual(['Near Misses', 'Recordable', 'DART']);
      expect(data.datasets[0]?.data).toEqual([33, 14, 5]);
    });

    it('reports the original stage index on chart click after a stage is hidden', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<FunnelChart data={MOCK_DATA} onClick={handleClick} />);

      clickLegendItem(1);
      vi.mocked(getElementAtEvent).mockReturnValueOnce([
        { datasetIndex: 0, index: 1, element: {} as never },
      ]);
      await user.click(screen.getByTestId('funnel-chart'));

      expect(handleClick.mock.calls[0]?.[0].elementAtEvent[0].index).toBe(2);
    });

    it('restores the stage when clicked again', () => {
      chartPropsSpy.mockClear();
      render(<FunnelChart data={MOCK_DATA} />);

      clickLegendItem(1);
      clickLegendItem(1);

      const { data } = getLatestChartProps();
      expect(data.labels).toEqual(MOCK_DATA.labels);
      expect(data.datasets[0]?.data).toEqual(MOCK_DATA.datasets[0]?.data);
    });
  });
});
