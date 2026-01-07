import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { TableScrollable as TableScrollableChart } from './TableScrollable';
import { useArgs } from 'storybook/internal/preview-api';
import { TableSort } from '../table.types';
import { decoratorsResizeCard } from '../../../../../storybook.constants';
import { MockEmployee, mockMakeEmployees, mockTableHeaders } from '../tables.test';

const meta: Meta = {
  title: 'Charts/TableScrollable',
  component: TableScrollableChart,
  args: {
    showIndex: true,
    pageSize: 3,
    page: 0,
    headers: mockTableHeaders,
    total: 100,
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

const pageSize = 10;

const pages = Array.from({ length: Math.ceil(allClients.length / pageSize) }, (_, i) =>
  allClients.slice(i * pageSize, (i + 1) * pageSize),
);

const renderScrollable: Story['render'] = (args) => {
  const [, updateArgs] = useArgs();

  const handleNext = async () => {
    if (args.isLoading) return;

    updateArgs({ isLoading: true });

    const delay = 300 + Math.floor(Math.random() * 900);
    await new Promise((r) => setTimeout(r, delay));

    const nextPage = args.page ?? 0;
    const nextRows = pages[nextPage] ?? [];

    const currentRows = args.rows ?? mockMakeEmployees(1000).slice(0, 10);
    const rows = currentRows.concat(nextRows);

    const hasMoreData = nextPage + 1 < pages.length;

    updateArgs({
      rows,
      page: nextPage + 1,
      isLoading: false,
      hasMoreData,
    });
  };

  const handleSortChange = (newSort: TableSort<MockEmployee> | undefined) => {
    updateArgs({ sort: newSort });
    args.onSortChange?.(newSort);
  };

  return (
    <TableScrollableChart
      {...args}
      onNextPage={handleNext}
      headers={args.headers}
      rows={args.rows ?? mockMakeEmployees(1000).slice(0, 10)}
      onSortChange={handleSortChange}
      hasMoreData={args.hasMoreData ?? true}
      isLoading={args.isLoading ?? false}
    />
  );
};

export const Basic: Story = {
  render: renderScrollable,
};

export const Resize: Story = {
  render: renderScrollable,
  decorators: decoratorsResizeCard,
};
