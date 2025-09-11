import { ChartData, ChartOptions } from 'chart.js';

export type BarChartDefaultConfigurationProps = {
  horizontal?: boolean;
  showLegend?: boolean;
  showTooltips?: boolean;
  showValueLabels?: boolean;
  showLogarithmicScale?: boolean;
  showTotalLabels?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  stacked?: 'stacked'; // TODO: Add the stacked option "percentage"
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
  onSegmentClick?: (index: number | undefined) => void;
} & (BarChartConfigurationProps | BarChartHorizontalConfigurationProps);
