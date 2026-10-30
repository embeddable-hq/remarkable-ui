import 'chartjs-chart-funnel';
import { ChartData, ChartOptions } from 'chart.js';
import type { TrapezoidElementOptions } from 'chartjs-chart-funnel';
import { ChartClickArgs } from '../charts.types';
import { ChartA11yProps } from '../chartjs.a11y.utils';

export type FunnelChartConfigurationProps = {
  showLegend?: boolean;
  showTooltips?: boolean;
  showValueLabels?: boolean;
  showPercentage?: boolean;
  percentageDecimalPlaces?: number;
  shrinkAnchor?: TrapezoidElementOptions['shrinkAnchor'];
  shrinkFraction?: TrapezoidElementOptions['shrinkFraction'];
};

export type BaseFunnelChartProps = {
  data: ChartData<'funnel'>;
  options?: Partial<ChartOptions<'funnel'>>;
  onClick?: (args: ChartClickArgs) => void;
} & FunnelChartConfigurationProps &
  ChartA11yProps;
