import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { TablePaginated as TablePaginatedChart } from './TablePaginated';
import { useArgs } from 'storybook/internal/preview-api';
import { TableHeaderItem } from './table.types';

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
        email: `person${i + 1}@example.com`,
        location: `City ${((i + 4) % 10) + 1}`,
      }) as Client,
  );

const headers: TableHeaderItem<Client>[] = [
  {
    id: 'id',
    title: 'ID',
    align: 'right',
  },
  {
    id: 'name',
    title: 'Name',
  },
  { id: 'title', title: 'Title', align: 'right' },
  { id: 'team', title: 'Team', align: 'left' },
  { id: 'age', title: 'Age', align: 'right' },
  {
    id: 'salary',
    title: 'Salary',
    align: 'right',
  },
  {
    id: 'email',
    title: 'Email',
    align: 'left',
  },
  {
    id: 'location',
    title: 'Location',
    align: 'left',
  },
];

const meta: Meta = {
  title: 'Charts/Table',
  component: TablePaginatedChart,
  args: {
    showIndex: true,
    pageSize: 3,
    page: 0,
    headers,
    total: 100,
  },
  argTypes: {
    rowHeight: { control: { type: 'number' } },
    headerHeight: { control: { type: 'number' } },
    footerHeight: { control: { type: 'number' } },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

type Client = {
  id: number;
  name: string;
  age: number;
  title: string;
  team: string;
  salary: number;
  email: string;
  location: string;
};

export const TablePaginated: Story = {
  render: (args) => {
    const [, updateArgs] = useArgs();

    const start = args.page * args.pageSize;
    const end = start + args.pageSize;
    const rows = makeClients(args.total).slice(start, end);

    return (
      <TablePaginatedChart
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
};

export const Resize: Story = {
  render: (args) => {
    const [, updateArgs] = useArgs();

    const start = args.page * args.pageSize;
    const end = start + args.pageSize;
    const rows = makeClients(args.total).slice(start, end);

    return (
      <div style={{ width: '400px', height: '200px', resize: 'both', overflow: 'auto' }}>
        <TablePaginatedChart
          showIndex={args.showIndex}
          headers={args.headers}
          page={args.page}
          pageSize={args.pageSize}
          total={args.total}
          rows={rows}
          onPageChange={(value) => updateArgs({ page: value })}
          onSortChange={() => null}
        />
      </div>
    );
  },
};
