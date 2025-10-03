import { ChartOptions } from 'chart.js';
import { chartjsOptions } from '../chartjs.constants';

export const defaultBarChartOptions: Partial<ChartOptions<'bar'>> = chartjsOptions as Partial<
  ChartOptions<'bar'>
>;
