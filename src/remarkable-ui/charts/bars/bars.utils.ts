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

const getDatalabelTotalDisplay = (context: Context) =>
  context.datasetIndex === context.chart.data.datasets.length - 1 ? 'auto' : false;

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
  return mergician(defaultBarChartOptions, {
    indexAxis: 'x',
    plugins: {
      datalabels: {
        labels: {
          total: {
            anchor: (context) => {
              const value = context.dataset.data[context.dataIndex] as number;
              return value >= 0 ? 'end' : 'start';
            },
            align: (context) => {
              const value = context.dataset.data[context.dataIndex] as number;
              return value >= 0 ? 'top' : 'bottom';
            },
            display: getDatalabelTotalDisplay,
            formatter: getDatalabelTotalFormatter,
          },
          value: {
            anchor: (context) => {
              if (config.stacked) {
                return 'center';
              }
              const value = context.dataset.data[context.dataIndex] as number;
              return value >= 0 ? 'end' : 'start';
            },
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
      y: {
        stacked: config.stacked,
        grid: { display: true },
        ticks: {
          color: getStyle('--em-chart-grid-font-color-muted'),
          ...(config.stacked === 'percentage' && {
            callback: (value: string) => value + '%',
          }),
        },
        min: config.yAxisRangeMin,
        max: config.stacked === 'percentage' ? 100 : config.yAxisRangeMax,
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
  } as Partial<ChartOptions<'bar'>>);
};

const getBarHorizontalChartOptions = (
  config: BarChartHorizontalConfigurationProps,
): Partial<ChartOptions<'bar'>> => {
  return mergician(defaultBarChartOptions, {
    indexAxis: 'y',
    plugins: {
      datalabels: {
        labels: {
          total: {
            anchor: (context) => {
              const value = context.dataset.data[context.dataIndex] as number;
              return value >= 0 ? 'end' : 'start';
            },
            align: (context) => {
              const value = context.dataset.data[context.dataIndex] as number;
              return value >= 0 ? 'right' : 'left';
            },
            display: getDatalabelTotalDisplay,
            formatter: getDatalabelTotalFormatter,
          },
          value: {
            anchor: (context) => {
              if (config.stacked) {
                return 'center';
              }
              const value = context.dataset.data[context.dataIndex] as number;
              return value >= 0 ? 'end' : 'start';
            },
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
        stacked: config.stacked,
        grid: { display: true },
        ticks: {
          color: getStyle('--em-chart-grid-font-color-muted'),
          ...(config.stacked === 'percentage' && {
            callback: (value: string) => value + '%',
          }),
        },
        min: config.xAxisRangeMin,
        max: config.stacked === 'percentage' ? 100 : config.xAxisRangeMax,
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
  } as Partial<ChartOptions<'bar'>>);
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
        display: (context) => {
          return showValueLabels && context.dataset.data[context.dataIndex] !== 0 ? 'auto' : false;
        },
      },
      tooltip: {
        enabled: showTooltips,
      },
    },
  } as Partial<ChartOptions<'bar'>>);
};
