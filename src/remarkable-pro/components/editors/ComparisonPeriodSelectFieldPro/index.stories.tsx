import type { Meta, StoryObj } from '@storybook/react-webpack5';

import Index from './index';

const meta = {
  component: Index,
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    primaryDateRange: undefined,
    comparisonPeriod: 'Previous period',
    onChange: (value) => console.log('onChange', value),
  },
};

export const Small = () => {
  return (
    <div style={{ width: 170 }}>
      <Index
        primaryDateRange={undefined}
        comparisonPeriod="Previous period"
        onChange={(value) => console.log('onChange', value)}
      />
    </div>
  );
};

export const DefaultValue = () => {
  return (
    <div style={{ width: 500 }}>
      <Index
        primaryDateRange={undefined}
        comparisonPeriod="Previous period"
        onChange={(value) => console.log('onChange', value)}
      />
    </div>
  );
};

export const NoDefaultValue = () => {
  return (
    <div style={{ width: 500 }}>
      <Index
        primaryDateRange={undefined}
        comparisonPeriod={undefined}
        onChange={(value) => console.log('onChange', value)}
      />
    </div>
  );
};
