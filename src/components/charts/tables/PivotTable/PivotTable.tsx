import { FC, Fragment, useMemo, useState } from 'react';
import tableStyles from '../tables.module.css';
import clsx from 'clsx';
import { PivotTableProps } from './PivotTable.types';
import { getTableCellWidthStyle } from '../tables.utils';
import { IconLoader2, IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import {
  buildCellMap,
  getCellDisplayValue,
  getPercentageDisplay,
  getMeasureTotal,
  computeSubRowTotal,
  useProgressiveRows,
  usePivotTotals,
} from './PivotTable.utils';

/* eslint-disable @typescript-eslint/no-explicit-any */
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

  const cellMap = useMemo(
    () => buildCellMap(data, rowDimension.key, columnDimension.key),
    [data, rowDimension.key, columnDimension.key],
  );

  const rowTotalsSet = useMemo(() => new Set<string>(rowTotalsFor), [rowTotalsFor]);
  const columnTotalsSet = useMemo(() => new Set<string>(columnTotalsFor), [columnTotalsFor]);
  const hasRowTotals = rowTotalsSet.size > 0;
  const hasColumnTotals = columnTotalsSet.size > 0;

  const measureIndexByKey = useMemo(() => {
    const map = new Map<string, number>();
    measures.forEach((m, i) => map.set(String(m.key), i));
    return map;
  }, [measures]);

  const { colTotals, rowTotals, grandTotals } = usePivotTotals(
    data,
    measures,
    rowDimension.key,
    columnDimension.key,
    columnValues,
    rowValues,
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

  const visibleRows = useProgressiveRows(rowValues, {
    progressive,
    batchSize,
    batchDelayMs,
    data,
  });

  const renderMeasureCells = (
    rowCellMap: Map<string, Map<string, Record<string, any>>>,
    rowKey: string,
    keyPrefix: string,
  ) =>
    columnValues.flatMap((columnValue) =>
      measures.map((measure, idx) => {
        const object = rowCellMap.get(rowKey)?.get(String(columnValue)) ?? {};
        const value = object?.[measure.key];
        const key = `${keyPrefix}-${columnValue}-${measure.key}-${idx}`;
        const mi = measureIndexByKey.get(String(measure.key)) ?? -1;
        const colTotal = getMeasureTotal(colTotals, String(columnValue), mi, measures.length);
        const displayValue = getCellDisplayValue(value, measure, object, colTotal);

        return (
          <td key={key} title={displayValue}>
            {displayValue}
          </td>
        );
      }),
    );

  const renderRowTotalCells = (
    getTotalValue: (measureKey: string, measureIndex: number) => number,
    keyPrefix: string,
  ) => {
    if (!hasRowTotals) return null;
    return measures
      .filter((measure) => rowTotalsSet.has(measure.key))
      .map((measure, idx) => {
        const measureIndex = measureIndexByKey.get(measure.key) ?? -1;
        const key = `${keyPrefix}-${measure.key}-${idx}`;
        const value = getTotalValue(measure.key, measureIndex);
        const displayValue = getCellDisplayValue(
          value,
          measure,
          { [measure.key]: value },
          grandTotals[measureIndex] || 1,
        );

        return (
          <td key={key} className={tableStyles.boltCell} title={displayValue}>
            {displayValue}
          </td>
        );
      });
  };

  const renderSubRows = (rowKey: string, subRows: any[]) => {
    const subRowValues = Array.from(
      new Set(subRows.map((sr) => sr[effectiveSubRowDimension.key]).filter((v) => v != null)),
    );
    const subRowCellMap = buildCellMap(subRows, effectiveSubRowDimension.key, columnDimension.key);

    return subRowValues.map((subRowValue, subRowIdx) => {
      const subRowDimensionValue = effectiveSubRowDimension.formatValue
        ? effectiveSubRowDimension.formatValue(subRowValue)
        : subRowValue;

      return (
        <tr key={`sub-${rowKey}-${subRowIdx}`} className={tableStyles.subRow}>
          <th
            scope="row"
            className={clsx(tableStyles.stickyFirstColumn, tableStyles.subRowFirstColumn)}
            style={getTableCellWidthStyle(firstColumnWidth)}
            title={subRowDimensionValue}
          >
            <span>{subRowDimensionValue}</span>
          </th>

          {renderMeasureCells(
            subRowCellMap,
            String(subRowValue),
            `sub-cell-${rowKey}-${subRowIdx}`,
          )}

          {renderRowTotalCells(
            (key) => computeSubRowTotal(subRowCellMap, String(subRowValue), columnValues, key),
            `sub-total-${rowKey}-${subRowIdx}`,
          )}
        </tr>
      );
    });
  };

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
                      onKeyDown={(e) => {
                        if (expandableRows && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault();
                          handleRowExpand(rowKey);
                        }
                      }}
                      tabIndex={expandableRows ? 0 : undefined}
                      role={expandableRows ? 'button' : undefined}
                      aria-expanded={expandableRows ? isExpanded : undefined}
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

                    {renderMeasureCells(cellMap, String(row), `cell-${row}`)}

                    {renderRowTotalCells(
                      (_key, mi) => getMeasureTotal(rowTotals, String(row), mi, measures.length),
                      `row-total-${String(row)}`,
                    )}
                  </tr>

                  {/* Sub-rows when expanded and loaded */}
                  {showSubRows && renderSubRows(rowKey, subRows)}
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
                    const mi = measureIndexByKey.get(String(measure.key)) ?? -1;
                    const key = `col-total-${String(columnValue)}-${measure.key}-${idx}`;
                    const value = getMeasureTotal(
                      colTotals,
                      String(columnValue),
                      mi,
                      measures.length,
                    );
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
                      const measureIndex = measureIndexByKey.get(measure.key) ?? -1;
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
