import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useArgs } from 'storybook/internal/preview-api';

import { ChartTabs } from './ChartTabs';
import { decoratorsResize } from '../../../../storybook.constants';

const meta = {
  title: 'Charts/Shared/ChartTabs',
  component: ChartTabs,
} satisfies Meta<typeof ChartTabs>;

export default meta;

type Story = StoryObj<typeof meta>;

const mockItems = [
  { id: 'tab1', label: 'Revenue', value: '$1.2M', onClick: () => {} },
  { id: 'tab2', label: 'Costs', value: '$800K', onClick: () => {} },
  { id: 'tab3', label: 'Profit', value: '$400K', onClick: () => {} },
];

export const Default: Story = {
  args: {
    value: 'tab1',
    onChange: (id: string) => console.log('Tab changed:', id),
    items: [
      { id: 'tab1', label: 'Revenue', onClick: () => {} },
      { id: 'tab2', label: 'Costs', onClick: () => {} },
      { id: 'tab3', label: 'Profit', onClick: () => {} },
    ],
  },
};

export const WithValues: Story = {
  args: {
    value: 'tab1',
    onChange: (id: string) => console.log('Tab changed:', id),
    items: mockItems,
  },
};

export const WithSlot: Story = {
  args: {
    value: 'tab1',
    onChange: (id: string) => console.log('Tab changed:', id),
    items: mockItems.map((item) => ({
      ...item,
      slot: <span style={{ marginLeft: '8px', color: '#888' }}>Additional Info</span>,
    })),
  },
};

export const SingleTab: Story = {
  args: {
    value: 'tab1',
    onChange: (id: string) => console.log('Tab changed:', id),
    items: [{ id: 'tab1', label: 'Overview', value: '42', onClick: () => {} }],
  },
};

export const MultiTab: Story = {
  args: {
    value: 'tab1',
    onChange: (id: string) => console.log('Tab changed:', id),
    items: mockItems,
  },
};

export const Scrollable: Story = {
  args: {
    value: 'tab1',
    onChange: (id: string) => console.log('Tab changed:', id),
    items: [
      ...mockItems,
      { id: 'tab4', label: 'New Customers', value: '150', onClick: () => {} },
      { id: 'tab5', label: 'Churn Rate', value: '5%', onClick: () => {} },
      { id: 'tab6', label: 'LTV', value: '$2.5K', onClick: () => {} },
      { id: 'tab7', label: 'CAC', value: '$500', onClick: () => {} },
    ],
  },
  decorators: decoratorsResize,
};

export const Playground: Story = {
  args: {
    value: 'tab1',
    onChange: () => {},
    items: mockItems,
  },
  render: (args) => {
    const [{ value }, updateArgs] = useArgs<typeof args>();

    const handleChange = (id: string) => {
      updateArgs({
        value: id,
        items: args.items.map((item) => ({ ...item, isActive: item.id === id })),
      });
    };

    return (
      <ChartTabs
        {...args}
        value={value}
        onChange={handleChange}
        items={args.items.map((item) => ({ ...item, isActive: item.id === value }))}
      />
    );
  },
};
