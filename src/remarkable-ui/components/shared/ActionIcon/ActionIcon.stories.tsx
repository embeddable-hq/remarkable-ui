import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { IconBoltFilled } from '@tabler/icons-react';

import { ActionIcon } from './ActionIcon';
import { storybookArgTypesIcon } from '../../../storybook.constants';

const meta = {
  title: 'shared/✅ ActionIcon',
  component: ActionIcon,
  args: {
    icon: IconBoltFilled,
    disabled: false,
  },
  argTypes: {
    icon: storybookArgTypesIcon,
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof ActionIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Disabled: Story = {
  args: {
    icon: IconBoltFilled,
    disabled: true,
  },
};
