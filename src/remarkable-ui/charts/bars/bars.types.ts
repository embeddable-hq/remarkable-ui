import { ChartData, ChartOptions } from 'chart.js';

export type BaseBarChartProps = {
  horizontal?: boolean;
  data: ChartData<'bar'>;
  options?: Partial<ChartOptions<'bar'>>;
  onSegmentClick?: (index: number | undefined) => void;
};
