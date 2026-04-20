import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';

export type ChartPointClickHit = { datasetIndex: number; index: number };

export const getChartPointClicked = (
  event: React.MouseEvent<HTMLCanvasElement>,
  chartRef: React.RefObject<ChartJSOrUndefined | null>,
): ChartPointClickHit | undefined => {
  const chart = chartRef.current;

  if (!chart) return undefined;

  const points = chart.getElementsAtEventForMode(
    event.nativeEvent,
    'nearest',
    { intersect: true },
    false,
  );

  const el = points[0];
  if (!el) return undefined;

  return { datasetIndex: el.datasetIndex, index: el.index };
};
