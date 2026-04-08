import { describe, expect, it } from 'vitest';
import {
  NULL_BAND_OFFSET,
  NULL_BAND_PADDING,
  computeScatterNullBand,
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
