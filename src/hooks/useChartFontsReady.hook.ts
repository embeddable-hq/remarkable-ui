import { RefObject, useEffect } from 'react';
import { Chart } from 'chart.js';
import {
  areFontsApiAvailable,
  preloadChartFonts,
  remeasureChart,
} from '../components/charts/chartjs.fonts.utils';

// Re-measures the chart once its web fonts load, so labels aren't clipped (#433).
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

    fonts.addEventListener('loadingdone', remeasure);

    // Some WebKit versions don't fire `loadingdone` for fonts.load() (bug 304091).
    preloadChartFonts().then(remeasure, remeasure);

    return () => {
      cancelled = true;
      fonts.removeEventListener('loadingdone', remeasure);
    };
  }, [chartRef]);
}
