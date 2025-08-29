import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { ChartCardMenuPro } from './ChartCardMenuPro';

const meta = {
  component: ChartCardMenuPro,
} satisfies Meta<typeof ChartCardMenuPro>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
