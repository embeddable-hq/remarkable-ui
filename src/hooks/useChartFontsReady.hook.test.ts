import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useChartFontsReady } from './useChartFontsReady.hook';

type Listener = () => void;

const setupFonts = () => {
  const listeners = new Set<Listener>();
  const fonts = {
    load: vi.fn().mockResolvedValue([]),
    addEventListener: vi.fn((_: string, fn: Listener) => listeners.add(fn)),
    removeEventListener: vi.fn((_: string, fn: Listener) => listeners.delete(fn)),
  };
  Object.defineProperty(document, 'fonts', { value: fonts, configurable: true });
  return { fonts, fire: () => listeners.forEach((fn) => fn()) };
};

const buildChart = () => {
  const scale = { _longestTextCache: { '12px Inter': { data: {}, gc: [] } } };
  return {
    canvas: document.createElement('canvas'),
    scales: { x: scale },
    update: vi.fn(),
    scale,
  };
};

describe('useChartFontsReady', () => {
  beforeEach(() => {
    document.documentElement.style.setProperty('--em-chart-grid-font-family', "'Inter'");
    document.documentElement.style.setProperty('--em-core-font-weight--regular', '400');
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (document as any).fonts;
    document.documentElement.style.removeProperty('--em-chart-grid-font-family');
    document.documentElement.style.removeProperty('--em-core-font-weight--regular');
  });

  it('preloads the chart fonts', () => {
    const { fonts } = setupFonts();
    renderHook(() => useChartFontsReady({ current: buildChart() }));

    expect(fonts.load).toHaveBeenCalledWith("400 1em 'Inter'");
  });

  it('clears the text measure cache and updates the chart when fonts finish loading', () => {
    const { fire } = setupFonts();
    const chart = buildChart();
    renderHook(() => useChartFontsReady({ current: chart }));

    expect(chart.update).not.toHaveBeenCalled();
    fire();

    expect(chart.scale._longestTextCache).toEqual({});
    expect(chart.update).toHaveBeenCalledOnce();
  });

  it('does nothing when the chart is not mounted', () => {
    const { fire } = setupFonts();
    expect(() => {
      renderHook(() => useChartFontsReady({ current: null }));
      fire();
    }).not.toThrow();
  });

  it('removes the listener and ignores late events after unmount', () => {
    const { fonts, fire } = setupFonts();
    const chart = buildChart();
    const { unmount } = renderHook(() => useChartFontsReady({ current: chart }));

    unmount();
    fire();

    expect(fonts.removeEventListener).toHaveBeenCalledWith('loadingdone', expect.any(Function));
    expect(chart.update).not.toHaveBeenCalled();
  });

  it('does not throw when the Font Loading API is unavailable', () => {
    expect(() => renderHook(() => useChartFontsReady({ current: buildChart() }))).not.toThrow();
  });
});
