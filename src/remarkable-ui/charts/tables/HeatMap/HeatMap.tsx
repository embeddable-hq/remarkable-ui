import { useMemo } from 'react';
import styles from './HeatMap.module.css';
import clsx from 'clsx';
import { Typography } from '../../../shared/Typography/Typography';

type HeatMapPropsDimension<T> = {
  key: Extract<keyof T, string>;
  label: string;
  format?: (value: any) => string;
};

type HeatMapPropsMeasure<T> = {
  key: Extract<keyof T, string>;
  label: string;
  format?: (value: any) => any;
};

type HeatMapProps<T> = {
  data: T[];
  measure: HeatMapPropsMeasure<T>;
  rowDimension: HeatMapPropsDimension<T>;
  columnDimension: HeatMapPropsDimension<T>;
  showValues?: boolean;
  onCellClick?: (row: number, col: number, value: number) => void;
  className?: string;
  minValueUntil?: number; // percentage domain min (0..100)
  maxValueFrom?: number; // percentage domain max (0..100)
  minColor: string;
  midColor: string;
  maxColor: string;
  displayNullAs?: string;
};

// Utility functions
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const clampPct01 = (p: number) => Math.max(0, Math.min(1, p));
const clampPct = (p: number) => Math.max(0, Math.min(100, p));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const CSS_RGB_REGEX = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i;

const cssToHex = (color: string): string => {
  if (typeof document === 'undefined') return color;
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return color;
  ctx.fillStyle = color;
  const computed = ctx.fillStyle;
  if (computed.startsWith('#')) return computed;
  const match = computed.match(CSS_RGB_REGEX);
  if (!match) return color;
  const [, r = '0', g = '0', b = '0'] = match;
  const toHex = (n: string) => (+n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const hexToRgb = (hex: string) => {
  const v = hex.replace('#', '');
  const n =
    v.length === 3
      ? v
          .split('')
          .map((c) => c + c)
          .join('')
      : v;
  const i = parseInt(n, 16);
  return { r: (i >> 16) & 255, g: (i >> 8) & 255, b: i & 255 };
};

const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (x: number) => Math.round(x).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const lerpColor = (a: string, b: string, t: number) => {
  const A = hexToRgb(cssToHex(a));
  const B = hexToRgb(cssToHex(b));
  return rgbToHex(lerp(A.r, B.r, t), lerp(A.g, B.g, t), lerp(A.b, B.b, t));
};

const getBrightness = (hex: string) => {
  const { r, g, b } = hexToRgb(cssToHex(hex));
  return (r * 299 + g * 587 + b * 114) / 1000;
};

const makeDiverging = (minC: string, midC: string, maxC: string, midpoint = 0.5) => {
  const m = clamp01(midpoint);
  return (t: number) => {
    const x = clamp01(t);
    return x <= m
      ? lerpColor(minC, midC, m === 0 ? 1 : x / m)
      : lerpColor(midC, maxC, (x - m) / (1 - m));
  };
};

// Normalize keys for Map indexing
const idOf = (v: unknown) => String(v ?? '');

// Easing to keep near-threshold colors bright (for outside-domain darkening)
const easeOutQuad = (x: number) => 1 - (1 - x) * (1 - x);

// Max darkness applied outside the domain (0..1). Lower -> lighter tails.
const OUTSIDE_DARKEN_MAX = 0.35;

export function HeatMap<T extends Record<string, unknown>>({
  data,
  showValues = false,
  onCellClick,
  className,
  columnDimension,
  rowDimension,
  measure,
  minValueUntil, // interpreted as percentage domain min (0..100)
  maxValueFrom, // interpreted as percentage domain max (0..100)
  minColor,
  midColor,
  maxColor,
  displayNullAs,
}: HeatMapProps<T>) {
  const isEmpty = !data || data.length === 0;

  // 1) RAW domain from data (only used to compute base percentages)
  const { rawMin, rawMax } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const d of data) {
      const v = Number(d[measure.key]);
      if (Number.isFinite(v)) {
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      min = 0;
      max = 0;
    }
    return { rawMin: min, rawMax: max };
  }, [data, measure.key]);

  // 2) Percentage domain (min/max are PERCENTAGES)
  const { minValue, maxValue } = useMemo(() => {
    const minPct = clampPct(minValueUntil ?? 0);
    const maxPct = clampPct(maxValueFrom ?? 100);
    return {
      minValue: Math.min(minPct, maxPct),
      maxValue: Math.max(minPct, maxPct),
    };
  }, [minValueUntil, maxValueFrom]);

  // 3) Midpoint (percentage → fraction)
  const midpoint = useMemo(() => {
    const domain = maxValue - minValue;
    if (domain === 0) return 0.5;
    const target = clampPct((minValue + maxValue) / 2);
    return (target - minValue) / domain; // fraction 0..1 within percentage domain
  }, [minValue, maxValue]);

  const scale = useMemo(
    () => makeDiverging(minColor!, midColor!, maxColor!, midpoint),
    [minColor, midColor, maxColor, midpoint],
  );

  const columnValues = useMemo(() => {
    const s = new Set<string>();
    for (const d of data) {
      const columnValue = d[columnDimension.key];
      if (columnValue !== undefined && columnValue !== null) s.add(idOf(columnValue));
    }
    return Array.from(s);
  }, [data, columnDimension.key]);

  const rowValues = useMemo(() => {
    const s = new Set<string>();
    for (const d of data) {
      const rowValue = d[rowDimension.key];
      if (rowValue !== undefined && rowValue !== null) s.add(idOf(rowValue));
    }
    return Array.from(s);
  }, [data, rowDimension.key]);

  // Map cells
  const cellMap = useMemo(() => {
    const map = new Map<string, Map<string, Record<string, any>>>();
    for (const d of data) {
      const r = idOf(d[rowDimension.key]);
      const c = idOf(d[columnDimension.key]);
      if (!map.has(r)) map.set(r, new Map());
      map.get(r)!.set(c, d as Record<string, any>);
    }
    return map;
  }, [data, rowDimension.key, columnDimension.key]);

  // Convert RAW value -> percentage (can be <0 or >100). Used for display and then clamped for color.
  const rawToPercent = (v: number) => {
    const denom = rawMax - rawMin;
    if (denom === 0) return 50;
    return ((v - rawMin) / denom) * 100;
  };

  // Color mapping with capped, eased darkening outside the domain.
  const colorForPercent = (percentClamped01: number) => {
    // percentClamped01 is a 0..1 value (i.e., clamped percent / 100)
    const p01 = clampPct01(percentClamped01);
    const min01 = minValue / 100;
    const max01 = maxValue / 100;
    const domain01 = max01 - min01;

    // Below domain: darken from minColor as we move away, but cap & ease it
    if (p01 < min01) {
      const tailLen = Math.max(1e-6, min01); // avoid /0 when min=0
      const dist = (min01 - p01) / tailLen; // 0..1
      const strength = easeOutQuad(clamp01(dist)) * OUTSIDE_DARKEN_MAX;
      return lerpColor(minColor, '#000000', strength);
    }

    // Above domain: darken from maxColor as we move away, but cap & ease it
    if (p01 > max01) {
      const tailLen = Math.max(1e-6, 1 - max01); // avoid /0 when max=1
      const dist = (p01 - max01) / tailLen; // 0..1
      const strength = easeOutQuad(clamp01(dist)) * OUTSIDE_DARKEN_MAX;
      return lerpColor(maxColor, '#000000', strength);
    }

    // Inside domain: interpolate normally (t=0 -> minColor, t=1 -> maxColor)
    const t = domain01 === 0 ? 0.5 : (p01 - min01) / domain01;
    return scale(t);
  };

  // Render text
  const renderValue = (v: number | string) => {
    if (!showValues) return null;

    if (typeof v == 'string') {
      return v;
    }

    return measure.format ? measure.format(v) : String(v);
  };

  if (isEmpty) {
    return (
      <div className={clsx(styles.heatMapContainer, className)}>
        <Typography>No data</Typography>
      </div>
    );
  }

  return (
    <div className={clsx(styles.heatMapContainer, className)}>
      <table className={styles.heatMapTable} aria-label="Heat map">
        <thead>
          <tr>
            <th className={clsx(styles.heatMapCell, styles.header)}>
              <Typography>{columnDimension.label}</Typography>
            </th>
            {columnValues.map((cv, index) => (
              <th
                key={`col-${cv}-${index}`}
                className={clsx(styles.heatMapCell, styles.header)}
                scope="col"
              >
                <Typography>{columnDimension.format ? columnDimension.format(cv) : cv}</Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowValues.map((rv, rowIndex) => (
            <tr key={`row-${rv}`}>
              <th className={clsx(styles.heatMapCell, styles.header)} scope="row">
                <Typography>{rowDimension.format ? rowDimension.format(rv) : rv}</Typography>
              </th>
              {columnValues.map((cv, colIndex) => {
                const object = cellMap.get(rv)?.get(cv);
                const rawValue = object?.[measure.key];
                const numericValue = rawValue
                  ? Number(rawValue)
                  : displayNullAs
                    ? displayNullAs
                    : '';
                const isMissing =
                  rawValue == null || Number.isNaN(numericValue) || !Number.isFinite(numericValue);

                // Base percent from RAW domain (may be <0 or >100)
                const basePercent = isMissing ? 0 : rawToPercent(numericValue as number);

                // Clamped 0..100 for color only
                const clampedPercent = clampPct(basePercent);
                const clampedPercent01 = clampedPercent / 100;

                // Background color
                const background = isMissing ? '#fff' : colorForPercent(clampedPercent01);

                // Text color for contrast
                const color = getBrightness(background) < 150 ? '#fff' : '#212129';

                const interactive = !!onCellClick && !isMissing;

                return (
                  <td
                    key={`cell-${rv}-${cv}`}
                    className={clsx(styles.heatMapCell)}
                    style={{ background, color }}
                    onClick={interactive ? () => onCellClick?.(rowIndex, colIndex, 1) : undefined}
                    role={interactive ? 'button' : undefined}
                    tabIndex={interactive ? 0 : undefined}
                    onKeyDown={
                      interactive
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onCellClick?.(rowIndex, colIndex, 1);
                            }
                          }
                        : undefined
                    }
                  >
                    {renderValue(numericValue)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
