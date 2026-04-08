import { describe, expect, it } from 'vitest';
import { pointHasNullMeasure } from './scatter.utils';
import type { ScatterChartInputPoint } from './scatter.types';

describe('pointHasNullMeasure', () => {
  it('treats (no value, value) and (value, no value) as null-measure opacity cases', () => {
    expect(pointHasNullMeasure({ x: null, y: 18 })).toBe(true);
    expect(pointHasNullMeasure({ x: 52, y: null })).toBe(true);
  });

  it('uses full opacity only when both coordinates are finite numbers', () => {
    expect(pointHasNullMeasure({ x: 40, y: 25 })).toBe(false);
  });

  it('matches null-band semantics for undefined (runtime / loose data)', () => {
    expect(pointHasNullMeasure({ x: undefined, y: 5 } as unknown as ScatterChartInputPoint)).toBe(
      true,
    );
    expect(pointHasNullMeasure({ x: 3, y: undefined } as unknown as ScatterChartInputPoint)).toBe(
      true,
    );
  });

  it('treats both null as null measure', () => {
    expect(pointHasNullMeasure({ x: null, y: null })).toBe(true);
  });

  it('supports legacy isNull', () => {
    expect(pointHasNullMeasure({ x: 1, y: 2, isNull: true })).toBe(true);
  });

  it('treats NaN as missing', () => {
    expect(pointHasNullMeasure({ x: NaN, y: 1 })).toBe(true);
  });
});
