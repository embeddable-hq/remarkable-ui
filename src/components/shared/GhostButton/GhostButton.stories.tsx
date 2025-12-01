import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { GhostButton } from './GhostButton';
import { IconBoltFilled } from '@tabler/icons-react';
import { storybookArgTypesIconNullable } from '../../../storybook.constants';

const meta = {
  title: 'shared/GhostButton',
  component: GhostButton,
  args: {
    children: 'Ghost Button',
    disabled: false,
    startIcon: undefined,
    endIcon: undefined,
  },
  argTypes: {
    startIcon: storybookArgTypesIconNullable,
    endIcon: storybookArgTypesIconNullable,
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof GhostButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithStartIcon: Story = {
  args: {
    children: 'Ghost Button Start Icon',
    startIcon: IconBoltFilled,
  },
};

export const WithEndIcon: Story = {
  args: {
    children: 'Ghost Button End Icon',
    endIcon: IconBoltFilled,
  },
};

export const WithStartEndIcon: Story = {
  args: {
    children: 'Ghost Button Start End Icon',
    startIcon: IconBoltFilled,
    endIcon: IconBoltFilled,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Ghost Button Disabled',
    disabled: true,
  },
};
