import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { ChartCardMenu } from './ChartCardMenu';

const meta = {
  component: ChartCardMenu,
} satisfies Meta<typeof ChartCardMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
