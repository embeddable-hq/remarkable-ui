import { useEffect, useMemo, useState } from 'react';
import { PivotTablePropsMeasure } from './PivotTable.types';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const isNumber = (v: any) => typeof v === 'number' && !Number.isNaN(v);

export const getPercentageDisplay = (percentage: number, percentageDecimalPlaces: number) => {
  return `${percentage.toFixed(percentageDecimalPlaces)}%`;
};

export const getCellDisplayValue = (
  value: any,
  measure: PivotTablePropsMeasure<any>,
  dataObject: Record<string, any>,
  denominatorTotal: number,
): any => {
  if (measure.showAsPercentage) {
    if (isNumber(Number(value)) && isNumber(denominatorTotal) && denominatorTotal > 0) {
      return getPercentageDisplay(
        (value / denominatorTotal) * 100,
        measure.percentageDecimalPlaces ?? 0,
      );
    }
  }
  return measure.accessor ? measure.accessor(dataObject) : value;
};

export const buildCellMap = (
  rows: Record<string, any>[],
  rowKey: string,
  colKey: string,
): Map<string, Map<string, Record<string, any>>> => {
  const map = new Map<string, Map<string, Record<string, any>>>();
  for (const d of rows) {
    const r = String(d[rowKey]);
    const c = String(d[colKey]);
    if (!map.has(r)) map.set(r, new Map());
    map.get(r)!.set(c, d as Record<string, any>);
  }
  return map;
};

export const getMeasureTotal = (
  totalsMap: Map<string, number[]>,
  key: string,
  measureIndex: number,
  measuresCount: number,
): number => {
  const totals = totalsMap.get(key) ?? Array(measuresCount).fill(0);
  return measureIndex >= 0 ? (totals[measureIndex] ?? 0) : 0;
};

export const computeSubRowTotal = (
  cellMap: Map<string, Map<string, Record<string, any>>>,
  rowKey: string,
  columnValues: string[],
  measureKey: string,
): number => {
  let total = 0;
  for (const columnValue of columnValues) {
    const data = cellMap.get(rowKey)?.get(String(columnValue)) ?? {};
    const val = Number(data?.[measureKey]);
    if (!Number.isNaN(val)) total += val;
  }
  return total;
};

export const useProgressiveRows = (
  rowValues: string[],
  options: {
    progressive: boolean;
    batchSize: number;
    batchDelayMs: number;
  },
): string[] => {
  const { progressive, batchSize, batchDelayMs } = options;

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
    setVisibleCount(Math.min(batchSize, rowValues.length));

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
  }, [progressive, batchSize, batchDelayMs, rowValues.length]);

  return progressive ? rowValues.slice(0, visibleCount) : rowValues;
};

export const usePivotTotals = (
  data: any[],
  measures: PivotTablePropsMeasure<any>[],
  rowDimensionKey: string,
  columnDimensionKey: string,
  columnValues: string[],
  rowValues: string[],
) => {
  return useMemo(() => {
    const cTotals = new Map<string, number[]>();
    const rTotals = new Map<string, number[]>();
    const gTotals = measures.map(() => 0);

    for (const d of data) {
      const r = String(d[rowDimensionKey]);
      const c = String(d[columnDimensionKey]);
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
  }, [data, measures, rowDimensionKey, columnDimensionKey, columnValues, rowValues]);
};
