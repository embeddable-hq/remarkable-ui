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
  color: getStyle('--em-chart-grid-font-color-default'),
  font: {
    size: getStyleNumber('--em-chart-grid-font-subtitle-size'),
    weight: getStyleNumber('--em-chart-grid-font-label-weight'),
    lineHeight: `${getStyleNumber('--em-chart-grid-font-line-height')}px`,
    // TODO: fix family on dedicated ticket
    // family: getStyle('--em-chart-grid-font-font-family'),
  },
};

export const chartjsAxisOptionsScalesTicksMuted: Partial<CartesianTickOptions> = {
  display: true,
  color: getStyle('--em-chart-grid-font-color-muted'),
  font: {
    size: getStyleNumber('--em-chart-grid-font-subtitle-size'),
    weight: getStyleNumber('--em-chart-grid-font-label-weight'),
    lineHeight: `${getStyleNumber('--em-chart-grid-font-line-height')}px`,
    // TODO: fix family on dedicated ticket
    // family: getStyle('--em-chart-grid-font-font-family'),
  },
};

// TODO: replace type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const chartjsAxisOptionsScalesTitle: any = {
  color: getStyle('--em-chart-grid-font-color-default'),
  font: {
    size: getStyleNumber('--em-chart-grid-font-title-size'),
    weight: getStyleNumber('--em-chart-grid-font-title-weight'),
    lineHeight: `${getStyleNumber('--em-chart-grid-font-line-height')}px`,
    // TODO: fix family on dedicated ticket
    // family: getStyle('--em-chart-grid-font-font-family'),
  },
};

export const chartjsAxisOptionsScalesGrid: Partial<GridLineOptions> = {
  color: getStyle('--em-chart-grid-line-color-light'),
  lineWidth: getStyleNumber('--em-chart-grid-line-width-default'),
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
