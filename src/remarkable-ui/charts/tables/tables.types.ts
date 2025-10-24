import { CssSize } from '../../types/css.types';

export const TableSortDirection = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type TableSort<T> = {
  id: keyof T;
  direction: (typeof TableSortDirection)[keyof typeof TableSortDirection];
};
type TableHeaderItemAlign = 'left' | 'center' | 'right';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TableHeaderCell = (value: any) => React.ReactNode;
export type TableHeaderItem<T> = {
  id: keyof T;
  title: React.ReactNode;
  align?: TableHeaderItemAlign;
  field?: keyof T;
  minWidth?: CssSize;
  sort?: TableSort<T>;
  accessor?: (row: T) => React.ReactNode;
  cell?: TableHeaderCell;
};

export type TablePaginatedProps<T> = {
  showIndex?: boolean;
  className?: string;
  headers: TableHeaderItem<T>[];
  rows: T[];
  page: number;
  pageSize: number;
  total?: number;
  sort?: TableSort<T>;
  onPageChange: (page: number) => void;
  onSortChange?: (value: TableSort<T> | undefined) => void;
};
