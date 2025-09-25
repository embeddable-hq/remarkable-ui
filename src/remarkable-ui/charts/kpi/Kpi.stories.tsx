import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Kpi } from './Kpi';

const meta = {
  component: Kpi,
} satisfies Meta<typeof Kpi>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: {
    value: 100,
  },
};

export const KpiComparisonNegative: Story = {
  args: {
    value: 100,
    comparisonValue: 150,
  },
};

export const KpiComparisonNegativePercentage: Story = {
  args: {
    value: 100,
    comparisonValue: 150,
    showChangeAsPercentage: true,
  },
};

export const KpiComparisonPositive: Story = {
  args: {
    value: 100,
    comparisonValue: 75,
  },
};

export const KpiComparisonPositivePercentage: Story = {
  args: {
    value: 100,
    comparisonValue: 75,
    showChangeAsPercentage: true,
  },
};

export const KpiComparisonPositiveInvertedColors: Story = {
  args: {
    value: 100,
    comparisonValue: 75,
    invertChangeColors: true,
  },
};

export const KpiComparisonNegativeInvertedColors: Story = {
  args: {
    value: 100,
    comparisonValue: 150,
    invertChangeColors: true,
  },
};
