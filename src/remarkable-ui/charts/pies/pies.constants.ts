import { ChartOptions } from 'chart.js';
import { getStyle, getStyleNumber } from '../../styles/styles.utils';
import { AnnotationOptions } from 'chartjs-plugin-annotation';
import { chartjsOptions } from '../chartjs.constants';

export const defaultPieChartOptions: Partial<ChartOptions<'pie'>> = chartjsOptions as Partial<
  ChartOptions<'pie'>
>;

export const defaultDonutChartOptions: Partial<ChartOptions<'pie'>> = {
  cutout: '60%',
  ...defaultPieChartOptions,
};

export const defaultDonutLabelChartOptions: Partial<ChartOptions<'pie'>> = {
  cutout: '60%',
  ...defaultPieChartOptions,
  plugins: {
    ...defaultPieChartOptions.plugins,
    annotation: {
      annotations: {
        innerlabel: {
          type: 'doughnutLabel',
          font: [
            {
              size: getStyleNumber('--em-pie-chart-donut-number-font-size'),
              weight: getStyleNumber('--em-pie-chart-donut-number-font-weight'),
              height: getStyleNumber('--em-pie-chart-donut-number-font-line-height'),
              family: 'Inter, sans-serif',
            },
            {
              size: getStyleNumber('--em-pie-chart-donut-label-font-size'),
              weight: getStyleNumber('--em-pie-chart-donut-label-font-weight'),
              height: getStyleNumber('--em-pie-chart-donut-label-font-line-height'),
              family: 'Inter, sans-serif',
            },
          ],
          color: [
            getStyle('--em-pie-chart-donut-number-text-default'),
            getStyle('--em-pie-chart-donut-label-text-default'),
          ],
        },
        // According to the last comment, a fix should be coming in the next release:
        // https://github.com/chartjs/chartjs-plugin-annotation/commit/1e95744fb98e6fe9426f8b6a7bd17b1fcdee2f42
      } as unknown as Record<string, AnnotationOptions>,
    },
  },
};
