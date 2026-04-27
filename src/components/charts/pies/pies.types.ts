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
  onClick?: (event: React.MouseEvent<HTMLCanvasElement>, ref?: React.RefObject<null>) => void;
} & PieChartConfigurationProps;
