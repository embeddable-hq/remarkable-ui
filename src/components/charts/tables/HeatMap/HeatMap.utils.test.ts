import { describe, expect, it } from 'vitest';
import {
  idOf,
  lerpColor,
  getCellColor,
  thresholdToRaw,
  getCellValue,
  getCellBackground,
  getCellDisplayValue,
  createColorForValue,
} from './HeatMap.utils';

describe('idOf', () => {
  it('converts a number to string', () => {
    expect(idOf(42)).toBe('42');
  });

  it('converts a string to string', () => {
    expect(idOf('hello')).toBe('hello');
  });

  it('converts null to empty string', () => {
    expect(idOf(null)).toBe('');
  });

  it('converts undefined to empty string', () => {
    expect(idOf(undefined)).toBe('');
  });

  it('converts 0 to "0"', () => {
    expect(idOf(0)).toBe('0');
  });
});

describe('lerpColor', () => {
  it('returns the start color at t=0', () => {
    expect(lerpColor('#ff0000', '#0000ff', 0)).toBe('#ff0000');
  });

  it('returns the end color at t=1', () => {
    expect(lerpColor('#ff0000', '#0000ff', 1)).toBe('#0000ff');
  });

  it('interpolates to a midpoint color at t=0.5', () => {
    const result = lerpColor('#000000', '#ffffff', 0.5);
    expect(result).toBe('#808080');
  });

  it('handles short hex colors', () => {
    const result = lerpColor('#fff', '#000', 0);
    expect(result).toBe('#ffffff');
  });
});

describe('getCellColor', () => {
  it('returns white text color for dark backgrounds', () => {
    expect(getCellColor('#000000')).toBe('#FFFFFF');
  });

  it('returns dark text color for light backgrounds', () => {
    expect(getCellColor('#ffffff')).toBe('#212129');
  });

  it('returns white text color for medium-dark backgrounds', () => {
    expect(getCellColor('#333333')).toBe('#FFFFFF');
  });

  it('returns dark text color for medium-light backgrounds', () => {
    expect(getCellColor('#dddddd')).toBe('#212129');
  });
});

describe('thresholdToRaw', () => {
  it('returns a numeric threshold directly', () => {
    expect(thresholdToRaw(50, 0, 100, 0)).toBe(50);
  });

  it('converts a percentage string to a raw value', () => {
    expect(thresholdToRaw('50%', 0, 100, 0)).toBe(50);
  });

  it('converts a percentage string relative to the range', () => {
    expect(thresholdToRaw('25%', 0, 200, 0)).toBe(50);
  });

  it('returns the fallback when threshold is null', () => {
    expect(thresholdToRaw(null as unknown as undefined, 0, 100, 25)).toBe(25);
  });

  it('returns the fallback when threshold is undefined', () => {
    expect(thresholdToRaw(undefined, 0, 100, 25)).toBe(25);
  });

  it('handles a numeric string without %', () => {
    expect(thresholdToRaw('75' as unknown as number, 0, 100, 0)).toBe(75);
  });

  it('returns the fallback for invalid string input', () => {
    expect(thresholdToRaw('invalid' as unknown as number, 0, 100, 42)).toBe(42);
  });

  it('clamps percentage strings to 0..1', () => {
    expect(thresholdToRaw('150%', 0, 100, 0)).toBe(100);
  });
});

describe('getCellValue', () => {
  it('returns a numeric value as a number', () => {
    expect(getCellValue(42, undefined)).toBe(42);
  });

  it('returns a numeric string as a number', () => {
    expect(getCellValue('3.14', undefined)).toBe(3.14);
  });

  it('returns a non-numeric string as-is', () => {
    expect(getCellValue('hello', undefined)).toBe('hello');
  });

  it('uses displayNullAs string when value is null', () => {
    expect(getCellValue(null, 'N/A')).toBe('N/A');
  });

  it('coerces a numeric displayNullAs to a number when value is null', () => {
    expect(getCellValue(null, '0')).toBe(0);
  });

  it('returns undefined when value is null and no displayNullAs', () => {
    expect(getCellValue(null, undefined)).toBeUndefined();
  });
});

describe('getCellBackground', () => {
  it('returns the default cell background color for non-numeric values', () => {
    const colorForValue = () => '#ff0000';
    const result = getCellBackground('text', colorForValue);
    expect(result).toBeTruthy();
    expect(result).not.toBe('#ff0000');
  });

  it('returns the default cell background color for undefined', () => {
    const colorForValue = () => '#ff0000';
    const result = getCellBackground(undefined, colorForValue);
    expect(result).not.toBe('#ff0000');
  });

  it('uses the colorForValue mapper for numeric values', () => {
    const colorForValue = vi.fn().mockReturnValue('#abc123');
    const result = getCellBackground(5, colorForValue);
    expect(colorForValue).toHaveBeenCalledWith(5);
    expect(result).toBe('#abc123');
  });

  it('returns a non-numeric default for Infinity', () => {
    const colorForValue = () => '#ff0000';
    const result = getCellBackground(Infinity, colorForValue);
    expect(result).not.toBe('#ff0000');
  });
});

describe('getCellDisplayValue', () => {
  const measure = { key: 'val' as const, label: 'Value' };

  it('returns null when showValues is false', () => {
    expect(getCellDisplayValue(42, false, measure)).toBeNull();
  });

  it('returns the raw number when showValues is true and no format function', () => {
    expect(getCellDisplayValue(42, true, measure)).toBe(42);
  });

  it('applies the measure format function when showValues is true', () => {
    const measureWithFormat = { ...measure, format: (v: number) => `$${v}` };
    expect(getCellDisplayValue(42, true, measureWithFormat)).toBe('$42');
  });

  it('returns a string value as-is when showValues is true', () => {
    expect(getCellDisplayValue('N/A', true, measure)).toBe('N/A');
  });

  it('returns null for showValues=false even with a string value', () => {
    expect(getCellDisplayValue('N/A', false, measure)).toBeNull();
  });

  it('returns undefined when value is undefined and showValues is true', () => {
    expect(getCellDisplayValue(undefined, true, measure)).toBeUndefined();
  });
});

describe('createColorForValue', () => {
  const baseConfig = {
    domainMin: 0,
    domainMax: 100,
    rawMin: 0,
    rawMax: 100,
    minColor: '#0000ff',
    midColor: '#ffffff',
    maxColor: '#ff0000',
  };

  it('returns a function', () => {
    const colorForValue = createColorForValue(baseConfig);
    expect(typeof colorForValue).toBe('function');
  });

  it('returns a hex color string for values within domain', () => {
    const colorForValue = createColorForValue(baseConfig);
    const color = colorForValue(50);
    expect(color).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('returns the minColor at the minimum domain value', () => {
    const colorForValue = createColorForValue(baseConfig);
    expect(colorForValue(0)).toBe('#0000ff');
  });

  it('returns the maxColor at the maximum domain value', () => {
    const colorForValue = createColorForValue(baseConfig);
    expect(colorForValue(100)).toBe('#ff0000');
  });

  it('returns a lighter version of minColor for values below domain', () => {
    const config = { ...baseConfig, rawMin: -50 };
    const colorForValue = createColorForValue(config);
    const below = colorForValue(-25);
    const atMin = colorForValue(0);
    expect(below).not.toBe(atMin);
  });

  it('returns a fixed color for degenerate domain (min === max)', () => {
    const config = { ...baseConfig, domainMin: 50, domainMax: 50 };
    const colorForValue = createColorForValue(config);
    const c1 = colorForValue(10);
    const c2 = colorForValue(90);
    expect(c1).toBe(c2);
  });

  it('returns a valid hex color for non-finite values', () => {
    const colorForValue = createColorForValue(baseConfig);
    const result = colorForValue(Number.NaN);
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
  });
});
