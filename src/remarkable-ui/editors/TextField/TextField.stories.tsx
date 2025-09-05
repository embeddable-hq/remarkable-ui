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
    required: true,
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
    disabled: false,
    onChange: (value) => console.log('onChange', value),
  },
};

export const WithCharacterLimit: Story = {
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();

    return (
      <TextField {...args} value={value} onChange={(newValue) => updateArgs({ value: newValue })} />
    );
  },
  args: {
    characterLimit: 50,
    placeholder: 'Enter text with character limit',
    onChange: (value) => console.log('onChange', value),
  },
};

export const WithCharacterLimitMaxed: Story = {
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();

    return (
      <TextField {...args} value={value} onChange={(newValue) => updateArgs({ value: newValue })} />
    );
  },
  args: {
    characterLimit: 20,
    value: 'This text is at the limit',
    placeholder: 'Enter text with character limit',
    onChange: (value) => console.log('onChange', value),
  },
};

export const Required: Story = {
  args: {
    required: true,
    placeholder: 'This field is required',
    onChange: (value) => console.log('onChange', value),
  },
};

export const RequiredWithCharacterLimit: Story = {
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();

    return (
      <TextField {...args} value={value} onChange={(newValue) => updateArgs({ value: newValue })} />
    );
  },
  args: {
    required: true,
    characterLimit: 30,
    placeholder: 'Required field with character limit',
    onChange: (value) => console.log('onChange', value),
  },
};
