import { ChartData, ChartOptions } from 'chart.js';

export type BasePieChartVariant = 'pie' | 'donut' | 'donutLabel';

export type PieChartConfigurationProps = {
  showLegend?: boolean;
  showTooltips?: boolean;
  showValueLabels?: boolean;
};

export type BasePieChartProps = {
  data: ChartData<'pie'>;
  options?: Partial<ChartOptions<'pie'>>;
  onSegmentClick?: (index: number | undefined) => void;
} & PieChartConfigurationProps;
