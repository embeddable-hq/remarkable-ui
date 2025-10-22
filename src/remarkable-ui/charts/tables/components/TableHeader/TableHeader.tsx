import { IconCaretDownFilled, IconCaretUpDownFilled, IconCaretUpFilled } from '@tabler/icons-react';
import { Typography } from '../../../../shared/Typography/Typography';
import styles from './TableHeader.module.css';
import { TableHeaderItem, TableSort, TableSortDirection } from '../../tables.types';

export type TableHeaderProps<T> = {
  headers: TableHeaderItem<T>[];
  sort?: TableSort<T>;
  onSort?: (newSort: TableSort<T> | undefined) => void;
};

export const TableHeader = <T,>({ headers, sort, onSort }: TableHeaderProps<T>) => {
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
    if (!onSort) return;

    if (!sort) {
      return onSort({ id, direction: TableSortDirection.ASC });
    }

    if (sort) {
      // New sort
      if (sort.id !== id) {
        return onSort({ id, direction: TableSortDirection.ASC });
      }

      // Toggle sort direction
      if (sort.direction === TableSortDirection.ASC) {
        return onSort({ id, direction: TableSortDirection.DESC });
      } else if (sort.direction === TableSortDirection.DESC) {
        return onSort(undefined); // Remove sort after DESC
      }
    }
  };

  return (
    <thead className={styles.tableHead}>
      <tr>
        <th>
          <button className={styles.tableHeadCell}>#</button>
        </th>
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
