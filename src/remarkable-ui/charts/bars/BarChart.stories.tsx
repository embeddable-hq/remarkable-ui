import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { BarChart } from './BarChart';
import { ChartData } from 'chart.js';

const meta = {
  component: BarChart,
} satisfies Meta<typeof BarChart>;

export default meta;

type Story = StoryObj<typeof meta>;

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const barChartData: ChartData<'bar'> = {
  labels: labels,
  datasets: [
    {
      label: 'Number of sales',
      data: [65, 59, 80, 200, 56, 55, 40],
    },
    {
      label: 'Number of visitors',
      data: [43, 10, 12, 102, 66, 200, 200],
    },
  ],
};

export const Vertical: Story = {
  args: {
    data: barChartData,
    horizontal: false,
  },
};

export const Horizontal: Story = {
  args: {
    data: barChartData,
    horizontal: true,
  },
};

export const SquareVertical = () => {
  return (
    <div style={{ width: 400, height: 400 }}>
      <BarChart data={barChartData} />
    </div>
  );
};

export const SquareHorizontal = () => {
  return (
    <div style={{ width: 400, height: 400 }}>
      <BarChart horizontal data={barChartData} />
    </div>
  );
};

export const SquareVerticalHorizontal = () => {
  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <div style={{ width: 400, height: 400 }}>
        <BarChart horizontal data={barChartData} />
      </div>
      <div style={{ width: 400, height: 400 }}>
        <BarChart data={barChartData} />
      </div>
    </div>
  );
};
