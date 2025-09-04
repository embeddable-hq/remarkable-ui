import { ChartOptions } from 'chart.js';
import { getStyle, getStyleNumber } from '../styles/styles.utils';

export const chartjsOptionsPlugins: Partial<ChartOptions['plugins']> = {
  datalabels: {
    display: 'auto',
    backgroundColor: getStyle('--em-label-background-color-default'),
    borderRadius: getStyleNumber('--em-label-border-radius-default'),
    padding: {
      top: getStyleNumber('--em-label-padding-top-bottom'),
      bottom: getStyleNumber('--em-label-padding-top-bottom'),
      right: getStyleNumber('--em-label-padding-left-right'),
      left: getStyleNumber('--em-label-padding-left-right'),
    },
    color: getStyle('--em-label-label-font-color-default'),
    font: {
      family: 'Inter, sans-serif',
      size: getStyleNumber('--em-label-label-font-size'),
      weight: getStyleNumber('--em-label-label-font-weight'),
    },
    anchor: 'center',
    align: 'center',
  },
  legend: {
    display: true,
    position: 'bottom',
    labels: {
      boxWidth: getStyleNumber('--em-category-indicator-size-width'),
      boxHeight: getStyleNumber('--em-category-indicator-size-height'),
      usePointStyle: true,
      color: getStyle('--em-category-group-item-label-color-default'),
      padding: getStyleNumber('--em-chart-gap-default'),
      font: {
        size: getStyleNumber('--em-category-group-item-label-font-size'),
        weight: getStyleNumber('--em-category-group-item-label-font-weight'),
        lineHeight: getStyleNumber('--em-category-group-item-label-font-line-height'),
      },
    },
  },
  tooltip: {
    usePointStyle: true,
    caretSize: 0,
    enabled: true,
    backgroundColor: getStyle('--em-chart-tooltip-background-color-default'),
    cornerRadius: getStyleNumber('--em-chart-tooltip-border-radius-default'),
    padding: getStyleNumber('--em-chart-tooltip-padding-default'),
    displayColors: true,
    bodyColor: getStyle('--em-foreground-color-inverted'),
    bodyAlign: 'left',
    boxPadding: getStyleNumber('--em-category-indicator-gap-default'),
    bodyFont: {
      size: getStyleNumber('--em-category-group-item-label-font-size'),
      weight: getStyleNumber('--em-category-group-item-label-font-weight'),
      family: 'Inter, sans-serif',
    },
    titleAlign: 'left',
    titleColor: getStyle('--em-chart-tooltip-label-color-default'),
    titleFont: {
      size: getStyleNumber('--em-chart-tooltip-title-font-size'),
      weight: getStyleNumber('--em-chart-tooltip-title-font-weight'),
      family: 'Inter, sans-serif',
    },
  },
};

export const chartjsOptions: Partial<ChartOptions> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: chartjsOptionsPlugins,
};
