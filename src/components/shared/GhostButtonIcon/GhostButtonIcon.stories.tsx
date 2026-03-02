import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { IconBoltFilled } from '@tabler/icons-react';

import { GhostButtonIcon } from './GhostButtonIcon';
import { storybookArgTypesIcon } from '../../../storybook.constants';

const meta = {
  title: 'shared/GhostButtonIcon',
  component: GhostButtonIcon,
  args: {
    icon: IconBoltFilled,
    disabled: false,
  },
  argTypes: {
    icon: storybookArgTypesIcon,
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof GhostButtonIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Default: Story = {
  args: {
    icon: IconBoltFilled,
  },
};

export const Disabled: Story = {
  args: {
    icon: IconBoltFilled,
    disabled: true,
  },
};
