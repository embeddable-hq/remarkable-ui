import { useMemo, useCallback } from 'react';
import tableStyles from '../tables.module.css';
import clsx from 'clsx';
import { HeatMapProps } from './HeatMap.types';
import {
  createColorForValue,
  getCellBackground,
  getCellColor,
  getCellDisplayValue,
  getCellValue,
  idOf,
  thresholdToRaw,
} from './HeatMap.utils';
import { getTableCellWidthStyle } from '../tables.utils';
import { getStyle } from '../../../../styles/styles.utils';

export const HeatMap = <T extends Record<string, unknown>>({
  data,
  showValues = false,
  className,
  columnDimension,
  rowDimension,
  measure,
  minThreshold,
  maxThreshold,
  minColor,
  midColor = getStyle('--em-tablechart-heatmap-color', '#FF5400'),
  maxColor,
  columnWidth,
  firstColumnWidth,
  displayNullAs,
}: HeatMapProps<T>) => {
  // 1. Get raw min/max from data
  const { rawMin, rawMax } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const d of data) {
      const value = getCellValue(d[measure.key], displayNullAs);

      if (value != null && typeof value === 'number' && Number.isFinite(value)) {
        if (value < min) min = value;
        if (value > max) max = value;
      }
    }
    if (!Number.isFinite(min) || !Number.isFinite(max)) return { rawMin: 0, rawMax: 0 };
    return { rawMin: min, rawMax: max };
  }, [data, measure.key, displayNullAs]);

  // 2. Resolve thresholds to a raw domain
  const { domainMin, domainMax } = useMemo(() => {
    const domMin = thresholdToRaw(minThreshold, rawMin, rawMax, rawMin);
    const domMax = thresholdToRaw(maxThreshold, rawMin, rawMax, rawMax);
    return domMin <= domMax
      ? { domainMin: domMin, domainMax: domMax }
      : { domainMin: domMax, domainMax: domMin };
  }, [minThreshold, maxThreshold, rawMin, rawMax]);

  const columnValues = useMemo(
    () =>
      Array.from(
        new Set(
          data
            .map((d) => d[columnDimension.key])
            .filter((v) => v != null)
            .map(idOf),
        ),
      ),
    [data, columnDimension.key],
  );

  const rowValues = useMemo(
    () =>
      Array.from(
        new Set(
          data
            .map((d) => d[rowDimension.key])
            .filter((v) => v != null)
            .map(idOf),
        ),
      ),
    [data, rowDimension.key],
  );

  // 3. Store data in a map for fast lookup
  const cellMap = useMemo(() => {
    const map = new Map<string, Map<string, Record<string, unknown>>>();
    for (const d of data) {
      const r = idOf(d[rowDimension.key]);
      const c = idOf(d[columnDimension.key]);
      if (!map.has(r)) map.set(r, new Map());
      map.get(r)!.set(c, d as Record<string, unknown>);
    }
    return map;
  }, [data, rowDimension.key, columnDimension.key]);

  // 4. Create color scale function
  const colorForValue = useCallback(
    (v: number) => {
      return createColorForValue({
        domainMin,
        domainMax,
        rawMin,
        rawMax,
        minColor,
        midColor,
        maxColor,
      })(v);
    },
    [domainMin, domainMax, rawMin, rawMax, minColor, midColor, maxColor],
  );

  return (
    <div className={clsx(tableStyles.tableFullContainer, className)}>
      <div
        className={clsx(
          tableStyles.tableAdjustedContainer,
          (!columnWidth || !firstColumnWidth) && tableStyles.fullWidth,
        )}
      >
        <table className={tableStyles.table} aria-label="Heat map">
          <thead>
            <tr>
              <th
                className={tableStyles.stickyFirstColumn}
                style={getTableCellWidthStyle(firstColumnWidth)}
              >
                {measure.label}
              </th>
              {columnValues.map((cv, index) => (
                <th key={`col-${cv}-${index}`} style={getTableCellWidthStyle(columnWidth)}>
                  {columnDimension.format ? columnDimension.format(cv) : cv}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rowValues.map((rv) => (
              <tr key={`row-${rv}`}>
                <th
                  scope="row"
                  className={tableStyles.stickyFirstColumn}
                  style={getTableCellWidthStyle(firstColumnWidth)}
                >
                  {rowDimension.format ? rowDimension.format(rv) : rv}
                </th>

                {columnValues.map((cv) => {
                  const obj = cellMap.get(rv)?.get(cv);
                  const value = getCellValue(obj?.[measure.key], displayNullAs);
                  const background = getCellBackground(value, colorForValue);
                  const color = getCellColor(background);

                  return (
                    <td
                      key={`cell-${rv}-${cv}`}
                      style={{
                        background,
                        color,
                        textAlign: 'center',
                        ...getTableCellWidthStyle(columnWidth),
                      }}
                    >
                      {getCellDisplayValue(value, showValues, measure)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
