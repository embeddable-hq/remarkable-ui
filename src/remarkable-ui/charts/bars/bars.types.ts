import { ChartData, ChartOptions } from 'chart.js';

type BarChartAxisRange = { min: number; max: number } | undefined;

export type BarChartConfigurationProps = {
  horizontal?: boolean;
  showLegend?: boolean;
  showTooltips?: boolean;
  showValueLabels?: boolean;
  showLogarithmicScale?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  reverseXAxis?: boolean;
  reverseYAxis?: boolean;
  yAxisRange?: BarChartAxisRange;
  xAxisRange?: BarChartAxisRange;
};

export type BaseBarChartProps = {
  data: ChartData<'bar'>;
  options?: Partial<ChartOptions<'bar'>>;
  onSegmentClick?: (index: number | undefined) => void;
} & BarChartConfigurationProps;
