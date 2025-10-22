import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { TablePagination } from './TablePagination';

const meta = {
  component: TablePagination,
} satisfies Meta<typeof TablePagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {
  args: {
    currentPage: 0,
    totalPages: 10,
    onPageChange: (page: number) => console.log('Go to page:', page),
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: (page: number) => console.log('Go to page:', page),
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 9,
    totalPages: 10,
    onPageChange: (page: number) => console.log('Go to page:', page),
  },
};
