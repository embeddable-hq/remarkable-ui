import { ChartData } from 'chart.js';
import { defaultChartDataDataset } from './bars.constants';
import { chartColors } from '../charts.constants';

export const getBarData = (data: ChartData<'bar'>) => {
  const mergedData: ChartData<'bar', number[], unknown> = {
    ...data,
    datasets:
      data.datasets?.map((dataset, index) => {
        const merged = {
          borderRadius: dataset.borderRadius ?? defaultChartDataDataset.borderRadius,
          backgroundColor: dataset.backgroundColor ?? chartColors[index],
          borderColor: dataset.borderColor ?? chartColors[index],
          data: Array.isArray(dataset.data)
            ? dataset.data.filter((d): d is number => typeof d === 'number')
            : [],
        };

        return merged;
      }) || [],
  };
  return mergedData;
};
