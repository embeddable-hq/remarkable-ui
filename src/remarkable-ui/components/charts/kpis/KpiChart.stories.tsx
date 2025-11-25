import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { KpiChart } from './KpiChart';

const meta = {
  title: 'Charts/✅ KpiChart',
  component: KpiChart,
  decorators: [
    (Story) => (
      <div
        style={{
          width: '400px',
          height: '200px',
          resize: 'both',
          overflow: 'auto',
          border: '1px solid #ccc',
        }}
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    valueFontSize: {
      control: {
        type: 'number',
      },
    },
  },
} satisfies Meta<typeof KpiChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 100,
  },
};

export const PositiveComparison: Story = {
  args: {
    value: 100,
    comparisonValue: 50,
    comparisonLabel: 'vs previous period.',
    equalComparisonLabel: 'No change',
  },
};

export const NegativeComparison: Story = {
  args: {
    value: 100,
    comparisonValue: 150,
    comparisonLabel: 'vs previous period.',
    equalComparisonLabel: 'No change',
  },
};

export const Equal: Story = {
  args: {
    value: 100,
    comparisonValue: 100,
    comparisonLabel: 'vs previous period.',
    equalComparisonLabel: 'No change',
  },
};

export const Percentage: Story = {
  args: {
    value: 100,
    comparisonValue: 75,
    comparisonLabel: 'vs previous period.',
    equalComparisonLabel: 'No change',
    showChangeAsPercentage: true,
  },
};
