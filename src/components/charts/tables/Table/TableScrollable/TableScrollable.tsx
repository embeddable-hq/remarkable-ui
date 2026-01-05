import clsx from 'clsx';
import tableStyles from '../../tables.module.css';
import { TableHeaderItem, TableSort } from '../table.types';
import { TableHeader } from '../components/TableHeader/TableHeader';
import { TableBody } from '../components/TableBody/TableBody';
import { useInfiniteScroll } from './TableScrollable.hooks';
import { forwardRef, useImperativeHandle, useRef } from 'react';

export type TableScrollableHandle = {
  scrollToTop: (behavior?: ScrollBehavior) => void;
  getScrollElement: () => HTMLDivElement | null;
};

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TableScrollable = forwardRef<TableScrollableHandle, TableScrollableProps<any>>(
  (
    {
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
    },
    ref,
  ) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    // Expose imperative API to parent
    useImperativeHandle(
      ref,
      () => ({
        scrollToTop: (behavior: ScrollBehavior = 'auto') => {
          scrollRef.current?.scrollTo({ top: 0, behavior });
        },
        getScrollElement: () => scrollRef.current,
      }),
      [],
    );

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
              hasMoreData={hasMoreData}
            />
          </table>

          {isLoading && <div className={tableStyles.loadingIndicator}>{loadingLabel}</div>}
        </div>
      </div>
    );
  },
);

TableScrollable.displayName = 'TableScrollable';
