import { ChartData } from 'chart.js';
import { chartColors } from '../charts.constants';
import { mergician } from 'mergician';

export const getBarChartData = (data: ChartData<'bar'>): ChartData<'bar'> => {
  return {
    ...data,
    datasets: data.datasets?.map((dataset, index) => {
      const colors = chartColors[index];
      const defaultDataset = {
        backgroundColor: colors,
        borderColor: colors,
        data: dataset.data,
      };

      return mergician(defaultDataset, dataset) as typeof dataset;
    }),
  };
};
