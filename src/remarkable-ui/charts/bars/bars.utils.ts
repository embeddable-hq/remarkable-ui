import { ChartData, ChartOptions } from 'chart.js';
import { chartColors } from '../charts.constants';
import { getStyle, getStyleNumber } from '../../styles/styles.utils';
import { mergician } from 'mergician';
import { BarChartConfigurationProps } from './bars.types';
import { defaultBarChartOptions } from './bars.constants';

export const getBarChartData = (data: ChartData<'bar'>): ChartData<'bar'> => {
  return {
    ...data,
    datasets: data.datasets?.map((dataset, index) => {
      const colors = chartColors[index % chartColors.length];
      const defaultDataset = {
        ...dataset,
        backgroundColor: colors,
        borderColor: colors,
        borderRadius: getStyleNumber('--em-chart-style-border-radius-default'),
      };

      return mergician(defaultDataset, dataset) as typeof dataset;
    }),
  };
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
