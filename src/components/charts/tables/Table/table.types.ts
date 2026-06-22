import { CSSProperties } from 'react';
import { CssSize } from '../../../../types/css.types';

export const TableSortDirection = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type TableSort<T> = {
  id: keyof T;
  direction: (typeof TableSortDirection)[keyof typeof TableSortDirection];
};
export const TableHeaderAlign = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
} as const;

export type TableHeaderItemAlign = (typeof TableHeaderAlign)[keyof typeof TableHeaderAlign];

export type TableHeaderCell = (props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  className?: string;
}) => React.ReactElement<HTMLTableCellElement>;

export type TableHeaderCellStyle = (props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  className?: string;
}) => CSSProperties | undefined;

export type TableHeaderItem<T> = {
  id: keyof T;
  title: React.ReactNode;
  align?: TableHeaderItemAlign;
  field?: keyof T;
  minWidth?: CssSize;
  sort?: TableSort<T>;
  accessor?: (row: T) => React.ReactNode;
  cell?: TableHeaderCell;
  cellStyle?: TableHeaderCellStyle;
};

export type TableCellClickArg<T> = {
  /** Index of the clicked row within the current `rows`. */
  rowIndex: number;
  /** `id` of the clicked column's header. */
  columnId: keyof T;
  /** Raw underlying cell value (`row[columnId]`), before any `accessor`/`cell` formatting. */
  value: unknown;
  /** The full row the clicked cell belongs to. */
  row: T;
};
