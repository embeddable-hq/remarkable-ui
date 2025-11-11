import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { NumberField } from './NumberField';
import { IconBoltFilled } from '@tabler/icons-react';
import { useArgs } from 'storybook/internal/preview-api';

const meta = {
  component: NumberField,
} satisfies Meta<typeof NumberField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();

    return (
      <NumberField
        {...args}
        value={value}
        onChange={(newValue) => updateArgs({ value: newValue })}
      />
    );
  },
  args: {
    value: null,
    onChange: (value) => console.log('onChange', value),
  },
};

export const Filled: Story = {
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();

    return (
      <NumberField
        {...args}
        value={value}
        onChange={(newValue) => updateArgs({ value: newValue })}
      />
    );
  },
  args: {
    value: 42,
    onChange: (value) => console.log('onChange', value),
  },
};

export const Disabled: Story = {
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();

    return (
      <NumberField
        {...args}
        value={value}
        onChange={(newValue) => updateArgs({ value: newValue })}
      />
    );
  },
  args: {
    disabled: true,
    value: 10,
    onChange: (value) => console.log('onChange', value),
  },
};

export const WithMinMax: Story = {
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();

    return (
      <NumberField
        {...args}
        value={value}
        onChange={(newValue) => updateArgs({ value: newValue })}
      />
    );
  },
  args: {
    value: 5,
    min: 0,
    max: 10,
    step: 1,
    onChange: (value) => console.log('onChange', value),
  },
};

export const WithStep: Story = {
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();

    return (
      <NumberField
        {...args}
        value={value}
        onChange={(newValue) => updateArgs({ value: newValue })}
      />
    );
  },
  args: {
    value: 0,
    step: 0.5,
    onChange: (value) => console.log('onChange', value),
  },
};

export const WithStartIcon: Story = {
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();

    return (
      <NumberField
        {...args}
        value={value}
        onChange={(newValue) => updateArgs({ value: newValue })}
      />
    );
  },
  args: {
    startIcon: IconBoltFilled,
    value: 25,
    onChange: (value) => console.log('onChange', value),
  },
};

export const WithError: Story = {
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();

    return (
      <NumberField
        {...args}
        value={value}
        onChange={(newValue) => updateArgs({ value: newValue })}
      />
    );
  },
  args: {
    value: 42,
    error: true,
    errorMessage: 'Please enter a number between 0 and 100',
    onChange: (value) => console.log('onChange', value),
  },
};

export const WithErrorEmpty: Story = {
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();

    return (
      <NumberField
        {...args}
        value={value}
        onChange={(newValue) => updateArgs({ value: newValue })}
      />
    );
  },
  args: {
    value: null,
    error: true,
    errorMessage: 'This field is required',
    placeholder: 'Enter number',
    onChange: (value) => console.log('onChange', value),
  },
};
