import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react';
import { ActionIcon } from '../../../../../shared/ActionIcon/ActionIcon';
import styles from './TablePagination.module.css';
import { FC, useEffect } from 'react';
import { TablePaginatedProps } from '../../table.types';

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
    if (totalPages && page >= totalPages) {
      onPageChange(0);
    }
  }, [totalPages, page]);

  return (
    <div className={styles.tablePagination} aria-label="Table pagination controls">
      <div className={styles.tablePaginationCentral}>
        <div className={styles.tablePaginationCentralButtons}>
          <ActionIcon
            icon={IconChevronsLeft}
            onClick={() => {
              onPageChange(0);
            }}
            disabled={disabledPrev}
            aria-label="First page"
          />
          <ActionIcon
            icon={IconChevronLeft}
            onClick={() => {
              onPageChange(page - 1);
            }}
            disabled={disabledPrev}
            aria-label="Previous page"
          />
        </div>
        <span>{paginationLabel ?? `Page ${page + 1} of ${totalPages ?? '?'}`}</span>
        <div className={styles.tablePaginationCentralButtons}>
          <ActionIcon
            icon={IconChevronRight}
            onClick={() => {
              onPageChange(page + 1);
            }}
            disabled={disabledNext}
            aria-label="Next page"
          />
          <ActionIcon
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
