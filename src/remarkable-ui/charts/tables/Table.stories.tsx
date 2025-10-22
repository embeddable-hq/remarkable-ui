import type { Meta, StoryObj } from '@storybook/react';
import { TablePaginated } from './TablePaginated';
import { TableHeaderItem } from './components/TableHeader/TableHeader';
import { useArgs } from 'storybook/internal/preview-api';

// Demo type & data
type Person = {
  id: number;
  name: string;
  title: string;
  team: string;
  age: number;
  salary: number;
};
const teams = ['Design', 'Engineering', 'Ops', 'Marketing'] as const;
const titles = ['IC', 'Lead', 'Manager', 'Director'] as const;
const makePeople = (count = 41): Person[] =>
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
      }) as Person,
  );
const people = makePeople(41);

const columns: TableHeaderItem<Person>[] = [
  {
    id: 'name',
    title: 'Name',
    field: 'name',
    width: 200,
  },
  { id: 'title', title: 'Title', field: 'title', width: 140, align: 'center' },
  { id: 'team', title: 'Team', field: 'team', width: 160 },
  {
    id: 'age',
    title: 'Age',
    field: 'age',
    width: 100,
    align: 'right',
  },
  {
    id: 'salary',
    title: 'Salary',
    field: 'salary',
    width: 140,
    align: 'right',
  },
];

const meta: Meta = {
  component: TablePaginated,
  argTypes: {
    rowHeight: { control: { type: 'number' } },
    headerHeight: { control: { type: 'number' } },
    footerHeight: { control: { type: 'number' } },
  },
  parameters: {
    layout: 'padded',
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

type Client = { id: number; name: string; age: number; title: string };

const rows: Client[] = [
  { id: 1, name: 'Alice', age: 30, title: 'Engineer' },
  { id: 2, name: 'Bob', age: 25, title: 'Designer' },
  { id: 3, name: 'Charlie', age: 35, title: 'Manager' },
  { id: 4, name: 'Diana', age: 28, title: 'Analyst' },
  { id: 5, name: 'Evan', age: 40, title: 'Director' },
  { id: 6, name: 'Fiona', age: 32, title: 'Consultant' },
  { id: 7, name: 'George', age: 29, title: 'Developer' },
  { id: 8, name: 'Helen', age: 27, title: 'Product Owner' },
];

const headers: TableHeaderItem<Client>[] = [
  { id: 'id', title: 'Id' },
  { id: 'name', title: 'Name' },
  { id: 'age', title: 'Age' },
  { id: 'title', title: 'Title asndlasdlkas daslkdlaksmdlkas ' },
];

export const Basic: Story = {
  render: (args) => {
    const [_, updateArgs] = useArgs();

    return (
      <TablePaginated<Person>
        {...args}
        currentPage={args.currentPage}
        headers={headers}
        rows={people}
        onPageChange={(value) => updateArgs({ currentPage: value })}
        totalPages={10}
        onSortChange={() => null}
      />
    );
  },
  args: {
    currentPage: 0,
    headers,
    rows,
  } as any,
};
