import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { NumberField } from './NumberField';
import { IconBoltFilled } from '@tabler/icons-react';
import { useArgs } from 'storybook/internal/preview-api';
import { storybookArgTypesIcon } from '../../../../storybook.constants';

const meta = {
  title: 'Editors/NumberField',
  component: NumberField,
  args: {
    label: 'Label',
    required: true,
    value: null,
    disabled: false,
    clearable: false,
    onChange: (value: number | null) => value,
  },
  argTypes: {
    startIcon: storybookArgTypesIcon,
    endIcon: storybookArgTypesIcon,
    onChange: { action: 'onChange' },
  },
} satisfies Meta<typeof NumberField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [, updateArgs] = useArgs();

    return (
      <NumberField
        {...args}
        onChange={(val) => {
          updateArgs({ value: val });
          args.onChange?.(val);
        }}
      />
    );
  },
};

export const Basic: Story = {
  args: {
    label: undefined,
    required: false,
  },
};

export const WithIcons: Story = {
  args: {
    label: undefined,
    required: false,
    startIcon: IconBoltFilled,
    endIcon: IconBoltFilled,
  },
};

export const Disabled: Story = {
  args: {
    label: undefined,
    required: false,
    value: 42,
    disabled: true,
  },
};

export const Clearable: Story = {
  args: {
    label: undefined,
    required: false,
    value: 42,
    clearable: true,
  },
};

export const WithError: Story = {
  args: {
    label: undefined,
    required: false,
    error: true,
  },
};

export const WithErrorMessage: Story = {
  args: {
    label: undefined,
    required: false,
    errorMessage: 'Value is invalid',
  },
};
