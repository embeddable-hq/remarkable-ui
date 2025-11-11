import { HeatMapPropsMeasure, HeatMapPropsThreshold } from './HeatMap.types';

/* -------------------------------------------------------------------------- */
/* Core math + tiny helpers                                                   */
/* -------------------------------------------------------------------------- */

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const easeOutQuad = (x: number) => 1 - (1 - x) * (1 - x);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Max darkening applied for values outside the domain (0..1). Lower = lighter tails. */
const OUTSIDE_DARKEN_MAX = 0.35;
/** Darkest color to lerp toward when outside domain (kept as const for tree-shakeability). */
const LERP_DARKEST_COLOR = '#000000';
const LERP_LIGHTEST_COLOR = '#FFFFFF';

export const idOf = (v: unknown) => String(v ?? '');

/* -------------------------------------------------------------------------- */
/* Color parsing / conversion                                                 */
/*  - Resolves hex/rgb/hsl/named/var(...) to a hex string (#rrggbb)           */
/*  - Memoized to avoid repeated DOM work                                     */
/* -------------------------------------------------------------------------- */

const CSS_RGB_REGEX = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i;
const COLOR_CACHE = new Map<string, string>();

/** Normalizes short or long hex to lowercase #rrggbb; returns input if not hex. */
const normalizeHex = (hex: string) => {
  if (!hex || hex[0] !== '#') return hex;
  const v = hex.slice(1).toLowerCase();
  if (v.length === 3) return `#${v[0]}${v[0]}${v[1]}${v[1]}${v[2]}${v[2]}`;
  if (v.length === 6) return `#${v}`;
  return hex.toLowerCase();
};

/**
 * Resolves any CSS color (hex, rgb/rgba, hsl/hsla, named, var(--token)) into #rrggbb.
 * SSR-safe: returns input unchanged if `document` is not available.
 */
const resolveCssColorToHex = (input: string): string => {
  if (!input) return input;
  const cached = COLOR_CACHE.get(input);
  if (cached) return cached;

  // Quick-path for hex.
  if (input.startsWith('#')) {
    const hex = normalizeHex(input);
    COLOR_CACHE.set(input, hex);
    return hex;
  }

  if (typeof document === 'undefined') {
    // SSR: cannot resolve computed styles → return as-is (caller should accept).
    return input;
  }

  // Use the browser to compute final color (resolves var(...), named, hsl, etc.)
  const el = document.createElement('span');
  el.style.color = input;
  document.body.appendChild(el);
  const computed = getComputedStyle(el).color || '';
  el.remove();

  // Expect "rgb(...)" or "rgba(...)" now.
  const m = computed.match(CSS_RGB_REGEX);
  if (!m) return input;

  const [, r = '0', g = '0', b = '0'] = m;
  const toHex = (n: string) => Number(n).toString(16).padStart(2, '0');
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`.toLowerCase();
  COLOR_CACHE.set(input, hex);
  return hex;
};

const hexToRgb = (color: string) => {
  const hex = normalizeHex(resolveCssColorToHex(color)).slice(1);
  // Guard against bad inputs
  if (hex.length !== 6) return { r: 0, g: 0, b: 0 };
  const i = parseInt(hex, 16);
  return { r: (i >> 16) & 255, g: (i >> 8) & 255, b: i & 255 };
};

const rgbToHex = (r: number, g: number, b: number) => {
  const to = (x: number) => Math.round(x).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
};

/** Linear interpolation between two colors (0..1). */
export const lerpColor = (a: string, b: string, t: number) => {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(lerp(A.r, B.r, t), lerp(A.g, B.g, t), lerp(A.b, B.b, t));
};

/** YIQ perceived brightness, used to pick white/black text. */
const getBrightness = (color: string) => {
  const { r, g, b } = hexToRgb(color);
  return (r * 299 + g * 587 + b * 114) / 1000;
};

/** Returns '#FFFFFF' for dark backgrounds, '#212129' for light ones. */
export const getCellColor = (backgroundColor: string) => {
  return getBrightness(backgroundColor) < 150 ? '#FFFFFF' : '#212129';
};

/* -------------------------------------------------------------------------- */
/* Scales / thresholds                                                        */
/* -------------------------------------------------------------------------- */

/** Creates a diverging scale: t∈[0..1] → color blended across [min→mid→max]. */
const makeDiverging = (minC: string, midC: string, maxC: string, midpoint = 0.5) => {
  const m = clamp01(midpoint);
  return (t: number) => {
    const x = clamp01(t);
    return x <= m
      ? lerpColor(minC, midC, m === 0 ? 1 : x / m)
      : lerpColor(midC, maxC, (x - m) / (1 - m));
  };
};

/** Parses "NN%" → 0..1; otherwise null. */
const parsePercentString = (s: string): number | null => {
  const t = s.trim();
  if (!t.endsWith('%')) return null;
  const n = Number.parseFloat(t.slice(0, -1));
  return Number.isFinite(n) ? clamp01(n / 100) : null;
};

/**
 * Converts a flexible threshold into a RAW domain value.
 * - number → raw value
 * - "NN%" → percentage of [rawMin..rawMax]
 * - undefined/invalid → fallback
 */
export const thresholdToRaw = (
  t: HeatMapPropsThreshold,
  rawMin: number,
  rawMax: number,
  fallback: number,
): number => {
  if (t == null) return fallback;
  if (typeof t === 'number' && Number.isFinite(t)) return t;
  const asPct = typeof t === 'string' ? parsePercentString(t) : null;
  if (asPct != null) return rawMin + asPct * (rawMax - rawMin);

  // Last-chance: numeric string without %
  const maybe = Number(t as unknown as string);
  return Number.isFinite(maybe) ? maybe : fallback;
};

/* -------------------------------------------------------------------------- */
/* Cell value helpers                                                         */
/* -------------------------------------------------------------------------- */

const toFiniteOrSelf = (v: number | string | undefined): number | string | undefined => {
  if (v == null) return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : v;
};

/**
 * Normalizes the raw cell value for display/compute:
 * - if nullish, uses `displayNullAs` (if numeric string, coerces to number)
 * - if numeric-like, returns as number
 * - otherwise returns original string
 */
export const getCellValue = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  displayNullAs: string | number | undefined,
): string | number | undefined => {
  const fallback =
    displayNullAs && Number.isFinite(Number(displayNullAs)) ? Number(displayNullAs) : displayNullAs;
  return toFiniteOrSelf(value ?? fallback);
};

/** Returns the background color for a given cell value using a prepared mapper. */
export const getCellBackground = (
  value: number | string | undefined,
  colorForValue: (t: number) => string,
): string => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'white';
  return colorForValue(value);
};

/** Formats the cell’s display text (respects showValues & measure.format). */
export const getCellDisplayValue = (
  value: number | string | undefined,
  showValues: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  measure: HeatMapPropsMeasure<any>,
) => {
  if (!showValues) return null;
  if (typeof value === 'string' || value == null || Number.isNaN(value as number)) return value;
  return measure?.format ? measure.format(Number(value)) : value;
};

/* -------------------------------------------------------------------------- */
/* Color mapper factory                                                       */
/* -------------------------------------------------------------------------- */

/** Returns midpoint in [0..1] for the diverging scale given raw min/max. */
const getMidPoint = (domainMin: number, domainMax: number) => {
  const range = domainMax - domainMin;
  if (range === 0) return 0.5;
  return ((domainMin + domainMax) / 2 - domainMin) / range;
};

/**
 * Builds a fast `(value:number) => color` mapper.
 *
 * Behavior:
 * - Inside [domainMin..domainMax]: interpolate via diverging scale.
 * - Below domain: darken from `minColor` toward black, eased & capped.
 * - Above domain: darken from `maxColor` toward black, eased & capped.
 * - Degenerate domain: always returns mid color.
 */
export const createColorForValue = ({
  domainMin,
  domainMax,
  rawMin,
  rawMax,
  minColor,
  midColor,
  maxColor,
}: {
  domainMin: number;
  domainMax: number;
  rawMin: number;
  rawMax: number;
  minColor: string;
  midColor: string;
  maxColor: string;
}) => {
  const midPoint = getMidPoint(domainMin, domainMax);
  const scale = makeDiverging(minColor, midColor, maxColor, midPoint);

  const leftTailLen = Math.max(1e-6, domainMin - rawMin);
  const rightTailLen = Math.max(1e-6, rawMax - domainMax);
  const domRange = domainMax - domainMin;

  if (domRange === 0) {
    // Degenerate domain → fixed color
    const mid = scale(0.5);
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    return (_v: number) => mid;
  }

  return (v: number) => {
    if (!Number.isFinite(v)) return scale(0.5);

    const t = (v - domainMin) / domRange;

    if (t <= 0) {
      const dist = Math.max(0, domainMin - v) / leftTailLen;
      const strength = easeOutQuad(clamp01(dist)) * OUTSIDE_DARKEN_MAX;
      return strength > 0 ? lerpColor(minColor, LERP_LIGHTEST_COLOR, strength) : minColor;
    }

    if (t >= 1) {
      const dist = Math.max(0, v - domainMax) / rightTailLen;
      const strength = easeOutQuad(clamp01(dist)) * OUTSIDE_DARKEN_MAX;
      return strength > 0 ? lerpColor(maxColor, LERP_DARKEST_COLOR, strength) : maxColor;
    }

    return scale(t);
  };
};
