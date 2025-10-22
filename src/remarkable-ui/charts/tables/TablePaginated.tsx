import * as React from 'react';
import styles from './Table.module.css';
import clsx from 'clsx';
import { TablePagination } from './components/TablePagination/TablePagination';
import { TableHeader } from './components/TableHeader/TableHeader';
import { TableBody } from './components/TableBody/TableBody';
import { TablePaginatedProps } from './tables.types';

export const TablePaginated = React.forwardRef<HTMLDivElement, TablePaginatedProps<any>>(
  <T extends Record<string, any>>(
    { headers, rows, className, totalPages, onPageChange, currentPage }: TablePaginatedProps<T>,
    ref: React.Ref<HTMLDivElement>,
  ): React.JSX.Element => {
    return (
      <div ref={ref} className={clsx(styles.tableContainer, className)}>
        <div className={styles.scrollX}>
          <table>
            <TableHeader headers={headers} />
            <TableBody headers={headers} rows={rows} />
          </table>
        </div>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    );
  },
);
