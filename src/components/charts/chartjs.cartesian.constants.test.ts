import { describe, expect, it } from 'vitest';
import { getSmallIntegerAxisStepSize } from './chartjs.cartesian.constants';

describe('getSmallIntegerAxisStepSize', () => {
  it('returns 1 when all values are integers and max < 8', () => {
    const result = getSmallIntegerAxisStepSize([{ data: [1, 2, 3] }]);
    expect(result).toBe(1);
  });

  it('returns undefined when max >= 8', () => {
    const result = getSmallIntegerAxisStepSize([{ data: [1, 2, 8] }]);
    expect(result).toBeUndefined();
  });

  it('returns undefined when max > 8', () => {
    const result = getSmallIntegerAxisStepSize([{ data: [1, 2, 10] }]);
    expect(result).toBeUndefined();
  });

  it('returns undefined when any value is a decimal', () => {
    const result = getSmallIntegerAxisStepSize([{ data: [1.5, 2, 3] }]);
    expect(result).toBeUndefined();
  });

  it('returns undefined when datasets is undefined', () => {
    const result = getSmallIntegerAxisStepSize(undefined);
    expect(result).toBeUndefined();
  });

  it('returns undefined when datasets is empty', () => {
    const result = getSmallIntegerAxisStepSize([]);
    expect(result).toBeUndefined();
  });

  it('returns undefined when all datasets have no numeric values', () => {
    const result = getSmallIntegerAxisStepSize([{ data: [] }]);
    expect(result).toBeUndefined();
  });

  it('works with multiple datasets - returns 1 when all values across datasets are integers and max < 8', () => {
    const result = getSmallIntegerAxisStepSize([{ data: [1, 2] }, { data: [3, 4] }]);
    expect(result).toBe(1);
  });

  it('works with multiple datasets - returns undefined when any dataset has a decimal', () => {
    const result = getSmallIntegerAxisStepSize([{ data: [1, 2] }, { data: [3, 4.5] }]);
    expect(result).toBeUndefined();
  });

  it('works with multiple datasets - returns undefined when combined max >= 8', () => {
    const result = getSmallIntegerAxisStepSize([{ data: [1, 2] }, { data: [3, 9] }]);
    expect(result).toBeUndefined();
  });
});
