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
} from 'chart.js';
import { mergician } from 'mergician';
import { BaseBarChartProps } from './bars.types';
import { getSegmentIndexClicked } from '../chartjs.utils';
import { getBarData } from './bars.utils';
import { defaultBarChartOptions } from './bars.constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export type BarChartProps = BaseBarChartProps;

export const BarChart: FC<BarChartProps> = ({ data, options = {}, onSegmentClick }) => {
  const chartRef = useRef(null);

  const barOptions = mergician(defaultBarChartOptions, options);

  const handleSegmentClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const indexClicked = getSegmentIndexClicked(event, chartRef);
    onSegmentClick?.(indexClicked);
  };

  return (
    <Bar ref={chartRef} data={getBarData(data)} options={barOptions} onClick={handleSegmentClick} />
  );
};
