import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';

export type ScatterPointClickHit = { datasetIndex: number; index: number };

export const getScatterPointClicked = (
  event: React.MouseEvent<HTMLCanvasElement>,
  chartRef: React.RefObject<ChartJSOrUndefined | null>,
): ScatterPointClickHit | undefined => {
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

export const getSegmentIndexClicked = (
  event: React.MouseEvent<HTMLCanvasElement>,
  chartRef: React.RefObject<ChartJSOrUndefined | null>,
): number | undefined => {
  const chart = chartRef.current;

  if (!chart) return undefined;

  const points = chart.getElementsAtEventForMode(
    event.nativeEvent,
    'nearest',
    { intersect: true },
    false,
  );

  return points[0]?.index;
};
