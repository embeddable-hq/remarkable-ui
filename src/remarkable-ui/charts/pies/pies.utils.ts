import { ChartData, ChartDataset } from 'chart.js';
import { mergician } from 'mergician';
import { defaultData } from './pies.constants';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';

export const getPieData = (data: ChartData<'pie'>) => {
  const mergedData: ChartData<'pie', number[], unknown> = {
    ...data,
    datasets:
      data.datasets?.map((dataset, index) => {
        const defaultDataset = defaultData.datasets?.[index] || { data: [] };
        const merged = mergician(defaultDataset, dataset) as ChartDataset<'pie'>;
        return merged;
      }) || [],
  };
  return mergedData;
};

export const getPieSegmentIndexClicked = (
  event: React.MouseEvent<HTMLCanvasElement>,
  chartRef: React.RefObject<ChartJSOrUndefined<'pie'> | null>,
): number | undefined => {
  const chart = chartRef.current;

  if (!chart) return undefined;

  const points = chart.getElementsAtEventForMode(
    event.nativeEvent,
    'nearest',
    { intersect: true },
    false,
  );

  return points[0]?.index;
};
