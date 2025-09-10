import { ChartData, ChartOptions } from 'chart.js';
import { chartContrastColors } from '../charts.constants';
import { getStyle, getStyleNumber } from '../../styles/styles.utils';
import { mergician } from 'mergician';
import { BarChartConfigurationProps, BarChartHorizontalConfigurationProps } from './bars.types';
import { defaultBarChartOptions } from './bars.constants';
import { Context } from 'chartjs-plugin-datalabels';

export const getBarChartData = (data: ChartData<'bar'>): ChartData<'bar'> => {
  return {
    ...data,
    datasets: data.datasets?.map((dataset, index) => {
      const colors = chartContrastColors[index % chartContrastColors.length];
      const defaultDataset = {
        ...dataset,
        backgroundColor: colors,
        borderColor: colors,
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
    plugins: {
      datalabels: {
        anchor: (context: Context) => {
          const value = context.dataset.data[context.dataIndex] as number;
          return value >= 0 ? 'end' : 'start';
        },
        align: (context: Context) => {
          const value = context.dataset.data[context.dataIndex] as number;
          return value >= 0 ? 'top' : 'bottom';
        },
      },
    },
    scales: {
      y: {
        stacked: config.stacked,
        grid: { display: true },
        ticks: {
          color: getStyle('--em-chart-grid-font-color-muted'),
          ...(config.stacked === 'percentage' && {
            callback: (value: number | string) => value + '%',
          }),
        },
        min: config.yAxisRangeMin,
        max: config.yAxisRangeMax,
        type: config.showLogarithmicScale ? 'logarithmic' : 'linear',
        title: {
          text: config.yAxisLabel ?? '',
        },
      },
      x: {
        stacked: config.stacked,
        ticks: {
          color: getStyle('--em-chart-grid-font-color-default'),
        },
        reverse: config.reverseXAxis,
        title: {
          text: config.xAxisLabel ?? '',
        },
      },
    },
  });
};

const getBarHorizontalChartOptions = (
  config: BarChartHorizontalConfigurationProps,
): Partial<ChartOptions<'bar'>> => {
  return mergician(defaultBarChartOptions, {
    indexAxis: 'y',
    plugins: {
      datalabels: {
        anchor: (context: Context) => {
          const value = context.dataset.data[context.dataIndex] as number;
          return value >= 0 ? 'end' : 'start';
        },
        align: (context: Context) => {
          const value = context.dataset.data[context.dataIndex] as number;
          return value >= 0 ? 'right' : 'left';
        },
      },
    },
    scales: {
      x: {
        stacked: config.stacked,
        grid: { display: true },
        ticks: {
          color: getStyle('--em-chart-grid-font-color-muted'),
          ...(config.stacked === 'percentage' && {
            callback: (value: number | string) => value + '%',
          }),
        },
        min: config.xAxisRangeMin,
        max: config.xAxisRangeMax,
        type: config.showLogarithmicScale ? 'logarithmic' : 'linear',
        title: {
          text: config.xAxisLabel ?? '',
        },
      },
      y: {
        stacked: config.stacked,
        ticks: {
          color: getStyle('--em-chart-grid-font-color-default'),
        },
        reverse: config.reverseYAxis,
        title: {
          text: config.yAxisLabel ?? '',
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
    stacked,
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
    elements: {
      bar: {
        borderRadius:
          stacked === 'percentage' ? 0 : getStyleNumber('--em-chart-style-border-radius-default'),
      },
    },
    plugins: {
      stacked100: { enable: stacked === 'percentage' },
      legend: { display: showLegend },
      datalabels: {
        display: showValueLabels ? 'auto' : false,
      },
      tooltip: {
        enabled: showTooltips,
      },
    },
  });
};
