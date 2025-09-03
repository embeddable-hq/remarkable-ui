import { FC, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { getPieData } from './pies.utils';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getSegmentIndexClicked } from '../chartjs.utils';
import { mergician } from 'mergician';
import { BasePieChartProps } from './pies.types';
import { defaultPieChartOptions } from './pies.constants';
import styles from '../charts.module.css';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export type PieChartProps = BasePieChartProps;

export const PieChart: FC<PieChartProps> = ({ data, options = {}, onSegmentClick }) => {
  const chartRef = useRef(null);

  const pieOptions = mergician(defaultPieChartOptions, options);

  const handleSegmentClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const indexClicked = getSegmentIndexClicked(event, chartRef);
    onSegmentClick?.(indexClicked);
  };

  return (
    <div className={styles.chartContainer}>
      <Pie
        ref={chartRef}
        data={getPieData(data)}
        options={pieOptions}
        onClick={handleSegmentClick}
      />
    </div>
  );
};
