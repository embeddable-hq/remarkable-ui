import { Chart } from 'chart.js';

export type ChartPointClicked = { datasetIndex: number; index: number };

export const getChartPointClicked = (
  event: React.MouseEvent<HTMLCanvasElement>,
): ChartPointClicked | undefined => {
  const chart = Chart.getChart(event.nativeEvent.target as HTMLCanvasElement);

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
