import { ChartData, ChartDataset } from 'chart.js';
import { mergician } from 'mergician';
import { chartColors } from '../charts.constants';

export const getPieChartData = (data: ChartData<'pie'>) => {
  const mergedData: ChartData<'pie', number[], unknown> = {
    ...data,
    datasets:
      data.datasets?.map((dataset, index) => {
        const colors = chartColors[index % chartColors.length];
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
