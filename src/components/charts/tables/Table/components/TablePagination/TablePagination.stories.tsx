import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { TablePagination } from './TablePagination';

const meta = {
  title: 'Charts/Table/TablePagination',
  component: TablePagination,
} satisfies Meta<typeof TablePagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {
  args: {
    pageSize: 1,
    page: 0,
    total: 10,
    onPageChange: (page: number) => console.log('Go to page:', page),
  },
};

export const MiddlePage: Story = {
  args: {
    pageSize: 1,
    page: 5,
    total: 10,
    onPageChange: (page: number) => console.log('Go to page:', page),
  },
};

export const LastPage: Story = {
  args: {
    pageSize: 1,
    page: 9,
    total: 10,
    onPageChange: (page: number) => console.log('Go to page:', page),
  },
};
