import { describe, expect, it } from 'vitest';
import { shallowEqual } from './object.utils';

describe('shallowEqual', () => {
  it('returns true for two identical objects', () => {
    expect(shallowEqual({ a: 1, b: 'x' }, { a: 1, b: 'x' })).toBe(true);
  });

  it('returns false when values differ', () => {
    expect(shallowEqual({ a: 1 }, { a: 2 })).toBe(false);
  });

  it('returns false when key counts differ', () => {
    expect(shallowEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
  });

  it('returns true for two empty objects', () => {
    expect(shallowEqual({}, {})).toBe(true);
  });

  it('returns true when both are null', () => {
    expect(shallowEqual(null, null)).toBe(true);
  });

  it('returns true when both are undefined', () => {
    expect(shallowEqual(undefined, undefined)).toBe(true);
  });

  it('returns false when one is null and the other has keys', () => {
    expect(shallowEqual(null, { a: 1 })).toBe(false);
    expect(shallowEqual({ a: 1 }, null)).toBe(false);
  });

  it('returns true for objects with the same numeric values as strings', () => {
    expect(shallowEqual({ a: 1 }, { a: '1' })).toBe(true);
  });

  it('returns false when a key is present in one but not the other', () => {
    expect(shallowEqual({ a: 1, b: 2 }, { a: 1, c: 2 })).toBe(false);
  });
});
