import { FC, Fragment, useEffect, useMemo, useState } from 'react';
import tableStyles from '../tables.module.css';
import clsx from 'clsx';
import { PivotTableProps } from './PivotTable.types';
import { getTableCellWidthStyle } from '../tables.utils';
import { IconLoader2, IconChevronDown, IconChevronRight } from '@tabler/icons-react';

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
  className,
  expandableRows = false,
  subRowsByRow,
  loadingRows,
  onRowExpand,
  subRowDimension,
}) => {
  // Default subRowDimension to rowDimension if not provided
  const effectiveSubRowDimension = subRowDimension ?? rowDimension;
  const rowValues = useMemo(() => {
    const s = new Set<string>();
    for (const d of data) {
      const rowValue = d[rowDimension.key];
      if (rowValue != null) s.add(rowValue);
    }
    return Array.from(s);
  }, [data, rowDimension.key]);

  const columnValues = useMemo(() => {
    const s = new Set<string>();
    for (const d of data) {
      const columnValue = d[columnDimension.key];
      if (columnValue != null) s.add(columnValue as string);
    }
    return Array.from(s);
  }, [data, columnDimension.key]);

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

  const rowTotalsSet = useMemo(() => new Set<string>(rowTotalsFor), [rowTotalsFor]);
  const columnTotalsSet = useMemo(() => new Set<string>(columnTotalsFor), [columnTotalsFor]);
  const hasRowTotals = rowTotalsSet.size > 0;
  const hasColumnTotals = columnTotalsSet.size > 0;

  const measureIndexByKey = useMemo(() => {
    const map = new Map<string, number>();
    measures.forEach((m, i) => map.set(String(m.key), i));
    return map;
  }, [measures]);

  const { colTotals, rowTotals, grandTotals } = useMemo(() => {
    const cTotals = new Map<string, number[]>();
    const rTotals = new Map<string, number[]>();
    const gTotals = measures.map(() => 0);

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

  const [visibleCount, setVisibleCount] = useState(() =>
    progressive ? Math.min(batchSize, rowValues.length) : rowValues.length,
  );

  const [expandedRows, setExpandedRows] = useState<Set<string>>(() => new Set());

  const handleRowExpand = (rowKey: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      const wasExpanded = next.has(rowKey);

      if (wasExpanded) {
        // Collapse the row
        next.delete(rowKey);
      } else {
        // Expand the row and trigger data fetch
        next.add(rowKey);
        // Only call onRowExpand if we don't already have the data
        if (!subRowsByRow?.has(rowKey)) {
          onRowExpand?.(rowKey);
        }
      }

      return next;
    });
  };

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
    <div className={clsx(tableStyles.tableFullContainer, className)}>
      <div
        className={clsx(
          tableStyles.tableAdjustedContainer,
          (!columnWidth || !firstColumnWidth) && tableStyles.fullWidth,
        )}
      >
        <table
          className={tableStyles.table}
          aria-label={`${rowDimension.label} by ${columnDimension.label}`}
        >
          <thead>
            <tr>
              <th
                scope="col"
                rowSpan={1}
                title={columnDimension.label}
                className={tableStyles.stickyFirstColumn}
                style={getTableCellWidthStyle(firstColumnWidth)}
              >
                {columnDimension.label}
              </th>
              {columnValues.map((columnValue) => {
                const columnValueDisplay = columnDimension.formatValue
                  ? columnDimension.formatValue(columnValue)
                  : columnValue;
                return (
                  <th
                    key={`col-${columnValue}`}
                    scope="colgroup"
                    colSpan={measures.length}
                    title={columnValueDisplay}
                  >
                    {columnValueDisplay}
                  </th>
                );
              })}
              {hasRowTotals && (
                <th
                  key="col-total-group"
                  scope="colgroup"
                  colSpan={Array.from(rowTotalsSet).length}
                  className={tableStyles.boltCell}
                  title={totalLabel}
                >
                  {totalLabel}
                </th>
              )}
            </tr>
            <tr>
              <th
                scope="col"
                rowSpan={1}
                title={rowDimension.label}
                className={tableStyles.stickyFirstColumn}
                style={getTableCellWidthStyle(firstColumnWidth)}
              >
                {rowDimension.label}
              </th>
              {columnValues.flatMap((col) =>
                measures.map((measure, idx) => (
                  <th
                    key={`sub-${String(col)}-${measure.key}-${idx}`}
                    scope="col"
                    title={measure.label}
                    style={getTableCellWidthStyle(columnWidth)}
                  >
                    {measure.label}
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
                      className={tableStyles.boltCell}
                      title={measure.label}
                      style={getTableCellWidthStyle(columnWidth)}
                    >
                      {measure.label}
                    </th>
                  ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => {
              const rowKey = String(row);
              const isExpanded = expandedRows.has(rowKey);
              const isLoading = loadingRows?.has(rowKey) ?? false;
              const subRows = subRowsByRow?.get(rowKey) ?? [];
              const hasLoadedSubRows = subRows.length > 0;

              const rowDimensionValue = rowDimension.formatValue
                ? rowDimension.formatValue(row)
                : row;

              const ariaLabel = expandableRows
                ? isLoading
                  ? 'Loading'
                  : isExpanded
                    ? `Collapse ${rowDimensionValue}`
                    : `Expand ${rowDimensionValue}`
                : '';

              const showSubRows = isExpanded && !isLoading && hasLoadedSubRows;

              return (
                <Fragment key={`row-group-${rowKey}`}>
                  {/* Parent row with expand button */}
                  <tr
                    key={`row-${row}`}
                    className={clsx(isExpanded && tableStyles.expandedRow)}
                    title={rowDimensionValue}
                  >
                    <th
                      scope="row"
                      title={rowDimensionValue}
                      className={clsx(
                        tableStyles.stickyFirstColumn,
                        expandableRows && tableStyles.expandableRowCell,
                      )}
                      onClick={() => expandableRows && handleRowExpand(rowKey)}
                      style={getTableCellWidthStyle(firstColumnWidth)}
                      aria-label={ariaLabel}
                    >
                      <div className={tableStyles.firstColumnCell}>
                        {expandableRows && (
                          <>
                            {isLoading ? (
                              <IconLoader2 className={tableStyles.subRowLoading} />
                            ) : isExpanded ? (
                              <IconChevronDown />
                            ) : (
                              <IconChevronRight />
                            )}
                          </>
                        )}
                        <span>{rowDimensionValue}</span>
                      </div>
                    </th>

                    {columnValues.flatMap((columnValue) =>
                      measures.map((measure, idx) => {
                        const object = cellMap.get(String(row))?.get(String(columnValue)) ?? {};
                        const value = object?.[measure.key];

                        const key = `cell-${row}-${columnValue}-${measure.key}-${idx}`;
                        const getDisplayValue = () => {
                          if (measure.showAsPercentage) {
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
                              const percentage = (value / colTotal) * 100;
                              return `${percentage.toFixed(measure.percentageDecimalPlaces ?? 0)}%`;
                            }
                          }

                          return measure.accessor ? measure.accessor(object) : value;
                        };

                        const columnValueDisplay = getDisplayValue();

                        return (
                          <td key={key} title={columnValueDisplay}>
                            {columnValueDisplay}
                          </td>
                        );
                      }),
                    )}

                    {hasRowTotals &&
                      measures
                        .filter((measure) => rowTotalsSet.has(measure.key))
                        .map((measure, idx) => {
                          const totalsForRow = rowTotals.get(String(row)) ?? measures.map(() => 0);
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
                            <td key={key} className={tableStyles.boltCell} title={displayValue}>
                              {displayValue}
                            </td>
                          );
                        })}
                  </tr>

                  {/* Sub-rows when expanded and loaded */}
                  {showSubRows &&
                    (() => {
                      // Group sub-rows by subRowDimension.key (e.g., city)
                      const subRowValues = Array.from(
                        new Set(
                          subRows
                            .map((sr) => sr[effectiveSubRowDimension.key])
                            .filter((v) => v != null),
                        ),
                      );

                      // Create a cell map for sub-rows (subRowValue -> columnValue -> data)
                      const subRowCellMap = new Map<string, Map<string, Record<string, any>>>();
                      for (const sr of subRows) {
                        const subR = String(sr[effectiveSubRowDimension.key]);
                        const subC = String(sr[columnDimension.key]);
                        if (!subRowCellMap.has(subR)) subRowCellMap.set(subR, new Map());
                        subRowCellMap.get(subR)!.set(subC, sr as Record<string, any>);
                      }

                      return subRowValues.map((subRowValue, subRowIdx) => {
                        const subRowDimensionValue = effectiveSubRowDimension.formatValue
                          ? effectiveSubRowDimension.formatValue(subRowValue)
                          : subRowValue;

                        return (
                          <tr key={`sub-${rowKey}-${subRowIdx}`} className={tableStyles.subRow}>
                            <th
                              scope="row"
                              className={clsx(
                                tableStyles.stickyFirstColumn,
                                tableStyles.subRowFirstColumn,
                              )}
                              style={getTableCellWidthStyle(firstColumnWidth)}
                              title={subRowDimensionValue}
                            >
                              <span>{subRowDimensionValue}</span>
                            </th>

                            {columnValues.flatMap((columnValue) =>
                              measures.map((measure, idx) => {
                                const subRowData =
                                  subRowCellMap
                                    .get(String(subRowValue))
                                    ?.get(String(columnValue)) ?? {};
                                const value = subRowData?.[measure.key];
                                const key = `sub-cell-${rowKey}-${subRowIdx}-${columnValue}-${measure.key}-${idx}`;

                                const getDisplayValue = () => {
                                  if (measure.showAsPercentage) {
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
                                      const percentage = (value / colTotal) * 100;
                                      return `${percentage.toFixed(measure.percentageDecimalPlaces ?? 0)}%`;
                                    }
                                  }

                                  return measure.accessor ? measure.accessor(subRowData) : value;
                                };

                                const columnValueDisplay = getDisplayValue();

                                return (
                                  <td key={key} title={columnValueDisplay}>
                                    {columnValueDisplay}
                                  </td>
                                );
                              }),
                            )}

                            {hasRowTotals &&
                              measures
                                .filter((measure) => rowTotalsSet.has(measure.key))
                                .map((measure, idx) => {
                                  // Calculate total for this sub-row across all columns
                                  let total = 0;
                                  for (const columnValue of columnValues) {
                                    const subRowData =
                                      subRowCellMap
                                        .get(String(subRowValue))
                                        ?.get(String(columnValue)) ?? {};
                                    const val = Number(subRowData?.[measure.key]);
                                    if (!Number.isNaN(val)) {
                                      total += val;
                                    }
                                  }

                                  let displayValue: any = total;

                                  if (measure.showAsPercentage) {
                                    const measureIndex = measureIndexByKey.get(measure.key) ?? -1;
                                    const grandTotal = grandTotals[measureIndex] || 1;
                                    displayValue = getPercentageDisplay(
                                      (total / grandTotal) * 100,
                                      measure.percentageDecimalPlaces ?? 0,
                                    );
                                  } else if (measure.accessor) {
                                    displayValue = measure.accessor({ [measure.key]: total });
                                  }

                                  return (
                                    <td
                                      key={`sub-total-${rowKey}-${subRowIdx}-${measure.key}-${idx}`}
                                      className={tableStyles.boltCell}
                                      title={displayValue}
                                    >
                                      {displayValue}
                                    </td>
                                  );
                                })}
                          </tr>
                        );
                      });
                    })()}
                </Fragment>
              );
            })}
            {hasColumnTotals && (
              <tr key="totals-row" className={tableStyles.stickyLastRow}>
                <th
                  scope="row"
                  className={clsx(tableStyles.stickyFirstColumn, tableStyles.boltCell)}
                  title={totalLabel}
                  style={getTableCellWidthStyle(firstColumnWidth)}
                >
                  {totalLabel}
                </th>

                {columnValues.flatMap((columnValue) =>
                  measures.map((measure, idx) => {
                    const show = columnTotalsSet.has(String(measure.key));
                    const totalsForCol =
                      colTotals.get(String(columnValue)) ?? measures.map(() => 0);
                    const mi = measures.findIndex((mm) => String(mm.key) === String(measure.key));
                    const key = `col-total-${String(columnValue)}-${measure.key}-${idx}`;
                    const value: number = totalsForCol[mi] ?? 0;
                    let displayValue: any = value;

                    if (measure.showAsPercentage) {
                      displayValue = getPercentageDisplay(
                        100,
                        measure.percentageDecimalPlaces ?? 0,
                      );
                    } else if (measure.accessor) {
                      displayValue = measure.accessor({ [measure.key]: value });
                    }
                    const columnValueDisplay = show ? displayValue : '';

                    return (
                      <td key={key} className={tableStyles.boltCell} title={columnValueDisplay}>
                        {columnValueDisplay}
                      </td>
                    );
                  }),
                )}

                {hasRowTotals &&
                  measures
                    .filter((measure) => rowTotalsSet.has(measure.key))
                    .map((measure, idx) => {
                      const measureIndex = measures.findIndex((m) => String(m.key) === measure.key);
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
                        <td key={key} className={tableStyles.boltCell} title={displayValue}>
                          {displayValue}
                        </td>
                      );
                    })}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
