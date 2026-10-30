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
import { buildChartjsOnClick } from '../chartjs.utils';
import { useChartFontsReady } from '../../../hooks/useChartFontsReady.hook';
import styles from '../charts.module.css';
import { describeCartesianChart } from '../chartjs.a11y.utils';
import { useChartA11y } from '../useChartA11y.hook';

import { FC, useRef } from 'react';
import { mergician } from 'mergician';
import { BaseLineChartProps } from './lines.types';
import { getLineChartData, getLineChartOptions } from './lines.utils';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AnnotationPlugin from 'chartjs-plugin-annotation';

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
  AnnotationPlugin,
);

export type LineChartProps = BaseLineChartProps;

export const LineChart: FC<LineChartProps> = ({
  options = {},
  data,
  onClick,
  ariaLabel,
  ariaDescription,
  ...props
}) => {
  const chartRef = useRef(null);
  useChartFontsReady(chartRef);
  const { canvasProps, description } = useChartA11y({
    ariaLabel,
    ariaDescription,
    defaultLabel: 'Line chart',
    getSummary: () =>
      describeCartesianChart({
        type: 'line',
        data,
        xAxisLabel: props.xAxisLabel,
        yAxisLabel: props.yAxisLabel,
      }),
    summaryDeps: [data, props.xAxisLabel, props.yAxisLabel],
  });

  const lineOptions = mergician(getLineChartOptions(props), options);

  return (
    <div className={styles.chartContainer}>
      <Line
        ref={chartRef}
        data={getLineChartData(data)}
        options={lineOptions}
        onClick={buildChartjsOnClick(chartRef, onClick)}
        {...canvasProps}
      />
      {description}
    </div>
  );
};
