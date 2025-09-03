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
import styles from '../charts.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LogarithmicScale, Title, Tooltip, Legend);

export type BarChartProps = BaseBarChartProps;

export const BarChart: FC<BarChartProps> = ({ data, onSegmentClick, ...props }) => {
  const chartRef = useRef(null);

  const barChartOptions = getBarChartOptions(props);

  const handleSegmentClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const indexClicked = getSegmentIndexClicked(event, chartRef);
    onSegmentClick?.(indexClicked);
  };

  return (
    <div className={styles.chartContainer}>
      <Bar
        ref={chartRef}
        data={getBarChartData(data)}
        options={barChartOptions}
        onClick={handleSegmentClick}
      />
    </div>
  );
};
