import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { DonutChart } from './DonutChart';
import { defaultDonutChartOptions } from './pies.constants';
import { pieDataMock } from './pies.mock';

const meta = {
  component: DonutChart,
} satisfies Meta<typeof DonutChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Total',
subLabel: (pieDataMock.datasets[0]?.data ?? []).reduce((a, b) => a + b, 0).toString(),
    data: pieDataMock,
    options: defaultDonutChartOptions,
  },
};
