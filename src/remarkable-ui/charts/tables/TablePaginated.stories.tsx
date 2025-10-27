import type { Meta, StoryObj } from '@storybook/react';
import { TablePaginated } from './TablePaginated';
import { useArgs } from 'storybook/internal/preview-api';
import { TableHeaderItem } from './tables.types';

const teams = ['Design', 'Engineering', 'Ops', 'Marketing'] as const;
const titles = ['IC', 'Lead', 'Manager', 'Director'] as const;
const makeClients = (count = 3): Client[] =>
  Array.from(
    { length: count },
    (_, i) =>
      ({
        id: i + 1,
        name: `Person ${i + 1}`,
        title: titles[(i + 1) % titles.length],
        team: teams[(i + 2) % teams.length],
        age: 22 + ((i + 3) % 28),
        salary: 52000 + ((i + 5) % 20) * 2500,
      }) as Client,
  );

const meta: Meta = {
  component: TablePaginated,
  argTypes: {
    rowHeight: { control: { type: 'number' } },
    headerHeight: { control: { type: 'number' } },
    footerHeight: { control: { type: 'number' } },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

type Client = { id: number; name: string; age: number; title: string };

const headers: TableHeaderItem<Client>[] = [
  { id: 'name', title: 'Name', minWidth: 500 },
  { id: 'age', title: 'Age', minWidth: 500 },
  { id: 'title', title: 'Title', minWidth: 500 },
];

export const Basic: Story = {
  render: (args) => {
    const [_, updateArgs] = useArgs();

    const start = args.page * args.pageSize;
    const end = start + args.pageSize;
    const rows = makeClients(args.total).slice(start, end);

    return (
      <TablePaginated
        showIndex={args.showIndex}
        headers={args.headers}
        page={args.page}
        pageSize={args.pageSize}
        total={args.total}
        rows={rows}
        onPageChange={(value) => updateArgs({ page: value })}
        onSortChange={() => null}
      />
    );
  },
  args: {
    showIndex: true,
    pageSize: 3,
    page: 0,
    headers,
    total: 100,
  },
};
