import { describe, expect, it } from 'vitest';
import { getChartjsAxisOptionsScales } from './chartjs.cartesian.constants';

describe('getChartjsAxisOptionsScales', () => {
  describe('y scale afterBuildTicks', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getAfterBuildTicks = (): ((scale: any) => void) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const scales = getChartjsAxisOptionsScales() as any;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      return scales.y.afterBuildTicks as (scale: any) => void;
    };

    const makeMockScale = (datasets: { data: number[] }[], ticks: { value: number }[]) => ({
      chart: { data: { datasets } },
      ticks: [...ticks],
    });

    it('filters out non-integer ticks when all data values are integers', () => {
      const afterBuildTicks = getAfterBuildTicks();
      const scale = makeMockScale(
        [{ data: [1, 2, 3] }],
        [
          { value: 0 },
          { value: 0.5 },
          { value: 1 },
          { value: 1.5 },
          { value: 2 },
          { value: 2.5 },
          { value: 3 },
        ],
      );
      afterBuildTicks(scale);
      expect(scale.ticks.every((t) => Number.isInteger(t.value))).toBe(true);
    });

    it('leaves ticks unchanged when data contains decimal values', () => {
      const afterBuildTicks = getAfterBuildTicks();
      const scale = makeMockScale(
        [{ data: [1.5, 2.5] }],
        [{ value: 0 }, { value: 0.5 }, { value: 1 }, { value: 1.5 }, { value: 2 }, { value: 2.5 }],
      );
      const originalTicks = [...scale.ticks];
      afterBuildTicks(scale);
      expect(scale.ticks).toEqual(originalTicks);
    });

    it('leaves ticks unchanged when datasets are empty', () => {
      const afterBuildTicks = getAfterBuildTicks();
      const scale = makeMockScale([], [{ value: 0 }, { value: 0.5 }, { value: 1 }]);
      const originalTicks = [...scale.ticks];
      afterBuildTicks(scale);
      expect(scale.ticks).toEqual(originalTicks);
    });

    it('filters non-integer ticks for large integer ranges (no threshold)', () => {
      const afterBuildTicks = getAfterBuildTicks();
      const scale = makeMockScale(
        [{ data: [10, 20, 30] }],
        [{ value: 0 }, { value: 3.33 }, { value: 10 }, { value: 20 }, { value: 30 }],
      );
      afterBuildTicks(scale);
      expect(scale.ticks.every((t) => Number.isInteger(t.value))).toBe(true);
    });

    it('handles multiple datasets correctly', () => {
      const afterBuildTicks = getAfterBuildTicks();
      const scale = makeMockScale(
        [{ data: [1, 2] }, { data: [3, 4] }],
        [{ value: 0 }, { value: 0.5 }, { value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }],
      );
      afterBuildTicks(scale);
      expect(scale.ticks.every((t) => Number.isInteger(t.value))).toBe(true);
    });
  });
});
