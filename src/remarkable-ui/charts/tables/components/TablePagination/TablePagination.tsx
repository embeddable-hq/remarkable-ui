import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react';
import { IconButton } from '../../../../shared/IconButton/IconButton';
import { Typography } from '../../../../shared/Typography/Typography';
import styles from './TablePagination.module.css';
import { FC, useEffect } from 'react';
import { TablePaginatedProps } from '../../tables.types';

export type TablePaginationProps = Pick<
  TablePaginatedProps<unknown>,
  'page' | 'pageSize' | 'paginationLabel' | 'total' | 'onPageChange'
>;

export const getTableTotalPages = (
  total: number | undefined,
  pageSize: number,
): number | undefined => {
  return total ? Math.ceil(total / pageSize) : undefined;
};

export const TablePagination: FC<TablePaginationProps> = ({
  page,
  pageSize,
  paginationLabel,
  total,
  onPageChange,
}) => {
  const totalPages = getTableTotalPages(total, pageSize);

  const disabledPrev = page <= 0;
  const disabledNext = !totalPages || page >= totalPages - 1;

  useEffect(() => {
    if (totalPages && page > totalPages) {
      onPageChange(0);
    }
  }, [totalPages, page]);

  return (
    <div className={styles.tablePagination} aria-label="Table pagination controls">
      <div className={styles.tablePaginationCentral}>
        <div className={styles.tablePaginationCentralButtons}>
          <IconButton
            icon={IconChevronsLeft}
            onClick={() => {
              onPageChange(0);
            }}
            disabled={disabledPrev}
            aria-label="First page"
          />
          <IconButton
            icon={IconChevronLeft}
            onClick={() => {
              onPageChange(page - 1);
            }}
            disabled={disabledPrev}
            aria-label="Previous page"
          />
        </div>
        <Typography>{paginationLabel ?? `Page ${page + 1} of ${totalPages ?? '?'}`}</Typography>
        <div className={styles.tablePaginationCentralButtons}>
          <IconButton
            icon={IconChevronRight}
            onClick={() => {
              onPageChange(page + 1);
            }}
            disabled={disabledNext}
            aria-label="Previous page"
          />
          <IconButton
            icon={IconChevronsRight}
            onClick={() => totalPages && onPageChange(totalPages - 1)}
            disabled={disabledNext}
            aria-label="Last page"
          />
        </div>
      </div>
    </div>
  );
};
