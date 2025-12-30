import { IconCaretDownFilled, IconCaretUpDownFilled, IconCaretUpFilled } from '@tabler/icons-react';
import styles from './TableHeader.module.css';
import { TableHeaderItem, TableSortDirection } from '../../table.types';
import tableStyles from '../../../tables.module.css';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useDebounce } from '../../../../../../hooks/useDebounce.hook';
import { TablePaginatedProps } from '../../TablePaginated/TablePaginated';

export type TableHeaderProps<T> = Pick<
  TablePaginatedProps<T>,
  'showIndex' | 'headers' | 'sort' | 'onSortChange'
>;

const getHeaderAriaSort = <T,>(
  sort: TablePaginatedProps<T>['sort'],
  header: TablePaginatedProps<T>['headers'][0],
) => {
  return sort?.id === header.id ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none';
};

const getHeaderAriaLabel = <T,>(
  sort: TablePaginatedProps<T>['sort'],
  header: TablePaginatedProps<T>['headers'][0],
) => {
  return sort?.id === header.id
    ? sort.direction === 'asc'
      ? `Sort by ${header.title}, currently ascending. Activate to sort descending.`
      : `Sort by ${header.title}, currently descending. Activate to sort ascending.`
    : `Sort by ${header.title}. Activate to sort ascending.`;
};
export const TableHeader = <T,>({
  headers,
  sort,
  showIndex,
  onSortChange,
}: TableHeaderProps<T>) => {
  const [currentSort, setCurrentSort] = useState(sort);

  const debouncedUpdateState = useDebounce((value) => {
    if (value === undefined && value === sort) {
      return;
    }
    if (value?.id === sort?.id && value?.direction === sort?.direction) {
      return;
    }

    onSortChange?.(value);
  });

  useEffect(() => {
    debouncedUpdateState(currentSort);
  }, [currentSort, debouncedUpdateState]);

  const getSortIcon = (header: TableHeaderItem<T>) => {
    if (!currentSort) return <IconCaretUpDownFilled />;

    if (currentSort.id === header.id) {
      if (currentSort.direction === TableSortDirection.ASC) {
        return <IconCaretUpFilled />;
      } else if (currentSort.direction === TableSortDirection.DESC) {
        return <IconCaretDownFilled />;
      }
    }
    return <IconCaretUpDownFilled />;
  };

  const handleNewSortClick = (clickedHeader: keyof T | undefined) => {
    // Un-select sort
    if (!clickedHeader) return setCurrentSort(undefined);

    // New sort
    if (currentSort?.id !== clickedHeader)
      return setCurrentSort({ id: clickedHeader, direction: TableSortDirection.ASC });

    // Change current sort direction
    if (currentSort?.direction === undefined)
      return setCurrentSort({ id: clickedHeader, direction: TableSortDirection.ASC });
    if (currentSort?.direction === TableSortDirection.ASC)
      return setCurrentSort({ id: clickedHeader, direction: TableSortDirection.DESC });

    // Remove sort
    return setCurrentSort(undefined);
  };

  return (
    <thead className={styles.tableHeader}>
      <tr>
        {showIndex && (
          <th className={clsx(tableStyles.mutedCell, tableStyles.stickyFirstColumn)}>#</th>
        )}
        {headers.map((header) => (
          <th
            className={styles.tableHeaderCell}
            key={header.id as string}
            style={{ minWidth: header.minWidth }}
            scope="col"
            aria-sort={getHeaderAriaSort(sort, header)}
          >
            <button
              onClick={() => handleNewSortClick(header.id)}
              aria-label={getHeaderAriaLabel(sort, header)}
            >
              {header.title}
              {getSortIcon(header)}
            </button>
          </th>
        ))}
      </tr>
    </thead>
  );
};
