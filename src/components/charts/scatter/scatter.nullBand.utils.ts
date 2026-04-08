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

export function computeScatterNullBand(
  datasets: { data: ScatterChartInputPoint[] }[],
): ScatterNullBandResult | null {
  if (!datasets.length) return null;

  const allX: number[] = [];
  const allY: number[] = [];
  let foundNullX = false;
  let foundNullY = false;

  for (const ds of datasets) {
    for (const pt of ds.data) {
      if (pt.x !== null && pt.x !== undefined) allX.push(pt.x);
      else foundNullX = true;
      if (pt.y !== null && pt.y !== undefined) allY.push(pt.y);
      else foundNullY = true;
    }
  }

  const xNumMin = allX.length ? Math.min(...allX) : 0;
  const xNumMax = allX.length ? Math.max(...allX) : 0;
  const yNumMin = allY.length ? Math.min(...allY) : 0;
  const yNumMax = allY.length ? Math.max(...allY) : 0;
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
