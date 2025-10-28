import styles from './TableBody.module.css';
import { Typography } from '../../../../shared/Typography/Typography';
import { TableHeaderAlign, TableHeaderItem, TablePaginatedProps } from '../../tables.types';
import clsx from 'clsx';
import { IconButton } from '../../../../shared/IconButton/IconButton';
import { IconCopy, IconCopyCheckFilled } from '@tabler/icons-react';
import { useState } from 'react';

export type TableBodyProps<T> = Pick<
  TablePaginatedProps<T>,
  'showIndex' | 'headers' | 'rows' | 'pageSize' | 'page'
>;

export const TableBody = <T,>({ headers, rows, pageSize, page, showIndex }: TableBodyProps<T>) => {
  return (
    <tbody className={styles.tableBody}>
      {rows.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {showIndex && (
            <td className={clsx(styles.tableBodyCell, styles.tableBodyCellIndex)}>
              <Typography>{pageSize * page + rowIndex + 1}</Typography>
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
    if (value !== undefined) {
      navigator.clipboard.writeText(String(value));
    }
  };

  return (
    <td
      key={`${rowIndex}-${cellIndex}`}
      className={styles.tableBodyCell}
      title={value}
      style={{ textAlign: header.align }}
      onMouseLeave={() => setIsPressedCopy(false)}
    >
      <IconButton
        title={`Copy: ${String(value)}`}
        onMouseDown={() => setIsPressedCopy(true)}
        size="small"
        icon={isPressedCopy ? IconCopyCheckFilled : IconCopy}
        className={clsx(
          styles.copyButton,
          header.align === TableHeaderAlign.RIGHT && styles.leftAlign,
        )}
        onClick={handleCopy}
      />
      <Typography>{value}</Typography>
    </td>
  );
};
