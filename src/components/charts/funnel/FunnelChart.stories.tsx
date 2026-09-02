import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { FunnelChart } from './FunnelChart';
import { funnelDataMock } from './funnel.mock';
import { decoratorsResizeCard, decoratorsSquare } from '../../../storybook.constants';

const meta = {
  title: 'Charts/FunnelChart',
  component: FunnelChart,
  args: {
    data: funnelDataMock,
    showPercentage: false,
    percentageDecimalPlaces: 1,
  },
} satisfies Meta<typeof FunnelChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: decoratorsSquare,
};

export const Resize: Story = {
  decorators: decoratorsResizeCard,
};
