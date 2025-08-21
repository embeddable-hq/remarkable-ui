import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { TextField } from './TextField';
import { IconBoltFilled } from '@tabler/icons-react';
import { useArgs } from 'storybook/internal/preview-api';

const meta = {
  component: TextField,
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    onChange: (value) => console.log('onChange', value),
  },
};

export const Filled: Story = {
  args: { value: 'Filled text field', onChange: (value) => console.log('onChange', value) },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    onChange: (value) => console.log('onChange', value),
  },
};

export const Icons: Story = {
  args: {
    startIcon: IconBoltFilled,
    endIcon: IconBoltFilled,
    value: 'Filled text field',
    onChange: (value) => console.log('onChange', value),
  },
};

export const WithState: Story = {
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();

    return (
      <TextField {...args} value={value} onChange={(newValue) => updateArgs({ value: newValue })} />
    );
  },
  args: {
    startIcon: IconBoltFilled,
    endIcon: IconBoltFilled,
    disabled: true,
    onChange: (value) => console.log('onChange', value),
  },
};
