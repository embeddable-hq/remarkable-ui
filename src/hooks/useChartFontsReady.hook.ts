import { RefObject, useEffect } from 'react';
import { Chart } from 'chart.js';
import {
  areFontsApiAvailable,
  preloadChartFonts,
  remeasureChart,
} from '../components/charts/chartjs.fonts.utils';

/**
 * Chart.js measures axis labels on the first draw. If the theme's web font hasn't loaded
 * yet, it measures with fallback font metrics and e.g. clips the longest label. This hook
 * requests the chart fonts and re-measures the chart once they are available.
 * See https://github.com/embeddable-hq/remarkable-ui/issues/433
 */
export function useChartFontsReady(chartRef: RefObject<unknown>): void {
  useEffect(() => {
    if (!areFontsApiAvailable()) return;

    const fonts = document.fonts;
    let cancelled = false;

    const remeasure = () => {
      const chart = chartRef.current as Chart | null;
      if (cancelled || !chart?.canvas) return;
      remeasureChart(chart);
    };

    // Fires whenever a batch of fonts finishes loading, including the ones requested below
    // and any requested by other elements on the page. Fonts that were already loaded never
    // fire it, so charts that drew with the right font are not updated needlessly.
    fonts.addEventListener('loadingdone', remeasure);
    preloadChartFonts();

    return () => {
      cancelled = true;
      fonts.removeEventListener('loadingdone', remeasure);
    };
  }, [chartRef]);
}
