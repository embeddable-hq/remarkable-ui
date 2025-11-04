import { IconCaretDownFilled, IconCaretUpDownFilled, IconCaretUpFilled } from '@tabler/icons-react';
import { Typography } from '../../../../../shared/Typography/Typography';
import styles from './TableHeader.module.css';
import { TableHeaderItem, TablePaginatedProps, TableSortDirection } from '../../table.types';

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
  const getSortIcon = (header: TableHeaderItem<T>) => {
    if (!sort) return <IconCaretUpDownFilled />;

    if (sort.id === header.id) {
      if (sort.direction === TableSortDirection.ASC) {
        return <IconCaretUpFilled />;
      } else if (sort.direction === TableSortDirection.DESC) {
        return <IconCaretDownFilled />;
      }
    }
    return <IconCaretUpDownFilled />;
  };

  const handleSort = (id: keyof T) => {
    if (!onSortChange) return;

    if (!sort) {
      return onSortChange({ id, direction: TableSortDirection.ASC });
    }

    if (sort) {
      // New sort
      if (sort.id !== id) {
        return onSortChange({ id, direction: TableSortDirection.ASC });
      }

      // Toggle sort direction
      if (sort.direction === TableSortDirection.ASC) {
        return onSortChange({ id, direction: TableSortDirection.DESC });
      } else if (sort.direction === TableSortDirection.DESC) {
        return onSortChange(undefined); // Remove sort after DESC
      }
    }
  };

  return (
    <thead className={styles.tableHead}>
      <tr>
        {showIndex && (
          <th className={styles.tableHeadIndex}>
            <div className={styles.tableHeadCell}>
              <Typography>#</Typography>
            </div>
          </th>
        )}
        {headers.map((header) => (
          <th
            key={header.id as string}
            style={{ minWidth: header.minWidth }}
            scope="col"
            aria-sort={getHeaderAriaSort(sort, header)}
          >
            <button
              className={styles.tableHeadCell}
              onClick={() => handleSort(header.id)}
              aria-label={getHeaderAriaLabel(sort, header)}
            >
              <Typography>{header.title}</Typography>
              {getSortIcon(header)}
            </button>
          </th>
        ))}
      </tr>
    </thead>
  );
};
