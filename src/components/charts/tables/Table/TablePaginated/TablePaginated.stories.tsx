import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { TablePaginated as TablePaginatedChart } from './TablePaginated';
import { useArgs } from 'storybook/internal/preview-api';
import { TableSort } from '../table.types';
import { decoratorsResizeCard } from '../../../../../storybook.constants';
import { MockEmployee, mockMakeEmployees, mockTableHeaders } from '../tables.test';

const meta: Meta = {
  title: 'Charts/Table',
  component: TablePaginatedChart,
  args: {
    showIndex: true,
    pageSize: 3,
    page: 0,
    headers: mockTableHeaders,
    total: 100,
    sort: undefined,
    rows: undefined,
  },
  argTypes: {
    onSortChange: { action: 'onSortChange' },
    rowHeight: { control: { type: 'number' } },
    headerHeight: { control: { type: 'number' } },
    footerHeight: { control: { type: 'number' } },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const allClients = mockMakeEmployees(1000);

const sortClients = (data: MockEmployee[], sort?: TableSort<MockEmployee>) => {
  if (!sort) return data;

  const sortId = sort.id;
  const direction = sort.direction;

  if (!sortId || !direction) return data;

  const dir = direction === 'asc' ? 1 : -1;

  return [...data].sort((a, b) => {
    const av = a[sortId];
    const bv = b[sortId];

    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;

    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;

    return String(av).localeCompare(String(bv)) * dir;
  });
};

const renderPaginated: Story['render'] = (args) => {
  const [, updateArgs] = useArgs();

  const sortedClients = sortClients(allClients, args.sort);

  const start = (args.page ?? 0) * (args.pageSize ?? 0);
  const end = start + (args.pageSize ?? 0);
  const rows = sortedClients.slice(start, end);

  const handleSortChange = (newSort: TableSort<MockEmployee> | undefined) => {
    updateArgs({ sort: newSort, page: 0 });
    args.onSortChange?.(newSort);
  };

  return (
    <TablePaginatedChart
      showIndex={args.showIndex}
      headers={args.headers}
      page={args.page}
      pageSize={args.pageSize}
      total={args.total}
      rows={rows}
      onPageChange={(value) => updateArgs({ page: value })}
      onSortChange={handleSortChange}
      sort={args.sort}
    />
  );
};

export const TablePaginated: Story = {
  render: renderPaginated,
};

export const Resize: Story = {
  render: renderPaginated,
  decorators: decoratorsResizeCard,
};
