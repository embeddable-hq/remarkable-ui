import { ChartData, ChartOptions } from 'chart.js';

export type BaseBarChartProps = {
  data: ChartData<'bar'>;
  options?: Partial<ChartOptions<'bar'>>;
  onSegmentClick?: (index: number | undefined) => void;
};
