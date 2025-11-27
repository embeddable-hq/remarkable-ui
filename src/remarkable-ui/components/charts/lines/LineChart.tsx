import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from '../charts.module.css';
import { FC, useRef } from 'react';
import { mergician } from 'mergician';
import { BaseLineChartProps } from './lines.types';
import { getLineChartData, getLineChartOptions } from './lines.utils';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getSegmentIndexClicked } from '../chartjs.utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LogarithmicScale,
  Filler,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

export type LineChartProps = BaseLineChartProps;

export const LineChart: FC<LineChartProps> = ({ options = {}, data, onSegmentClick, ...props }) => {
  const chartRef = useRef(null);

  const pieOptions = mergician(getLineChartOptions(props), options);

  const handleSegmentClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const indexClicked = getSegmentIndexClicked(event, chartRef);
    onSegmentClick?.(indexClicked);
  };

  return (
    <div className={styles.chartContainer}>
      <Line
        ref={chartRef}
        data={getLineChartData(data)}
        options={pieOptions}
        onClick={handleSegmentClick}
      />
    </div>
  );
};
