import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react';
import { IconButton } from '../../../../shared/IconButton/IconButton';
import { Typography } from '../../../../shared/Typography/Typography';
import styles from './TablePagination.module.css';

type TablePaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const disabledPrev = currentPage <= 0;
  const disabledNext = currentPage >= totalPages - 1;

  return (
    <div className={styles.tablePagination} aria-label="Table pagination controls">
      <div className={styles.tablePaginationCentral}>
        <div className={styles.tablePaginationCentralButtons}>
          <IconButton
            icon={IconChevronLeft}
            onClick={() => {
              onPageChange(currentPage - 1);
            }}
            disabled={disabledPrev}
            aria-label="Previous page"
          />
          <IconButton
            icon={IconChevronsLeft}
            onClick={() => {
              onPageChange(0);
            }}
            disabled={disabledPrev}
            aria-label="First page"
          />
        </div>
        <Typography>
          Page {currentPage + 1} of {totalPages}
        </Typography>
        <div className={styles.tablePaginationCentralButtons}>
          <IconButton
            icon={IconChevronRight}
            onClick={() => {
              onPageChange(currentPage + 1);
            }}
            disabled={disabledNext}
            aria-label="Previous page"
          />
          <IconButton
            icon={IconChevronsRight}
            onClick={() => {
              onPageChange(totalPages - 1);
            }}
            disabled={disabledNext}
            aria-label="Last page"
          />
        </div>
      </div>
    </div>
  );
};
