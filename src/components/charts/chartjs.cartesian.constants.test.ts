import { describe, expect, it } from 'vitest';
import { getIntegerAxisTickCallback } from './chartjs.cartesian.constants';

describe('getIntegerAxisTickCallback', () => {
  it('returns a function when all values are integers', () => {
    const result = getIntegerAxisTickCallback([{ data: [1, 2, 3] }]);
    expect(typeof result).toBe('function');
  });

  it('returns a function for large integer ranges (no threshold)', () => {
    const result = getIntegerAxisTickCallback([{ data: [1, 2, 100] }]);
    expect(typeof result).toBe('function');
  });

  it('returns undefined when any value is a decimal', () => {
    const result = getIntegerAxisTickCallback([{ data: [1.5, 2, 3] }]);
    expect(result).toBeUndefined();
  });

  it('returns undefined when datasets is undefined', () => {
    const result = getIntegerAxisTickCallback(undefined);
    expect(result).toBeUndefined();
  });

  it('returns undefined when datasets is empty', () => {
    const result = getIntegerAxisTickCallback([]);
    expect(result).toBeUndefined();
  });

  it('returns undefined when all datasets have no numeric values', () => {
    const result = getIntegerAxisTickCallback([{ data: [] }]);
    expect(result).toBeUndefined();
  });

  it('the returned callback returns the value for integer ticks', () => {
    const callback = getIntegerAxisTickCallback([{ data: [1, 2, 3] }])!;
    expect(callback(2)).toBe(2);
    expect(callback(0)).toBe(0);
  });

  it('the returned callback returns null for non-integer ticks', () => {
    const callback = getIntegerAxisTickCallback([{ data: [1, 2, 3] }])!;
    expect(callback(1.5)).toBeNull();
    expect(callback(2.33)).toBeNull();
  });

  it('works with multiple datasets - returns a function when all values across datasets are integers', () => {
    const result = getIntegerAxisTickCallback([{ data: [1, 2] }, { data: [3, 4] }]);
    expect(typeof result).toBe('function');
  });

  it('works with multiple datasets - returns undefined when any dataset has a decimal', () => {
    const result = getIntegerAxisTickCallback([{ data: [1, 2] }, { data: [3, 4.5] }]);
    expect(result).toBeUndefined();
  });
});
