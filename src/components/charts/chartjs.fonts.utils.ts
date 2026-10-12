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

// Charts draw to a canvas, so nothing in the DOM may request the web font before the first draw.
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

  await Promise.allSettled(loads);
};

// Clears Chart.js's internal per-scale text measure cache, which `update()` alone doesn't reset.
export const remeasureChart = (chart: Chart): void => {
  Object.values(chart.scales ?? {}).forEach((scale) => {
    const internalScale = scale as unknown as { _longestTextCache?: Record<string, unknown> };
    if (internalScale._longestTextCache) internalScale._longestTextCache = {};
  });
  chart.update();
};
