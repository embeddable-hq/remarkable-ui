import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { IconBoltFilled } from '@tabler/icons-react';

import { ButtonIcon } from './ButtonIcon';

const meta = {
  component: ButtonIcon,
} satisfies Meta<typeof ButtonIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    icon: IconBoltFilled,
    variant: 'primary',
    onClick: () => console.log('Button icon primary clicked!'),
  },
};

export const Secondary: Story = {
  args: {
    icon: IconBoltFilled,
    variant: 'secondary',
    onClick: () => console.log('Button icon secondary clicked!'),
  },
};
