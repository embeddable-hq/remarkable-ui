import { ChartData, ChartOptions } from 'chart.js';
import { getStyle, getStyleNumber } from '../../../theme/theme.utils';

// TODO: update the rest of the vars

export const defaultData: ChartData<'pie'> = {
  datasets: [
    {
      data: [],
      backgroundColor: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
      borderColor: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
    },
  ],
};

export const defaultOptions: Partial<ChartOptions<'pie'>> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    datalabels: {
      display: true,
      backgroundColor: getStyle('--em-label-background-color-default') as string,
      borderRadius: getStyleNumber('--em-label-border-radius-default'),
      padding: {
        top: getStyleNumber('--em-label-padding-top-bottom'),
        bottom: getStyleNumber('--em-label-padding-top-bottom'),
        right: getStyleNumber('--em-label-padding-left-right'),
        left: getStyleNumber('--em-label-padding-left-right'),
      },
      color: getStyle('--em-label-label-font-color-default') as string,
      font: {
        family: getStyle('--em-label-label-font-family') as string,
        size: getStyleNumber('--em-label-label-font-size'),
        weight: getStyle('--em-label-label-font-weight') as number,
      },
      anchor: 'center',
      align: 'center',
    },
    legend: {
      display: true,
      labels: {
        boxWidth: getStyleNumber('--em-category-indicator-size-width'),
        boxHeight: getStyleNumber('--em-category-indicator-size-height'),
        usePointStyle: true,
        color: 'red',
        // color: getStyle('--em-category-indicator-group-') as string,
        font: {
          family: getStyle('--em-category-indicator-group-label-family') as string,
          // size: getStyleNumber('--em-category-indicator-group-label-font-size'),
          // weight: getStyleNumber('--em-category-indicator-group-label-font-weight'),
          // lineHeight: getStyleNumber('--em-category-indicator-group-label-font-line-height'),
        },
      },
    },
    tooltip: {
      caretSize: 0,
      enabled: true,
      backgroundColor: getStyle('--em-chart-tooltip-background-color-default') as string,
      boxPadding: getStyleNumber('--em-chart-tooltip-padding-default'),
      cornerRadius: getStyleNumber('--em-chart-tooltip-border-radius-default'),
      padding: getStyleNumber('--em-chart-tooltip-padding-default'),
      displayColors: true,
      bodyColor: getStyle('--em-foreground-color-inverted') as string,
      // TODO: wait fo the variable
      bodyAlign: 'right',
      bodyFont: {
        // family: getStyle('--em-category-group-item-label-font-font-family') as string,
        size: getStyleNumber('--em-category-group-item-label-font-size'),
        weight: getStyleNumber('--em-category-group-item-label-font-weight'),
        // lineHeight: getStyleNumber('--em-category-group-item-label-font-height'),
      },
      // titleAlign: getStyle('--em-chart-tooltip-title-font-align') as string,
      // titleColor: getStyle('--em-chart-tooltip-title-font-color') as string,
      titleFont: {
        family: getStyle('--em-chart-tooltip-title-font-font-family') as string,
        size: getStyleNumber('--em-chart-tooltip-title-font-size'),
        weight: getStyleNumber('--em-chart-tooltip-title-font-weight'),
        lineHeight: getStyleNumber('--em-chart-tooltip-title-font-line-height'),
      },
      usePointStyle: true,
    },
  },
};
