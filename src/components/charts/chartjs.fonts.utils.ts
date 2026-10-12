import { Chart } from 'chart.js';
import { getStyle } from '../../styles/styles.utils';
import { StylesKeys } from '../../styles/styles.constants';

const CHART_FONT_FAMILY_VARIABLES: StylesKeys[] = [
  '--em-chart-category-font-family',
  '--em-chart-grid-font-family',
  '--em-chart-label-font-family',
  '--em-chart-tooltip-family',
  '--em-piechart-font-family',
];

const CHART_FONT_WEIGHT_VARIABLES: StylesKeys[] = [
  '--em-core-font-weight--regular',
  '--em-core-font-weight--medium',
  '--em-core-font-weight--bold',
];

export const areFontsApiAvailable = (): boolean =>
  typeof document !== 'undefined' && !!document.fonts;

/**
 * Asks the browser to load the font families (and weights) used by the charts.
 * A web font is only fetched once something in the DOM uses it, and charts draw to a
 * canvas, so without this the font may never be requested before the first draw.
 */
export const preloadChartFonts = async (): Promise<void> => {
  if (!areFontsApiAvailable()) return;

  const families = new Set(
    CHART_FONT_FAMILY_VARIABLES.map((variable) => getStyle(variable)).filter(Boolean),
  );
  const weights = new Set(
    CHART_FONT_WEIGHT_VARIABLES.map((variable) => getStyle(variable)).filter(Boolean),
  );

  const loads: Promise<unknown>[] = [];
  families.forEach((family) => {
    weights.forEach((weight) => {
      loads.push(document.fonts.load(`${weight} 1em ${family}`));
    });
  });

  // A font that fails to load must never prevent the chart from rendering.
  await Promise.allSettled(loads);
};

/**
 * Chart.js caches text measurements per scale (keyed by font string, not by whether the
 * font has actually loaded), so measurements taken with a fallback font would otherwise
 * survive `chart.update()`. `_longestTextCache` is internal to Chart.js, so this is
 * guarded and degrades to a plain update if it ever goes away.
 */
export const remeasureChart = (chart: Chart): void => {
  Object.values(chart.scales ?? {}).forEach((scale) => {
    const internalScale = scale as unknown as { _longestTextCache?: Record<string, unknown> };
    if (internalScale._longestTextCache) internalScale._longestTextCache = {};
  });
  chart.update();
};
