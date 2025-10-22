import { CssSize } from '../../types/css.types';

export const TableSortDirection = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

type TableSortDirection = (typeof TableSortDirection)[keyof typeof TableSortDirection];
export type TableSort<T> = { id: keyof T; direction: TableSortDirection };
type TableHeaderItemAlign = 'left' | 'center' | 'right';

export type TableHeaderCell = (value: any) => React.ReactNode;
export type TableHeaderItem<T> = {
  id: keyof T;
  title: React.ReactNode;
  align?: TableHeaderItemAlign;
  field?: keyof T;
  width?: CssSize;
  sort?: TableSort<T>;
  accessor?: (row: T) => React.ReactNode;
  cell?: TableHeaderCell;
};

export type TablePaginatedProps<T> = {
  className?: string;
  headers: TableHeaderItem<T>[];
  rows: T[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSortChange?: (value: { id: keyof T; direction: 'asc' | 'desc' }) => void;
};
