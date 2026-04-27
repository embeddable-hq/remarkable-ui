import { Chart } from 'chart.js';

export const getSegmentIndexClicked = (
  event: React.MouseEvent<HTMLCanvasElement>,
): number | undefined => {
  const chart = Chart.getChart(event.nativeEvent.target as HTMLCanvasElement);

  if (!chart) return undefined;

  const points = chart.getElementsAtEventForMode(
    event.nativeEvent,
    'nearest',
    { intersect: true },
    false,
  );

  return points[0]?.index;
};
