import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Switch } from './Switch';
import { useArgs } from 'storybook/internal/preview-api';

const meta = {
  title: 'Editors/✅ Switch',
  component: Switch,
  args: {
    checked: false,
    disabled: false,
    label: 'Switch Label',
  },
  argTypes: {
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [, updateArgs] = useArgs();

    const handleChange = (checked: boolean) => {
      updateArgs({ checked });
      args.onChange?.(checked);
    };

    return <Switch {...args} onChange={handleChange} />;
  },
};

export const Basic: Story = {
  args: {
    label: undefined,
  },
};

export const WithLabel: Story = {};

export const Disabled: Story = {
  args: {
    label: undefined,
    disabled: true,
  },
};
