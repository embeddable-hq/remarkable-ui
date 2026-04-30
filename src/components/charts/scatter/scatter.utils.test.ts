import { describe, expect, it, vi } from 'vitest';
import type { ChartData, ChartOptions } from 'chart.js';
import type { BubbleChartInputPoint, ScatterChartInputPoint } from './scatter.types';
import { computeScatterNullBand } from './scatter.nullBand.utils';

vi.mock('../charts.constants', () => ({
  getChartColors: vi.fn(() => ['#111111', '#222222']),
}));

vi.mock('../../../styles/styles.utils', () => ({
  getStyle: vi.fn((_k: string, fb: string) => fb),
  getStyleNumber: vi.fn((_k: string, fallback: string) => parseFloat(fallback) || 0),
}));

import {
  getColorWithOpacity,
  filterNumericScatterData,
  getScatterDataWithNullBand as getScatterChartData,
  getScatterChartOptions,
  hasNullMeasure,
} from './scatter.utils';

import {
  getBubbleChartData,
  getBubbleChartOptions,
  type BubbleDatasetWithOriginal,
} from './BubbleChart/BubbleChart.utils';

describe('hasNullMeasure', () => {
  it('treats (no value, value) and (value, no value) as null-measure opacity cases', () => {
    expect(hasNullMeasure({ x: null, y: 18 })).toBe(true);
    expect(hasNullMeasure({ x: 52, y: null })).toBe(true);
  });

  it('uses full opacity only when both coordinates are finite numbers', () => {
    expect(hasNullMeasure({ x: 40, y: 25 })).toBe(false);
  });

  it('matches null-band semantics for undefined (runtime / loose data)', () => {
    expect(hasNullMeasure({ x: undefined, y: 5 } as unknown as ScatterChartInputPoint)).toBe(true);
    expect(hasNullMeasure({ x: 3, y: undefined } as unknown as ScatterChartInputPoint)).toBe(true);
  });

  it('treats both null as null measure', () => {
    expect(hasNullMeasure({ x: null, y: null })).toBe(true);
  });

  it('supports legacy isNull', () => {
    expect(hasNullMeasure({ x: 1, y: 2, isNull: true })).toBe(true);
  });

  it('treats NaN as missing', () => {
    expect(hasNullMeasure({ x: NaN, y: 1 })).toBe(true);
  });

  it('treats non-finite numbers (e.g. Infinity) as missing', () => {
    expect(hasNullMeasure({ x: Infinity, y: 1 })).toBe(true);
    expect(hasNullMeasure({ x: 1, y: -Infinity })).toBe(true);
  });

  it('returns false for undefined point', () => {
    expect(hasNullMeasure(undefined)).toBe(false);
  });
});

describe('filterNumericScatterData', () => {
  it('keeps finite x (linear) and positive finite y (log Y); drops invalid y', () => {
    const data: ChartData<'scatter', ScatterChartInputPoint[]> = {
      datasets: [
        {
          label: 'S',
          data: [
            { x: 1, y: 2 },
            { x: null, y: 1 },
            { x: -1, y: 2 },
            { x: 0, y: 3 },
            { x: 1, y: 0 },
            { x: 3, y: 4 },
          ],
        },
      ],
    };
    const out = filterNumericScatterData(data);
    expect(out.datasets[0]!.data).toEqual([
      { x: 1, y: 2 },
      { x: -1, y: 2 },
      { x: 0, y: 3 },
      { x: 3, y: 4 },
    ]);
  });
});

describe('getColorWithOpacity', () => {
  it('returns fallback rgba when color is empty', () => {
    expect(getColorWithOpacity('', 0.5)).toBe('rgba(33, 33, 41, 0.5)');
    expect(getColorWithOpacity('   ', 0.5)).toBe('rgba(33, 33, 41, 0.5)');
  });

  it('parses rgb from computed style and applies alpha', () => {
    const el = document.createElement('span');
    el.style.color = 'rgb(255, 0, 0)';
    document.body.appendChild(el);
    const rgb = getComputedStyle(el).color;
    document.body.removeChild(el);

    const out = getColorWithOpacity(rgb, 0.4);
    expect(out).toMatch(/^rgba\(\s*255\s*,\s*0\s*,\s*0\s*,\s*0\.4\s*\)$/);
  });

  it('returns fallback rgba when computed style does not match rgb pattern', () => {
    const spy = vi
      .spyOn(window, 'getComputedStyle')
      .mockReturnValue({ color: 'invalid' } as CSSStyleDeclaration);
    try {
      expect(getColorWithOpacity('#ff0000', 0.2)).toBe('rgba(33, 33, 41, 0.2)');
    } finally {
      spy.mockRestore();
    }
  });
});

describe('getScatterChartData', () => {
  const baseData: ChartData<'scatter', ScatterChartInputPoint[]> = {
    datasets: [
      {
        label: 'S',
        data: [
          { x: 1, y: 2 },
          { x: 3, y: 4 },
        ],
      },
    ],
  };

  it('maps null-band positions when supportsNullMeasures and nullBand has nulls', () => {
    const raw: ChartData<'scatter', ScatterChartInputPoint[]> = {
      datasets: [
        {
          label: 'S',
          data: [
            { x: null, y: 10 },
            { x: 10, y: 20 },
          ],
        },
      ],
    };
    const nullBand = computeScatterNullBand(raw.datasets);
    expect(nullBand).not.toBeNull();

    const out = getScatterChartData(raw, {
      nullBand,
      supportsNullMeasures: true,
    });

    const p0 = out.datasets[0]!.data[0] as ScatterChartInputPoint;
    expect(p0.x).toBe(nullBand!.xNullPos);
    expect(p0.y).toBe(10);
    expect(
      (out.datasets[0] as { originalData?: ScatterChartInputPoint[] }).originalData?.[0]?.x,
    ).toBe(null);
  });

  it('maps non-finite x to null-band position like null/undefined', () => {
    const raw: ChartData<'scatter', ScatterChartInputPoint[]> = {
      datasets: [
        {
          label: 'S',
          data: [
            { x: NaN, y: 10 },
            { x: 10, y: 20 },
          ],
        },
      ],
    };
    const nullBand = computeScatterNullBand(raw.datasets);
    expect(nullBand!.hasNullX).toBe(true);
    const out = getScatterChartData(raw, {
      nullBand,
      supportsNullMeasures: true,
    });
    const p0 = out.datasets[0]!.data[0] as { x: number; y: number };
    expect(p0.x).toBe(nullBand!.xNullPos);
    expect(p0.y).toBe(10);
  });

  it('skips null-band mapping when supportsNullMeasures is false', () => {
    const raw: ChartData<'scatter', ScatterChartInputPoint[]> = {
      datasets: [{ label: 'S', data: [{ x: null, y: 1 }] }],
    };
    const nullBand = computeScatterNullBand(raw.datasets);
    const out = getScatterChartData(raw, { nullBand, supportsNullMeasures: false });
    expect(out.datasets[0]!.data[0]).toEqual({ x: null, y: 1 });
  });

  it('uses explicit point colors when userControlsPointFill', () => {
    const out = getScatterChartData(
      {
        datasets: [
          {
            label: 'S',
            data: [{ x: 1, y: 2 }],
            pointBackgroundColor: '#abcdef',
          },
        ],
      },
      { nullBand: null, supportsNullMeasures: true },
    );
    expect(out.datasets[0]!.pointBackgroundColor).toBe('#abcdef');
  });

  it('uses scriptable colors from base palette when fill not controlled', () => {
    const out = getScatterChartData(baseData, { nullBand: null, supportsNullMeasures: true });
    const bg = out.datasets[0]!.pointBackgroundColor;
    const border = out.datasets[0]!.pointBorderColor;
    expect(typeof bg).toBe('function');
    expect(typeof border).toBe('function');
    const ctx = {
      dataset: {
        ...out.datasets[0],
        originalData: baseData.datasets[0]!.data,
        data: out.datasets[0]!.data,
      },
      dataIndex: 0,
    };
    const c = (bg as (c: unknown) => string)(ctx);
    const b = (border as (c: unknown) => string)(ctx);
    expect(c).toContain('rgba');
    expect(b).toContain('rgba');
  });

  it('merges mapped data when user controls fill and null band is active', () => {
    const raw: ChartData<'scatter', ScatterChartInputPoint[]> = {
      datasets: [
        {
          label: 'S',
          data: [{ x: null, y: 1 }],
          pointBackgroundColor: '#aabbcc',
        },
      ],
    };
    const nullBand = computeScatterNullBand(raw.datasets);
    const out = getScatterChartData(raw, { nullBand, supportsNullMeasures: true });
    const p0 = out.datasets[0]!.data[0] as ScatterChartInputPoint;
    expect(p0.x).toBe(nullBand!.xNullPos);
    expect(out.datasets[0]!.pointBackgroundColor).toBe('#aabbcc');
  });

  it('uses scriptable colors for null-band mapping without user fill control', () => {
    const raw: ChartData<'scatter', ScatterChartInputPoint[]> = {
      datasets: [
        {
          label: 'S',
          data: [
            { x: null, y: 1 },
            { x: 5, y: 2 },
          ],
        },
      ],
    };
    const nullBand = computeScatterNullBand(raw.datasets);
    const out = getScatterChartData(raw, { nullBand, supportsNullMeasures: true });
    expect(typeof out.datasets[0]!.pointBackgroundColor).toBe('function');
    expect(typeof out.datasets[0]!.pointBorderColor).toBe('function');
  });
});

describe('getScatterChartOptions', () => {
  it('draws axis spines with visible border color and at least 1px width', () => {
    const opts = getScatterChartOptions({}) as Partial<ChartOptions<'scatter'>>;
    expect(opts.scales?.x?.border).toMatchObject({
      display: true,
      color: '#B8B8BD',
      width: 1,
    });
    expect(opts.scales?.y?.border).toMatchObject({
      display: true,
      color: '#B8B8BD',
      width: 1,
    });
  });

  it('uses linear x and logarithmic y when showLogarithmicScale (matches line charts)', () => {
    const linear = getScatterChartOptions({});
    expect(linear.scales?.x?.type).toBe('linear');
    expect(linear.scales?.y?.type).toBe('linear');
    const log = getScatterChartOptions({ showLogarithmicScale: true });
    expect(log.scales?.x?.type).toBe('linear');
    expect(log.scales?.y?.type).toBe('logarithmic');
  });

  it('shows null-band label on x tick at null position', () => {
    const datasets: { data: ScatterChartInputPoint[] }[] = [
      {
        data: [
          { x: null, y: 1 },
          { x: 10, y: 2 },
        ],
      },
    ];
    const nullBand = computeScatterNullBand(datasets);
    expect(nullBand).not.toBeNull();

    const opts = getScatterChartOptions({ nullBandLabel: 'NV', nullBand });
    const cb = opts.scales?.x?.ticks?.callback as
      | ((this: unknown, v: string | number, i: number, ticks: unknown[]) => string)
      | undefined;
    expect(cb).toBeDefined();
    const label = cb!.call({}, nullBand!.xNullPos, 0, []);
    expect(label).toBe('NV');
  });

  it('merges user axis min with computed null-band min', () => {
    const datasets: { data: ScatterChartInputPoint[] }[] = [{ data: [{ x: null, y: 1 }] }];
    const nullBand = computeScatterNullBand(datasets);
    const opts = getScatterChartOptions({ xAxisRangeMin: 0, nullBandLabel: 'NV', nullBand });
    expect(opts.scales?.x?.min).toBe(Math.min(0, nullBand!.computedXAxisMin!));
  });

  it('tooltip label uses originalData when present', () => {
    const opts = getScatterChartOptions({ showTooltips: true, nullBandLabel: 'NV' });
    const labelFn = opts.plugins?.tooltip?.callbacks?.label as (ctx: {
      dataset: { label?: string; originalData?: ScatterChartInputPoint[] };
      dataIndex: number;
      parsed: { x: number; y: number };
    }) => string;
    const s = labelFn!({
      dataset: { label: 'S', originalData: [{ x: 1, y: null }] },
      dataIndex: 0,
      parsed: { x: 1, y: 0 },
    });
    expect(s).toContain('NV');
    expect(s).toContain('S');
  });

  it('tooltip label uses null label for non-finite measure in originalData', () => {
    const opts = getScatterChartOptions({ showTooltips: true, nullBandLabel: 'NV' });
    const labelFn = opts.plugins?.tooltip?.callbacks?.label as (ctx: {
      dataset: { label?: string; originalData?: ScatterChartInputPoint[] };
      dataIndex: number;
      parsed: { x: number; y: number };
    }) => string;
    const s = labelFn!({
      dataset: { label: 'S', originalData: [{ x: NaN, y: 2 }] },
      dataIndex: 0,
      parsed: { x: 0, y: 2 },
    });
    expect(s).toContain('NV');
    expect(s).not.toContain('NaN');
  });

  it('tooltip label falls back to parsed when no originalData', () => {
    const opts = getScatterChartOptions({ showTooltips: true });
    const labelFn = opts.plugins?.tooltip?.callbacks?.label as (ctx: {
      dataset: { label?: string };
      dataIndex: number;
      parsed: { x: number; y: number };
    }) => string;
    const s = labelFn!({
      dataset: { label: 'T' },
      dataIndex: 0,
      parsed: { x: 2, y: 3 },
    });
    expect(s).toContain('2');
    expect(s).toContain('3');
  });

  it('value label formatter prints measure pair', () => {
    const opts = getScatterChartOptions({ showValueLabels: true });
    const fmt = opts.plugins?.datalabels?.labels?.value?.formatter as (
      v: unknown,
      ctx: { dataset: { originalData?: ScatterChartInputPoint[] }; dataIndex: number },
    ) => string;
    const text = fmt!(null, {
      dataset: { originalData: [{ x: 1, y: 2 }] },
      dataIndex: 0,
    });
    expect(text).toBe('(1, 2)');
  });

  it('caption formatter uses pointLabel', () => {
    const opts = getScatterChartOptions({ showPointLabels: true });
    const fmt = opts.plugins?.datalabels?.labels?.caption?.formatter as (
      v: unknown,
      ctx: { dataset: { originalData?: ScatterChartInputPoint[] }; dataIndex: number },
    ) => string;
    const text = fmt!(null, {
      dataset: { originalData: [{ x: 1, y: 2, pointLabel: 'P' }] },
      dataIndex: 0,
    });
    expect(text).toBe('P');
  });

  it('shows null-band label on y tick at null position', () => {
    const datasets: { data: ScatterChartInputPoint[] }[] = [
      {
        data: [
          { x: 1, y: null },
          { x: 2, y: 8 },
        ],
      },
    ];
    const nullBand = computeScatterNullBand(datasets);
    const opts = getScatterChartOptions({ nullBandLabel: 'NV', nullBand });
    const cb = opts.scales?.y?.ticks?.callback as (
      this: unknown,
      v: string | number,
      i: number,
      ticks: unknown[],
    ) => string;
    const label = cb!.call({}, nullBand!.yNullPos, 0, []);
    expect(label).toBe('NV');
  });

  it('hides y-axis grid lines by default (no chart grid, like scatter without Show grid)', () => {
    const opts = getScatterChartOptions({});
    expect(opts.scales?.y?.grid?.display).toBe(false);
    expect(opts.scales?.x?.grid?.display).toBe(false);
  });

  it('does not override Chart.js default linear-axis tick / auto-skip rules', () => {
    const opts = getScatterChartOptions({});
    expect(opts.scales?.x?.ticks?.maxTicksLimit).toBeUndefined();
    expect(opts.scales?.x?.ticks?.autoSkipPadding).toBeUndefined();
    expect(opts.scales?.y?.ticks?.maxTicksLimit).toBeUndefined();
    expect(opts.scales?.y?.ticks?.autoSkipPadding).toBeUndefined();
  });

  it('uses grace instead of beginAtZero on linear y so the data band is not compressed', () => {
    const opts = getScatterChartOptions({ showLogarithmicScale: false });
    expect((opts.scales?.y as { grace?: string })?.grace).toBe('5%');
    expect(Object.prototype.hasOwnProperty.call(opts.scales?.y ?? {}, 'beginAtZero')).toBe(false);
  });

  it('does not set grace on logarithmic y', () => {
    const opts = getScatterChartOptions({ showLogarithmicScale: true });
    expect((opts.scales?.y as { grace?: string })?.grace).toBeUndefined();
  });

  it('value label display respects chart scales and mapped point', () => {
    const opts = getScatterChartOptions({ showValueLabels: true });
    const display = opts.plugins?.datalabels?.labels?.value?.display as (
      ctx: MockLabelCtx,
    ) => boolean;
    const ok = display!({
      chart: {
        scales: {
          x: { min: 0, max: 10, type: 'linear' },
          y: { min: 0, max: 10, type: 'linear' },
        },
      },
      dataset: {
        data: [{ x: 2, y: 3 }],
        originalData: [{ x: 2, y: 3 }],
      },
      dataIndex: 0,
    });
    expect(ok).toBe('auto');
  });

  it('hides value labels on logarithmic y when mapped y is not positive', () => {
    const opts = getScatterChartOptions({ showValueLabels: true, showLogarithmicScale: true });
    const display = opts.plugins?.datalabels?.labels?.value?.display as (
      ctx: MockLabelCtx,
    ) => boolean;
    const bad = display!({
      chart: {
        scales: {
          x: { min: 0, max: 10, type: 'linear' },
          y: { min: 0.1, max: 10, type: 'logarithmic' },
        },
      },
      dataset: {
        data: [{ x: 1, y: 0 }],
        originalData: [{ x: 1, y: 0 }],
      },
      dataIndex: 0,
    });
    expect(bad).toBe(false);
  });

  it('computes value and caption offsets when both value and point labels are shown', () => {
    const opts = getScatterChartOptions({ showValueLabels: true, showPointLabels: true });
    const valueOffset = opts.plugins?.datalabels?.labels?.value?.offset as (
      ctx: MockLabelCtx,
    ) => number;
    const captionOffset = opts.plugins?.datalabels?.labels?.caption?.offset as (
      ctx: MockLabelCtx,
    ) => number;
    const ctx: MockLabelCtx = {
      chart: {
        scales: {
          x: { min: 0, max: 10, type: 'linear' },
          y: { min: 0, max: 10, type: 'linear' },
        },
      },
      dataset: {
        data: [{ x: 1, y: 2 }],
        originalData: [{ x: 1, y: 2, pointLabel: 'P' }],
      },
      dataIndex: 0,
    };
    expect(valueOffset!(ctx)).toBeGreaterThan(0);
    expect(captionOffset!(ctx)).toBeGreaterThan(0);
  });

  it('point label display is false when caption text is missing', () => {
    const opts = getScatterChartOptions({ showPointLabels: true });
    const display = opts.plugins?.datalabels?.labels?.caption?.display as (
      ctx: MockLabelCtx,
    ) => 'auto' | false;
    expect(
      display!({
        chart: { scales: { x: {}, y: {} } },
        dataset: { data: [{ x: 1, y: 2 }], originalData: [{ x: 1, y: 2 }] },
        dataIndex: 0,
      }),
    ).toBe(false);
  });

  it('uses default number format for axis tick labels', () => {
    const opts = getScatterChartOptions({});
    const xCb = opts.scales?.x?.ticks?.callback as (v: string | number) => string;
    const yCb = opts.scales?.y?.ticks?.callback as (v: string | number) => string;
    expect(xCb(1_000_000)).toBe(new Intl.NumberFormat().format(1_000_000));
    expect(yCb(2)).toBe(new Intl.NumberFormat().format(2));
  });
});

type MockLabelCtx = {
  chart: { scales: Record<string, { min?: number; max?: number; type?: string }> };
  dataset: { data: { x: number; y: number }[]; originalData?: ScatterChartInputPoint[] };
  dataIndex: number;
};

// ─── getBubbleChartData ───────────────────────────────────────────────────────

describe('getBubbleChartData', () => {
  const baseData: ChartData<'bubble', BubbleChartInputPoint[]> = {
    datasets: [
      {
        label: 'S',
        data: [
          { x: 1, y: 2, size: 100 },
          { x: 3, y: 4, size: 25 },
        ],
      },
    ],
  };

  it('scales r proportionally to size by area (largest maps to bubbleRadiusMax)', () => {
    const out = getBubbleChartData(baseData, {
      nullBand: null,
      bubbleRadiusMin: 5,
      bubbleRadiusMax: 40,
    });
    const d0 = out.datasets[0]!.data[0] as { r: number };
    const d1 = out.datasets[0]!.data[1] as { r: number };
    expect(d0.r).toBeCloseTo(40); // sqrt(100/100) * 40
    expect(d1.r).toBeCloseTo(20); // sqrt(25/100) * 40
  });

  it('enforces minimum radius for very small size values', () => {
    const data: ChartData<'bubble', BubbleChartInputPoint[]> = {
      datasets: [
        {
          label: 'S',
          data: [
            { x: 1, y: 2, size: 0.001 },
            { x: 3, y: 4, size: 1000 },
          ],
        },
      ],
    };
    const out = getBubbleChartData(data, {
      nullBand: null,
      bubbleRadiusMin: 5,
      bubbleRadiusMax: 40,
    });
    const d0 = out.datasets[0]!.data[0] as { r: number };
    expect(d0.r).toBe(5);
  });

  it('maps null and undefined size to minimum radius', () => {
    const data: ChartData<'bubble', BubbleChartInputPoint[]> = {
      datasets: [
        {
          label: 'S',
          data: [
            { x: 1, y: 2, size: null },
            { x: 3, y: 4, size: undefined },
            { x: 5, y: 6, size: 100 },
          ],
        },
      ],
    };
    const out = getBubbleChartData(data, {
      nullBand: null,
      bubbleRadiusMin: 5,
      bubbleRadiusMax: 40,
    });
    expect((out.datasets[0]!.data[0] as { r: number }).r).toBe(5);
    expect((out.datasets[0]!.data[1] as { r: number }).r).toBe(5);
  });

  it('stores computedRadii on dataset for hover scaling', () => {
    const out = getBubbleChartData(baseData, {
      nullBand: null,
      bubbleRadiusMin: 5,
      bubbleRadiusMax: 40,
    });
    const ds = out.datasets[0] as BubbleDatasetWithOriginal;
    expect(ds.computedRadii).toHaveLength(2);
    expect(ds.computedRadii![0]).toBeCloseTo(40);
    expect(ds.computedRadii![1]).toBeCloseTo(20);
  });

  it('stores originalData with full BubbleChartInputPoint shape', () => {
    const out = getBubbleChartData(baseData, { nullBand: null });
    const ds = out.datasets[0] as BubbleDatasetWithOriginal;
    expect(ds.originalData?.[0]).toMatchObject({ x: 1, y: 2, size: 100 });
  });

  it('maps null x to null band position', () => {
    const raw: ChartData<'bubble', BubbleChartInputPoint[]> = {
      datasets: [
        {
          label: 'S',
          data: [
            { x: null, y: 10, size: 50 },
            { x: 10, y: 20, size: 100 },
          ],
        },
      ],
    };
    const nullBand = computeScatterNullBand(raw.datasets);
    const out = getBubbleChartData(raw, { nullBand });
    const p0 = out.datasets[0]!.data[0] as { x: number; y: number };
    expect(p0.x).toBe(nullBand!.xNullPos);
    expect(p0.y).toBe(10);
  });

  it('uses bubbleRadiusMin and bubbleRadiusMax props over CSS vars', () => {
    const out = getBubbleChartData(baseData, {
      nullBand: null,
      bubbleRadiusMin: 10,
      bubbleRadiusMax: 50,
    });
    const d0 = out.datasets[0]!.data[0] as { r: number };
    const d1 = out.datasets[0]!.data[1] as { r: number };
    expect(d0.r).toBeCloseTo(50); // sqrt(100/100) * 50
    expect(d1.r).toBeCloseTo(25); // max(10, sqrt(25/100) * 50)
  });
});

// ─── getBubbleChartOptions ────────────────────────────────────────────────────

describe('getBubbleChartOptions', () => {
  type BubbleTooltipCtx = {
    dataset: { label?: string; originalData?: BubbleChartInputPoint[] };
    dataIndex: number;
    parsed: { x: number; y: number; r: number };
  };

  it('tooltip label shows (x, y, size) triplet with series name', () => {
    const opts = getBubbleChartOptions({ nullBandLabel: 'NV' });
    const labelFn = opts.plugins?.tooltip?.callbacks?.label as unknown as (
      ctx: BubbleTooltipCtx,
    ) => string;
    const s = labelFn({
      dataset: { label: 'S', originalData: [{ x: 1, y: 2, size: 300 }] },
      dataIndex: 0,
      parsed: { x: 1, y: 2, r: 15 },
    });
    expect(s).toContain('S');
    expect(s).toContain('1');
    expect(s).toContain('2');
    expect(s).toContain('300');
  });

  it('tooltip label shows nullBandLabel for null size', () => {
    const opts = getBubbleChartOptions({ nullBandLabel: 'NV' });
    const labelFn = opts.plugins?.tooltip?.callbacks?.label as unknown as (
      ctx: BubbleTooltipCtx,
    ) => string;
    const s = labelFn({
      dataset: { label: 'S', originalData: [{ x: 1, y: 2, size: null }] },
      dataIndex: 0,
      parsed: { x: 1, y: 2, r: 5 },
    });
    expect(s).toContain('NV');
  });

  it('tooltip label shows nullBandLabel for null x', () => {
    const opts = getBubbleChartOptions({ nullBandLabel: 'NV' });
    const labelFn = opts.plugins?.tooltip?.callbacks?.label as unknown as (
      ctx: BubbleTooltipCtx,
    ) => string;
    const s = labelFn({
      dataset: { label: 'S', originalData: [{ x: null, y: 2, size: 100 }] },
      dataIndex: 0,
      parsed: { x: 0, y: 2, r: 15 },
    });
    expect(s).toContain('NV');
  });

  it('hoverRadius is a function that scales proportionally to computedRadii', () => {
    const opts = getBubbleChartOptions({});
    const hoverFn = opts.elements?.point?.hoverRadius as unknown as (ctx: {
      dataIndex: number;
      dataset: { computedRadii?: number[] };
    }) => number;
    expect(typeof hoverFn).toBe('function');
    // hoverScale = 1.2 (from mock), r = 20 → 20 * 0.2 = 4
    expect(hoverFn({ dataIndex: 0, dataset: { computedRadii: [20] } })).toBeCloseTo(4);
  });

  it('hoverRadius falls back to bubbleMinRadiusPx when computedRadii is absent', () => {
    const opts = getBubbleChartOptions({});
    const hoverFn = opts.elements?.point?.hoverRadius as unknown as (ctx: {
      dataIndex: number;
      dataset: { computedRadii?: number[] };
    }) => number;
    // minR = 5, hoverScale = 1.2 → 5 * 0.2 = 1
    expect(hoverFn({ dataIndex: 0, dataset: {} })).toBeCloseTo(1);
  });

  it('inherits linear x and logarithmic y option from scatter base', () => {
    const linear = getBubbleChartOptions({});
    expect(linear.scales?.x?.type).toBe('linear');
    expect(linear.scales?.y?.type).toBe('linear');
    const log = getBubbleChartOptions({ showLogarithmicScale: true });
    expect(log.scales?.x?.type).toBe('linear');
    expect(log.scales?.y?.type).toBe('logarithmic');
  });

  it('shows null-band label on x tick at null position', () => {
    const datasets: { data: BubbleChartInputPoint[] }[] = [
      {
        data: [
          { x: null, y: 1, size: 10 },
          { x: 10, y: 2, size: 20 },
        ],
      },
    ];
    const nullBand = computeScatterNullBand(datasets);
    const opts = getBubbleChartOptions({ nullBandLabel: 'NV', nullBand });
    const cb = opts.scales?.x?.ticks?.callback as (
      this: unknown,
      v: string | number,
      i: number,
      ticks: unknown[],
    ) => string;
    expect(cb!.call({}, nullBand!.xNullPos, 0, [])).toBe('NV');
  });
});
