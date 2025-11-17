import { ChartOptions } from 'chart.js';
import { getStyle, getStyleNumber } from '../styles/styles.utils';

export const chartjsOptionsPlugins: Partial<ChartOptions['plugins']> = {
  datalabels: {
    backgroundColor: getStyle('--TEMP-label-background-color-default'),
    borderRadius: getStyleNumber('--TEMP-label-border-radius-default'),
    padding: {
      top: getStyleNumber('--TEMP-label-padding-top-bottom'),
      bottom: getStyleNumber('--TEMP-label-padding-top-bottom'),
      right: getStyleNumber('--TEMP-label-padding-left-right'),
      left: getStyleNumber('--TEMP-label-padding-left-right'),
    },
    color: getStyle('--TEMP-label-text-default'),
    font: {
      size: getStyleNumber('--TEMP-label-font-size'),
      weight: getStyleNumber('--TEMP-label-font-weight'),
      // TODO: fix family on dedicated ticket
      family: 'Inter, sans-serif',
    },
  },
  legend: {
    position: 'bottom',
    labels: {
      boxWidth: getStyleNumber('--TEMP-cat-indicator-size-width'),
      boxHeight: getStyleNumber('--TEMP-cat-indicator-size-height'),
      usePointStyle: true,
      color: getStyle('--TEMP-cat-indicator-color-default'),
      padding: getStyleNumber('--TEMP-chart-gap-default'),
      font: {
        size: getStyleNumber('--TEMP-cat-group-item-label-font-size'),
        weight: getStyleNumber('--TEMP-cat-group-item-label-font-weight'),
        lineHeight: getStyleNumber('--TEMP-cat-group-item-label-font-line-height'),
      },
    },
  },
  tooltip: {
    usePointStyle: true,
    caretSize: 0,
    enabled: true,
    backgroundColor: getStyle('--TEMP-chart-tooltip-background-color-default'),
    cornerRadius: getStyleNumber('--TEMP-chart-tooltip-border-radius-default'),
    padding: getStyleNumber('--TEMP-chart-tooltip-padding-default'),
    displayColors: true,
    bodyColor: getStyle('--TEMP-sem-text-inverted'),
    bodyAlign: 'left',
    boxPadding: getStyleNumber('--TEMP-cat-indicator-gap-default'),
    bodyFont: {
      size: getStyleNumber('--TEMP-cat-group-item-label-font-size'),
      weight: getStyleNumber('--TEMP-cat-group-item-label-font-weight'),
      // TODO: fix family on dedicated ticket
      family: 'Inter, sans-serif',
    },
    titleAlign: 'left',
    titleColor: getStyle('--TEMP-chart-tooltip-label-color-default'),
    titleFont: {
      size: getStyleNumber('--TEMP-chart-tooltip-title-font-size'),
      weight: getStyleNumber('--TEMP-chart-tooltip-title-font-weight'),
      // TODO: fix family on dedicated ticket
      family: 'Inter, sans-serif',
    },
  },
};

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
  plugins: chartjsOptionsPlugins,
  scales: chartjsOptionsScales,
};
