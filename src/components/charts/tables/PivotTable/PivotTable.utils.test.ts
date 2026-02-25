import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  isNumber,
  getPercentageDisplay,
  buildCellMap,
  getMeasureTotal,
  computeSubRowTotal,
  getCellDisplayValue,
  useProgressiveRows,
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

describe('getMeasureTotal', () => {
  it('retrieves the correct total for a given key and measure index', () => {
    const totalsMap = new Map([['North', [100, 200, 300]]]);

    expect(getMeasureTotal(totalsMap, 'North', 0, 3)).toBe(100);
    expect(getMeasureTotal(totalsMap, 'North', 1, 3)).toBe(200);
    expect(getMeasureTotal(totalsMap, 'North', 2, 3)).toBe(300);
  });

  it('returns 0 when key is not in the map', () => {
    const totalsMap = new Map<string, number[]>();

    expect(getMeasureTotal(totalsMap, 'Missing', 0, 2)).toBe(0);
  });

  it('returns 0 when measureIndex is negative', () => {
    const totalsMap = new Map([['North', [100]]]);

    expect(getMeasureTotal(totalsMap, 'North', -1, 1)).toBe(0);
  });

  it('returns 0 when measureIndex exceeds the array length', () => {
    const totalsMap = new Map([['North', [100]]]);

    expect(getMeasureTotal(totalsMap, 'North', 5, 2)).toBe(0);
  });
});

describe('computeSubRowTotal', () => {
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

  it('sums numeric values across column values for a row key', () => {
    expect(computeSubRowTotal(cellMap, 'North', ['Q1', 'Q2', 'Q3'], 'sales')).toBe(450);
  });

  it('sums only the specified columns', () => {
    expect(computeSubRowTotal(cellMap, 'North', ['Q1', 'Q2'], 'sales')).toBe(300);
  });

  it('returns 0 for a row key not in the map', () => {
    expect(computeSubRowTotal(cellMap, 'South', ['Q1', 'Q2'], 'sales')).toBe(0);
  });

  it('skips NaN values in the sum', () => {
    const mapWithNaN = new Map([
      [
        'East',
        new Map([
          ['Q1', { sales: 'N/A' }],
          ['Q2', { sales: 100 }],
        ]),
      ],
    ]);

    expect(computeSubRowTotal(mapWithNaN, 'East', ['Q1', 'Q2'], 'sales')).toBe(100);
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
