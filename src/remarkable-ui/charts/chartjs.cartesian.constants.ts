import { CartesianTickOptions, ChartOptions, GridLineOptions } from 'chart.js';
import { getStyle, getStyleNumber } from '../styles/styles.utils';
import { mergician } from 'mergician';
import { chartjsOptions } from './chartjs.constants';

export const chartjsAxisOptionsPlugins: Partial<ChartOptions['plugins']> = {
  datalabels: {
    labels: {
      total: {
        anchor: (context) => {
          const value = context.dataset.data[context.dataIndex] as number;
          return value >= 0 ? 'end' : 'start';
        },
        align: (context) => {
          const value = context.dataset.data[context.dataIndex] as number;
          return value >= 0 ? 'top' : 'bottom';
        },
      },
      value: {
        anchor: (context) => {
          const value = context.dataset.data[context.dataIndex] as number;
          return value >= 0 ? 'end' : 'start';
        },
        align: (context) => {
          const value = context.dataset.data[context.dataIndex] as number;
          return value >= 0 ? 'top' : 'bottom';
        },
      },
    },
  },
};

export const chartjsAxisOptionsScalesTicksDefault: Partial<CartesianTickOptions> = {
  display: true,
  color: getStyle('--em-chart-grid-text-default'),
  font: {
    size: getStyleNumber('--em-chart-grid-font-size-subtitle'),
    weight: getStyleNumber('--em-chart-grid-font-weight-subtitle'),
    lineHeight: getStyleNumber('--em-chart-grid-font-line-height'),
    // TODO: fix family on dedicated ticket
    family: 'Inter, sans-serif',
  },
};

export const chartjsAxisOptionsScalesTicksMuted: Partial<CartesianTickOptions> = {
  display: true,
  color: getStyle('--em-chart-grid-text-muted'),
  font: {
    size: getStyleNumber('--em-chart-grid-font-size-subtitle'),
    weight: getStyleNumber('--em-chart-grid-font-weight-subtitle'),
    lineHeight: getStyleNumber('--em-chart-grid-font-line-height'),
    // TODO: fix family on dedicated ticket
    family: 'Inter, sans-serif',
  },
};

// TODO: replace type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const chartjsAxisOptionsScalesTitle: any = {
  color: getStyle('--em-chart-grid-text-default'),
  font: {
    size: getStyleNumber('--em-chart-grid-font-size-title'),
    weight: getStyleNumber('--em-chart-grid-font-weight-title'),
    lineHeight: getStyleNumber('--em-chart-grid-font-line-height'),
    // TODO: fix family on dedicated ticket
    family: 'Inter, sans-serif',
  },
};

export const chartjsAxisOptionsScalesGrid: Partial<GridLineOptions> = {
  color: getStyle('--em-chart-grid-line-color-light'),
  lineWidth: getStyleNumber('--em-chart-grid-line-width-100'),
};

export const chartjsAxisOptionsScales: Partial<ChartOptions['scales']> = {
  x: {
    grid: chartjsAxisOptionsScalesGrid,
    title: chartjsAxisOptionsScalesTitle,
    ticks: chartjsAxisOptionsScalesTicksDefault,
  },
  y: {
    grid: chartjsAxisOptionsScalesGrid,
    title: chartjsAxisOptionsScalesTitle,
    ticks: chartjsAxisOptionsScalesTicksMuted,
  },
};

export const chartjsAxisOptions: Partial<ChartOptions> = mergician(chartjsOptions, {
  plugins: chartjsAxisOptionsPlugins,
  scales: chartjsAxisOptionsScales,
});

export const chartjsAxisOptionsLayoutPadding: number = 30;
