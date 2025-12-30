import * as React from 'react';
import styles from '../../tables.module.css';
import clsx from 'clsx';
import { TableHeaderItem, TableSort } from '../table.types';
import { TableHeader } from '../components/TableHeader/TableHeader';
import { TableBody } from '../components/TableBody/TableBody';
import { TablePagination } from '../components/TablePagination/TablePagination';

export type TablePaginatedProps<T> = {
  showIndex?: boolean;
  className?: string;
  headers: TableHeaderItem<T>[];
  rows: T[];
  page: number;
  pageSize: number;
  paginationLabel?: string;
  total?: number;
  sort?: TableSort<T>;
  onRowIndexClick?: (rowIndex: number) => void;
  onPageChange: (page: number) => void;
  onSortChange?: (value: TableSort<T> | undefined) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TablePaginated = React.forwardRef<HTMLDivElement, TablePaginatedProps<any>>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T extends Record<string, any>>(
    props: TablePaginatedProps<T>,
    ref: React.Ref<HTMLDivElement>,
  ): React.JSX.Element => {
    const {
      headers,
      rows,
      className,
      total,
      page,
      pageSize,
      paginationLabel,
      sort,
      showIndex = false,
      onRowIndexClick,
      onPageChange,
      onSortChange,
    } = props;

    return (
      <div ref={ref} className={clsx(styles.tableContainer, className)}>
        <div className={styles.tableContainerScroll}>
          <table className={styles.table}>
            <TableHeader
              showIndex={showIndex}
              headers={headers}
              sort={sort}
              onSortChange={onSortChange}
            />
            <TableBody
              onRowIndexClick={onRowIndexClick}
              showIndex={showIndex}
              headers={headers}
              rows={rows}
              page={page}
              pageSize={pageSize}
            />
          </table>
        </div>
        <TablePagination
          page={page}
          pageSize={pageSize}
          paginationLabel={paginationLabel}
          total={total}
          onPageChange={onPageChange}
        />
      </div>
    );
  },
);

TablePaginated.displayName = 'TablePaginated';
