import { ChartData, ChartOptions } from 'chart.js';
import { ScatterPointClickHit } from '../chartjs.utils';

export type ScatterChartInputPoint = {
  x: number | null;
  y: number | null;
  label?: string;
  pointLabel?: string;
  isNull?: boolean;
};

export type ScatterChartConfigurationProps = {
  showLegend?: boolean;
  showTooltips?: boolean;
  showValueLabels?: boolean;
  showPointLabels?: boolean;
  showLogarithmicScale?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  xAxisRangeMin?: number;
  xAxisRangeMax?: number;
  yAxisRangeMin?: number;
  yAxisRangeMax?: number;
  reverseXAxis?: boolean;
  nullBandLabel?: string;
};

export type BaseScatterChartProps = {
  data: ChartData<'scatter', ScatterChartInputPoint[]>;
  options?: Partial<ChartOptions<'scatter'>>;
  onPointClick?: (hit: ScatterPointClickHit | undefined) => void;
} & ScatterChartConfigurationProps;
