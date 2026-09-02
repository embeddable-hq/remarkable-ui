import { FC, useRef } from 'react';
import { Chart } from 'react-chartjs-2';
import { buildChartjsOnClick } from '../chartjs.utils';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { FunnelController, TrapezoidElement } from 'chartjs-chart-funnel';
import { getFunnelChartData, getFunnelChartOptions } from './funnel.utils';
import { ChartClickArgs } from '../charts.types';
import styles from '../charts.module.css';
import { mergician } from 'mergician';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  FunnelController,
  TrapezoidElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels,
);

export type FunnelChartProps = {
  data: ChartData<'funnel'>;
  options?: Partial<ChartOptions<'funnel'>>;
  onClick?: (args: ChartClickArgs) => void;
  showLegend?: boolean;
  showTooltips?: boolean;
  showPercentage?: boolean;
  percentageDecimalPlaces?: number;
};

export const FunnelChart: FC<FunnelChartProps> = ({
  data,
  options = {},
  onClick,
  showLegend = true,
  showTooltips = true,
  showPercentage = false,
  percentageDecimalPlaces = 1,
}) => {
  const chartRef = useRef(null);
  const funnelOptions = mergician(
    getFunnelChartOptions({ showLegend, showTooltips, showPercentage, percentageDecimalPlaces }),
    options,
  );

  return (
    <div className={styles.chartContainer}>
      <Chart
        ref={chartRef}
        type="funnel"
        data={getFunnelChartData(data)}
        options={funnelOptions}
        onClick={buildChartjsOnClick(chartRef, onClick)}
      />
    </div>
  );
};
