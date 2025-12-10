import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { BarChart } from './BarChart';
import { ChartData } from 'chart.js';
import { decoratorsResizeCard, decoratorsSquare } from '../../../storybook.constants';

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
  title: 'Charts/BarChart',
  component: BarChart,
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

export const Default: Story = {
  decorators: decoratorsSquare,
};

export const Stacked: Story = {
  args: {
    stacked: true,
  },
  decorators: decoratorsSquare,
};

export const LogarithmicScale: Story = {
  args: {
    showLogarithmicScale: true,
  },
  decorators: decoratorsSquare,
};

export const widthRange: Story = {
  args: {
    yAxisRangeMin: 10,
    yAxisRangeMax: 70,
  },
  decorators: decoratorsSquare,
};

export const Horizontal: Story = {
  args: {
    horizontal: true,
  },
  decorators: decoratorsSquare,
};

export const Resize: Story = {
  decorators: decoratorsResizeCard,
};
