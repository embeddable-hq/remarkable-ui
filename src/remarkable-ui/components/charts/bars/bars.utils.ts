import { ChartData, ChartOptions } from 'chart.js';
import { chartContrastColors } from '../charts.constants';
import { getStyleNumber } from '../../../styles/styles.utils';
import { mergician } from 'mergician';
import { BarChartConfigurationProps, BarChartHorizontalConfigurationProps } from './bars.types';
import { Context } from 'chartjs-plugin-datalabels';
import {
  chartjsAxisOptions,
  chartjsAxisOptionsLayoutPadding,
  getChartjsAxisOptionsScalesGridColor,
  getChartjsAxisOptionsScalesTicksDefault,
  getChartjsAxisOptionsScalesTicksMuted,
} from '../chartjs.cartesian.constants';

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

const getDatalabelTotalDisplay = (context: Context, showTotalLabels: boolean | undefined) =>
  showTotalLabels && context.datasetIndex === context.chart.data.datasets.length - 1
    ? 'auto'
    : false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDatalabelTotalFormatter = (_value: any, context: Context) => {
  const { datasets } = context.chart.data;
  const i = context.dataIndex;

  const total = datasets.reduce((sum, ds) => {
    const val = ds.data[i] as number;
    return sum + (val || 0);
  }, 0);

  return total > 0 ? total : '';
};

const getBarVerticalChartOptions = (
  config: BarChartConfigurationProps,
): Partial<ChartOptions<'bar'>> => {
  return {
    indexAxis: 'x',
    layout: {
      padding: {
        top: (config.stacked ? config.showTotalLabels : config.showValueLabels)
          ? chartjsAxisOptionsLayoutPadding
          : 0,
      },
    },
    plugins: {
      datalabels: {
        labels: {
          total: {
            align: (context) => {
              const value = context.dataset.data[context.dataIndex] as number;
              return value >= 0 ? 'top' : 'left';
            },
          },
          value: {
            align: (context) => {
              if (config.stacked) {
                return 'center';
              }
              const value = context.dataset.data[context.dataIndex] as number;
              return value >= 0 ? 'top' : 'bottom';
            },
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: {
          display: false,
        },
        ticks: getChartjsAxisOptionsScalesTicksDefault(),
        reverse: config.reverseXAxis,
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: getChartjsAxisOptionsScalesGridColor,
        },
        border: {
          display: false,
        },
        ticks: getChartjsAxisOptionsScalesTicksMuted(),
        min: config.yAxisRangeMin,
        max: config.yAxisRangeMax,
        type: config.showLogarithmicScale ? 'logarithmic' : 'linear',
      },
    },
  };
};

const getBarHorizontalChartOptions = (
  config: BarChartHorizontalConfigurationProps,
): Partial<ChartOptions<'bar'>> => {
  return {
    indexAxis: 'y',
    layout: {
      padding: {
        right: (config.stacked ? config.showTotalLabels : config.showValueLabels)
          ? chartjsAxisOptionsLayoutPadding
          : 0,
      },
    },
    plugins: {
      datalabels: {
        labels: {
          total: {
            align: (context) => {
              const value = context.dataset.data[context.dataIndex] as number;
              return value >= 0 ? 'right' : 'left';
            },
          },
          value: {
            align: (context) => {
              if (config.stacked) {
                return 'center';
              }
              const value = context.dataset.data[context.dataIndex] as number;
              return value >= 0 ? 'right' : 'left';
            },
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: true, color: getChartjsAxisOptionsScalesGridColor },
        border: { display: false },
        ticks: getChartjsAxisOptionsScalesTicksMuted(),
        min: config.xAxisRangeMin,
        max: config.xAxisRangeMax,
        type: config.showLogarithmicScale ? 'logarithmic' : 'linear',
      },
      y: {
        grid: { display: false },
        border: {
          display: false,
        },
        ticks: getChartjsAxisOptionsScalesTicksDefault(),
        reverse: config.reverseYAxis,
      },
    },
  };
};

export const getBarChartOptions = (
  options: BarChartConfigurationProps,
): Partial<ChartOptions<'bar'>> => {
  const baseBarChartOptions: Partial<ChartOptions<'bar'>> = {
    elements: {
      bar: {
        borderRadius: getStyleNumber('--em-barchart-border-raidus', '0.375rem'),
      },
    },
    plugins: {
      legend: { display: options.showLegend },
      tooltip: {
        enabled: options.showTooltips,
      },
      datalabels: {
        display: (context) => {
          return options.showValueLabels && context.dataset.data[context.dataIndex] !== 0
            ? 'auto'
            : false;
        },
        labels: {
          total: {
            display: (context) => getDatalabelTotalDisplay(context, options.showTotalLabels),
            formatter: getDatalabelTotalFormatter,
            anchor: (context) => {
              const value = context.dataset.data[context.dataIndex] as number;
              return value >= 0 ? 'end' : 'start';
            },
          },
          value: {
            anchor: (context) => {
              if (options.stacked) {
                return 'center';
              }
              const value = context.dataset.data[context.dataIndex] as number;
              return value >= 0 ? 'end' : 'start';
            },
          },
        },
      },
    },
    scales: {
      x: {
        stacked: Boolean(options.stacked),
        title: {
          display: Boolean(options.xAxisLabel),
          text: options.xAxisLabel ?? '',
        },
        ticks: { display: true },
      },
      y: {
        stacked: Boolean(options.stacked),
        title: {
          display: Boolean(options.yAxisLabel),
          text: options.yAxisLabel ?? '',
        },
        ticks: { display: true },
      },
    },
  };

  const getVerticalHorizontalOptions = options.horizontal
    ? getBarHorizontalChartOptions
    : getBarVerticalChartOptions;

  const verticalHorizontalOptions = getVerticalHorizontalOptions(options);

  return mergician(chartjsAxisOptions, baseBarChartOptions, verticalHorizontalOptions);
};
