import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { DateRangePicker } from './DateRangePicker';
import { DateRange } from 'react-day-picker';
import { useArgs } from 'storybook/internal/preview-api';

const meta = {
  title: 'Editors/DateRangePicker',
  component: DateRangePicker,
} satisfies Meta<typeof DateRangePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

const dateRange: DateRange = {
  from: new Date(2025, 11, 8),
  to: new Date(2025, 11, 19),
};

export const Default: Story = {
  args: {
    onChange: () => {},
  },
};

export const WithValue: Story = {
  args: {
    dateRange,
    onChange: () => {},
  },
};

export const Playground: StoryObj<typeof DateRangePicker> = {
  argTypes: {
    onChange: { action: 'onChange' },
  },
  render: (args) => {
    const [{ dateRange }, updateArgs] = useArgs();

    return (
      <DateRangePicker
        {...args}
        dateRange={dateRange}
        onChange={(nextRange) => {
          console.log('nextRange', nextRange);
          updateArgs({ dateRange: nextRange });
          args.onChange?.(nextRange);
        }}
      />
    );
  },
};
