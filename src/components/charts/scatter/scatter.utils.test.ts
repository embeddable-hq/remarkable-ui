import { describe, expect, it, vi } from 'vitest';
import type { ChartData, ChartOptions } from 'chart.js';
import type { ScatterChartInputPoint } from './scatter.types';
import { computeScatterNullBand } from './scatter.nullBand.utils';

vi.mock('../charts.constants', () => ({
  getChartColors: vi.fn(() => ['#111111', '#222222']),
}));

vi.mock('../../../styles/styles.utils', () => ({
  getStyle: vi.fn((_k: string, fb: string) => fb),
  getStyleNumber: vi.fn((_k: string, fallback: string) => parseFloat(fallback) || 0),
}));

import {
  applyOpacityToColor,
  filterNumericScatterData,
  applyScatterNullBandToData as getScatterChartData,
  getScatterChartOptions,
  hasNullMeasure,
} from './scatter.utils';

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

describe('applyOpacityToColor', () => {
  it('returns fallback rgba when color is empty', () => {
    expect(applyOpacityToColor('', 0.5)).toBe('rgba(33, 33, 41, 0.5)');
    expect(applyOpacityToColor('   ', 0.5)).toBe('rgba(33, 33, 41, 0.5)');
  });

  it('parses rgb from computed style and applies alpha', () => {
    const el = document.createElement('span');
    el.style.color = 'rgb(255, 0, 0)';
    document.body.appendChild(el);
    const rgb = getComputedStyle(el).color;
    document.body.removeChild(el);

    const out = applyOpacityToColor(rgb, 0.4);
    expect(out).toMatch(/^rgba\(\s*255\s*,\s*0\s*,\s*0\s*,\s*0\.4\s*\)$/);
  });

  it('returns fallback rgba when computed style does not match rgb pattern', () => {
    const spy = vi
      .spyOn(window, 'getComputedStyle')
      .mockReturnValue({ color: 'invalid' } as CSSStyleDeclaration);
    try {
      expect(applyOpacityToColor('#ff0000', 0.2)).toBe('rgba(33, 33, 41, 0.2)');
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
