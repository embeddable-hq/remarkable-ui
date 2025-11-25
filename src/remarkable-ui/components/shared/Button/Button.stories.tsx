import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Button } from './Button';
import { storybookArgTypesIcon } from '../../../storybook.constants';
import { IconBoltFilled } from '@tabler/icons-react';

const meta = {
  title: 'Shared/✅ Button',
  component: Button,
  args: {
    children: 'Button',
    size: 'medium',
    variant: 'primary',
    startIcon: IconBoltFilled,
    endIcon: IconBoltFilled,
    disabled: false,
  },
  argTypes: {
    startIcon: storybookArgTypesIcon,
    endIcon: storybookArgTypesIcon,
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium'],
    },
    variant: {
      control: { type: 'radio' },
      options: ['primary', 'secondary'],
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Primary: Story = {
  args: {
    startIcon: IconBoltFilled,
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    startIcon: IconBoltFilled,
    variant: 'secondary',
  },
};

export const Small: Story = {
  args: {
    startIcon: IconBoltFilled,
    variant: 'primary',
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    startIcon: IconBoltFilled,
    variant: 'primary',
    size: 'medium',
  },
};

export const Disabled: Story = {
  args: {
    startIcon: IconBoltFilled,
    variant: 'primary',
    disabled: true,
  },
};
