import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { mergician } from 'mergician';
import { getChartColors } from '../charts.constants';
import { getChartjsOptions } from '../chartjs.constants';
import { PieChartConfigurationProps } from './pies.types';
import { AnnotationOptions } from 'chartjs-plugin-annotation';
import { getStyle, getStyleNumber } from '../../../styles/styles.utils';

export const getPieChartData = (data: ChartData<'pie'>) => {
  const chartColors = getChartColors();
  const mergedData: ChartData<'pie', number[], unknown> = {
    ...data,
    datasets:
      data.datasets?.map((dataset) => {
        const colors = dataset.data.map((_value, index) => chartColors[index % chartColors.length]);
        const defaultDataset = {
          backgroundColor: colors,
          borderColor: colors,
        };
        const merged = mergician(defaultDataset, dataset) as ChartDataset<'pie'>;
        return merged;
      }) || [],
  };
  return mergedData;
};

export const getPieChartOptions = (
  options: PieChartConfigurationProps,
): Partial<ChartOptions<'pie'>> => {
  const pieChartOptions: Partial<ChartOptions<'pie'>> = {
    plugins: {
      legend: { display: options.showLegend },
      datalabels: {
        display: options.showValueLabels ? 'auto' : false,
      },
      tooltip: {
        enabled: options.showTooltips,
      },
    },
  };
  return mergician(getChartjsOptions(), pieChartOptions);
};

export const getDonutChartOptions = (
  options: PieChartConfigurationProps & { label?: string; subLabel?: string },
): Partial<ChartOptions<'pie'>> => {
  const donutChartOptions: Partial<ChartOptions<'pie'>> = {
    cutout: '60%',
    plugins: {
      annotation: {
        annotations: {
          innerlabel: {
            content: [options.label ?? '', options.subLabel ?? ''],
            type: 'doughnutLabel',
            font: [
              {
                size: getStyleNumber('--em-piechart-donut-number-line-height', '2.375rem'),
                weight: getStyleNumber('--em-piechart-donut-number-font-weight', '700'),
                height: getStyleNumber('--em-piechart-donut-number-line-height', '2.375rem'),
                family: getStyle('--em-piechart-font-family', 'sans-serif'),
              },
              {
                size: getStyleNumber('--em-piechart-donut-label-font-size', '1rem'),
                weight: getStyleNumber('--em-piechart-donut-label-font-weight', '500'),
                height: getStyleNumber('--em-piechart-donut-label-line-height', '1rem'),
                family: getStyle('--em-piechart-font-family', 'sans-serif'),
              },
            ],
            color: [getStyle('--em-piechart-donut-color', '#212129')],
          },
          // According to the last comment, a fix should be coming in the next release:
          // https://github.com/chartjs/chartjs-plugin-annotation/commit/1e95744fb98e6fe9426f8b6a7bd17b1fcdee2f42
        } as unknown as Record<string, AnnotationOptions>,
      },
    },
  };
  return mergician(getPieChartOptions(options), donutChartOptions);
};
