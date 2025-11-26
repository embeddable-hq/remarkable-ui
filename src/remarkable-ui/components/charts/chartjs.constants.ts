import { ChartOptions } from 'chart.js';
import { getStyle, getStyleNumber } from '../../styles/styles.utils';

export const getChartjsOptionsPlugins = (): Partial<ChartOptions['plugins']> => ({
  datalabels: {
    backgroundColor: getStyle('--em-chart-label-background', '#FFF'),
    borderRadius: getStyleNumber('--em-chart-label-border-radius', '624.9375rem'),
    padding: {
      top: getStyleNumber('--em-chart-label-padding-top-bottom', '0.125rem'),
      bottom: getStyleNumber('--em-chart-label-padding-top-bottom', '0.25rem'),
      right: getStyleNumber('--em-chart-label-padding-left-right', '0.125rem'),
      left: getStyleNumber('--em-chart-label-padding-left-right', '0.25rem'),
    },
    color: getStyle('--em-chart-label-color', '#212129'),
    font: {
      size: getStyleNumber('--em-chart-label-font-size', '0.75rem'),
      weight: getStyleNumber('--em-chart-label-font-weight', '500'),
      family: getStyle('--em-chart-label-font-family', 'sans-serif'),
    },
  },
  legend: {
    position: 'bottom',
    labels: {
      boxWidth: getStyleNumber('--em-chart-category-size', '0.75rem')! / 2,
      boxHeight: getStyleNumber('--em-chart-category-size', '0.75rem')! / 2,
      usePointStyle: true,
      color: getStyle('--em-chart-category-color', '#5C5C66'),
      padding: getStyleNumber('--em-chart-category-list-gap', '1rem'),
      font: {
        family: getStyle('--em-chart-category-font-family', 'sans-serif'),
        size: getStyleNumber('--em-chart-category-font-size', '0.75rem'),
        weight: getStyleNumber('--em-chart-category-font-weight', '500'),
      },
    },
  },
  tooltip: {
    usePointStyle: true,
    caretSize: 0,
    enabled: true,
    backgroundColor: getStyle('--em-chart-tooltip-background', '#212129'),
    cornerRadius: getStyleNumber('--em-chart-tooltip-border-radius', '0.75rem'),
    padding: getStyleNumber('--em-chart-tooltip-padding', '1rem'),
    displayColors: true,
    bodyColor: getStyle('--em-chart-tooltip-title-color', '#FFF'),
    bodyAlign: 'left',
    boxPadding: getStyleNumber('--em-chart-category-gap', '0.25rem'),
    bodyFont: {
      size: getStyleNumber('--em-chart-category-font-size', '0.75rem'),
      weight: getStyleNumber('--em-chart-category-font-weight', '500'),
      family: getStyle('--em-chart-tooltip-family', 'sans-serif'),
    },
    titleAlign: 'left',
    titleColor: getStyle('--em-chart-tooltip-title-color', '#FFF'),
    titleFont: {
      size: getStyleNumber('--em-chart-tooltip-title-font-size', '0.875rem'),
      weight: getStyleNumber('--em-chart-tooltip-title-font-weight', '700'),
      family: getStyle('--em-chart-tooltip-family', 'sans-serif'),
    },
  },
});

export const chartjsOptionsScales: Partial<ChartOptions['scales']> = {
  x: {
    border: { display: false },
    grid: { display: false },
    ticks: { display: false },
  },
  y: {
    border: { display: false },
    grid: { display: false },
    ticks: { display: false },
  },
};

export const chartjsOptions: Partial<ChartOptions> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: getChartjsOptionsPlugins(),
};
