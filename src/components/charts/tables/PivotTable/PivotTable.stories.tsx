import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { PivotTable } from './PivotTable';
import { PivotTableProps } from './PivotTable.types';
import { decoratorsResizeCard } from '../../../../storybook.constants';
import { useState } from 'react';

type Data = {
  country: string;
  city?: string;
  month: string;
  orders: number | null;
  cost: number | null;
};

const data: Data[] = [
  // Jul 25
  { country: 'Australia', month: 'Jul 25', orders: 4, cost: 100 },
  { country: 'Belgium', month: 'Jul 25', orders: 4, cost: 80 },
  { country: 'Canada', month: 'Jul 25', orders: 3, cost: 60 },
  { country: 'Germany', month: 'Jul 25', orders: null, cost: 0 },
  { country: 'Iceland', month: 'Jul 25', orders: null, cost: 0 },
  { country: 'New Zealand', month: 'Jul 25', orders: 6, cost: 120 },
  { country: 'United Kingdom', month: 'Jul 25', orders: null, cost: 0 },
  { country: 'United States', month: 'Jul 25', orders: 17, cost: 340 },

  // Aug 25
  { country: 'Australia', month: 'Aug 25', orders: 2, cost: 50 },
  { country: 'Belgium', month: 'Aug 25', orders: 6, cost: 90 },
  { country: 'Canada', month: 'Aug 25', orders: null, cost: 0 },
  { country: 'Germany', month: 'Aug 25', orders: 10, cost: 200 },
  { country: 'Iceland', month: 'Aug 25', orders: null, cost: 0 },
  { country: 'New Zealand', month: 'Aug 25', orders: 4, cost: 80 },
  { country: 'United Kingdom', month: 'Aug 25', orders: 12, cost: 240 },
  { country: 'United States', month: 'Aug 25', orders: 112, cost: 2240 },

  // Sep 25
  { country: 'Australia', month: 'Sep 25', orders: null, cost: 0 },
  { country: 'Belgium', month: 'Sep 25', orders: 4, cost: 70 },
  { country: 'Canada', month: 'Sep 25', orders: null, cost: 0 },
  { country: 'Germany', month: 'Sep 25', orders: 11, cost: 220 },
  { country: 'Iceland', month: 'Sep 25', orders: 5, cost: 100 },
  { country: 'New Zealand', month: 'Sep 25', orders: 4, cost: 80 },
  { country: 'United Kingdom', month: 'Sep 25', orders: 8, cost: 160 },
  { country: 'United States', month: 'Sep 25', orders: 110, cost: 2200 },

  // Oct 25
  { country: 'Australia', month: 'Oct 25', orders: 6, cost: 120 },
  { country: 'Belgium', month: 'Oct 25', orders: 4, cost: 80 },
  { country: 'Canada', month: 'Oct 25', orders: null, cost: 0 },
  { country: 'Germany', month: 'Oct 25', orders: 23, cost: 460 },
  { country: 'Iceland', month: 'Oct 25', orders: null, cost: 0 },
  { country: 'New Zealand', month: 'Oct 25', orders: 9, cost: 180 },
  { country: 'United Kingdom', month: 'Oct 25', orders: 10, cost: 200 },
  { country: 'United States', month: 'Oct 25', orders: 127, cost: 2540 },
];

const measures: PivotTableProps<Data>['measures'] = [
  {
    key: 'orders',
    label: '# of orders',
    showAsPercentage: true,
    percentageDecimalPlaces: 2,
  },
  {
    key: 'cost',
    label: 'Cost ($)',
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

const meta = {
  title: 'Charts/PivotTable',
  component: PivotTable,
  args: {
    data,
    measures,
    rowDimension,
    columnDimension,
    rowTotalsFor: [],
    columnTotalsFor: [],
    totalLabel: 'Total',
    firstColumnWidth: 150,
    columnWidth: 100,
  },
  argTypes: {
    columnTotalsFor: {
      options: ['orders', 'cost'],
      control: { type: 'check' },
    },
    rowTotalsFor: {
      options: ['orders', 'cost'],
      control: { type: 'check' },
    },
  },
} satisfies Meta<typeof PivotTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithTotals: Story = {
  args: {
    rowTotalsFor: ['orders', 'cost'],
    columnTotalsFor: ['orders', 'cost'],
  },
};

export const Resize: Story = {
  decorators: decoratorsResizeCard,
};

const ExpandableRowsStory = (args: PivotTableProps<Data>) => {
  const [subRowsByRow, setSubRowsByRow] = useState(new Map<string, Data[]>());
  const [loadingRows, setLoadingRows] = useState(new Set<string>());

  // Split a parent value across cities so sub-rows sum to parent
  const splitValue = (
    parentValue: number | null,
    cityIndex: number,
    totalCities: number,
  ): number | null => {
    if (parentValue == null) return null;
    const base = Math.floor(parentValue / totalCities);
    const remainder = parentValue - base * totalCities;
    return cityIndex === 0 ? base + remainder : base;
  };

  const handleRowExpand = async (rowKey: string) => {
    setLoadingRows((prev) => new Set(prev).add(rowKey));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get parent data for this row
    const parentRows = data.filter((d) => d.country === rowKey);
    const cities = ['City A', 'City B'];

    // Sub-row values sum to parent values so percentages add up correctly
    const mockSubRows: Data[] = cities.flatMap((city, cityIdx) =>
      parentRows.map((pd) => ({
        country: rowKey,
        city: city,
        month: pd.month,
        orders: splitValue(pd.orders, cityIdx, cities.length),
        cost: splitValue(pd.cost, cityIdx, cities.length),
      })),
    );

    setSubRowsByRow((prev) => new Map(prev).set(rowKey, mockSubRows));
    setLoadingRows((prev) => {
      const next = new Set(prev);
      next.delete(rowKey);
      return next;
    });
  };

  const subRowDimension: PivotTableProps<Data>['subRowDimension'] = {
    key: 'city',
    label: 'City',
  };

  return (
    <PivotTable
      {...args}
      expandableRows={true}
      subRowsByRow={subRowsByRow}
      loadingRows={loadingRows}
      onRowExpand={handleRowExpand}
      subRowDimension={subRowDimension}
    />
  );
};

export const WithExpandableRows: Story = {
  render: (args) => <ExpandableRowsStory {...(args as PivotTableProps<Data>)} />,
  args: {
    data: data,
    measures: measures,
    rowDimension: rowDimension,
    columnDimension: columnDimension,
    firstColumnWidth: 150,
    columnWidth: 100,
  },
};
