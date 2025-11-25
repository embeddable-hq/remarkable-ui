import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { TextField } from './TextField';
import { IconBoltFilled } from '@tabler/icons-react';
import { useArgs } from 'storybook/internal/preview-api';
import { storybookArgTypesIcon } from '../../../../storybook.constants';

const meta = {
  title: 'Editors/✅ TextField',
  component: TextField,
  args: {
    label: 'Label',
    required: true,
    value: '',
    disabled: false,
    clearable: false,
    onChange: (value: string) => value,
  },
  argTypes: {
    startIcon: storybookArgTypesIcon,
    endIcon: storybookArgTypesIcon,
    onChange: { action: 'onChange' },
  },
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [, updateArgs] = useArgs();

    return (
      <TextField
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
    value: 'Disabled',
    disabled: true,
  },
};

export const Clearable: Story = {
  args: {
    label: undefined,
    required: false,
    value: 'This is your value',
    clearable: true,
  },
};

export const WithCharCounter: Story = {
  args: {
    label: undefined,
    required: false,
    maxLength: 20,
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
