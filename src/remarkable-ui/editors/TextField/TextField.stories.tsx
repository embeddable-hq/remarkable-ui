import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { TextField } from './TextField';
import { IconBoltFilled } from '@tabler/icons-react';
import { useArgs } from 'storybook/internal/preview-api';
import { storybookArgTypesIcon } from '../../storybook.constants';

const meta = {
  title: 'Editors/✅ TextField',
  component: TextField,
  args: {
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

export const Empty: Story = {
  args: {
    placeholder: 'Enter your value',
  },
};

export const Filled: Story = {
  args: { value: 'This is your value' },
};

export const Disabled: Story = {
  args: {
    value: 'Disabled',
    disabled: true,
  },
};

export const Clearable: Story = {
  args: {
    value: 'Clearable',
    clearable: true,
  },
};

export const StartIcon: Story = {
  args: {
    startIcon: IconBoltFilled,
    value: 'Start icon',
  },
};

export const EndIcon: Story = {
  args: {
    endIcon: IconBoltFilled,
    value: 'End icon',
  },
};

export const StartEndIcon: Story = {
  args: {
    startIcon: IconBoltFilled,
    endIcon: IconBoltFilled,
    value: 'Start and end icon',
  },
};

export const ChartCount: Story = {
  args: {
    maxLength: 20,
  },
};

export const Error: Story = {
  args: {
    errorMessage: 'Value is invalid',
  },
};
