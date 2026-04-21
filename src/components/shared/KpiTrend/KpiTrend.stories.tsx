import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { KpiTrend } from './KpiTrend';

const meta = {
  title: 'Charts/Shared/KpiTrend',
  component: KpiTrend,
  argTypes: {
    direction: {
      control: { type: 'select' },
      options: ['positive', 'negative'],
    },
  },
} satisfies Meta<typeof KpiTrend>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Positive: Story = {
  args: {
    direction: 'positive',
    value: '+15%',
  },
};

export const Negative: Story = {
  args: {
    direction: 'negative',
    value: '-10%',
  },
};

export const PositiveAbsolute: Story = {
  args: {
    direction: 'positive',
    value: '+1,200',
  },
};

export const NegativeAbsolute: Story = {
  args: {
    direction: 'negative',
    value: '-340',
  },
};
