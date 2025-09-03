import { ChartData } from 'chart.js';
import { chartColors } from '../charts.constants';
import { mergician } from 'mergician';
import { getStyleNumber } from '../../styles/styles.utils';

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
