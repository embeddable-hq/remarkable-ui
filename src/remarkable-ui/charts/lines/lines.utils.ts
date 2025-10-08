import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { chartContrastColors } from '../charts.constants';
import { mergician } from 'mergician';
import { LineChartConfigurationProps } from './lines.types';
import {
  chartjsAxisOptions,
  chartjsAxisOptionsLayoutPadding,
} from '../chartjs.cartesian.constants';
import { getStyleNumber } from '../../styles/styles.utils';

export const getLineChartData = (data: ChartData<'line'>) => {
  const mergedData: ChartData<'line', number[], unknown> = {
    ...data,
    datasets:
      data.datasets?.map((dataset, index) => {
        const colors = chartContrastColors[index % chartContrastColors.length];
        const defaultDataset: Partial<ChartData<'line'>['datasets'][number]> = {
          backgroundColor: colors,
          borderColor: colors,
        };
        const merged = mergician(defaultDataset, dataset) as ChartDataset<'line', number[]>;
        return merged;
      }) || [],
  };
  return mergedData;
};

export const getLineChartOptions = (
  options: LineChartConfigurationProps,
): Partial<ChartOptions<'line'>> => {
  const newOptions: Partial<ChartOptions<'line'>> = {
    interaction: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      point: {
        radius: getStyleNumber('--em-line-chart-point-size-default')! / 2,
        hoverRadius: getStyleNumber('--em-line-chart-point-size-hover')! / 2,
      },
      line: {
        tension: getStyleNumber('--em-line-chart-line-tension'),
        borderWidth: getStyleNumber('--em-line-chart-border-width-default'),
      },
    },
    layout: {
      padding: {
        top: options.showValueLabels ? chartjsAxisOptionsLayoutPadding : 0,
      },
    },
    plugins: {
      datalabels: {
        display: (context) => {
          if (!options.showValueLabels) return false;
          const value: number | undefined = context.dataset.data[context.dataIndex] as
            | number
            | undefined;
          const yScale = context.chart.scales.y;
          return value !== undefined && yScale && value >= yScale.min && value <= yScale.max
            ? 'auto'
            : false;
        },
      },
      legend: {
        display: options.showLegend,
      },
      tooltip: {
        enabled: options.showTooltips,
      },
    },
    scales: {
      x: {
        title: {
          display: Boolean(options.xAxisLabel),
          text: options.xAxisLabel,
        },
        reverse: options.reverseXAxis,
      },
      y: {
        grid: { display: true },
        type: options.showLogarithmicScale ? 'logarithmic' : 'linear',
        title: {
          display: Boolean(options.yAxisLabel),
          text: options.yAxisLabel,
        },
        min: options.yAxisRangeMin,
        max: options.yAxisRangeMax,
      },
    },
  };

  return mergician(chartjsAxisOptions, newOptions);
};
