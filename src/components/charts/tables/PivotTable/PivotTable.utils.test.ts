import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  isNumber,
  getPercentageDisplay,
  buildCellMap,
  getAggregatedValue,
  computeSubRowAggregation,
  getCellDisplayValue,
  useProgressiveRows,
  usePivotAggregations,
  AGG_DEFAULT_LABELS,
} from './PivotTable.utils';

describe('isNumber', () => {
  it('returns true for a regular number', () => {
    expect(isNumber(42)).toBe(true);
  });

  it('returns true for 0', () => {
    expect(isNumber(0)).toBe(true);
  });

  it('returns true for negative numbers', () => {
    expect(isNumber(-5)).toBe(true);
  });

  it('returns false for NaN', () => {
    expect(isNumber(NaN)).toBe(false);
  });

  it('returns false for a string', () => {
    expect(isNumber('42')).toBe(false);
  });

  it('returns false for null', () => {
    expect(isNumber(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isNumber(undefined)).toBe(false);
  });
});

describe('getPercentageDisplay', () => {
  it('formats a percentage with specified decimal places', () => {
    expect(getPercentageDisplay(25, 1)).toBe('25.0%');
  });

  it('formats with 0 decimal places', () => {
    expect(getPercentageDisplay(33.333, 0)).toBe('33%');
  });

  it('formats with 2 decimal places', () => {
    expect(getPercentageDisplay(12.345, 2)).toBe('12.35%');
  });

  it('appends the % symbol', () => {
    expect(getPercentageDisplay(100, 0)).toBe('100%');
  });
});

describe('buildCellMap', () => {
  const rows = [
    { region: 'North', product: 'A', sales: 100 },
    { region: 'North', product: 'B', sales: 200 },
    { region: 'South', product: 'A', sales: 150 },
  ];

  it('creates a map keyed by row dimension', () => {
    const map = buildCellMap(rows, 'region', 'product');

    expect(map.has('North')).toBe(true);
    expect(map.has('South')).toBe(true);
  });

  it('creates nested maps keyed by column dimension', () => {
    const map = buildCellMap(rows, 'region', 'product');

    expect(map.get('North')?.has('A')).toBe(true);
    expect(map.get('North')?.has('B')).toBe(true);
    expect(map.get('South')?.has('A')).toBe(true);
  });

  it('stores the full row data object in each cell', () => {
    const map = buildCellMap(rows, 'region', 'product');

    expect(map.get('North')?.get('A')).toEqual({ region: 'North', product: 'A', sales: 100 });
  });

  it('returns an empty map for empty rows array', () => {
    const map = buildCellMap([], 'region', 'product');

    expect(map.size).toBe(0);
  });

  it('overwrites duplicate row+column combinations with the last entry', () => {
    const duplicateRows = [
      { region: 'North', product: 'A', sales: 100 },
      { region: 'North', product: 'A', sales: 999 },
    ];
    const map = buildCellMap(duplicateRows, 'region', 'product');

    expect(map.get('North')?.get('A')?.sales).toBe(999);
  });
});

describe('AGG_DEFAULT_LABELS', () => {
  it('provides a human-readable label for each aggregation type', () => {
    expect(AGG_DEFAULT_LABELS.sum).toBe('Sum');
    expect(AGG_DEFAULT_LABELS.min).toBe('Min');
    expect(AGG_DEFAULT_LABELS.max).toBe('Max');
    expect(AGG_DEFAULT_LABELS.average).toBe('Average');
  });
});

describe('getAggregatedValue', () => {
  const makeResult = (sum: number, min: number, max: number, average: number) => ({
    sum: [sum],
    min: [min],
    max: [max],
    average: [average],
  });

  it('retrieves sum for a given key and measure index', () => {
    const aggsMap = new Map([['North', makeResult(300, 100, 200, 150)]]);
    expect(getAggregatedValue(aggsMap, 'North', 0, 'sum', 1)).toBe(300);
  });

  it('retrieves min correctly', () => {
    const aggsMap = new Map([['North', makeResult(300, 100, 200, 150)]]);
    expect(getAggregatedValue(aggsMap, 'North', 0, 'min', 1)).toBe(100);
  });

  it('retrieves max correctly', () => {
    const aggsMap = new Map([['North', makeResult(300, 100, 200, 150)]]);
    expect(getAggregatedValue(aggsMap, 'North', 0, 'max', 1)).toBe(200);
  });

  it('retrieves average correctly', () => {
    const aggsMap = new Map([['North', makeResult(300, 100, 200, 150)]]);
    expect(getAggregatedValue(aggsMap, 'North', 0, 'average', 1)).toBe(150);
  });

  it('returns 0 when key is not in the map', () => {
    const aggsMap = new Map<string, ReturnType<typeof makeResult>>();
    expect(getAggregatedValue(aggsMap, 'Missing', 0, 'sum', 1)).toBe(0);
  });

  it('returns 0 when measureIndex is negative', () => {
    const aggsMap = new Map([['North', makeResult(300, 100, 200, 150)]]);
    expect(getAggregatedValue(aggsMap, 'North', -1, 'sum', 1)).toBe(0);
  });

  it('returns 0 when measureIndex exceeds array length', () => {
    const aggsMap = new Map([['North', makeResult(300, 100, 200, 150)]]);
    expect(getAggregatedValue(aggsMap, 'North', 5, 'sum', 1)).toBe(0);
  });
});

describe('computeSubRowAggregation', () => {
  const cellMap = new Map([
    [
      'North',
      new Map([
        ['Q1', { region: 'North', quarter: 'Q1', sales: 100 }],
        ['Q2', { region: 'North', quarter: 'Q2', sales: 200 }],
        ['Q3', { region: 'North', quarter: 'Q3', sales: 150 }],
      ]),
    ],
  ]);

  it('sums values across column values for a row key', () => {
    expect(computeSubRowAggregation(cellMap, 'North', ['Q1', 'Q2', 'Q3'], 'sales', 'sum')).toBe(
      450,
    );
  });

  it('returns the minimum value across column values', () => {
    expect(computeSubRowAggregation(cellMap, 'North', ['Q1', 'Q2', 'Q3'], 'sales', 'min')).toBe(
      100,
    );
  });

  it('returns the maximum value across column values', () => {
    expect(computeSubRowAggregation(cellMap, 'North', ['Q1', 'Q2', 'Q3'], 'sales', 'max')).toBe(
      200,
    );
  });

  it('returns the average of values across column values', () => {
    expect(computeSubRowAggregation(cellMap, 'North', ['Q1', 'Q2', 'Q3'], 'sales', 'average')).toBe(
      150,
    );
  });

  it('sums only the specified columns', () => {
    expect(computeSubRowAggregation(cellMap, 'North', ['Q1', 'Q2'], 'sales', 'sum')).toBe(300);
  });

  it('returns 0 for a row key not in the map', () => {
    expect(computeSubRowAggregation(cellMap, 'South', ['Q1', 'Q2'], 'sales', 'sum')).toBe(0);
  });

  it('skips NaN values in the computation', () => {
    const mapWithNaN = new Map([
      [
        'East',
        new Map([
          ['Q1', { sales: 'N/A' }],
          ['Q2', { sales: 100 }],
        ]),
      ],
    ]);

    expect(computeSubRowAggregation(mapWithNaN, 'East', ['Q1', 'Q2'], 'sales', 'sum')).toBe(100);
    expect(computeSubRowAggregation(mapWithNaN, 'East', ['Q1', 'Q2'], 'sales', 'min')).toBe(100);
    expect(computeSubRowAggregation(mapWithNaN, 'East', ['Q1', 'Q2'], 'sales', 'max')).toBe(100);
    expect(computeSubRowAggregation(mapWithNaN, 'East', ['Q1', 'Q2'], 'sales', 'average')).toBe(
      100,
    );
  });
});

describe('usePivotAggregations', () => {
  const data = [
    { country: 'US', month: 'Jan', revenue: 100 },
    { country: 'US', month: 'Feb', revenue: 120 },
    { country: 'UK', month: 'Jan', revenue: 80 },
    { country: 'UK', month: 'Feb', revenue: 90 },
  ];
  const measures = [{ key: 'revenue' as const, label: 'Revenue' }];
  const rowKey = 'country';
  const colKey = 'month';
  const columnValues = ['Jan', 'Feb'];
  const rowValues = ['US', 'UK'];

  it('computes row sums correctly', () => {
    const { result } = renderHook(() =>
      usePivotAggregations(data, measures, rowKey, colKey, columnValues, rowValues),
    );

    expect(result.current.rowAggs.get('US')?.sum[0]).toBe(220);
    expect(result.current.rowAggs.get('UK')?.sum[0]).toBe(170);
  });

  it('computes column sums correctly', () => {
    const { result } = renderHook(() =>
      usePivotAggregations(data, measures, rowKey, colKey, columnValues, rowValues),
    );

    expect(result.current.colAggs.get('Jan')?.sum[0]).toBe(180);
    expect(result.current.colAggs.get('Feb')?.sum[0]).toBe(210);
  });

  it('computes grand sum correctly', () => {
    const { result } = renderHook(() =>
      usePivotAggregations(data, measures, rowKey, colKey, columnValues, rowValues),
    );

    expect(result.current.grandAggs.sum[0]).toBe(390);
  });

  it('computes row min correctly', () => {
    const { result } = renderHook(() =>
      usePivotAggregations(data, measures, rowKey, colKey, columnValues, rowValues),
    );

    expect(result.current.rowAggs.get('US')?.min[0]).toBe(100);
    expect(result.current.rowAggs.get('UK')?.min[0]).toBe(80);
  });

  it('computes row max correctly', () => {
    const { result } = renderHook(() =>
      usePivotAggregations(data, measures, rowKey, colKey, columnValues, rowValues),
    );

    expect(result.current.rowAggs.get('US')?.max[0]).toBe(120);
    expect(result.current.rowAggs.get('UK')?.max[0]).toBe(90);
  });

  it('computes row average correctly', () => {
    const { result } = renderHook(() =>
      usePivotAggregations(data, measures, rowKey, colKey, columnValues, rowValues),
    );

    expect(result.current.rowAggs.get('US')?.average[0]).toBe(110);
    expect(result.current.rowAggs.get('UK')?.average[0]).toBe(85);
  });

  it('computes grand average correctly', () => {
    const { result } = renderHook(() =>
      usePivotAggregations(data, measures, rowKey, colKey, columnValues, rowValues),
    );

    expect(result.current.grandAggs.average[0]).toBe(97.5);
  });

  it('initialises missing row keys with zero values', () => {
    const { result } = renderHook(() =>
      usePivotAggregations([], measures, rowKey, colKey, columnValues, ['FR']),
    );

    expect(result.current.rowAggs.get('FR')?.sum[0]).toBe(0);
    expect(result.current.rowAggs.get('FR')?.min[0]).toBe(0);
    expect(result.current.rowAggs.get('FR')?.max[0]).toBe(0);
    expect(result.current.rowAggs.get('FR')?.average[0]).toBe(0);
  });

  it('initialises missing column keys with zero values', () => {
    const { result } = renderHook(() =>
      usePivotAggregations([], measures, rowKey, colKey, ['Mar'], rowValues),
    );

    expect(result.current.colAggs.get('Mar')?.sum[0]).toBe(0);
  });
});

describe('getCellDisplayValue (PivotTable)', () => {
  const rawMeasure = { key: 'sales' as const, label: 'Sales' };

  it('returns the raw value when showAsPercentage is false', () => {
    expect(getCellDisplayValue(50, rawMeasure, { sales: 50 }, 200)).toBe(50);
  });

  it('returns percentage string when showAsPercentage is true and denominator > 0', () => {
    const measure = { ...rawMeasure, showAsPercentage: true };

    expect(getCellDisplayValue(50, measure, { sales: 50 }, 200)).toBe('25%');
  });

  it('respects percentageDecimalPlaces', () => {
    const measure = { ...rawMeasure, showAsPercentage: true, percentageDecimalPlaces: 2 };

    expect(getCellDisplayValue(1, measure, { sales: 1 }, 3)).toBe('33.33%');
  });

  it('returns raw value when showAsPercentage is true but denominator is 0', () => {
    const measure = { ...rawMeasure, showAsPercentage: true };

    expect(getCellDisplayValue(50, measure, { sales: 50 }, 0)).toBe(50);
  });

  it('uses accessor when provided and showAsPercentage is false', () => {
    const measure = {
      ...rawMeasure,
      accessor: (row: Record<string, unknown>) => `$${row.sales}`,
    };

    expect(getCellDisplayValue(50, measure, { sales: 50 }, 200)).toBe('$50');
  });
});

describe('useProgressiveRows', () => {
  it('returns all rows immediately when progressive is false', () => {
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const { result } = renderHook(() =>
      useProgressiveRows(rows, { progressive: false, batchSize: 2, batchDelayMs: 100 }),
    );

    expect(result.current).toEqual(rows);
  });

  it('returns only the first batchSize rows initially when progressive is true', () => {
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const { result } = renderHook(() =>
      useProgressiveRows(rows, { progressive: true, batchSize: 2, batchDelayMs: 100 }),
    );

    expect(result.current).toEqual(['A', 'B']);
  });

  it('returns all rows when batchSize exceeds total rows in progressive mode', () => {
    const rows = ['A', 'B'];
    const { result } = renderHook(() =>
      useProgressiveRows(rows, { progressive: true, batchSize: 10, batchDelayMs: 100 }),
    );

    expect(result.current).toEqual(['A', 'B']);
  });

  it('returns empty array for empty rows', () => {
    const { result } = renderHook(() =>
      useProgressiveRows([], { progressive: false, batchSize: 5, batchDelayMs: 100 }),
    );

    expect(result.current).toEqual([]);
  });
});
