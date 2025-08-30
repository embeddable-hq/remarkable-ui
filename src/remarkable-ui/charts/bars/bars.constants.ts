import { ChartData, ChartOptions } from 'chart.js';
import { chartColors } from '../charts.constants';
import { getStyle, getStyleNumber } from '../../styles/styles.utils';

// TODO: add a better reusable default
export const defaultChartDataDataset: ChartData<'bar'>['datasets'][number] = {
  data: [],
  backgroundColor: chartColors,
  borderColor: chartColors,
  borderRadius: getStyleNumber('--em-chart-style-border-radius-default'),
};

export const defaultBarChartOptions: Partial<ChartOptions<'bar'>> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    datalabels: {
      display: false, // TODO: check with harry
    },
    legend: {
      display: false, // TODO: check with harry
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: getStyle('--em-chart-grid-font-color-default'),
        font: {
          size: getStyleNumber('--em-chart-grid-font-subtitle-size'),
          weight: getStyleNumber('--em-chart-grid-font-label-weight'),
          // TODO: fix family on dedicated ticket
          // family: getStyle('--em-chart-grid-font-font-family'),
          lineHeight: `${getStyleNumber('--em-chart-grid-font-line-height')}px`,
        },
      },
    },
    y: {
      border: {
        display: false,
      },
      grid: {
        color: getStyle('--em-chart-grid-line-color-light'),
        lineWidth: getStyleNumber('--em-chart-grid-line-width-default'),
      },
    },
  },
};
