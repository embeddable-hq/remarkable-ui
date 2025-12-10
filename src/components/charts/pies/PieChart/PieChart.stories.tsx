import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { PieChart } from './PieChart';
import { pieDataMock } from '../pies.mock';
import { decoratorsResizeCard, decoratorsSquare } from '../../../../storybook.constants';

const meta = {
  title: 'Charts/PieChart',
  component: PieChart,
  args: {
    data: pieDataMock,
  },
} satisfies Meta<typeof PieChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: decoratorsSquare,
};

export const Resize: Story = {
  decorators: decoratorsResizeCard,
};
