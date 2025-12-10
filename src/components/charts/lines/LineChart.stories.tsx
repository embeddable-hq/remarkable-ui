import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { LineChart } from './LineChart';
import { ChartData } from 'chart.js';
import { decoratorsResizeCard, decoratorsSquare } from '../../../storybook.constants';

const data: ChartData<'line'> = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Primary Dataset',
      data: [10, 20, 5, 80, 10],
      xAxisID: 'x',
    },
    {
      label: 'Secondary Dataset',
      data: [20, 60, 30, 50, 80],
      xAxisID: 'x',
    },
  ],
};

const meta = {
  title: 'Charts/LineChart',
  component: LineChart,
  args: {
    data,
    showValueLabels: true,
    showLegend: true,
    showTooltips: true,
    xAxisLabel: 'Months',
    yAxisLabel: 'Count',
    reverseXAxis: false,
    showLogarithmicScale: false,
  },
} satisfies Meta<typeof LineChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: decoratorsSquare,
};

export const widthRange: Story = {
  args: {
    yAxisRangeMin: 10,
    yAxisRangeMax: 70,
  },
  decorators: decoratorsSquare,
};

export const Resize: Story = {
  decorators: decoratorsResizeCard,
};
