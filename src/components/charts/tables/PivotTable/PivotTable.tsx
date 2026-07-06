import { FC, Fragment, useMemo, useState } from 'react';
import tableStyles from '../tables.module.css';
import clsx from 'clsx';
import { PivotAggregationConfig, PivotAggregationType, PivotTableProps } from './PivotTable.types';
import { getTableCellWidthStyle } from '../tables.utils';
import { IconLoader2, IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import {
  AGG_DEFAULT_LABELS,
  AggResult,
  buildCellMap,
  computeSubRowAggregation,
  getCellDisplayValue,
  getAggregatedValue,
  getPercentageDisplay,
  usePivotAggregations,
  useProgressiveRows,
} from './PivotTable.utils';

/* eslint-disable @typescript-eslint/no-explicit-any */
const toGroups = (
  sum: string[],
  min: string[],
  max: string[],
  average: string[],
): PivotAggregationConfig<any>[] =>
  [
    { type: 'sum' as const, measureKeys: sum },
    { type: 'min' as const, measureKeys: min },
    { type: 'max' as const, measureKeys: max },
    { type: 'average' as const, measureKeys: average },
  ].filter((g) => g.measureKeys.length > 0);

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
  rowSumFor = [],
  rowMinFor = [],
  rowMaxFor = [],
  rowAverageFor = [],
  columnSumFor = [],
  columnMinFor = [],
  columnMaxFor = [],
  columnAverageFor = [],
  sumLabel,
  minLabel,
  maxLabel,
  averageLabel,
  className,
  expandableRows = false,
  subRowsByRow,
  loadingRows,
  onRowExpand,
  subRowDimension,
}) => {
  const effectiveSubRowDimension = subRowDimension ?? rowDimension;

  const aggLabels: Record<string, string> = {
    sum: sumLabel ?? AGG_DEFAULT_LABELS.sum,
    min: minLabel ?? AGG_DEFAULT_LABELS.min,
    max: maxLabel ?? AGG_DEFAULT_LABELS.max,
    average: averageLabel ?? AGG_DEFAULT_LABELS.average,
  };

  const rowAggregationsFor = useMemo(
    () => toGroups(rowSumFor, rowMinFor, rowMaxFor, rowAverageFor),
    [rowSumFor, rowMinFor, rowMaxFor, rowAverageFor],
  );
  const columnAggregationsFor = useMemo(
    () => toGroups(columnSumFor, columnMinFor, columnMaxFor, columnAverageFor),
    [columnSumFor, columnMinFor, columnMaxFor, columnAverageFor],
  );

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

  const hasRowAggs = rowAggregationsFor.length > 0;
  const hasColumnAggs = columnAggregationsFor.length > 0;

  const measureIndexByKey = useMemo(() => {
    const map = new Map<string, number>();
    measures.forEach((m, i) => map.set(String(m.key), i));
    return map;
  }, [measures]);

  const measureByKey = useMemo(() => new Map(measures.map((m) => [String(m.key), m])), [measures]);

  const { colAggs, rowAggs, grandAggs } = usePivotAggregations(
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
        next.delete(rowKey);
      } else {
        next.add(rowKey);
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
        const colTotal = getAggregatedValue(
          colAggs,
          String(columnValue),
          mi,
          'sum',
          measures.length,
        );
        const displayValue = getCellDisplayValue(value, measure, object, colTotal);

        return (
          <td key={key} title={displayValue}>
            {displayValue}
          </td>
        );
      }),
    );

  const getAggCellDisplayValue = (
    type: PivotAggregationType,
    value: number,
    measure: any,
    sourceAggs: AggResult,
    measureIndex: number,
  ): any => {
    if (type === 'sum' && measure.showAsPercentage) {
      const denominator = sourceAggs.sum[measureIndex] || 1;
      if (typeof denominator === 'number' && denominator > 0) {
        return getPercentageDisplay(
          (value / denominator) * 100,
          measure.percentageDecimalPlaces ?? 0,
        );
      }
    }
    return measure.accessor ? measure.accessor({ [measure.key]: value }) : value;
  };

  const renderRowAggCells = (
    getAggValue: (type: PivotAggregationType, measureKey: string, measureIndex: number) => number,
    sourceAggs: AggResult,
    keyPrefix: string,
  ) => {
    if (!hasRowAggs) return null;
    return rowAggregationsFor.flatMap((group: PivotAggregationConfig<any>, gi: number) =>
      group.measureKeys.map((measureKey: string, idx: number) => {
        const measure = measureByKey.get(measureKey);
        if (!measure) return null;
        const measureIndex = measureIndexByKey.get(measureKey) ?? -1;
        const key = `${keyPrefix}-${group.type}-${gi}-${measureKey}-${idx}`;
        const value = getAggValue(group.type, measureKey, measureIndex);
        const displayValue = getAggCellDisplayValue(
          group.type,
          value,
          measure,
          sourceAggs,
          measureIndex,
        );

        return (
          <td key={key} className={tableStyles.boltCell} title={String(displayValue)}>
            {displayValue}
          </td>
        );
      }),
    );
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

          {renderRowAggCells(
            (type, measureKey) =>
              computeSubRowAggregation(
                subRowCellMap,
                String(subRowValue),
                columnValues,
                measureKey,
                type,
              ),
            grandAggs,
            `sub-agg-${rowKey}-${subRowIdx}`,
          )}
        </tr>
      );
    });
  };

  const getColumnAggDisplayValue = (
    type: PivotAggregationType,
    value: number,
    measure: any,
  ): any => {
    if (type === 'sum' && measure.showAsPercentage) {
      return getPercentageDisplay(100, measure.percentageDecimalPlaces ?? 0);
    }
    return measure.accessor ? measure.accessor({ [measure.key]: value }) : value;
  };

  const renderColumnAggRow = (
    group: PivotAggregationConfig<any>,
    gi: number,
    rowsBelow: number,
  ) => {
    const groupLabel = aggLabels[group.type];
    const groupMeasureKeySet = new Set(group.measureKeys);

    return (
      <tr
        key={`col-agg-row-${group.type}-${gi}`}
        className={tableStyles.stickyLastRow}
        // Stack each total row above the one below it. `top: auto` disables top-sticking
        // so the rows only pin to the bottom edge. Cell height is fixed by the theme.
        style={{
          top: 'auto',
          bottom: `calc(var(--em-tablechart-cell-height, 2.5rem) * ${rowsBelow})`,
        }}
      >
        <th
          scope="row"
          className={clsx(tableStyles.stickyFirstColumn, tableStyles.boltCell)}
          title={groupLabel}
          style={getTableCellWidthStyle(firstColumnWidth)}
        >
          {groupLabel}
        </th>

        {columnValues.flatMap((columnValue) =>
          measures.map((measure, idx) => {
            const key = `col-agg-${group.type}-${gi}-${String(columnValue)}-${measure.key}-${idx}`;
            if (!groupMeasureKeySet.has(measure.key)) {
              return (
                <td key={key} className={tableStyles.boltCell}>
                  {''}
                </td>
              );
            }
            const mi = measureIndexByKey.get(String(measure.key)) ?? -1;
            const value = getAggregatedValue(
              colAggs,
              String(columnValue),
              mi,
              group.type,
              measures.length,
            );
            const displayValue = getColumnAggDisplayValue(group.type, value, measure);
            return (
              <td key={key} className={tableStyles.boltCell} title={String(displayValue)}>
                {displayValue}
              </td>
            );
          }),
        )}

        {hasRowAggs &&
          rowAggregationsFor.flatMap((rowGroup: PivotAggregationConfig<any>, rgi: number) =>
            rowGroup.measureKeys.map((measureKey: string, idx: number) => {
              const measure = measureByKey.get(measureKey);
              const measureIndex = measureIndexByKey.get(measureKey) ?? -1;
              const key = `grand-agg-${group.type}-${gi}-${rowGroup.type}-${rgi}-${measureKey}-${idx}`;
              const value = grandAggs[rowGroup.type][measureIndex] ?? 0;
              const displayValue = measure
                ? getColumnAggDisplayValue(rowGroup.type, value, measure)
                : value;
              return (
                <td key={key} className={tableStyles.boltCell} title={String(displayValue)}>
                  {displayValue}
                </td>
              );
            }),
          )}
      </tr>
    );
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
              {hasRowAggs &&
                rowAggregationsFor.map((group: PivotAggregationConfig<any>, gi: number) => {
                  const label = aggLabels[group.type];
                  const validCount = group.measureKeys.filter((k) => measureByKey.has(k)).length;
                  return (
                    <th
                      key={`agg-group-${group.type}-${gi}`}
                      scope="colgroup"
                      colSpan={validCount}
                      className={tableStyles.boltCell}
                      title={label}
                    >
                      {label}
                    </th>
                  );
                })}
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
              {hasRowAggs &&
                rowAggregationsFor.flatMap((group: PivotAggregationConfig<any>, gi: number) =>
                  group.measureKeys.map((measureKey: string, idx: number) => {
                    const measure = measureByKey.get(measureKey);
                    if (!measure) return null;
                    return (
                      <th
                        key={`agg-sub-${group.type}-${gi}-${measureKey}-${idx}`}
                        scope="col"
                        className={tableStyles.boltCell}
                        title={measure.label}
                        style={getTableCellWidthStyle(columnWidth)}
                      >
                        {measure.label}
                      </th>
                    );
                  }),
                )}
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
                  <tr
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
                      <span className={tableStyles.firstColumnCell}>
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
                      </span>
                    </th>

                    {renderMeasureCells(cellMap, String(row), `cell-${row}`)}

                    {renderRowAggCells(
                      (_type, _measureKey, measureIndex) =>
                        getAggregatedValue(
                          rowAggs,
                          String(row),
                          measureIndex,
                          _type,
                          measures.length,
                        ),
                      grandAggs,
                      `row-agg-${String(row)}`,
                    )}
                  </tr>

                  {showSubRows && renderSubRows(rowKey, subRows)}
                </Fragment>
              );
            })}

            {hasColumnAggs &&
              columnAggregationsFor.map((group: PivotAggregationConfig<any>, gi: number) =>
                // Every aggregation total row is sticky, stacked at the bottom: a row's
                // offset from the bottom equals the number of aggregation rows below it.
                renderColumnAggRow(group, gi, columnAggregationsFor.length - 1 - gi),
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
