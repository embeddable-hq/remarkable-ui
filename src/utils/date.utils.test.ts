import { describe, expect, it } from 'vitest';
import { isSameDate, isSameDateRange, endOfDayUTC } from './date.utils';

describe('isSameDate', () => {
  it('returns true for two identical dates', () => {
    const date = new Date('2024-01-15T10:00:00Z');
    expect(isSameDate(date, new Date('2024-01-15T10:00:00Z'))).toBe(true);
  });

  it('returns false for two different dates', () => {
    expect(isSameDate(new Date('2024-01-15'), new Date('2024-01-16'))).toBe(false);
  });

  it('returns true when both are undefined', () => {
    expect(isSameDate(undefined, undefined)).toBe(true);
  });

  it('returns false when only one is undefined', () => {
    expect(isSameDate(new Date('2024-01-15'), undefined)).toBe(false);
    expect(isSameDate(undefined, new Date('2024-01-15'))).toBe(false);
  });
});

describe('isSameDateRange', () => {
  it('returns true for two identical ranges', () => {
    const a = { from: new Date('2024-01-01'), to: new Date('2024-01-31') };
    const b = { from: new Date('2024-01-01'), to: new Date('2024-01-31') };
    expect(isSameDateRange(a, b)).toBe(true);
  });

  it('returns false when from dates differ', () => {
    const a = { from: new Date('2024-01-01'), to: new Date('2024-01-31') };
    const b = { from: new Date('2024-01-02'), to: new Date('2024-01-31') };
    expect(isSameDateRange(a, b)).toBe(false);
  });

  it('returns false when to dates differ', () => {
    const a = { from: new Date('2024-01-01'), to: new Date('2024-01-31') };
    const b = { from: new Date('2024-01-01'), to: new Date('2024-02-01') };
    expect(isSameDateRange(a, b)).toBe(false);
  });

  it('returns true when both are undefined', () => {
    expect(isSameDateRange(undefined, undefined)).toBe(true);
  });

  it('returns false when only one is undefined', () => {
    const range = { from: new Date('2024-01-01'), to: new Date('2024-01-31') };
    expect(isSameDateRange(range, undefined)).toBe(false);
    expect(isSameDateRange(undefined, range)).toBe(false);
  });

  it('returns true for ranges where both to fields are undefined', () => {
    const a = { from: new Date('2024-01-01') };
    const b = { from: new Date('2024-01-01') };
    expect(isSameDateRange(a, b)).toBe(true);
  });
});

describe('endOfDayUTC', () => {
  it('sets time to 23:59:59.999 UTC', () => {
    const date = new Date('2024-06-15T08:30:00Z');
    const result = endOfDayUTC(date);
    expect(result.getUTCHours()).toBe(23);
    expect(result.getUTCMinutes()).toBe(59);
    expect(result.getUTCSeconds()).toBe(59);
    expect(result.getUTCMilliseconds()).toBe(999);
  });

  it('preserves the date', () => {
    const date = new Date('2024-06-15T08:30:00Z');
    const result = endOfDayUTC(date);
    expect(result.getUTCFullYear()).toBe(2024);
    expect(result.getUTCMonth()).toBe(5);
    expect(result.getUTCDate()).toBe(15);
  });

  it('does not mutate the original date', () => {
    const date = new Date('2024-06-15T08:30:00Z');
    const original = date.getTime();
    endOfDayUTC(date);
    expect(date.getTime()).toBe(original);
  });
});
