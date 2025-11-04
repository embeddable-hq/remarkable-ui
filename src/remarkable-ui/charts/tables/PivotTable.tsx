import { FC, useEffect, useMemo, useState } from 'react';
import styles from './PivotTable.module.css';
import { Typography } from '../../shared/Typography/Typography';
import clsx from 'clsx';
import { PivotTableProps } from './PivotTable.types';

/* eslint-disable @typescript-eslint/no-explicit-any */

const isNumber = (v: any) => typeof v === 'number' && !Number.isNaN(v);

const getPercentageDisplay = (percentage: number, percentageDecimalPlaces: number) => {
  return `${percentage.toFixed(percentageDecimalPlaces)}%`;
};

export const PivotTable: FC<PivotTableProps<any>> = ({
  columnWidth,
  firstColumnWidth,
  data,
  measures,
  rowDimension,
  columnDimension,
  progressive = true,
  batchSize = 100,
  batchDelayMs = 0,
  rowTotalsFor = [],
  columnTotalsFor = [],
  totalLabel = 'Total',
}) => {
  // 1) Unique row/column values, memoized (first-seen order)
  const rowValues = useMemo(() => {
    const s = new Set<string>();
    for (const d of data) {
      const rowValue = d[rowDimension.key];
      if (rowValue) {
        s.add(rowValue);
      }
    }
    return Array.from(s);
  }, [data, rowDimension.key]);

  const columnValues = useMemo(() => {
    const s = new Set<string>();
    for (const d of data) {
      const columnValue = d[rowDimension.key];
      if (columnValue) {
        s.add(d[columnDimension.key]);
      }
    }
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
  const rowTotalsSet = useMemo(() => new Set<string>(rowTotalsFor), [rowTotalsFor]);
  const columnTotalsSet = useMemo(() => new Set<string>(columnTotalsFor), [columnTotalsFor]);

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
    for (const c of columnValues) {
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
  }, [data, measures, rowDimension.key, columnDimension.key, columnValues, rowValues]);

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
  console.log('visibleRows', visibleRows);
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th
              scope="col"
              rowSpan={1}
              className={clsx(styles.cell, styles.header)}
              title={columnDimension.label}
            >
              <Typography>{columnDimension.label}</Typography>
            </th>
            {columnValues.map((columnValue) => {
              const columnValueDisplay = columnDimension.formatValue
                ? columnDimension.formatValue(columnValue)
                : columnValue;
              return (
                <th
                  key={`col-${columnValue}`}
                  scope="col"
                  colSpan={measures.length}
                  className={clsx(styles.cell, styles.header)}
                  title={columnValueDisplay}
                >
                  <Typography>{columnValueDisplay}</Typography>
                </th>
              );
            })}
            {hasRowTotals && (
              <th
                key="col-total-group"
                scope="col"
                colSpan={Array.from(rowTotalsSet).length}
                className={clsx(styles.cell, styles.bold)}
                title={totalLabel}
              >
                <Typography>{totalLabel}</Typography>
              </th>
            )}
          </tr>
          <tr>
            <th
              scope="col"
              rowSpan={1}
              className={clsx(styles.cell, styles.header)}
              title={rowDimension.label}
              style={{ minWidth: firstColumnWidth ? firstColumnWidth : undefined }}
            >
              <Typography>{rowDimension.label}</Typography>
            </th>
            {columnValues.flatMap((col) =>
              measures.map((measure, idx) => (
                <th
                  key={`sub-${String(col)}-${measure.key}-${idx}`}
                  scope="col"
                  className={clsx(styles.cell, styles.header)}
                  title={measure.label}
                  style={{ minWidth: columnWidth ? columnWidth : undefined }}
                >
                  <Typography> {measure.label}</Typography>
                </th>
              )),
            )}
            {hasRowTotals &&
              measures
                .filter((measure) => rowTotalsSet.has(measure.key))
                .map((measure, idx) => (
                  <th
                    key={`sub-total-${measure.key}-${idx}`}
                    scope="col"
                    className={clsx(styles.cell, styles.bold)}
                    title={measure.label}
                  >
                    <Typography> {measure.label}</Typography>
                  </th>
                ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => {
            const rowDimensionValue = rowDimension.formatValue
              ? rowDimension.formatValue(row)
              : row;
            return (
              <tr key={`row-${row}`}>
                <td
                  scope="row"
                  className={clsx(styles.cell, styles.header)}
                  title={rowDimensionValue}
                >
                  <Typography>{rowDimensionValue}</Typography>
                </td>
                {columnValues.flatMap((columnValue) =>
                  measures.map((measure, idx) => {
                    const object = cellMap.get(row)?.get(columnValue) ?? {};
                    const value = object?.[measure.key];

                    const key = `cell-${row}-${columnValue}-${measure.key}-${idx}`;

                    const getDisplayValue = () => {
                      if (measure.showAsPercentage) {
                        // compute percentage against column total for this measure (if enabled)
                        const mi = measureIndexByKey.get(String(measure.key)) ?? -1;
                        const totalsForCol =
                          colTotals.get(String(columnValue)) ?? measures.map(() => 0);
                        const colTotal = mi >= 0 ? (totalsForCol[mi] ?? 0) : 0;

                        const shouldShowPct =
                          measure.showAsPercentage &&
                          isNumber(Number(value)) &&
                          isNumber(colTotal) &&
                          colTotal > 0;

                        if (shouldShowPct) {
                          const percentage = !shouldShowPct ? 0 : (value / colTotal) * 100;
                          const percentageDisplay = `${percentage.toFixed(measure.percentageDecimalPlaces ?? 0)}%`;
                          return percentageDisplay;
                        }
                      }

                      return measure.accessor ? measure.accessor(object) : value;
                    };

                    const columnValueDisplay = getDisplayValue();

                    return (
                      <td key={key} className={clsx(styles.cell)} title={columnValueDisplay}>
                        <Typography>{columnValueDisplay}</Typography>
                      </td>
                    );
                  }),
                )}

                {/* Row totals at end of each row (only for selected measure keys) */}
                {hasRowTotals &&
                  measures
                    .filter((measure) => rowTotalsSet.has(measure.key))
                    .map((measure, idx) => {
                      const totalsForRow = rowTotals.get(row) ?? measures.map(() => 0);
                      const measureIndex = measureIndexByKey.get(measure.key) ?? -1;
                      const key = `row-total-${String(row)}-${measure.key}-${idx}`;

                      const value: number =
                        measureIndex >= 0 ? (totalsForRow[measureIndex] ?? 0) : 0;
                      let displayValue: any = value;

                      if (measure.showAsPercentage) {
                        displayValue = getPercentageDisplay(
                          (value / (grandTotals[measureIndex] || 1)) * 100,
                          measure.percentageDecimalPlaces ?? 0,
                        );
                      } else if (measure.accessor) {
                        displayValue = measure.accessor({ [measure.key]: value });
                      }

                      return (
                        <td
                          key={key}
                          className={clsx(styles.cell, styles.bold)}
                          title={displayValue}
                        >
                          <Typography>{displayValue}</Typography>
                        </td>
                      );
                    })}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          {/* Bottom totals row (per column×measure) */}
          {hasColumnTotals && (
            <tr key="totals-row">
              <td scope="row" className={clsx(styles.cell, styles.bold)} title={totalLabel}>
                <Typography>{totalLabel}</Typography>
              </td>

              {columnValues.flatMap((columnValue) =>
                measures.map((measure, idx) => {
                  const show = columnTotalsSet.has(String(measure.key));
                  const totalsForCol = colTotals.get(String(columnValue)) ?? measures.map(() => 0);
                  const mi = measures.findIndex((mm) => String(mm.key) === String(measure.key));
                  const key = `col-total-${String(columnValue)}-${measure.key}-${idx}`;

                  const value: number = totalsForCol[mi] ?? 0;
                  let displayValue: any = value;

                  if (measure.showAsPercentage) {
                    displayValue = getPercentageDisplay(100, measure.percentageDecimalPlaces ?? 0);
                  } else if (measure.accessor) {
                    displayValue = measure.accessor({ [measure.key]: value });
                  }
                  const columnValueDisplay = show ? displayValue : '';

                  return (
                    <td
                      key={key}
                      className={clsx(styles.cell, styles.bold)}
                      title={columnValueDisplay}
                    >
                      <Typography>{columnValueDisplay}</Typography>
                    </td>
                  );
                }),
              )}

              {/* Bottom-right grand totals only if we also have a row totals group */}
              {hasRowTotals &&
                measures
                  .filter((measure) => rowTotalsSet.has(measure.key))
                  .map((measure, idx) => {
                    const measureIndex = measures.findIndex(
                      (measure) => String(measure.key) === measure.key,
                    );
                    const key = `grand-total-${measure.key}-${idx}`;

                    const value: number = grandTotals[measureIndex] ?? 0;
                    let displayValue: any = value;

                    if (measure.showAsPercentage) {
                      displayValue = getPercentageDisplay(
                        100,
                        measure.percentageDecimalPlaces ?? 0,
                      );
                    } else if (measure.accessor) {
                      displayValue = measure.accessor({ [measure.key]: value });
                    }

                    return (
                      <td key={key} className={clsx(styles.cell, styles.bold)} title={displayValue}>
                        <Typography>{displayValue}</Typography>
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
