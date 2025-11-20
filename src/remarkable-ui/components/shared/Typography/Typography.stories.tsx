import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Typography } from './Typography';

const meta = {
  title: 'Shared/✅ Typography',
  component: Typography,
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Typography example',
    as: 'p',
  },
};
