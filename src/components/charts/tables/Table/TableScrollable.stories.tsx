import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { TableScrollable as TableScrollableChart } from './TableScrollable';
import { useArgs } from 'storybook/internal/preview-api';
import { TableHeaderItem } from './table.types';
import { decoratorsResizeCard } from '../../../../storybook.constants';

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
        object: `{"query": {"limit": 100, "total": false, "filters": [{"member": "events.event_id", "operator": "set"}], "measures": ["event_views.event_views"], "timezone": "UTC", "dimensions": [], "renewQuery": false, "timeDimensions": []}`,
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
  {
    id: 'object',
    title: 'Object',
    align: 'left',
  },
];

const meta: Meta = {
  title: 'Charts/TableScrollable',
  component: TableScrollableChart,
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
  object: string;
};

const allClients = makeClients(1000);

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

    const currentRows = args.rows ?? makeClients(1000).slice(0, 10);
    const rows = currentRows.concat(nextRows);

    const hasMoreData = nextPage + 1 < pages.length;

    updateArgs({
      rows,
      page: nextPage + 1,
      isLoading: false,
      hasMoreData,
    });
  };

  return (
    <TableScrollableChart
      {...args}
      onNextPage={handleNext}
      headers={args.headers}
      rows={args.rows ?? makeClients(1000).slice(0, 10)}
      onSortChange={() => null}
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
