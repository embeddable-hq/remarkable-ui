import { FC, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { buildChartjsOnClick } from '../chartjs.utils';
import { useChartFontsReady } from '../../../hooks/useChartFontsReady.hook';
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
import { getBarChartData, getBarChartOptions } from './bars.utils';
import styles from '../charts.module.css';
import { describeCartesianChart } from '../chartjs.a11y.utils';
import { useChartA11y } from '../useChartA11y.hook';

import { mergician } from 'mergician';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LogarithmicScale,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

export type BarChartProps = BaseBarChartProps;

export const BarChart: FC<BarChartProps> = ({
  data,
  onClick,
  options = {},
  ariaLabel,
  ariaDescription,
  ...props
}) => {
  const chartRef = useRef(null);
  useChartFontsReady(chartRef);
  const { canvasProps, description } = useChartA11y({
    ariaLabel,
    ariaDescription,
    defaultLabel: 'Bar chart',
    getSummary: () =>
      describeCartesianChart({
        type: 'bar',
        data,
        xAxisLabel: props.xAxisLabel,
        yAxisLabel: props.yAxisLabel,
      }),
    summaryDeps: [data, props.xAxisLabel, props.yAxisLabel],
  });
  const barChartOptions = mergician(getBarChartOptions(props), options);

  return (
    <div className={styles.chartContainer}>
      <Bar
        ref={chartRef}
        data={getBarChartData(data)}
        options={barChartOptions}
        onClick={buildChartjsOnClick(chartRef, onClick)}
        {...canvasProps}
      />
      {description}
    </div>
  );
};
