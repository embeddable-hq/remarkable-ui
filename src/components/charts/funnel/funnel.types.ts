import 'chartjs-chart-funnel';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartClickArgs } from '../charts.types';

export type FunnelChartConfigurationProps = {
  showLegend?: boolean;
  showTooltips?: boolean;
  showValueLabels?: boolean;
  showPercentage?: boolean;
  percentageDecimalPlaces?: number;
};

export type BaseFunnelChartProps = {
  data: ChartData<'funnel'>;
  options?: Partial<ChartOptions<'funnel'>>;
  onClick?: (args: ChartClickArgs) => void;
} & FunnelChartConfigurationProps;
