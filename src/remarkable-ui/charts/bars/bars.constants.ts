import { ChartData, ChartOptions } from 'chart.js';
import { getStyle, getStyleNumber } from '../../styles/styles.utils';
import { mergician } from 'mergician';
import { BarChartConfigurationProps } from './bars.types';
import { chartjsOptions } from '../chartjs.constants';

export const defaultChartDataDataset: Partial<ChartData<'bar'>['datasets'][number]> = {
  borderRadius: getStyleNumber('--em-chart-style-border-radius-default'),
};

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

const getBarVerticalChartOptions = (
  config: BarChartConfigurationProps,
): Partial<ChartOptions<'bar'>> => {
  return mergician(defaultBarChartOptions, {
    indexAxis: 'x',
    scales: {
      y: {
        grid: { display: true },
        ticks: {
          color: getStyle('--em-chart-grid-font-color-muted'),
        },
        ...(config.yAxisRange?.min !== undefined ? { min: config.yAxisRange.min } : {}),
        ...(config.yAxisRange?.max !== undefined ? { max: config.yAxisRange.max } : {}),
        reverse: config.reverseYAxis,
        type: config.showLogarithmicScale ? 'logarithmic' : 'linear',
        title: {
          text: config.yAxisLabel,
        },
      },
      x: {
        ticks: {
          color: getStyle('--em-chart-grid-font-color-default'),
        },
        reverse: config.reverseXAxis,
        title: {
          text: config.xAxisLabel,
        },
      },
    },
  });
};

const getBarHorizontalChartOptions = (
  config: BarChartConfigurationProps,
): Partial<ChartOptions<'bar'>> => {
  return mergician(defaultBarChartOptions, {
    indexAxis: 'y',
    scales: {
      x: {
        grid: { display: true },
        ticks: {
          color: getStyle('--em-chart-grid-font-color-muted'),
        },
        ...(config.xAxisRange?.min !== undefined ? { min: config.xAxisRange.min } : {}),
        ...(config.xAxisRange?.max !== undefined ? { max: config.xAxisRange.max } : {}),
        reverse: config.reverseXAxis,
        type: config.showLogarithmicScale ? 'logarithmic' : 'linear',
        title: {
          text: config.xAxisLabel,
        },
      },
      y: {
        ticks: {
          color: getStyle('--em-chart-grid-font-color-default'),
        },
        reverse: config.reverseYAxis,
        title: {
          text: config.yAxisLabel,
        },
      },
    },
  });
};

export const getBarChartOptions = (
  props: BarChartConfigurationProps,
): Partial<ChartOptions<'bar'>> => {
  const {
    horizontal = false,
    showLegend = false,
    showTooltips = true,
    showValueLabels = false,
  } = props;

  const getOptions = horizontal ? getBarHorizontalChartOptions : getBarVerticalChartOptions;
  const options = getOptions(props);

  return mergician(options, {
    layout: {
      padding: {
        // Hack: dataLabels can get cut off if they are at the edge of the chart
        top: !horizontal && showValueLabels ? 30 : 0,
        right: horizontal && showValueLabels ? 30 : 0,
      },
    },
    plugins: {
      legend: { display: showLegend },
      datalabels: {
        display: showValueLabels,
        anchor: 'end',
        align: 'end',
      },
      tooltip: {
        enabled: showTooltips,
      },
    },
  });
};
