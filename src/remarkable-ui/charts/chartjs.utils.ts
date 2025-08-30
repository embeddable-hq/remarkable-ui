import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';

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
