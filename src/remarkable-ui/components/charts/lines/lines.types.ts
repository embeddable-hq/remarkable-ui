import { ChartData, ChartOptions } from 'chart.js';

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
  onSegmentClick?: (index: number | undefined) => void;
} & LineChartConfigurationProps;
