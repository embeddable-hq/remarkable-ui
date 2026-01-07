import styles from './TableBody.module.css';
import { TableHeaderAlign, TableHeaderItem, TableHeaderItemAlign } from '../../table.types';
import clsx from 'clsx';
import { ActionIcon } from '../../../../../shared/ActionIcon/ActionIcon';
import { IconCopy, IconCopyCheckFilled } from '@tabler/icons-react';
import { FC, RefObject, useState } from 'react';
import tableStyles from '../../../tables.module.css';
import { TablePaginatedProps } from '../../TablePaginated/TablePaginated';

export type TableBodyProps<T> = Pick<
  TablePaginatedProps<T>,
  'showIndex' | 'headers' | 'rows' | 'onRowIndexClick'
> & {
  pageSize?: number;
  page?: number;
  bottomRef?: RefObject<HTMLDivElement | null>;
  isLoading?: boolean;
  hasMoreData?: boolean;
};

export const TableBody = <T,>({
  headers,
  rows,
  pageSize,
  page,
  showIndex,
  onRowIndexClick,
  bottomRef,
  isLoading,
  hasMoreData,
}: TableBodyProps<T>) => {
  const hasPaginatedIndex = pageSize !== undefined && page !== undefined;
  const showBottomRef = !isLoading && hasMoreData && bottomRef !== undefined;

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
              {hasPaginatedIndex ? pageSize * page + rowIndex + 1 : rowIndex + 1}
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
      {showBottomRef && (
        <tr>
          <td colSpan={(showIndex ? 1 : 0) + headers.length} className={tableStyles.bottomRefCell}>
            <div ref={bottomRef} style={{ height: 1 }} />
          </td>
        </tr>
      )}
    </tbody>
  );
};

type TableBodyCellProps<T> = {
  header: TableHeaderItem<T>;
  row: T;
  rowIndex: number;
  cellIndex: number;
};

const TableBodyCell = <T,>({ header, row }: TableBodyCellProps<T>) => {
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

  return (
    <TableBodyCellWithCopy align={header.align} value={value}>
      {value}
    </TableBodyCellWithCopy>
  );
};

type TableBodyCellWithCopyProps = {
  value: string;
  align?: TableHeaderItemAlign;
  children: React.ReactNode;
};
export const TableBodyCellWithCopy: FC<TableBodyCellWithCopyProps> = ({
  value,
  align = 'left',
  children,
}) => {
  const [isPressedCopy, setIsPressedCopy] = useState(false);

  const handleCopy = () => {
    setIsPressedCopy(true);
    if (value !== undefined) {
      navigator.clipboard.writeText(String(value));
    }
  };

  return (
    <td title={value} style={{ textAlign: align }} onMouseLeave={() => setIsPressedCopy(false)}>
      <ActionIcon
        title={`Copy: ${String(value)}`}
        onMouseDown={handleCopy}
        icon={isPressedCopy ? IconCopyCheckFilled : IconCopy}
        className={clsx(styles.copyButton, align === TableHeaderAlign.RIGHT && styles.leftAlign)}
        onClick={handleCopy}
      />
      {children}
    </td>
  );
};
