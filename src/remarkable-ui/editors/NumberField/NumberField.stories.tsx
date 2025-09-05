import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { NumberField } from './NumberField';
import { IconBoltFilled } from '@tabler/icons-react';

const meta = {
  component: NumberField,
} satisfies Meta<typeof NumberField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    onChange: (value) => console.log('onChange', value),
  },
};

export const Filled: Story = {
  args: {
    value: 42,
    onChange: (value) => console.log('onChange', value),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 10,
    onChange: (value) => console.log('onChange', value),
  },
};

export const WithMinMax: Story = {
  args: {
    value: 5,
    min: 0,
    max: 10,
    step: 1,
    onChange: (value) => console.log('onChange', value),
  },
};

export const WithStep: Story = {
  args: {
    value: 0,
    step: 0.5,
    onChange: (value) => console.log('onChange', value),
  },
};

export const WithStartIcon: Story = {
  args: {
    startIcon: IconBoltFilled,
    value: 25,
    onChange: (value) => console.log('onChange', value),
  },
};
