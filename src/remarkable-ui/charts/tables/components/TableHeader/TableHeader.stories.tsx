// TableHeader.stories.tsx
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TableHeader } from './TableHeader';
import type { TableHeaderItem, TableHeaderProps } from './TableHeader';
import { useArgs } from 'storybook/internal/preview-api';

type Client = { id: number; name: string; age: number; title: string };

// 1) Wrap the generic component with a concrete T
const ClientTableHeader: React.FC<TableHeaderProps<Client>> = (props) => (
  <TableHeader<Client> {...props} />
);

// 2) Storybook meta uses the concrete wrapper
const meta: Meta<typeof ClientTableHeader> = {
  // title: 'Components/TableHeader',
  component: ClientTableHeader,
};
export default meta;

type Story = StoryObj<typeof ClientTableHeader>;

// 3) Strongly-typed headers
const headers = [
  { id: 'id', title: 'Id' },
  { id: 'name', title: 'Name' },
  { id: 'age', title: 'Age' },
  { id: 'title', title: 'Title' },
] satisfies TableHeaderItem<Client>[];

export const Default: Story = {
  args: {
    headers,
    sort: { id: 'name', direction: 'desc' } as const,
  },
};

export const WithState: Story = {
  render: (args) => {
    const [_, updateArgs] = useArgs();

    return <ClientTableHeader {...args} onSort={(newValue) => updateArgs({ sort: newValue })} />;
  },
  args: {
    headers,
  },
};
