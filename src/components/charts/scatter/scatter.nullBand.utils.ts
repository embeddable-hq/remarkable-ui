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

const isMissingAxisValue = (value: number | null | undefined): boolean =>
  value === null || value === undefined || !Number.isFinite(value);

const accumulateExtent = (ext: AxisExtent, value: number): void => {
  ext.min = Math.min(ext.min, value);
  ext.max = Math.max(ext.max, value);
  ext.count += 1;
};

const extentToNumBounds = (ext: AxisExtent): { min: number; max: number } => {
  if (ext.count === 0) return { min: 0, max: 0 };
  return { min: ext.min, max: ext.max };
};

const scanDatasetsForNullBandAxes = (
  datasets: { data: ScatterChartInputPoint[] }[],
): { foundNullX: boolean; foundNullY: boolean; xExt: AxisExtent; yExt: AxisExtent } => {
  let foundNullX = false;
  let foundNullY = false;
  const xExt = finiteExtent();
  const yExt = finiteExtent();

  for (const ds of datasets) {
    for (const pt of ds.data) {
      if (isMissingAxisValue(pt.x)) foundNullX = true;
      else accumulateExtent(xExt, pt.x as number);
      if (isMissingAxisValue(pt.y)) foundNullY = true;
      else accumulateExtent(yExt, pt.y as number);
    }
  }

  return { foundNullX, foundNullY, xExt, yExt };
};

const computedAxisMinWhenNull = (
  hasNullOnAxis: boolean,
  nullPos: number,
  range: number,
): number | undefined => {
  if (!hasNullOnAxis) return undefined;
  return nullPos - NULL_BAND_PADDING * range;
};

export const computeScatterNullBand = (
  datasets: { data: ScatterChartInputPoint[] }[],
): ScatterNullBandResult | null => {
  if (!datasets.length) return null;

  const { foundNullX, foundNullY, xExt, yExt } = scanDatasetsForNullBandAxes(datasets);
  if (!foundNullX && !foundNullY) return null;

  const { min: xNumMin, max: xNumMax } = extentToNumBounds(xExt);
  const { min: yNumMin, max: yNumMax } = extentToNumBounds(yExt);
  const xRange = Math.max(xNumMax - xNumMin, 1);
  const yRange = Math.max(yNumMax - yNumMin, 1);
  const xNullPos = xNumMin - NULL_BAND_OFFSET * xRange;
  const yNullPos = yNumMin - NULL_BAND_OFFSET * yRange;

  return {
    xNullPos,
    yNullPos,
    hasNullX: foundNullX,
    hasNullY: foundNullY,
    computedXAxisMin: computedAxisMinWhenNull(foundNullX, xNullPos, xRange),
    computedYAxisMin: computedAxisMinWhenNull(foundNullY, yNullPos, yRange),
    xRange,
    yRange,
    xNumMin,
    xNumMax,
    yNumMin,
    yNumMax,
  };
};

export type ScatterNullBandPluginOptions = {
  nullBand: ScatterNullBandResult;
};

export const createScatterNullBandPlugin = (
  options: ScatterNullBandPluginOptions,
): Plugin<'scatter'> => {
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
};
