import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { PieChart } from './PieChart';
import { pieDataMock } from '../pies.mock';

const meta = {
  title: 'Charts/✅ PieChart',
  component: PieChart,
  args: {
    data: pieDataMock,
  },
} satisfies Meta<typeof PieChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
