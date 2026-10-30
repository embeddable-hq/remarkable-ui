import { ChartData, ChartOptions } from 'chart.js';
import { ChartClickArgs } from '../charts.types';
import { ChartA11yProps } from '../chartjs.a11y.utils';

export type BasePieChartVariant = 'pie' | 'donut' | 'donutLabel';

export type PieChartConfigurationProps = {
  showLegend?: boolean;
  showTooltips?: boolean;
  showValueLabels?: boolean;
};

export type BasePieChartProps = {
  data: ChartData<'pie'>;
  options?: Partial<ChartOptions<'pie'>>;
  onClick?: (args: ChartClickArgs) => void;
} & PieChartConfigurationProps &
  ChartA11yProps;
