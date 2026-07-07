import { useEffect, useMemo, useState } from 'react';
import { PivotAggregationType, PivotTablePropsMeasure } from './PivotTable.types';

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

export const AGG_DEFAULT_LABELS: Record<PivotAggregationType, string> = {
  sum: 'Sum',
  min: 'Min',
  max: 'Max',
  average: 'Average',
};

export type AggResult = {
  sum: number[];
  min: number[];
  max: number[];
  average: number[];
};

type AggAccumulator = {
  sum: number[];
  count: number[];
  min: number[];
  max: number[];
};

const makeAccumulator = (len: number): AggAccumulator => ({
  sum: new Array(len).fill(0),
  count: new Array(len).fill(0),
  min: new Array(len).fill(Infinity),
  max: new Array(len).fill(-Infinity),
});

const finaliseAccumulator = (acc: AggAccumulator): AggResult => ({
  sum: acc.sum,
  min: acc.min.map((v) => (v === Infinity ? 0 : v)),
  max: acc.max.map((v) => (v === -Infinity ? 0 : v)),
  average: acc.sum.map((s, i) => (acc.count[i]! > 0 ? s / acc.count[i]! : 0)),
});

export const getAggregatedValue = (
  aggsMap: Map<string, AggResult>,
  key: string,
  measureIndex: number,
  type: PivotAggregationType,
  measuresCount: number,
): number => {
  const result = aggsMap.get(key);
  if (!result) return 0;
  const arr = result[type];
  return measureIndex >= 0 && measureIndex < measuresCount ? (arr[measureIndex] ?? 0) : 0;
};

export const computeSubRowAggregation = (
  cellMap: Map<string, Map<string, Record<string, any>>>,
  rowKey: string,
  columnValues: string[],
  measureKey: string,
  type: PivotAggregationType,
): number => {
  const values: number[] = [];
  for (const columnValue of columnValues) {
    const data = cellMap.get(rowKey)?.get(String(columnValue)) ?? {};
    const raw = data?.[measureKey];
    const val = raw == null ? NaN : Number(raw);
    if (!Number.isNaN(val)) values.push(val);
  }
  if (values.length === 0) return 0;
  switch (type) {
    case 'sum':
      return values.reduce((a, b) => a + b, 0);
    case 'min':
      return Math.min(...values);
    case 'max':
      return Math.max(...values);
    case 'average':
      return values.reduce((a, b) => a + b, 0) / values.length;
  }
};

export const usePivotAggregations = (
  data: any[],
  measures: PivotTablePropsMeasure<any>[],
  rowDimensionKey: string,
  columnDimensionKey: string,
  columnValues: string[],
  rowValues: string[],
) => {
  return useMemo(() => {
    const cAccs = new Map<string, AggAccumulator>();
    const rAccs = new Map<string, AggAccumulator>();
    const gAcc = makeAccumulator(measures.length);

    for (const d of data) {
      const r = String(d[rowDimensionKey]);
      const c = String(d[columnDimensionKey]);

      if (!cAccs.has(c)) cAccs.set(c, makeAccumulator(measures.length));
      if (!rAccs.has(r)) rAccs.set(r, makeAccumulator(measures.length));

      const cAcc = cAccs.get(c)!;
      const rAcc = rAccs.get(r)!;

      measures.forEach((m, i) => {
        const raw = (d as any)?.[m.key];
        const v = raw == null ? NaN : Number(raw);
        if (!Number.isNaN(v)) {
          cAcc.sum[i]! += v;
          cAcc.count[i]!++;
          cAcc.min[i] = Math.min(cAcc.min[i]!, v);
          cAcc.max[i] = Math.max(cAcc.max[i]!, v);

          rAcc.sum[i]! += v;
          rAcc.count[i]!++;
          rAcc.min[i] = Math.min(rAcc.min[i]!, v);
          rAcc.max[i] = Math.max(rAcc.max[i]!, v);

          gAcc.sum[i]! += v;
          gAcc.count[i]!++;
          gAcc.min[i] = Math.min(gAcc.min[i]!, v);
          gAcc.max[i] = Math.max(gAcc.max[i]!, v);
        }
      });
    }

    for (const c of columnValues) {
      if (!cAccs.has(String(c))) cAccs.set(String(c), makeAccumulator(measures.length));
    }
    for (const r of rowValues) {
      if (!rAccs.has(String(r))) rAccs.set(String(r), makeAccumulator(measures.length));
    }

    const colAggs = new Map<string, AggResult>();
    const rowAggs = new Map<string, AggResult>();
    cAccs.forEach((acc, key) => colAggs.set(key, finaliseAccumulator(acc)));
    rAccs.forEach((acc, key) => rowAggs.set(key, finaliseAccumulator(acc)));

    return { colAggs, rowAggs, grandAggs: finaliseAccumulator(gAcc) };
  }, [data, measures, rowDimensionKey, columnDimensionKey, columnValues, rowValues]);
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

  // Reset count when the data length or progressive flag changes.
  useEffect(() => {
    setVisibleCount(progressive ? Math.min(batchSize, rowValues.length) : rowValues.length);
  }, [progressive, batchSize, rowValues.length]);

  // Schedule the next batch only when more rows are waiting.
  // Keeps setTimeout out of the state updater so it isn't called multiple
  // times if React replays the updater in concurrent mode.
  useEffect(() => {
    if (!progressive || visibleCount >= rowValues.length) return;

    const t = window.setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + batchSize, rowValues.length));
    }, batchDelayMs);

    return () => window.clearTimeout(t);
  }, [progressive, visibleCount, rowValues.length, batchSize, batchDelayMs]);

  return progressive ? rowValues.slice(0, visibleCount) : rowValues;
};
