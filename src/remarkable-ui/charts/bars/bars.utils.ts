import { ChartData, ChartOptions } from 'chart.js';
import { chartColors } from '../charts.constants';
import { getStyle, getStyleNumber } from '../../styles/styles.utils';
import { mergician } from 'mergician';
import { BarChartConfigurationProps, BarChartHorizontalConfigurationProps } from './bars.types';
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
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'top',
      },
    },
    scales: {
      y: {
        grid: { display: true },
        ticks: {
          color: getStyle('--em-chart-grid-font-color-muted'),
        },
        min: config.yAxisRangeMin,
        max: config.yAxisRangeMax,
        type: config.showLogarithmicScale ? 'logarithmic' : 'linear',
        title: {
          text: config.yAxisLabel ?? '',
        },
      },
      x: {
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
        anchor: 'end',
        align: 'right',
      },
    },
    scales: {
      x: {
        grid: { display: true },
        ticks: {
          color: getStyle('--em-chart-grid-font-color-muted'),
        },
        min: config.xAxisRangeMin,
        max: config.xAxisRangeMax,
        type: config.showLogarithmicScale ? 'logarithmic' : 'linear',
        title: {
          text: config.xAxisLabel ?? '',
        },
      },
      y: {
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
