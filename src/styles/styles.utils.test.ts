import { describe, expect, it, beforeEach, vi } from 'vitest';
import { getStyle, getStyleNumber } from './styles.utils';

const mockGetPropertyValue = vi.fn();

beforeEach(() => {
  mockGetPropertyValue.mockReset();
  vi.spyOn(window, 'getComputedStyle').mockReturnValue({
    getPropertyValue: mockGetPropertyValue,
    fontSize: '16',
  } as unknown as CSSStyleDeclaration);
});

describe('getStyle', () => {
  it('returns the raw string value for a CSS variable', () => {
    mockGetPropertyValue.mockReturnValue('  #3498db  ');
    expect(getStyle('--em-core-color-gray--0000')).toBe('#3498db');
  });

  it('returns rgb color string', () => {
    mockGetPropertyValue.mockReturnValue('rgb(255 255 255)');
    expect(getStyle('--em-core-color-gray--0000')).toBe('rgb(255 255 255)');
  });

  it('returns rgba color string', () => {
    mockGetPropertyValue.mockReturnValue('rgba(52, 152, 219, 0.8)');
    expect(getStyle('--em-core-color-gray--0000')).toBe('rgba(52, 152, 219, 0.8)');
  });

  it('returns font-family string', () => {
    mockGetPropertyValue.mockReturnValue("'inter'");
    expect(getStyle('--em-core-font-family--base')).toBe("'inter'");
  });

  it('returns fallback when value is empty', () => {
    mockGetPropertyValue.mockReturnValue('');
    expect(getStyle('--em-core-color-gray--0000', 'fallback')).toBe('fallback');
  });

  it('returns empty string when value is empty and no fallback given', () => {
    mockGetPropertyValue.mockReturnValue('');
    expect(getStyle('--em-core-color-gray--0000')).toBe('');
  });
});

describe('getStyleNumber', () => {
  it('parses px values', () => {
    mockGetPropertyValue.mockReturnValue('16px');
    expect(getStyleNumber('--em-core-font-size--md')).toBe(16);
  });

  it('parses rem values using root font size', () => {
    mockGetPropertyValue.mockReturnValue('2rem');
    expect(getStyleNumber('--em-core-font-size--md')).toBe(32);
  });

  it('parses pure numeric string', () => {
    mockGetPropertyValue.mockReturnValue('42');
    expect(getStyleNumber('--em-core-font-size--md')).toBe(42);
  });

  it('parses negative numeric string', () => {
    mockGetPropertyValue.mockReturnValue('-5');
    expect(getStyleNumber('--em-core-font-size--md')).toBe(-5);
  });

  it('parses decimal numeric string', () => {
    mockGetPropertyValue.mockReturnValue('3.14');
    expect(getStyleNumber('--em-core-font-size--md')).toBe(3.14);
  });

  it('returns undefined for non-numeric values like color', () => {
    mockGetPropertyValue.mockReturnValue('#3498db');
    expect(getStyleNumber('--em-core-color-gray--0000')).toBeUndefined();
  });

  it('returns undefined when value is empty and no fallback given', () => {
    mockGetPropertyValue.mockReturnValue('');
    expect(getStyleNumber('--em-core-font-size--md')).toBeUndefined();
  });

  it('uses fallback value when CSS variable is empty', () => {
    mockGetPropertyValue.mockReturnValue('');
    expect(getStyleNumber('--em-core-font-size--md', '8px')).toBe(8);
  });

  it('uses fallback value when CSS variable is missing', () => {
    mockGetPropertyValue.mockReturnValue('');
    expect(getStyleNumber('--em-core-font-size--md', '1rem')).toBe(16);
  });
});
