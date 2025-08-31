import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { BarChart } from './BarChart';
import { ChartData } from 'chart.js';

const meta = {
  component: BarChart,
} satisfies Meta<typeof BarChart>;

export default meta;

type Story = StoryObj<typeof meta>;

const barChartData: ChartData<'bar'> = {
  labels: ['Orange 1', 'Orange 2', 'Orange 3', 'Orange 4', 'Orange 5'],
  datasets: [
    {
      label: 'Sales',
      data: [12, 19, 3, 5, 2],
    },
    {
      label: 'Orders',
      data: [2, 4, 3, 5, 1],
    },
  ],
};

const barChartOptions = {};

export const Vertical: Story = {
  args: {
    data: barChartData,
    options: barChartOptions,
    horizontal: false,
  },
};

export const Horizontal: Story = {
  args: {
    data: barChartData,
    options: barChartOptions,
    horizontal: true,
  },
};

export const LargeVertical = () => {
  return (
    <div style={{ width: 400, height: 400 }}>
      <BarChart data={barChartData} options={barChartOptions} />
    </div>
  );
};

export const LargeHorizontal = () => {
  return (
    <div style={{ width: 400, height: 400 }}>
      <BarChart horizontal data={barChartData} options={barChartOptions} />
    </div>
  );
};
