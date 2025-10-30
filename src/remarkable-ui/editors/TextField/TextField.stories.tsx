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

export const WithMaxLength: Story = {
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();

    return (
      <TextField {...args} value={value} onChange={(newValue) => updateArgs({ value: newValue })} />
    );
  },
  args: {
    maxLength: 50,
    placeholder: 'Enter text with character limit',
    onChange: (value) => console.log('onChange', value),
  },
};

export const WithMaxLengthMaxed: Story = {
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();

    return (
      <TextField {...args} value={value} onChange={(newValue) => updateArgs({ value: newValue })} />
    );
  },
  args: {
    maxLength: 25,
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

export const RequiredWithMaxLength: Story = {
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();

    return (
      <TextField {...args} value={value} onChange={(newValue) => updateArgs({ value: newValue })} />
    );
  },
  args: {
    required: true,
    maxLength: 30,
    placeholder: 'Required field with character limit',
    onChange: (value) => console.log('onChange', value),
  },
};

export const WithError: Story = {
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();

    return (
      <TextField {...args} value={value} onChange={(newValue) => updateArgs({ value: newValue })} />
    );
  },
  args: {
    value: 'Invalid input',
    error: true,
    errorMessage: 'This field contains invalid characters',
    onChange: (value) => console.log('onChange', value),
  },
};

export const WithErrorEmpty: Story = {
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();

    return (
      <TextField {...args} value={value} onChange={(newValue) => updateArgs({ value: newValue })} />
    );
  },
  args: {
    value: '',
    error: true,
    errorMessage: 'This field is required',
    placeholder: 'Enter text',
    onChange: (value) => console.log('onChange', value),
  },
};

export const WithErrorAndMaxLength: Story = {
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();

    return (
      <TextField {...args} value={value} onChange={(newValue) => updateArgs({ value: newValue })} />
    );
  },
  args: {
    value: 'This text exceeds the maximum length allowed',
    maxLength: 20,
    error: true,
    errorMessage: 'Text exceeds maximum length of 20 characters',
    onChange: (value) => console.log('onChange', value),
  },
};
