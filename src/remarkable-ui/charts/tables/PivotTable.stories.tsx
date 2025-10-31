import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { PivotTable, PivotTableProps } from './PivotTable';

const meta = {
  component: PivotTable,
  argTypes: {
    columnTotalsFor: {
      options: ['orders', 'cost', 'packages'],
      control: { type: 'check' },
    },
    rowTotalsFor: {
      options: ['orders', 'cost', 'packages'],
      control: { type: 'check' },
    },
  },
} satisfies Meta<typeof PivotTable>;

export default meta;

type Story = StoryObj<typeof meta>;

type Data = {
  country: string;
  month: string;
  orders: number | null;
  cost: number | null;
  packages: number | null;
};

const data: Data[] = [
  // Jul 25
  { country: 'Australia', month: 'Jul 25', orders: 4, cost: 100, packages: 2 },
  { country: 'Belgium', month: 'Jul 25', orders: 4, cost: 80, packages: 1 },
  { country: 'Canada', month: 'Jul 25', orders: 3, cost: 60, packages: 1 },
  { country: 'Germany', month: 'Jul 25', orders: null, cost: 0, packages: 0 },
  { country: 'Iceland', month: 'Jul 25', orders: null, cost: 0, packages: 0 },
  { country: 'New Zealand', month: 'Jul 25', orders: 6, cost: 120, packages: 3 },
  { country: 'United Kingdom', month: 'Jul 25', orders: null, cost: 0, packages: 0 },
  { country: 'United States', month: 'Jul 25', orders: 17, cost: 340, packages: 8 },

  // Aug 25
  { country: 'Australia', month: 'Aug 25', orders: 2, cost: 50, packages: 1 },
  { country: 'Belgium', month: 'Aug 25', orders: 6, cost: 90, packages: 2 },
  { country: 'Canada', month: 'Aug 25', orders: null, cost: 0, packages: 0 },
  { country: 'Germany', month: 'Aug 25', orders: 10, cost: 200, packages: 5 },
  { country: 'Iceland', month: 'Aug 25', orders: null, cost: 0, packages: 0 },
  { country: 'New Zealand', month: 'Aug 25', orders: 4, cost: 80, packages: 2 },
  { country: 'United Kingdom', month: 'Aug 25', orders: 12, cost: 240, packages: 6 },
  { country: 'United States', month: 'Aug 25', orders: 112, cost: 2240, packages: 56 },

  // Sep 25
  { country: 'Australia', month: 'Sep 25', orders: null, cost: 0, packages: 0 },
  { country: 'Belgium', month: 'Sep 25', orders: 4, cost: 70, packages: 1 },
  { country: 'Canada', month: 'Sep 25', orders: null, cost: 0, packages: 0 },
  { country: 'Germany', month: 'Sep 25', orders: 11, cost: 220, packages: 5 },
  { country: 'Iceland', month: 'Sep 25', orders: 5, cost: 100, packages: 2 },
  { country: 'New Zealand', month: 'Sep 25', orders: 4, cost: 80, packages: 2 },
  { country: 'United Kingdom', month: 'Sep 25', orders: 8, cost: 160, packages: 4 },
  { country: 'United States', month: 'Sep 25', orders: 110, cost: 2200, packages: 55 },

  // Oct 25
  { country: 'Australia', month: 'Oct 25', orders: 6, cost: 120, packages: 3 },
  { country: 'Belgium', month: 'Oct 25', orders: 4, cost: 80, packages: 2 },
  { country: 'Canada', month: 'Oct 25', orders: null, cost: 0, packages: 0 },
  { country: 'Germany', month: 'Oct 25', orders: 23, cost: 460, packages: 12 },
  { country: 'Iceland', month: 'Oct 25', orders: null, cost: 0, packages: 0 },
  { country: 'New Zealand', month: 'Oct 25', orders: 9, cost: 180, packages: 4 },
  { country: 'United Kingdom', month: 'Oct 25', orders: 10, cost: 200, packages: 5 },
  { country: 'United States', month: 'Oct 25', orders: 127, cost: 2540, packages: 64 },
];

const measures: PivotTableProps<Data>['measures'] = [
  {
    key: 'orders',
    label: '# of orders',
  },
  {
    key: 'cost',
    label: 'Cost ($)',
  },
  {
    key: 'packages',
    label: '# of packages',
  },
];

const rowDimension: PivotTableProps<Data>['rowDimension'] = {
  key: 'country',
  label: 'Country',
};

const columnDimension: PivotTableProps<Data>['columnDimension'] = {
  key: 'month',
  label: 'Month',
};

export const Default: Story = {
  args: {
    data,
    measures,
    rowDimension,
    columnDimension,
    rowTotalsFor: [],
    columnTotalsFor: [],
  },
};

export const PivotTablePlay: Story = {
  render: (args) => {
    return (
      <div
        style={{
          resize: 'both',
          flex: 1,
          overflow: 'auto',
        }}
      >
        <PivotTable {...args} />
      </div>
    );
  },
  args: {
    data,
    measures,
    rowDimension,
    columnDimension,
    rowTotalsFor: [],
    columnTotalsFor: [],
  },
};
