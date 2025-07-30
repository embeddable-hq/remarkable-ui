import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { ChartCardOptions } from './ChartCardMenu';

const meta = {
  component: ChartCardOptions,
} satisfies Meta<typeof ChartCardOptions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
