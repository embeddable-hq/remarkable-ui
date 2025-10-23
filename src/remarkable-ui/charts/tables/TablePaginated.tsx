import * as React from 'react';
import styles from './Table.module.css';
import clsx from 'clsx';
import { TablePagination } from './components/TablePagination/TablePagination';
import { TableHeader } from './components/TableHeader/TableHeader';
import { TableBody } from './components/TableBody/TableBody';
import { TablePaginatedProps } from './tables.types';

export const TablePaginated = React.forwardRef<HTMLDivElement, TablePaginatedProps<any>>(
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
      sort,
      showIndex = false,
      onPageChange,
      onSortChange,
    } = props;

    return (
      <div ref={ref} className={clsx(styles.tableContainer, className)}>
        <div className={styles.scrollX}>
          <table className={styles.table}>
            <TableHeader
              showIndex={showIndex}
              headers={headers}
              sort={sort}
              onSortChange={onSortChange}
            />
            <TableBody
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
          total={total}
          onPageChange={onPageChange}
        />
      </div>
    );
  },
);
