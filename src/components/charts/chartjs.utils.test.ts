import { describe, expect, it, vi } from 'vitest';
import { getScatterPointClicked, getSegmentIndexClicked } from './chartjs.utils';

describe('getSegmentIndexClicked', () => {
  it('returns undefined when chartRef.current is null', () => {
    const chartRef = { current: null };
    const event = { nativeEvent: {} } as React.MouseEvent<HTMLCanvasElement>;

    expect(getSegmentIndexClicked(event, chartRef)).toBeUndefined();
  });

  it('returns the index of the first clicked element', () => {
    const getElementsAtEventForMode = vi.fn(() => [{ index: 2 }]);
    const chartRef = { current: { getElementsAtEventForMode } };
    const event = { nativeEvent: new Event('click') } as React.MouseEvent<HTMLCanvasElement>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = getSegmentIndexClicked(event, chartRef as any);

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
    const chartRef = { current: { getElementsAtEventForMode } };
    const event = { nativeEvent: new Event('click') } as React.MouseEvent<HTMLCanvasElement>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = getSegmentIndexClicked(event, chartRef as any);

    expect(result).toBeUndefined();
  });
});

describe('getScatterPointClicked', () => {
  it('returns undefined when chartRef.current is null', () => {
    const chartRef = { current: null };
    const event = { nativeEvent: {} } as React.MouseEvent<HTMLCanvasElement>;

    expect(getScatterPointClicked(event, chartRef)).toBeUndefined();
  });

  it('returns datasetIndex and index of the first clicked element', () => {
    const getElementsAtEventForMode = vi.fn(() => [{ datasetIndex: 1, index: 3 }]);
    const chartRef = { current: { getElementsAtEventForMode } };
    const event = { nativeEvent: new Event('click') } as React.MouseEvent<HTMLCanvasElement>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = getScatterPointClicked(event, chartRef as any);

    expect(result).toEqual({ datasetIndex: 1, index: 3 });
  });

  it('returns undefined when no elements are at the click position', () => {
    const getElementsAtEventForMode = vi.fn(() => []);
    const chartRef = { current: { getElementsAtEventForMode } };
    const event = { nativeEvent: new Event('click') } as React.MouseEvent<HTMLCanvasElement>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = getScatterPointClicked(event, chartRef as any);

    expect(result).toBeUndefined();
  });
});
