import type { Meta } from '@storybook/react-webpack5';
import { BasePieChart } from './PieChart';

const meta = {
  component: BasePieChart,
} satisfies Meta<typeof BasePieChart>;

export default meta;

const data = {
  labels: ['Orange 1', 'Orange 2', 'Orange 3', 'Orange 4', 'Orange 5', 'Orange 6'],
  datasets: [
    {
      data: [12, 19, 3, 5, 2, 3],
    },
  ],
};

const options = {
  plugins: {
    datalabels: {
      display: true,
    },
    legend: {
      position: 'right',
      display: true,
    },
    tooltip: { enabled: true },
  },
};

export const PieChart1 = () => <PieChart data={data} options={options} />;
export const PieChart2 = () => <DonutChart data={data} options={options as any} />;
export const PieChart3 = () => <DonutChart data={data} options={options as any} />;
