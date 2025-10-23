import { IconCaretDownFilled, IconCaretUpDownFilled, IconCaretUpFilled } from '@tabler/icons-react';
import { Typography } from '../../../../shared/Typography/Typography';
import styles from './TableHeader.module.css';
import { TableHeaderItem, TablePaginatedProps, TableSortDirection } from '../../tables.types';

export type TableHeaderProps<T> = Pick<
  TablePaginatedProps<T>,
  'showIndex' | 'headers' | 'sort' | 'onSortChange'
>;

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
    <thead>
      <tr>
        {showIndex && (
          <th className={styles.tableHeadIndex}>
            <button className={styles.tableHeadCell}>#</button>
          </th>
        )}
        {headers.map((header) => (
          <th key={header.id as string}>
            <button className={styles.tableHeadCell} onClick={() => handleSort(header.id)}>
              <Typography>{header.title}</Typography>
              {getSortIcon(header)}
            </button>
          </th>
        ))}
      </tr>
    </thead>
  );
};
