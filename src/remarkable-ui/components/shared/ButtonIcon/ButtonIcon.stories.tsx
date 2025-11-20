import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { IconBoltFilled } from '@tabler/icons-react';

import { ButtonIcon } from './ButtonIcon';
import { storybookArgTypesIcon } from '../../../storybook.constants';

const meta = {
  title: 'Shared/✅ ButtonIcon',
  component: ButtonIcon,
  args: {
    size: 'medium',
    variant: 'primary',
    icon: IconBoltFilled,
    disabled: false,
  },
  argTypes: {
    icon: storybookArgTypesIcon,
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof ButtonIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Primary: Story = {
  args: {
    icon: IconBoltFilled,
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    icon: IconBoltFilled,
    variant: 'secondary',
  },
};

export const Small: Story = {
  args: {
    icon: IconBoltFilled,
    variant: 'primary',
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    icon: IconBoltFilled,
    variant: 'primary',
    size: 'medium',
  },
};

export const Disabled: Story = {
  args: {
    icon: IconBoltFilled,
    variant: 'primary',
    disabled: true,
  },
};
