import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { DateRangePickerField } from './DateRangePickerField';
import { useArgs } from 'storybook/internal/preview-api';
import { decoratorsResizeCard } from '../../../../storybook.constants';

const meta = {
  title: 'Editors/DateRangePickerField',
  component: DateRangePickerField,
} satisfies Meta<typeof DateRangePickerField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: StoryObj<typeof DateRangePickerField> = {
  argTypes: {
    onChange: { action: 'onChange' },
  },
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();

    return (
      <DateRangePickerField
        {...args}
        value={value}
        onChange={(nextValue) => {
          console.log('value', nextValue);
          updateArgs({ value: nextValue });
          args.onChange?.(nextValue);
        }}
      />
    );
  },
};

export const Default: Story = {
  args: {
    onChange: () => {},
  },
};

export const WithError: Story = {
  args: {
    onChange: () => {},
    error: true,
  },
};

export const WithErrorMessage: Story = {
  args: {
    onChange: () => {},
    error: true,
    errorMessage: 'Value is invalid',
  },
};

export const Resize: Story = {
  decorators: decoratorsResizeCard,
  args: {
    onChange: () => {},
  },
};
