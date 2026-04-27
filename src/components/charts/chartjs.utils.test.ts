import { Chart } from 'chart.js';
import { describe, expect, it, vi } from 'vitest';
import { getSegmentIndexClicked } from './chartjs.utils';
import { getChartPointClicked } from './chartjs.cartesian.utils';

describe('getSegmentIndexClicked', () => {
  it('returns undefined when chart is not found', () => {
    vi.spyOn(Chart, 'getChart').mockReturnValue(undefined);
    const event = { nativeEvent: new Event('click') } as React.MouseEvent<HTMLCanvasElement>;

    expect(getSegmentIndexClicked(event)).toBeUndefined();
  });

  it('returns the index of the first clicked element', () => {
    const getElementsAtEventForMode = vi.fn(() => [{ index: 2 }]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(Chart, 'getChart').mockReturnValue({ getElementsAtEventForMode } as any);
    const event = { nativeEvent: new Event('click') } as React.MouseEvent<HTMLCanvasElement>;

    const result = getSegmentIndexClicked(event);

    expect(getElementsAtEventForMode).toHaveBeenCalledWith(
      event.nativeEvent,
      'nearest',
      { intersect: true },
      false,
    );
    expect(result).toBe(2);
  });

  it('returns undefined when no elements are at the click position', () => {
    const getElementsAtEventForMode = vi.fn(() => []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(Chart, 'getChart').mockReturnValue({ getElementsAtEventForMode } as any);
    const event = { nativeEvent: new Event('click') } as React.MouseEvent<HTMLCanvasElement>;

    const result = getSegmentIndexClicked(event);

    expect(result).toBeUndefined();
  });
});

describe('getChartPointClicked', () => {
  it('returns undefined when chart is not found', () => {
    vi.spyOn(Chart, 'getChart').mockReturnValue(undefined);
    const event = { nativeEvent: new Event('click') } as React.MouseEvent<HTMLCanvasElement>;

    expect(getChartPointClicked(event)).toBeUndefined();
  });

  it('returns datasetIndex and index of the first clicked element', () => {
    const getElementsAtEventForMode = vi.fn(() => [{ datasetIndex: 1, index: 3 }]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(Chart, 'getChart').mockReturnValue({ getElementsAtEventForMode } as any);
    const event = { nativeEvent: new Event('click') } as React.MouseEvent<HTMLCanvasElement>;

    const result = getChartPointClicked(event);

    expect(result).toEqual({ datasetIndex: 1, index: 3 });
  });

  it('returns undefined when no elements are at the click position', () => {
    const getElementsAtEventForMode = vi.fn(() => []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(Chart, 'getChart').mockReturnValue({ getElementsAtEventForMode } as any);
    const event = { nativeEvent: new Event('click') } as React.MouseEvent<HTMLCanvasElement>;

    const result = getChartPointClicked(event);

    expect(result).toBeUndefined();
  });
});
