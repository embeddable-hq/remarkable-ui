import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { HeatMap } from './HeatMap';

const meta = {
  component: HeatMap,
} satisfies Meta<typeof HeatMap>;

export default meta;

type Story = StoryObj<typeof meta>;

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

export const HeatMap1Color: Story = {
  render: (args) => {
    return (
      <div
        style={{
          resize: 'both',
          flex: 1,
          overflow: 'auto',
        }}
      >
        <HeatMap {...args} />
      </div>
    );
  },
  args: {
    data,
    columnDimension: { key: 'country', label: 'Country' },
    rowDimension: { key: 'month', label: 'Month' },
    measure: { key: 'orders', label: 'Orders' },
    showValues: true,
  },
};

export const HeatMap3Colors: Story = {
  render: (args) => {
    return (
      <div
        style={{
          resize: 'both',
          flex: 1,
          overflow: 'auto',
        }}
      >
        <HeatMap {...args} />
      </div>
    );
  },
  args: {
    data,
    columnDimension: { key: 'country', label: 'Country' },
    rowDimension: { key: 'month', label: 'Month' },
    measure: { key: 'orders', label: 'Orders' },
    maxColor: 'green',
    midColor: 'yellow',
    minColor: 'red',
    showValues: true,
    minValueUntil: undefined,
    maxValueFrom: undefined,
  },
};
