import { ChartOptions } from 'chart.js';
import { getStyle, getStyleNumber } from '../../styles/styles.utils';
import { chartjsOptions } from '../chartjs.constants';

export const defaultBarChartOptions: Partial<ChartOptions<'bar'>> = {
  ...chartjsOptions,
  scales: {
    x: {
      title: {
        display: true,
        color: getStyle('--em-chart-grid-font-color-default'),
        font: {
          size: getStyleNumber('--em-chart-grid-font-title-size'),
          weight: getStyleNumber('--em-chart-grid-font-title-weight'),
          // TODO: fix family on dedicated ticket
          // family: getStyle('--em-chart-grid-font-font-family'),
          lineHeight: `${getStyleNumber('--em-chart-grid-font-line-height')}px`,
        },
      },
      ticks: {
        font: {
          size: getStyleNumber('--em-chart-grid-font-subtitle-size'),
          weight: getStyleNumber('--em-chart-grid-font-label-weight'),
          // TODO: fix family on dedicated ticket
          // family: getStyle('--em-chart-grid-font-font-family'),
          lineHeight: `${getStyleNumber('--em-chart-grid-font-line-height')}px`,
        },
      },
      grid: {
        display: false,
        color: getStyle('--em-chart-grid-line-color-light'),
        lineWidth: getStyleNumber('--em-chart-grid-line-width-default'),
      },
      border: {
        display: false,
      },
    },
    y: {
      title: {
        display: true,
        color: getStyle('--em-chart-grid-font-color-default'),
        font: {
          size: getStyleNumber('--em-chart-grid-font-title-size'),
          weight: getStyleNumber('--em-chart-grid-font-title-weight'),
          // TODO: fix family on dedicated ticket
          // family: getStyle('--em-chart-grid-font-font-family'),
          lineHeight: `${getStyleNumber('--em-chart-grid-font-line-height')}px`,
        },
      },
      ticks: {
        font: {
          size: getStyleNumber('--em-chart-grid-font-subtitle-size'),
          weight: getStyleNumber('--em-chart-grid-font-label-weight'),
          // TODO: fix family on dedicated ticket
          // family: getStyle('--em-chart-grid-font-font-family'),
          lineHeight: `${getStyleNumber('--em-chart-grid-font-line-height')}px`,
        },
      },
      grid: {
        display: false,
        color: getStyle('--em-chart-grid-line-color-light'),
        lineWidth: getStyleNumber('--em-chart-grid-line-width-default'),
      },
      border: {
        display: false,
      },
    },
  },
};
