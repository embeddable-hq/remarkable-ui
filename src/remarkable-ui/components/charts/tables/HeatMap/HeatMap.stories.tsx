import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { HeatMap } from './HeatMap';

type Data = {
  country: string;
  month: string;
  orders: number | null;
};

const data: Data[] = [
  // Jul 25
  { country: 'Australia', month: 'Jul 25', orders: 4 },
  { country: 'Belgium', month: 'Jul 25', orders: 35 },
  { country: 'Canada', month: 'Jul 25', orders: 3 },
  { country: 'Germany', month: 'Jul 25', orders: null },
  { country: 'Iceland', month: 'Jul 25', orders: null },
  { country: 'New Zealand', month: 'Jul 25', orders: 80 },
  { country: 'United Kingdom', month: 'Jul 25', orders: 40 },
  { country: 'United States', month: 'Jul 25', orders: 30 },

  // Aug 25
  { country: 'Australia', month: 'Aug 25', orders: null },
  { country: 'Belgium', month: 'Aug 25', orders: -20 },
  { country: 'Canada', month: 'Aug 25', orders: 100 },
  { country: 'Germany', month: 'Aug 25', orders: 50 },
  { country: 'Iceland', month: 'Aug 25', orders: null },
  { country: 'New Zealand', month: 'Aug 25', orders: 4 },
  { country: 'United Kingdom', month: 'Aug 25', orders: 12 },
  { country: 'United States', month: 'Aug 25', orders: 112 },
];

const meta = {
  title: 'Charts/✅ HeatMap',
  component: HeatMap,
  args: {
    data,
    columnDimension: { key: 'country', label: 'Country' },
    rowDimension: { key: 'month', label: 'Month' },
    measure: { key: 'orders', label: 'Orders' },
    maxColor: 'white',
    midColor: 'yellow',
    minColor: 'orange',
    showValues: true,
    minThreshold: undefined,
    maxThreshold: undefined,
  },
} satisfies Meta<typeof HeatMap>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Resize: Story = {
  render: (args) => {
    return (
      <div style={{ width: '400px', height: '200px', resize: 'both', overflow: 'auto' }}>
        <HeatMap {...args} />
      </div>
    );
  },
};
