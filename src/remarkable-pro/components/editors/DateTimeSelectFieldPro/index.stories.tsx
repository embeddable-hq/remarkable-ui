import type { Meta, StoryObj } from '@storybook/react-webpack5';

import Index from './index';

const meta = {
  component: Index,
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
