import { getElementAtEvent, getElementsAtEvent, getDatasetAtEvent } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import { ChartClickArgs } from './charts.types';

export function buildChartjsOnClick(
  chartRef: { current: unknown },
  onClick: ((args: ChartClickArgs) => void) | undefined,
) {
  return (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!chartRef.current) return;
    const chart = chartRef.current as Chart;
    onClick?.({
      event,
      elementAtEvent: getElementAtEvent(chart, event),
      elementsAtEvent: getElementsAtEvent(chart, event),
      datasetAtEvent: getDatasetAtEvent(chart, event),
    });
  };
}
