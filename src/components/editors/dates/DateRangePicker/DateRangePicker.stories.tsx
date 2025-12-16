import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { DateRangePicker } from './DateRangePicker';
import { useArgs } from 'storybook/internal/preview-api';

const meta = {
  title: 'Editors/DateRangePicker',
  component: DateRangePicker,
} satisfies Meta<typeof DateRangePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
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
        value={dateRange}
        onChange={(nextRange) => {
          console.log('nextRange', nextRange);
          updateArgs({ dateRange: nextRange });
          args.onChange?.(nextRange);
        }}
      />
    );
  },
};
