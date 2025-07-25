import { FC } from 'react';
import {
  ArcElement,
  Chart as ChartJS,
  ChartData,
  ChartDataset,
  ChartOptions,
  Legend,
  Tooltip,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { mergician } from 'mergician';
import { remarkableTheme, Theme } from '../../../theme/theme';
import { geDefaultOptions, getDefaultData } from './PieChart.utils';

ChartJS.register(ArcElement, Tooltip, Legend);

type PieChartProps = {
  data: ChartData<'pie'>;
  options?: Partial<ChartOptions<'pie'>>;
  theme?: Theme;
};

export const PieChart: FC<PieChartProps> = ({ data, options = {}, theme = remarkableTheme }) => {
  const mergedData: ChartData<'pie', number[], unknown> = {
    ...data,
    datasets:
      data.datasets?.map((dataset, index) => {
        const defaultDataset = getDefaultData(theme).datasets?.[index] || { data: [] };
        const merged = mergician(defaultDataset, dataset) as ChartDataset<'pie'>;
        return merged;
      }) || [],
  };

  const mergedOptions = mergician(geDefaultOptions(theme), options);

  return <Pie data={mergedData} options={mergedOptions} />;
};
