import React, { FC, useEffect, useMemo, useState, cloneElement } from 'react';
import styles from './PivotTable.module.css';
import { Typography } from '../../shared/Typography/Typography';

const formatPercent = (n: number) => `${(n * 100).toFixed(1)}%`;
const isNumber = (v: any) => typeof v === 'number' && !Number.isNaN(v);

export type PivotTableProps<T> = {
  data: T[];
  measures: {
    key: Extract<keyof T, string>;
    label: string;
    accessor?: (row: Record<string, any>) => any;
    cell?: (props: { value: any; className?: string }) => React.ReactElement<HTMLTableCellElement>;
  }[];
  rowDimension: {
    key: Extract<keyof T, string>;
    label: string;
    accessor?: (value: string) => any;
  };
  columnDimension: {
    key: Extract<keyof T, string>;
    label: string;
    accessor?: (value: string) => any;
  };
  progressive?: boolean;
  batchSize?: number;
  batchDelayMs?: number;
  rowTotalsFor?: Array<Extract<keyof T, string>>;
  columnTotalsFor?: Array<Extract<keyof T, string>>;
  showColumnPercentages?: boolean;
};

export const PivotTable: FC<PivotTableProps<any>> = ({
  data,
  measures,
  rowDimension,
  columnDimension,
  progressive = true,
  batchSize = 100,
  batchDelayMs = 0,
  rowTotalsFor = [],
  columnTotalsFor = [],
  showColumnPercentages = false,
}) => {
  // 1) Unique row/column values, memoized (first-seen order)
  const rowValues = useMemo(() => {
    const s = new Set<string>();
    for (const d of data) s.add(String(d[rowDimension.key]));
    return Array.from(s);
  }, [data, rowDimension.key]);

  const colValues = useMemo(() => {
    const s = new Set<string>();
    for (const d of data) s.add(String(d[columnDimension.key]));
    return Array.from(s);
  }, [data, columnDimension.key]);

  // 2) Nested map: row -> (col -> last data object)
  const cellMap = useMemo(() => {
    const map = new Map<string, Map<string, Record<string, any>>>();
    for (const d of data) {
      const r = String(d[rowDimension.key]);
      const c = String(d[columnDimension.key]);
      if (!map.has(r)) map.set(r, new Map());
      map.get(r)!.set(c, d as Record<string, any>);
    }
    return map;
  }, [data, rowDimension.key, columnDimension.key]);

  // Sets for quick membership checks
  const rowTotalsSet = useMemo(() => new Set<string>(rowTotalsFor.map(String)), [rowTotalsFor]);
  const columnTotalsSet = useMemo(
    () => new Set<string>(columnTotalsFor.map(String)),
    [columnTotalsFor],
  );

  const hasRowTotals = rowTotalsSet.size > 0;
  const hasColumnTotals = columnTotalsSet.size > 0;

  const measureIndexByKey = useMemo(() => {
    const map = new Map<string, number>();
    measures.forEach((m, i) => map.set(String(m.key), i));
    return map;
  }, [measures]);

  // 3) Totals (column totals, row totals, grand totals) in one pass over data
  const { colTotals, rowTotals, grandTotals } = useMemo(() => {
    const cTotals = new Map<string, number[]>(); // col -> [per-measure]
    const rTotals = new Map<string, number[]>(); // row -> [per-measure]
    const gTotals = measures.map(() => 0); // [per-measure]

    for (const d of data) {
      const r = String(d[rowDimension.key]);
      const c = String(d[columnDimension.key]);

      const cArr = cTotals.get(c) ?? measures.map(() => 0);
      const rArr = rTotals.get(r) ?? measures.map(() => 0);

      measures.forEach((m, i) => {
        const raw = (d as any)?.[m.key];
        const v = Number(raw);
        if (!Number.isNaN(v)) {
          cArr[i]! += v;
          rArr[i]! += v;
          gTotals[i]! += v;
        }
      });

      cTotals.set(c, cArr);
      rTotals.set(r, rArr);
    }

    // Ensure all displayed rows/cols exist (even if empty)
    for (const c of colValues) {
      if (!cTotals.has(String(c)))
        cTotals.set(
          String(c),
          measures.map(() => 0),
        );
    }
    for (const r of rowValues) {
      if (!rTotals.has(String(r)))
        rTotals.set(
          String(r),
          measures.map(() => 0),
        );
    }

    return { colTotals: cTotals, rowTotals: rTotals, grandTotals: gTotals };
  }, [data, measures, rowDimension.key, columnDimension.key, colValues, rowValues]);

  // 4) Progressive row rendering
  const [visibleCount, setVisibleCount] = useState(() =>
    progressive ? Math.min(batchSize, rowValues.length) : rowValues.length,
  );

  useEffect(() => {
    if (!progressive) {
      setVisibleCount(rowValues.length);
      return;
    }
    let cancelled = false;
    let t: number | null = null;

    setVisibleCount(0);

    const tick = () => {
      setVisibleCount((prev) => {
        const next = Math.min(prev + batchSize, rowValues.length);
        if (next < rowValues.length && !cancelled) {
          t = window.setTimeout(tick, batchDelayMs);
        }
        return next;
      });
    };

    t = window.setTimeout(tick, batchDelayMs);

    return () => {
      cancelled = true;
      if (t !== null) window.clearTimeout(t);
    };
  }, [progressive, batchSize, batchDelayMs, rowValues.length, data]);

  const visibleRows = progressive ? rowValues.slice(0, visibleCount) : rowValues;

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col" rowSpan={1}>
              <Typography>{columnDimension.label}</Typography>
            </th>
            {colValues.map((col) => (
              <th key={`col-${String(col)}`} scope="col" colSpan={measures.length}>
                <Typography>
                  {String(col)}{' '}
                  {columnDimension.accessor ? columnDimension.accessor(String(col)) : String(col)}
                </Typography>
              </th>
            ))}
            {hasRowTotals && (
              <th
                key="col-total-group"
                scope="col"
                colSpan={Array.from(rowTotalsSet).length}
                className={styles.total}
              >
                <Typography>Total</Typography>
              </th>
            )}
          </tr>
          <tr>
            <th scope="col" rowSpan={1}>
              <Typography>{rowDimension.label}</Typography>
            </th>
            {colValues.flatMap((col) =>
              measures.map((m, idx) => (
                <th key={`sub-${String(col)}-${m.key}-${idx}`} scope="col">
                  <Typography> {m.label}</Typography>
                </th>
              )),
            )}
            {hasRowTotals &&
              measures
                .filter((m) => rowTotalsSet.has(String(m.key)))
                .map((m, idx) => (
                  <th key={`sub-total-${m.key}-${idx}`} scope="col" className={styles.total}>
                    <Typography> {m.label}</Typography>
                  </th>
                ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => (
            <tr key={`row-${String(row)}`}>
              {/* Row header */}
              <td scope="row">
                <Typography>
                  {rowDimension.accessor ? rowDimension.accessor(String(row)) : String(row)}
                </Typography>
              </td>

              {colValues.flatMap((col) =>
                measures.map((m, idx) => {
                  const object = cellMap.get(String(row))?.get(String(col)) ?? {};
                  const value = object?.[m.key];

                  const key = `cell-${String(row)}-${String(col)}-${m.key}-${idx}`;

                  // compute percentage against column total for this measure (if enabled)
                  const mi = measureIndexByKey.get(String(m.key)) ?? -1;
                  const totalsForCol = colTotals.get(String(col)) ?? measures.map(() => 0);
                  const colTotal = mi >= 0 ? (totalsForCol[mi] ?? 0) : 0;

                  const shouldShowPct =
                    showColumnPercentages &&
                    columnTotalsSet.has(String(m.key)) &&
                    isNumber(Number(value)) &&
                    isNumber(colTotal) &&
                    colTotal > 0;

                  const pct = shouldShowPct ? value / colTotal : null;

                  if (m.cell) {
                    // keep API stable: pass only { value } + merged className
                    const el = m.cell({ value });
                    const mergedClassName = [el.props.className, styles.tableBodyCell]
                      .filter(Boolean)
                      .join(' ');
                    return cloneElement(el, { key, className: mergedClassName });
                  }

                  const getDisplayValue = () => {
                    if (shouldShowPct) {
                      debugger;
                      return formatPercent(pct as number);
                    }

                    return m.accessor ? m.accessor(object) : value;
                  };

                  return (
                    <td key={key}>
                      <Typography>{getDisplayValue()}</Typography>
                    </td>
                  );
                }),
              )}

              {/* Row totals at end of each row (only for selected measure keys) */}
              {hasRowTotals &&
                measures
                  .filter((m) => rowTotalsSet.has(String(m.key)))
                  .map((m, idx) => {
                    const totalsForRow = rowTotals.get(String(row)) ?? measures.map(() => 0);
                    const mi = measureIndexByKey.get(String(m.key)) ?? -1;
                    let total = mi >= 0 ? (totalsForRow[mi] ?? 0) : 0;
                    const key = `row-total-${String(row)}-${m.key}-${idx}`;

                    if (m.accessor) {
                      total = m.accessor({ [m.key]: total });
                    }

                    return (
                      <td key={key} className={styles.total}>
                        <Typography>{total}</Typography>
                      </td>
                    );
                  })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {/* Bottom totals row (per column×measure) */}
          {hasColumnTotals && (
            <tr key="totals-row">
              <td scope="row" className={styles.total}>
                <Typography>Total</Typography>
              </td>

              {colValues.flatMap((col) =>
                measures.map((m, idx) => {
                  const show = columnTotalsSet.has(String(m.key));
                  const totalsForCol = colTotals.get(String(col)) ?? measures.map(() => 0);
                  const mi = measures.findIndex((mm) => String(mm.key) === String(m.key));
                  const total = totalsForCol[mi];
                  const key = `col-total-${String(col)}-${m.key}-${idx}`;

                  let value: number = total as any;
                  if (m.accessor) {
                    value = m.accessor({ [m.key]: total });
                  }

                  return (
                    <td key={key} className={styles.total}>
                      <Typography> {show ? value : ''}</Typography>
                    </td>
                  );
                }),
              )}

              {/* Bottom-right grand totals only if we also have a row totals group */}
              {hasRowTotals &&
                measures
                  .filter((m) => rowTotalsSet.has(String(m.key)))
                  .map((m, idx) => {
                    const mi = measures.findIndex((mm) => String(mm.key) === String(m.key));
                    const total = grandTotals[mi] ?? 0;
                    const key = `grand-total-${m.key}-${idx}`;
                    return (
                      <td key={key} className={styles.totalTotal}>
                        <Typography>{total}</Typography>
                      </td>
                    );
                  })}
            </tr>
          )}
        </tfoot>
      </table>
    </div>
  );
};
