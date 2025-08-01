import { FC } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  ArcElement,
  Chart as ChartJS,
  ChartData,
  ChartDataset,
  ChartOptions,
  Legend,
  Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { mergician } from 'mergician';
import { defaultOptions, defaultData } from './PieChart.utils';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

type PieChartProps = {
  data: ChartData<'pie'>;
  options?: Partial<ChartOptions<'pie'>>;
};

export const PieChart: FC<PieChartProps> = ({ data, options = {} }) => {
  const mergedData: ChartData<'pie', number[], unknown> = {
    ...data,
    datasets:
      data.datasets?.map((dataset, index) => {
        const defaultDataset = defaultData.datasets?.[index] || { data: [] };
        const merged = mergician(defaultDataset, dataset) as ChartDataset<'pie'>;
        return merged;
      }) || [],
  };

  const mergedOptions = mergician(defaultOptions, options);

  return <Pie data={mergedData} options={mergedOptions} />;
};
