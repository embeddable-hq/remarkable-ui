import styles from './TableBody.module.css';
import { Typography } from '../../../../shared/Typography/Typography';
import { TablePaginatedProps } from '../../tables.types';
import clsx from 'clsx';

export type TableBodyProps<T> = Pick<
  TablePaginatedProps<T>,
  'showIndex' | 'headers' | 'rows' | 'pageSize' | 'page'
>;

export const TableBody = <T,>({ headers, rows, pageSize, page, showIndex }: TableBodyProps<T>) => {
  return (
    <tbody>
      {rows.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {showIndex && (
            <td className={clsx(styles.tableBodyCell, styles.tableBodyCellIndex)}>
              <Typography>{pageSize * page + rowIndex + 1}</Typography>
            </td>
          )}
          {headers.map((header, cellIndex) => {
            const value =
              header.accessor !== undefined
                ? header.accessor(row)
                : header.id !== undefined
                  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (row as any)[header.id]
                  : undefined;

            // Cell contains own rendering logic
            return (
              // TODO: Fix key
              <td
                key={`${rowIndex}-${cellIndex}`}
                className={styles.tableBodyCell}
                title={`Copy: ${value}`}
              >
                {header.cell ? header.cell(value) : <Typography>{value}</Typography>}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
};
