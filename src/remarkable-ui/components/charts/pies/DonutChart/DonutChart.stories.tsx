import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { DonutChart } from './DonutChart';
import { pieDataMock } from '../pies.mock';

const meta = {
  title: 'Charts/✅ DonutChart',
  component: DonutChart,
  args: {
    data: pieDataMock,
  },
} satisfies Meta<typeof DonutChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabels: Story = {
  args: {
    label: 'Total',
    subLabel: (pieDataMock.datasets[0]?.data ?? []).reduce((a, b) => a + b, 0).toString(),
  },
};
