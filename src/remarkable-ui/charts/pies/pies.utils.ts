import { ChartData, ChartDataset } from 'chart.js';
import { mergician } from 'mergician';
import { defaultPieData } from './pies.constants';

export const getPieData = (data: ChartData<'pie'>) => {
  const mergedData: ChartData<'pie', number[], unknown> = {
    ...data,
    datasets:
      data.datasets?.map((dataset, index) => {
        const defaultDataset = defaultPieData.datasets?.[index] || { data: [] };
        const merged = mergician(defaultDataset, dataset) as ChartDataset<'pie'>;
        return merged;
      }) || [],
  };
  return mergedData;
};
