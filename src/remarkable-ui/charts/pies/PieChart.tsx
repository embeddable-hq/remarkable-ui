import { FC } from 'react';
import { BasePieChartProps } from './pies.types';
import { mergician } from 'mergician';
import { defaultPieChartOptions } from './pies.constants';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export type PieChartProps = BasePieChartProps;

export const PieChart: FC<PieChartProps> = ({ options = {}, ...props }) => {
  const pieChartOptions = mergician(defaultPieChartOptions, options);
  return <Pie {...props} options={pieChartOptions} />;
};
