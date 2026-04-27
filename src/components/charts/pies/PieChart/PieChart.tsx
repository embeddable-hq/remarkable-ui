import { FC, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { getPieChartData, getPieChartOptions } from '../pies.utils';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { mergician } from 'mergician';
import { BasePieChartProps } from '../pies.types';
import styles from '../../charts.module.css';
import AnnotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, AnnotationPlugin);

export type PieChartProps = BasePieChartProps;

export const PieChart: FC<PieChartProps> = ({
  data,
  options = {},
  onClick,
  showLegend = true,
  showTooltips = true,
  showValueLabels = true,
}) => {
  const chartRef = useRef(null);
  const pieOptions = mergician(
    getPieChartOptions({
      showLegend,
      showTooltips,
      showValueLabels,
    }),
    options,
  );

  return (
    <div className={styles.chartContainer}>
      <Pie
        ref={chartRef}
        data={getPieChartData(data)}
        options={pieOptions}
        onClick={(event) => onClick?.(event, chartRef)}
      />
    </div>
  );
};
