import { ChartData, ChartOptions } from 'chart.js';
import { ChartClickArgs } from '../charts.types';
import { ChartA11yProps } from '../chartjs.a11y.utils';

export type BarChartDefaultConfigurationProps = {
  horizontal?: boolean;
  showLegend?: boolean;
  showTooltips?: boolean;
  showValueLabels?: boolean;
  showLogarithmicScale?: boolean;
  showTotalLabels?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  stacked?: boolean;
};

export type BarChartConfigurationProps = BarChartDefaultConfigurationProps & {
  yAxisRangeMin?: number;
  yAxisRangeMax?: number;
  reverseXAxis?: boolean;
};

export type BarChartHorizontalConfigurationProps = BarChartDefaultConfigurationProps & {
  xAxisRangeMin?: number;
  xAxisRangeMax?: number;
  reverseYAxis?: boolean;
};

export type BaseBarChartProps = {
  data: ChartData<'bar'>;
  options?: Partial<ChartOptions<'bar'>>;
  onClick?: (args: ChartClickArgs) => void;
} & (BarChartConfigurationProps | BarChartHorizontalConfigurationProps) &
  ChartA11yProps;
