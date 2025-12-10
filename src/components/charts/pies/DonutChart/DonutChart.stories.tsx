import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { DonutChart } from './DonutChart';
import { pieDataMock } from '../pies.mock';
import { decoratorsResizeCard, decoratorsSquare } from '../../../../storybook.constants';

const meta = {
  title: 'Charts/DonutChart',
  component: DonutChart,
  args: {
    data: pieDataMock,
  },
} satisfies Meta<typeof DonutChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: decoratorsSquare,
};

export const WithTotal: Story = {
  args: {
    label: 'Total',
  },
  decorators: decoratorsSquare,
};

export const WithTotalAndLabel: Story = {
  args: {
    label: 'Total',
    subLabel: (pieDataMock.datasets[0]?.data ?? []).reduce((a, b) => a + b, 0).toString(),
  },
  decorators: decoratorsSquare,
};

export const Resize: Story = {
  decorators: decoratorsResizeCard,
};
