import { useMemo, useCallback } from 'react';
import styles from './HeatMap.module.css';
import clsx from 'clsx';
import { Typography } from '../../../shared/Typography/Typography';

type Dimension<T> = {
  key: Extract<keyof T, string>;
  label: string;
  format?: (value: string) => string;
};

type Measure<T> = {
  key: Extract<keyof T, string>;
  label: string;
  format?: (value: number) => string;
  formatRaw?: (value: unknown) => number | null | undefined;
};

type Threshold = number | `${number}%` | undefined;

export type HeatMapProps<T extends Record<string, unknown>> = {
  data: T[];
  measure: Measure<T>;
  rowDimension: Dimension<T>;
  columnDimension: Dimension<T>;
  showValues?: boolean;
  onCellClick?: (row: number, col: number, value: number) => void;
  className?: string;

  /** Color thresholds — number = raw value, "NN%" = percentage of [min..max]. */
  minThreshold?: Threshold;
  maxThreshold?: Threshold;

  minColor: string;
  midColor: string;
  maxColor: string;
  columnWidth?: number;
  firstColumnWidth?: number;
  missingCellColor?: string;
};

// ─────────────────────────── Utilities ───────────────────────────

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const easeOutQuad = (x: number) => 1 - (1 - x) * (1 - x);
const OUTSIDE_DARKEN_MAX = 0.35;

const CSS_RGB_REGEX = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i;
const idOf = (v: unknown) => String(v ?? '');

const parseCssColorToHex = (color: string): string => {
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

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const lerpColor = (a: string, b: string, t: number) => {
  const A = hexToRgb(parseCssColorToHex(a));
  const B = hexToRgb(parseCssColorToHex(b));
  return rgbToHex(lerp(A.r, B.r, t), lerp(A.g, B.g, t), lerp(A.b, B.b, t));
};

const getBrightness = (hex: string) => {
  const { r, g, b } = hexToRgb(parseCssColorToHex(hex));
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

const parsePercentString = (s: string): number | null => {
  const trimmed = s.trim();
  if (!trimmed.endsWith('%')) return null;
  const n = Number.parseFloat(trimmed.slice(0, -1));
  return Number.isFinite(n) ? clamp01(n / 100) : null;
};

/** Convert flexible threshold → raw domain value */
const thresholdToRaw = (t: Threshold, rawMin: number, rawMax: number, fallback: number): number => {
  if (t == null) return fallback;
  if (typeof t === 'number' && Number.isFinite(t)) return t;
  const asPct = typeof t === 'string' ? parsePercentString(t) : null;
  if (asPct != null) return rawMin + asPct * (rawMax - rawMin);
  const maybe = Number(t as unknown as string);
  return Number.isFinite(maybe) ? maybe : fallback;
};

// ─────────────────────────── Component ───────────────────────────

export function HeatMap<T extends Record<string, unknown>>({
  data,
  showValues = false,
  onCellClick,
  className,
  columnDimension,
  rowDimension,
  measure,
  minThreshold,
  maxThreshold,
  minColor,
  midColor,
  maxColor,
  columnWidth,
  firstColumnWidth,
  missingCellColor = '#ffffff',
}: HeatMapProps<T>) {
  const isEmpty = !data || data.length === 0;

  // 1) Extract data domain
  const { rawMin, rawMax } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const d of data) {
      const vRaw = d[measure.key];
      const v = measure.formatRaw ? measure.formatRaw(vRaw) : (vRaw as number);
      const num = Number(v);
      if (Number.isFinite(num)) {
        if (num < min) min = num;
        if (num > max) max = num;
      }
    }
    if (!Number.isFinite(min) || !Number.isFinite(max)) return { rawMin: 0, rawMax: 0 };
    return { rawMin: min, rawMax: max };
  }, [data, measure.key, measure.formatRaw]);

  // 2) Resolve thresholds to a raw domain
  const { domainMin, domainMax } = useMemo(() => {
    const domMin = thresholdToRaw(minThreshold, rawMin, rawMax, rawMin);
    const domMax = thresholdToRaw(maxThreshold, rawMin, rawMax, rawMax);
    return domMin <= domMax
      ? { domainMin: domMin, domainMax: domMax }
      : { domainMin: domMax, domainMax: domMin };
  }, [minThreshold, maxThreshold, rawMin, rawMax]);

  // 3) Compute midpoint fraction for diverging scale
  const midpoint = useMemo(() => {
    const range = domainMax - domainMin;
    if (range === 0) return 0.5;
    const midRaw = (domainMin + domainMax) / 2;
    return (midRaw - domainMin) / range;
  }, [domainMin, domainMax]);

  const scale = useMemo(
    () => makeDiverging(minColor, midColor, maxColor, midpoint),
    [minColor, midColor, maxColor, midpoint],
  );

  // 4) Dimension ordering
  const columnValues = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const d of data) {
      const val = d[columnDimension.key];
      if (val !== undefined && val !== null) {
        const id = idOf(val);
        if (!seen.has(id)) {
          seen.add(id);
          out.push(id);
        }
      }
    }
    return out;
  }, [data, columnDimension.key]);

  const rowValues = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const d of data) {
      const val = d[rowDimension.key];
      if (val !== undefined && val !== null) {
        const id = idOf(val);
        if (!seen.has(id)) {
          seen.add(id);
          out.push(id);
        }
      }
    }
    return out;
  }, [data, rowDimension.key]);

  const cellMap = useMemo(() => {
    const map = new Map<string, Map<string, Record<string, unknown>>>();
    for (const d of data) {
      const r = idOf(d[rowDimension.key]);
      const c = idOf(d[columnDimension.key]);
      if (!map.has(r)) map.set(r, new Map());
      map.get(r)!.set(c, d as Record<string, unknown>);
    }
    return map;
  }, [data, rowDimension.key, columnDimension.key]);

  // 5) Map value → background color (based on new domain)
  const colorForValue = useCallback(
    (v: number) => {
      const range = domainMax - domainMin;
      if (range === 0) return scale(0.5);
      const t = (v - domainMin) / range;

      if (t <= 0) {
        const leftTail = Math.max(1e-6, domainMin - rawMin);
        const dist = Math.max(0, domainMin - v) / leftTail;
        const strength = easeOutQuad(clamp01(dist)) * OUTSIDE_DARKEN_MAX;
        return strength > 0 ? lerpColor(minColor, '#000000', strength) : minColor;
      }
      if (t >= 1) {
        const rightTail = Math.max(1e-6, rawMax - domainMax);
        const dist = Math.max(0, v - domainMax) / rightTail;
        const strength = easeOutQuad(clamp01(dist)) * OUTSIDE_DARKEN_MAX;
        return strength > 0 ? lerpColor(maxColor, '#000000', strength) : maxColor;
      }

      return scale(t);
    },
    [domainMin, domainMax, rawMin, rawMax, minColor, maxColor, scale],
  );

  const renderValue = useCallback(
    (value: number | null | undefined) => {
      if (!showValues) return null;
      if (value == null || Number.isNaN(value)) return '—';
      return measure.format ? measure.format(value) : String(value);
    },
    [showValues, measure],
  );

  if (isEmpty) {
    return (
      <div className={clsx(styles.heatMapContainer, className)}>
        <Typography>No data</Typography>
      </div>
    );
  }

  // ─────────────────────────── Render ───────────────────────────
  return (
    <div className={clsx(styles.heatMapContainer, className)}>
      <table className={styles.heatMapTable} aria-label="Heat map">
        <thead>
          <tr>
            <th
              className={clsx(styles.heatMapCell, styles.header)}
              style={{ minWidth: firstColumnWidth ? `${firstColumnWidth}px` : undefined }}
            >
              <Typography>{measure.label}</Typography>
            </th>
            {columnValues.map((cv, index) => (
              <th
                key={`col-${cv}-${index}`}
                className={clsx(styles.heatMapCell, styles.header)}
                style={{ minWidth: columnWidth ? `${columnWidth}px` : undefined }}
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
                const obj = cellMap.get(rv)?.get(cv);
                const raw = obj?.[measure.key];
                const val: number | null | undefined = measure.formatRaw
                  ? measure.formatRaw(raw)
                  : (raw as number);

                const isMissing =
                  val == null || Number.isNaN(val) || !Number.isFinite(val as number);

                const background = isMissing ? missingCellColor : colorForValue(val as number);
                const color = getBrightness(background) < 150 ? '#fff' : '#212129';
                const interactive = !!onCellClick && !isMissing;

                return (
                  <td
                    key={`cell-${rv}-${cv}`}
                    className={clsx(styles.heatMapCell)}
                    style={{ background, color }}
                    onClick={
                      interactive
                        ? () => onCellClick?.(rowIndex, colIndex, val as number)
                        : undefined
                    }
                    role={interactive ? 'button' : undefined}
                    tabIndex={interactive ? 0 : undefined}
                    onKeyDown={
                      interactive
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onCellClick?.(rowIndex, colIndex, val as number);
                            }
                          }
                        : undefined
                    }
                  >
                    <Typography>{renderValue(isMissing ? null : val)}</Typography>
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
