import { CartesianTickOptions, ChartOptions, GridLineOptions } from 'chart.js';
import { getStyle, getStyleNumber } from '../../styles/styles.utils';
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

export const getChartjsAxisOptionsScalesTicksDefault = (): Partial<CartesianTickOptions> => ({
  display: true,
  color: getStyle('--em-chart-grid-label-color', '#212129'),
  font: {
    size: getStyleNumber('--em-chart-grid-label-font-size', '0.75rem'),
    family: getStyle('--em-chart-grid-font-family', 'sans-serif'),
    weight: getStyleNumber('--em-chart-grid-label-font-weight', '400'),
  },
});

export const getChartjsAxisOptionsScalesTicksMuted = (): Partial<CartesianTickOptions> => ({
  display: true,
  color: getStyle('--em-chart-grid-label-color--muted', '#5C5C66'),
  font: {
    size: getStyleNumber('--em-chart-grid-label-font-size', '0.75rem'),
    family: getStyle('--em-chart-grid-font-family', 'sans-serif'),
    weight: getStyleNumber('--em-chart-grid-label-font-weight', '400'),
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getChartjsAxisOptionsScalesTitle = (): any => ({
  color: getStyle('--em-chart-grid-label-color', '#212129'),
  font: {
    size: getStyleNumber('--em-chart-grid-title-font-size', '0.875rem'),
    weight: getStyleNumber('--em-chart-grid-title-font-weight', '700'),
    family: getStyle('--em-chart-grid-font-family', 'sans-serif'),
  },
});

export const getChartjsAxisOptionsScalesGrid = (): Partial<GridLineOptions> => ({
  color: getStyle('--em-chart-grid-line-color--light', '#EDEDF1'),
  lineWidth: getStyleNumber('--em-chart-grid-line-width--thin', '0.0625rem'),
});

export const chartjsAxisOptionsScales: Partial<ChartOptions['scales']> = {
  x: {
    grid: getChartjsAxisOptionsScalesGrid(),
    title: getChartjsAxisOptionsScalesTitle(),
    ticks: getChartjsAxisOptionsScalesTicksDefault(),
  },
  y: {
    grid: getChartjsAxisOptionsScalesGrid(),
    title: getChartjsAxisOptionsScalesTitle(),
    ticks: getChartjsAxisOptionsScalesTicksMuted(),
  },
};

export const chartjsAxisOptions: Partial<ChartOptions> = mergician(chartjsOptions, {
  plugins: chartjsAxisOptionsPlugins,
  scales: chartjsAxisOptionsScales,
});

export const chartjsAxisOptionsLayoutPadding: number = 30;

function isMixedValues(values: number[]): boolean {
  const hasPos = values.some((v) => v > 0);
  const hasNeg = values.some((v) => v < 0);
  return hasPos && hasNeg;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getChartjsAxisOptionsScalesGridColor = (ctx: any) => {
  if (ctx.tick.value === 0) {
    const values = ctx.chart.data.datasets[0].data;
    if (isMixedValues(values)) {
      return getStyle('--em-chart-grid-line-color', '#212129');
    }
    return getStyle('--em-chart-grid-line-color--subtle', '#B8B8BD');
  }
  return getStyle('--em-chart-grid-line-color--light', '#EDEDF1');
};
