import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { KpiChart } from './KpiChart';
import { decoratorsResizeCard, decoratorsSquare } from '../../../storybook.constants';

const meta = {
  title: 'Charts/KpiChart',
  component: KpiChart,
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
  decorators: decoratorsSquare,
};

export const PositiveComparison: Story = {
  args: {
    value: 100,
    comparisonValue: 50,
    comparisonLabel: 'vs previous period.',
    equalComparisonLabel: 'No change',
  },
  decorators: decoratorsSquare,
};

export const NegativeComparison: Story = {
  args: {
    value: 100,
    comparisonValue: 150,
    comparisonLabel: 'vs previous period.',
    equalComparisonLabel: 'No change',
  },
  decorators: decoratorsSquare,
};

export const Equal: Story = {
  args: {
    value: 100,
    comparisonValue: 100,
    comparisonLabel: 'vs previous period.',
    equalComparisonLabel: 'No change',
  },
  decorators: decoratorsSquare,
};

export const Percentage: Story = {
  args: {
    value: 100,
    comparisonValue: 75,
    comparisonLabel: 'vs previous period.',
    equalComparisonLabel: 'No change',
    showChangeAsPercentage: true,
  },
  decorators: decoratorsSquare,
};

export const Resize: Story = {
  args: {
    value: 100,
    comparisonValue: 75,
    comparisonLabel: 'vs previous period.',
    equalComparisonLabel: 'No change',
    showChangeAsPercentage: true,
  },
  decorators: decoratorsResizeCard,
};
