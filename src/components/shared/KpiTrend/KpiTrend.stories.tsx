import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { KpiTrend } from './KpiTrend';

const meta = {
  title: 'Charts/Shared/KpiTrend',
  component: KpiTrend,
  argTypes: {
    reverseTrend: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof KpiTrend>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Increasing: Story = {
  args: {
    value: '+15%',
  },
};

export const Decreasing: Story = {
  args: {
    value: '-10%',
  },
};

export const IncreasingReversed: Story = {
  args: {
    value: '+15%',
    reverseTrend: true,
  },
};

export const DecreasingReversed: Story = {
  args: {
    value: '-10%',
    reverseTrend: true,
  },
};
