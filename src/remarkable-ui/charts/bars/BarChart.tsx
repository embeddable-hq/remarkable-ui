import { FC, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale,
} from 'chart.js';
import { BaseBarChartProps } from './bars.types';
import { getSegmentIndexClicked } from '../chartjs.utils';
import { getBarChartOptions } from './bars.constants';
import { getBarChartData } from './bars.utils';

ChartJS.register(CategoryScale, LinearScale, BarElement, LogarithmicScale, Title, Tooltip, Legend);

export type BarChartProps = BaseBarChartProps;

export const BarChart: FC<BarChartProps> = ({
  data,
  onSegmentClick,
  horizontal = false,
  showLegend = false,
  showTooltips = true,
  showValueLabels = false,
  showLogarithmicScale = false,
  xAxisLabel,
  yAxisLabel,
  reverseXAxis = false,
  reverseYAxis = false,
  yAxisRange = undefined,
  xAxisRange = undefined,
}) => {
  const chartRef = useRef(null);

  const barChartOptions = getBarChartOptions({
    horizontal,
    showLegend,
    showTooltips,
    showValueLabels,
    showLogarithmicScale,
    xAxisLabel,
    yAxisLabel,
    reverseXAxis,
    reverseYAxis,
    yAxisRange,
    xAxisRange,
  });

  const handleSegmentClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const indexClicked = getSegmentIndexClicked(event, chartRef);
    onSegmentClick?.(indexClicked);
  };

  return (
    <Bar
      ref={chartRef}
      data={getBarChartData(data)}
      options={barChartOptions}
      onClick={handleSegmentClick}
    />
  );
};
