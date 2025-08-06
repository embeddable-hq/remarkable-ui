import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { IconBoltFilled } from '@tabler/icons-react';

import { IconButton } from './IconButton';

const meta = {
  component: IconButton,
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: IconBoltFilled,
  },
};
