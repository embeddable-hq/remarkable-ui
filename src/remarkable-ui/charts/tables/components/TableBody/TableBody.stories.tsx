// TableHeader.stories.tsx
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TableBody, TableBodyProps } from './TableBody';
import { TableHeaderItem } from '../TableHeader/TableHeader';

type Client = { id: number; name: string; age: number; title: string };

// 1) Wrap the generic component with a concrete T
const ClientTableHeader: React.FC<TableBodyProps<Client>> = (props) => (
  <TableBody<Client> {...props} />
);

// 2) Storybook meta uses the concrete wrapper
const meta: Meta<typeof ClientTableHeader> = {
  // title: 'Components/TableHeader',
  component: ClientTableHeader,
};
export default meta;

type Story = StoryObj<typeof ClientTableHeader>;

// 3) Strongly-typed headers
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

const headers = [
  { id: 'id', title: 'Id' },
  { id: 'name', title: 'Name' },
  { id: 'age', title: 'Age' },
  { id: 'title', title: 'Title' },
] satisfies TableHeaderItem<Client>[];

export const Default: Story = {
  args: {
    rows,
    headers,
  },
};
