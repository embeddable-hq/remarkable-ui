import { ChartData, ChartOptions } from 'chart.js';

export type BasePieChartVariant = 'pie' | 'donut' | 'donutLabel';

export type BasePieChartProps = {
  data: ChartData<'pie'>;
  options?: Partial<ChartOptions<'pie'>>;
  onSegmentClick?: (index: number | undefined) => void;
};
