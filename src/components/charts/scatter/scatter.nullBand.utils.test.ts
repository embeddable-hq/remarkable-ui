import { describe, expect, it } from 'vitest';
import {
  NULL_BAND_OFFSET,
  NULL_BAND_PADDING,
  computeScatterNullBand,
  createScatterNullBandPlugin,
} from './scatter.nullBand.utils';
import type { ScatterChartInputPoint } from './scatter.types';

describe('computeScatterNullBand', () => {
  it('returns null when there are no datasets', () => {
    expect(computeScatterNullBand([])).toBeNull();
  });

  it('detects null x and null y independently', () => {
    const datasets: { data: ScatterChartInputPoint[] }[] = [
      {
        data: [
          { x: 10, y: 5 },
          { x: null, y: 8 },
          { x: 12, y: null },
        ],
      },
    ];
    const r = computeScatterNullBand(datasets);
    expect(r).not.toBeNull();
    expect(r!.hasNullX).toBe(true);
    expect(r!.hasNullY).toBe(true);
  });

  it('treats non-finite coordinates as null for hasNullX / hasNullY flags', () => {
    const datasets: { data: ScatterChartInputPoint[] }[] = [
      {
        data: [
          { x: NaN, y: 1 },
          { x: 2, y: 3 },
        ],
      },
    ];
    const r = computeScatterNullBand(datasets);
    expect(r!.hasNullX).toBe(true);
    expect(r!.hasNullY).toBe(false);
  });

  it('uses only non-null coordinates for numeric extent', () => {
    const datasets: { data: ScatterChartInputPoint[] }[] = [
      {
        data: [
          { x: 2, y: null },
          { x: 8, y: 4 },
        ],
      },
    ];
    const r = computeScatterNullBand(datasets);
    expect(r!.xNumMin).toBe(2);
    expect(r!.xNumMax).toBe(8);
    expect(r!.yNumMin).toBe(4);
    expect(r!.yNumMax).toBe(4);
  });

  it('ignores non-finite coordinates for extent so NaN does not break range', () => {
    const datasets: { data: ScatterChartInputPoint[] }[] = [
      {
        data: [
          { x: NaN, y: 1 },
          { x: 10, y: Infinity },
          { x: 2, y: 5 },
        ],
      },
    ];
    const r = computeScatterNullBand(datasets);
    expect(r!.xNumMin).toBe(2);
    expect(r!.xNumMax).toBe(10);
    expect(r!.yNumMin).toBe(1);
    expect(r!.yNumMax).toBe(5);
    expect(Number.isFinite(r!.xNullPos)).toBe(true);
    expect(Number.isFinite(r!.yNullPos)).toBe(true);
  });

  it('applies sandbox null-band position and axis min padding', () => {
    const datasets: { data: ScatterChartInputPoint[] }[] = [
      {
        data: [
          { x: 10, y: 20 },
          { x: null, y: 30 },
        ],
      },
    ];
    const r = computeScatterNullBand(datasets);
    expect(r!.hasNullX).toBe(true);
    expect(r!.hasNullY).toBe(false);

    expect(r!.xRange).toBeGreaterThanOrEqual(1);
    const expectedXNull = r!.xNumMin - NULL_BAND_OFFSET * r!.xRange;
    expect(r!.xNullPos).toBeCloseTo(expectedXNull);
    expect(r!.computedXAxisMin).toBeCloseTo(expectedXNull - NULL_BAND_PADDING * r!.xRange);
    expect(r!.computedYAxisMin).toBeUndefined();
  });

  it('uses range at least 1 when all x or all y are null', () => {
    const onlyNullX: { data: ScatterChartInputPoint[] }[] = [
      {
        data: [
          { x: null, y: 1 },
          { x: null, y: 3 },
        ],
      },
    ];
    const r = computeScatterNullBand(onlyNullX);
    expect(r!.xRange).toBe(1);
    expect(r!.yRange).toBe(2);
    expect(r!.hasNullX).toBe(true);
  });
});

describe('createScatterNullBandPlugin', () => {
  it('prepends null x tick on x scale when hasNullX', () => {
    const nullBand = computeScatterNullBand([
      {
        data: [
          { x: null, y: 1 },
          { x: 8, y: 2 },
        ],
      },
    ]);
    expect(nullBand).not.toBeNull();

    const plugin = createScatterNullBandPlugin({ nullBand: nullBand! });
    const scale = {
      id: 'x',
      ticks: [{ value: 8 }, { value: 12 }],
    };

    plugin.afterBuildTicks?.({} as never, { scale } as never, {} as never);

    expect(scale.ticks[0]!.value).toBe(nullBand!.xNullPos);
    expect(scale.ticks.map((t) => t.value)).toContain(8);
  });

  it('prepends null y tick on y scale when hasNullY', () => {
    const nullBand = computeScatterNullBand([
      {
        data: [
          { x: 1, y: null },
          { x: 2, y: 10 },
        ],
      },
    ]);
    expect(nullBand).not.toBeNull();

    const plugin = createScatterNullBandPlugin({ nullBand: nullBand! });
    const scale = {
      id: 'y',
      ticks: [{ value: 10 }, { value: 20 }],
    };

    plugin.afterBuildTicks?.({} as never, { scale } as never, {} as never);

    expect(scale.ticks[0]!.value).toBe(nullBand!.yNullPos);
  });

  it('does nothing when scale is missing', () => {
    const nullBand = computeScatterNullBand([{ data: [{ x: null, y: 1 }] }]);
    const plugin = createScatterNullBandPlugin({ nullBand: nullBand! });
    expect(() =>
      plugin.afterBuildTicks?.({} as never, { scale: undefined } as never, {} as never),
    ).not.toThrow();
  });

  it('does not modify ticks for unrelated scale ids', () => {
    const nullBand = computeScatterNullBand([{ data: [{ x: null, y: 1 }] }]);
    const plugin = createScatterNullBandPlugin({ nullBand: nullBand! });
    const scale = {
      id: 'r',
      ticks: [{ value: 1 }],
    };
    plugin.afterBuildTicks?.({} as never, { scale } as never, {} as never);
    expect(scale.ticks).toEqual([{ value: 1 }]);
  });
});
