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

    // Fires whenever a batch of fonts finishes loading, including any requested by other
    // elements on the page after the preload below has settled.
    fonts.addEventListener('loadingdone', remeasure);

    // Some WebKit versions load fonts via document.fonts.load() without dispatching
    // `loadingdone` (WebKit bug 304091), so also re-measure when the preload settles.
    preloadChartFonts().finally(remeasure);

    return () => {
      cancelled = true;
      fonts.removeEventListener('loadingdone', remeasure);
    };
  }, [chartRef]);
}
