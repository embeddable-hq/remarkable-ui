import type { Plugin } from 'chart.js';
import type { ScatterChartInputPoint } from './scatter.types';

export const NULL_BAND_OFFSET = 0.25;
export const NULL_BAND_PADDING = 0.08;

export type ScatterNullBandResult = {
  xNullPos: number;
  yNullPos: number;
  hasNullX: boolean;
  hasNullY: boolean;
  computedXAxisMin: number | undefined;
  computedYAxisMin: number | undefined;
  xRange: number;
  yRange: number;
  xNumMin: number;
  xNumMax: number;
  yNumMin: number;
  yNumMax: number;
};

type AxisExtent = { min: number; max: number; count: number };

const finiteExtent = (): AxisExtent => ({
  min: Infinity,
  max: -Infinity,
  count: 0,
});

function accumulatePointAxisValue(ext: AxisExtent, value: number | null | undefined): boolean {
  if (value === null || value === undefined) return true;
  if (!Number.isFinite(value)) return true;
  ext.min = Math.min(ext.min, value);
  ext.max = Math.max(ext.max, value);
  ext.count += 1;
  return false;
}

export function computeScatterNullBand(
  datasets: { data: ScatterChartInputPoint[] }[],
): ScatterNullBandResult | null {
  if (!datasets.length) return null;

  let foundNullX = false;
  let foundNullY = false;
  const xExt = finiteExtent();
  const yExt = finiteExtent();

  for (const ds of datasets) {
    for (const pt of ds.data) {
      if (accumulatePointAxisValue(xExt, pt.x)) foundNullX = true;
      if (accumulatePointAxisValue(yExt, pt.y)) foundNullY = true;
    }
  }

  const xNumMin = xExt.count > 0 ? xExt.min : 0;
  const xNumMax = xExt.count > 0 ? xExt.max : 0;
  const yNumMin = yExt.count > 0 ? yExt.min : 0;
  const yNumMax = yExt.count > 0 ? yExt.max : 0;
  const xRange = Math.max(xNumMax - xNumMin, 1);
  const yRange = Math.max(yNumMax - yNumMin, 1);

  const xNullPos = xNumMin - NULL_BAND_OFFSET * xRange;
  const yNullPos = yNumMin - NULL_BAND_OFFSET * yRange;

  const computedXAxisMin = foundNullX ? xNullPos - NULL_BAND_PADDING * xRange : undefined;
  const computedYAxisMin = foundNullY ? yNullPos - NULL_BAND_PADDING * yRange : undefined;

  return {
    xNullPos,
    yNullPos,
    hasNullX: foundNullX,
    hasNullY: foundNullY,
    computedXAxisMin,
    computedYAxisMin,
    xRange,
    yRange,
    xNumMin,
    xNumMax,
    yNumMin,
    yNumMax,
  };
}

export type ScatterNullBandPluginOptions = {
  nullBand: ScatterNullBandResult;
};

export function createScatterNullBandPlugin(
  options: ScatterNullBandPluginOptions,
): Plugin<'scatter'> {
  const { nullBand } = options;
  const { xNullPos, yNullPos, hasNullX, hasNullY, xNumMin, yNumMin } = nullBand;

  return {
    id: 'scatterNullBand',
    afterBuildTicks(_chart, args) {
      const scale = args.scale;
      if (!scale) return;

      if (scale.id === 'x' && hasNullX) {
        const ticks = scale.ticks.filter((t: { value: number }) => t.value >= xNumMin);
        scale.ticks = [{ value: xNullPos }, ...ticks];
      }
      if (scale.id === 'y' && hasNullY) {
        const ticks = scale.ticks.filter((t: { value: number }) => t.value >= yNumMin);
        scale.ticks = [{ value: yNullPos }, ...ticks];
      }
    },
  };
}
