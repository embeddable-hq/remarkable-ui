import { ChartData, ChartOptions } from 'chart.js';
import { getStyle, getStyleNumber } from '../../styles/styles.utils';
import { mergician } from 'mergician';

// TODO: add a better reusable default
export const defaultChartDataDataset: ChartData<'bar'>['datasets'][number] = {
  data: [],
  borderRadius: getStyleNumber('--em-chart-style-border-radius-default'),
};

export const defaultBarChartOptions: Partial<ChartOptions<'bar'>> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    datalabels: {
      display: false,
    },
    legend: {
      display: false,
    },
  },
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

export const defaultBarVerticalChartOptions: Partial<ChartOptions<'bar'>> = mergician(
  defaultBarChartOptions,
  {
    indexAxis: 'x',
    scales: {
      y: {
        grid: { display: true },
        ticks: {
          color: getStyle('--em-chart-grid-font-color-muted'),
        },
      },
      x: {
        ticks: {
          color: getStyle('--em-chart-grid-font-color-default'),
        },
      },
    },
  },
);

export const defaultBarHorizontalChartOptions: Partial<ChartOptions<'bar'>> = mergician(
  defaultBarChartOptions,
  {
    indexAxis: 'y',
    scales: {
      x: {
        grid: { display: true },
        ticks: {
          color: getStyle('--em-chart-grid-font-color-muted'),
        },
      },
      y: {
        ticks: {
          color: getStyle('--em-chart-grid-font-color-default'),
        },
      },
    },
  },
);
