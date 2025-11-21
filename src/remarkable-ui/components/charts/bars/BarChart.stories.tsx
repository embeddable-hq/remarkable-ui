import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { BarChart } from './BarChart';
import { ChartData } from 'chart.js';

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const data: ChartData<'bar'> = {
  labels,
  datasets: [
    {
      label: 'Sales',
      data: [100, 50, 50, 20, 80, 60, 70],
    },
    {
      label: 'Active Users',
      data: [20, 30, 50, 90, 60, 30, 60],
    },
  ],
};

const meta = {
  title: 'Charts/✅ BarChart',
  component: BarChart,
  decorators: [
    (Story) => (
      <div
        style={{
          width: 500,
          height: 500,
          display: 'flex',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    data,
    showValueLabels: true,
    showLegend: true,
    showTooltips: true,
    horizontal: false,
    showLogarithmicScale: false,
    xAxisLabel: 'Months',
    yAxisLabel: 'Count',
    reverseXAxis: false,
    reverseYAxis: false,
    stacked: false,
  },
  argTypes: {
    yAxisRangeMin: {
      control: {
        type: 'number',
      },
    },
    yAxisRangeMax: {
      control: {
        type: 'number',
      },
    },
  },
} satisfies Meta<typeof BarChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Stacked: Story = {
  args: {
    stacked: true,
  },
};

export const LogarithmicScale: Story = {
  args: {
    showLogarithmicScale: true,
  },
};

export const widthRange: Story = {
  args: {
    yAxisRangeMin: 10,
    yAxisRangeMax: 70,
  },
};

export const Horizontal: Story = {
  args: {
    horizontal: true,
  },
};
