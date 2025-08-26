import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Button } from './Button';
import { IconBoltFilled } from '@tabler/icons-react';

const meta = {
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PrimaryMedium: Story = {
  args: {
    children: 'Primary Medium Button',
    variant: 'primary',
    size: 'medium',
    startIcon: IconBoltFilled,
    endIcon: IconBoltFilled,
    disabled: false,
    onClick: () => console.log('Button clicked!'),
  },
};

export const PrimarySmall: Story = {
  args: {
    children: 'Primary Small Button',
    variant: 'primary',
    size: 'small',
    startIcon: IconBoltFilled,
    endIcon: IconBoltFilled,
    disabled: false,
    onClick: () => console.log('Button clicked!'),
  },
};

export const SecondaryMedium: Story = {
  args: {
    children: 'Secondary Medium Button',
    variant: 'secondary',
    size: 'medium',
    startIcon: IconBoltFilled,
    endIcon: IconBoltFilled,
    disabled: false,
    onClick: () => console.log('Button clicked!'),
  },
};

export const SecondarySmall: Story = {
  args: {
    children: 'Secondary Medium Button',
    variant: 'secondary',
    size: 'small',
    startIcon: IconBoltFilled,
    endIcon: IconBoltFilled,
    disabled: false,
    onClick: () => console.log('Button clicked!'),
  },
};
