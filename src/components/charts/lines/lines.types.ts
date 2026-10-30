import { ChartData, ChartOptions } from 'chart.js';
import { ChartClickArgs } from '../charts.types';
import { ChartA11yProps } from '../chartjs.a11y.utils';

export type LineChartConfigurationProps = {
  showLegend?: boolean;
  showTooltips?: boolean;
  showValueLabels?: boolean;
  showLogarithmicScale?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  yAxisRangeMin?: number;
  yAxisRangeMax?: number;
  reverseXAxis?: boolean;
};

export type BaseLineChartProps = {
  data: ChartData<'line'>;
  options?: Partial<ChartOptions<'line'>>;
  onClick?: (args: ChartClickArgs) => void;
} & LineChartConfigurationProps &
  ChartA11yProps;
