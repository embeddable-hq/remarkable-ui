import clsx from 'clsx';
import tableStyles from '../../tables.module.css';
import { TableHeaderItem, TableSort } from '../table.types';
import { TableHeader } from '../components/TableHeader/TableHeader';
import { TableBody } from '../components/TableBody/TableBody';
import { useInfiniteScroll } from './TableScrollable.hooks';
import { useRef } from 'react';

export type TableScrollableProps<T> = {
  bottomDistanceToPrefetch?: number;
  className?: string;
  hasMoreData?: boolean;
  headers: TableHeaderItem<T>[];
  isLoading?: boolean;
  loadingLabel?: string;
  rows: T[];
  showIndex?: boolean;
  sort?: TableSort<T>;
  onNextPage: () => void;
  onRowIndexClick?: (rowIndex: number) => void;
  onSortChange?: (value: TableSort<T> | undefined) => void;
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
