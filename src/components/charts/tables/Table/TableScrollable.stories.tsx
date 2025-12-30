import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { TableScrollable as TableScrollableChart } from './TableScrollable';
import { useArgs } from 'storybook/internal/preview-api';
import { TableHeaderItem } from './table.types';
import { decoratorsResizeCardLarge } from '../../../../storybook.constants';

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

export const TableScrollable: Story = {
  render: (args) => {
    console.log('args are', args.page);
    const [, updateArgs] = useArgs();

    const handleNext = () => {
      console.log('next page is', args.page, pages[args.page]);
      setTimeout(() => {
        const rows = (args.rows || []).concat(pages[args.page] || []);
        updateArgs({ rows, page: args.page + 1 });
      }, 0);
    };

    return (
      <TableScrollableChart
        {...args}
        onNextPage={handleNext}
        headers={args.headers}
        page={args.page}
        rows={args.rows ?? makeClients(1000).slice(0, 10)}
        onSortChange={() => null}
      />
    );
  },
  decorators: decoratorsResizeCardLarge,
};

// export const Resize: Story = {
//   render: (args) => {
//     const [, updateArgs] = useArgs();

//     const start = args.page * args.pageSize;
//     const end = start + args.pageSize;
//     const rows = makeClients(args.total).slice(start, end);

//     return (
//       <TableScrollableChart
//         showIndex={args.showIndex}
//         headers={args.headers}
//         page={args.page}
//         pageSize={args.pageSize}
//         total={args.total}
//         rows={rows}
//         onPageChange={(value) => updateArgs({ page: value })}
//         onSortChange={() => null}
//       />
//     );
//   },
//   decorators: decoratorsResizeCard,
// };
