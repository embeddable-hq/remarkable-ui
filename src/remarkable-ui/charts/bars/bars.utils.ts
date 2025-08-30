import { ChartData } from 'chart.js';
import { defaultChartDataDataset } from './bars.constants';

export const getBarData = (data: ChartData<'bar'>) => {
  const mergedData: ChartData<'bar', number[], unknown> = {
    ...data,
    datasets:
      data.datasets?.map((dataset, index) => {
        const merged = {
          ...dataset,
          data: Array.isArray(dataset.data)
            ? (dataset.data.filter((d): d is number => typeof d === 'number') as number[])
            : [],
          backgroundColor:
            dataset.backgroundColor ??
            (Array.isArray(defaultChartDataDataset.backgroundColor)
              ? defaultChartDataDataset.backgroundColor[index]
              : defaultChartDataDataset.backgroundColor),
          borderColor:
            dataset.borderColor ??
            (Array.isArray(defaultChartDataDataset.borderColor)
              ? defaultChartDataDataset.borderColor[index]
              : defaultChartDataDataset.borderColor),
          borderRadius: dataset.borderRadius ?? defaultChartDataDataset.borderRadius,
        };
        return merged;
      }) || [],
  };
  return mergedData;
};
