import styles from './TableBody.module.css';
import { TableHeaderAlign, TableHeaderItem, TablePaginatedProps } from '../../table.types';
import clsx from 'clsx';
import { ActionIcon } from '../../../../../shared/ActionIcon/ActionIcon';
import { IconCopy, IconCopyCheckFilled } from '@tabler/icons-react';
import { useState } from 'react';
import tableStyles from '../../../tables.module.css';

export type TableBodyProps<T> = Pick<
  TablePaginatedProps<T>,
  'showIndex' | 'headers' | 'rows' | 'pageSize' | 'page' | 'onRowIndexClick'
>;

export const TableBody = <T,>({
  headers,
  rows,
  pageSize,
  page,
  showIndex,
  onRowIndexClick,
}: TableBodyProps<T>) => {
  return (
    <tbody className={styles.tableBody}>
      {rows.map((row, rowIndex) => (
        <tr
          key={rowIndex}
          onClick={() => onRowIndexClick?.(rowIndex)}
          className={clsx(rowIndex === rows.length - 1 && tableStyles.tableLastRow)}
        >
          {showIndex && (
            <td className={clsx(tableStyles.mutedCell, tableStyles.stickyFirstColumn)}>
              {pageSize * page + rowIndex + 1}
            </td>
          )}
          {headers.map((header, cellIndex) => (
            <TableBodyCell
              key={cellIndex}
              header={header}
              row={row}
              rowIndex={rowIndex}
              cellIndex={cellIndex}
            />
          ))}
        </tr>
      ))}
    </tbody>
  );
};

type TableBodyCellProps<T> = {
  header: TableHeaderItem<T>;
  row: T;
  rowIndex: number;
  cellIndex: number;
};

const TableBodyCell = <T,>({ header, row, rowIndex, cellIndex }: TableBodyCellProps<T>) => {
  const [isPressedCopy, setIsPressedCopy] = useState(false);

  const value =
    header.accessor !== undefined
      ? header.accessor(row)
      : header.id !== undefined
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (row as any)[header.id]
        : undefined;

  // Custom cell renderer
  if (header.cell) {
    return header.cell({ value, className: styles.tableBodyCell });
  }

  const handleCopy = () => {
    setIsPressedCopy(true);
    if (value !== undefined) {
      navigator.clipboard.writeText(String(value));
    }
  };

  return (
    <td
      key={`${rowIndex}-${cellIndex}`}
      title={value}
      style={{ textAlign: header.align }}
      onMouseLeave={() => setIsPressedCopy(false)}
    >
      <ActionIcon
        title={`Copy: ${String(value)}`}
        onMouseDown={handleCopy}
        icon={isPressedCopy ? IconCopyCheckFilled : IconCopy}
        className={clsx(
          styles.copyButton,
          header.align === TableHeaderAlign.RIGHT && styles.leftAlign,
        )}
        onClick={handleCopy}
      />
      {value}
    </td>
  );
};
