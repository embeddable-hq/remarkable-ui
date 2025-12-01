import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { getChartContrastColors } from '../charts.constants';
import { mergician } from 'mergician';
import { LineChartConfigurationProps } from './lines.types';
import {
  getChartjsAxisOptions,
  chartjsAxisOptionsLayoutPadding,
  getChartjsAxisOptionsScalesGridColor,
  getChartjsAxisOptionsScalesTicksDefault,
  getChartjsAxisOptionsScalesTicksMuted,
} from '../chartjs.cartesian.constants';
import { getStyleNumber } from '../../../styles/styles.utils';

export const getLineChartData = (data: ChartData<'line'>) => {
  const chartContrastColors = getChartContrastColors();
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
      mode: 'x',
      intersect: false,
    },
    elements: {
      point: {
        radius: getStyleNumber('--em-linechart-point-size', '0.5rem')! / 2,
        hoverRadius: getStyleNumber('--em-linechart-point-size--hover', '0.75rem')! / 2,
      },
      line: {
        tension: 0.2,
        borderWidth: getStyleNumber('--em-linechart-line-width', '0.125rem'),
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
        grid: { display: false },
        border: {
          display: false,
        },
        ticks: getChartjsAxisOptionsScalesTicksDefault(),
        title: {
          display: Boolean(options.xAxisLabel),
          text: options.xAxisLabel,
        },
        reverse: options.reverseXAxis,
      },
      y: {
        beginAtZero: true,
        ticks: getChartjsAxisOptionsScalesTicksMuted(),
        grid: { display: true, color: getChartjsAxisOptionsScalesGridColor },
        border: {
          display: false,
        },
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

  return mergician(getChartjsAxisOptions(), newOptions);
};
