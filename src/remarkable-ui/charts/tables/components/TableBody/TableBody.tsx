import { Typography } from '../../../../shared/Typography/Typography';
import { TableHeaderItem } from '../TableHeader/TableHeader';
import styles from './TableBody.module.css';

export type TableBodyProps<T> = {
  headers: TableHeaderItem<T>[];
  rows: T[];
};

export const TableBody = <T,>({ headers, rows }: TableBodyProps<T>) => {
  return (
    <tbody className={styles.tableBody}>
      {rows.map((row, rowIndex) => (
        <tr key={rowIndex}>
          <td>
            <Typography>#</Typography>
          </td>
          {headers.map((header, cellIndex) => {
            const value =
              header.accessor !== undefined
                ? header.accessor(row)
                : header.id !== undefined
                  ? (row as any)[header.id]
                  : undefined;

            // Cell contains own rendering logic
            return (
              // TODO: Fix key
              <td key={`${rowIndex}-${cellIndex}`} title={`Copy: ${value}`}>
                {header.cell ? header.cell(value) : <Typography>{value}</Typography>}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
};
