import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { KpiChart } from './KpiChart';

const meta = {
  component: KpiChart,
} satisfies Meta<typeof KpiChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: {
    value: 100,
  },
};

export const KpiComparisonEqual: Story = {
  args: {
    value: 100,
    comparisonValue: 100,
    comparisonLabel: 'vs previous period.',
    equalComparisonLabel: 'No change',
  },
};

export const KpiComparisonNegative: Story = {
  args: {
    value: 100,
    comparisonValue: 150,
    comparisonLabel: 'vs previous period.',
    equalComparisonLabel: 'No change',
  },
};

export const KpiComparisonNegativePercentage: Story = {
  args: {
    value: 100,
    comparisonValue: 150,
    showChangeAsPercentage: true,
    comparisonLabel: 'vs previous period.',
    equalComparisonLabel: 'No change',
  },
};

export const KpiComparisonPositive: Story = {
  args: {
    value: 100,
    comparisonValue: 75,
    comparisonLabel: 'vs previous period.',
    equalComparisonLabel: 'No change',
  },
};

export const KpiComparisonPositivePercentage: Story = {
  args: {
    value: 100,
    comparisonValue: 75,
    showChangeAsPercentage: true,
    comparisonLabel: 'vs previous period.',
    equalComparisonLabel: 'No change',
  },
};

export const KpiComparisonPositiveInvertedColors: Story = {
  args: {
    value: 100,
    comparisonValue: 75,
    invertChangeColors: true,
    comparisonLabel: 'vs previous period.',
    equalComparisonLabel: 'No change',
  },
};

export const KpiComparisonNegativeInvertedColors: Story = {
  args: {
    value: 100,
    comparisonValue: 150,
    invertChangeColors: true,
    comparisonLabel: 'vs previous period.',
    equalComparisonLabel: 'No change',
  },
};
