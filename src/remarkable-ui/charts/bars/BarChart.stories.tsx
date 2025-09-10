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

export const Vertical: Story = {
  render: (args) => {
    return (
      <div style={{ width: 400, height: 400 }}>
        <BarChart {...args} />
      </div>
    );
  },
  args: {
    data: barChartData,
    horizontal: false,
    showLegend: false,
    showTooltips: true,
    showValueLabels: false,
    showLogarithmicScale: false,
    xAxisLabel: '',
    yAxisLabel: '',
    reverseYAxis: false,
    xAxisRangeMin: undefined,
    xAxisRangeMax: undefined,
  },
};

export const VerticalStacked: Story = {
  render: (args) => {
    return (
      <div style={{ width: 400, height: 400 }}>
        <BarChart {...args} />
      </div>
    );
  },
  args: {
    data: barChartData,
    horizontal: false,
    showLegend: false,
    showTooltips: true,
    showValueLabels: false,
    showLogarithmicScale: false,
    stacked: 'stacked',
    xAxisLabel: '',
    yAxisLabel: '',
    reverseYAxis: false,
    xAxisRangeMin: undefined,
    xAxisRangeMax: undefined,
  },
};

export const Horizontal: Story = {
  render: (args) => {
    return (
      <div style={{ width: 400, height: 400 }}>
        <BarChart {...args} />
      </div>
    );
  },
  args: {
    data: barChartData,
    horizontal: true,
    showLegend: false,
    showTooltips: true,
    showValueLabels: false,
    showLogarithmicScale: false,
    xAxisLabel: '',
    yAxisLabel: '',
    reverseXAxis: false,
    yAxisRangeMin: undefined,
    yAxisRangeMax: undefined,
  },
};

export const HorizontalStacked: Story = {
  render: (args) => {
    return (
      <div style={{ width: 400, height: 400 }}>
        <BarChart {...args} />
      </div>
    );
  },
  args: {
    data: barChartData,
    horizontal: true,
    showLegend: false,
    showTooltips: true,
    showValueLabels: false,
    showLogarithmicScale: false,
    stacked: 'stacked',
    xAxisLabel: '',
    yAxisLabel: '',
    reverseXAxis: false,
    yAxisRangeMin: undefined,
    yAxisRangeMax: undefined,
  },
};
