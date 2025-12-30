import clsx from 'clsx';
import tableStyles from '../tables.module.css';
import { TableHeaderItem, TableSort } from './table.types';
import { TableHeader } from './components/TableHeader/TableHeader';
import { TableBody } from './components/TableBody/TableBody';
import { useInfiniteScroll } from './components/TableBody/useInfiniteScroll';
import { useRef } from 'react';

export type TableScrollableProps<T> = {
  showIndex?: boolean;
  className?: string;
  headers: TableHeaderItem<T>[];
  rows: T[];
  sort?: TableSort<T>;
  page: number;
  onRowIndexClick?: (rowIndex: number) => void;
  onNextPage: () => void;
  onSortChange?: (value: TableSort<T> | undefined) => void;
  hasMoreData?: boolean;
  isLoading?: boolean;
  loadingLabel?: string;
  bottomDistanceToPrefetch?: number;
};

export const TableScrollable = ({
  sort,
  onSortChange,
  showIndex,
  headers,
  rows,
  onNextPage,
  hasMoreData = true,
  className,
  onRowIndexClick,
  isLoading = false,
  loadingLabel = 'Loading...',
  bottomDistanceToPrefetch,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: TableScrollableProps<any>) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useInfiniteScroll({
    rootRef: scrollRef,
    enabled: hasMoreData && !isLoading,
    onPrefetch: onNextPage,
    bottomDistanceToPrefetch,
  });

  return (
    <div className={clsx(tableStyles.tableFullContainer, className)}>
      <div
        ref={scrollRef}
        className={clsx(tableStyles.tableAdjustedContainer, tableStyles.fullWidth)}
      >
        <table
          className={clsx(tableStyles.table, tableStyles.cellWrap)}
          aria-label="Scrollable table"
        >
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
            onRowIndexClick={onRowIndexClick}
            bottomRef={sentinelRef}
            isLoading={isLoading}
            loadingLabel={loadingLabel}
            hasMoreData={hasMoreData}
          />
        </table>
      </div>
    </div>
  );
};
