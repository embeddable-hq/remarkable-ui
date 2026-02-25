import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useResizeObserver } from './useResizeObserver.hook';

describe('useResizeObserver', () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let resizeCallback: ResizeObserverCallback | null;

  const triggerResize = (width: number, height: number) => {
    if (!resizeCallback) return;
    const entry = { contentRect: { width, height } as DOMRectReadOnly } as ResizeObserverEntry;
    resizeCallback([entry], {} as ResizeObserver);
  };

  beforeEach(() => {
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();
    resizeCallback = null;

    vi.stubGlobal(
      'ResizeObserver',
      class MockResizeObserver {
        constructor(callback: ResizeObserverCallback) {
          resizeCallback = callback;
        }
        observe = mockObserve;
        disconnect = mockDisconnect;
        unobserve = vi.fn();
      },
    );

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('returns zero size when the ref is null', () => {
    const ref = { current: null };
    const { result } = renderHook(() => useResizeObserver(ref));

    expect(result.current).toEqual({ width: 0, height: 0 });
  });

  it('returns the initial size from getBoundingClientRect', () => {
    const el = document.createElement('div');
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      width: 100,
      height: 200,
    } as DOMRect);

    const ref = { current: el };
    const { result } = renderHook(() => useResizeObserver(ref));

    expect(result.current).toEqual({ width: 100, height: 200 });
  });

  it('clamps negative dimensions from getBoundingClientRect to 0', () => {
    const el = document.createElement('div');
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      width: -50,
      height: -30,
    } as DOMRect);

    const ref = { current: el };
    const { result } = renderHook(() => useResizeObserver(ref));

    expect(result.current).toEqual({ width: 0, height: 0 });
  });

  it('observes the element', () => {
    const el = document.createElement('div');
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({ width: 0, height: 0 } as DOMRect);

    const ref = { current: el };
    renderHook(() => useResizeObserver(ref));

    expect(mockObserve).toHaveBeenCalledWith(el);
  });

  it('updates size after the timeout fires following a resize', () => {
    const el = document.createElement('div');
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({ width: 100, height: 200 } as DOMRect);

    const ref = { current: el };
    const { result } = renderHook(() => useResizeObserver(ref, 100));

    act(() => {
      triggerResize(300, 400);
    });

    expect(result.current).toEqual({ width: 100, height: 200 });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toEqual({ width: 300, height: 400 });
  });

  it('does not update size before the timeout fires', () => {
    const el = document.createElement('div');
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({ width: 100, height: 200 } as DOMRect);

    const ref = { current: el };
    const { result } = renderHook(() => useResizeObserver(ref, 100));

    act(() => {
      triggerResize(300, 400);
      vi.advanceTimersByTime(99);
    });

    expect(result.current).toEqual({ width: 100, height: 200 });
  });

  it('debounces multiple resize events, using the last one', () => {
    const el = document.createElement('div');
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({ width: 0, height: 0 } as DOMRect);

    const ref = { current: el };
    const { result } = renderHook(() => useResizeObserver(ref, 100));

    act(() => {
      triggerResize(300, 400);
      vi.advanceTimersByTime(50);
      triggerResize(500, 600);
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toEqual({ width: 500, height: 600 });
  });

  it('clamps negative dimensions from resize observer to 0', () => {
    const el = document.createElement('div');
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({ width: 0, height: 0 } as DOMRect);

    const ref = { current: el };
    const { result } = renderHook(() => useResizeObserver(ref, 100));

    act(() => {
      triggerResize(-50, -30);
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toEqual({ width: 0, height: 0 });
  });

  it('disconnects the observer on unmount', () => {
    const el = document.createElement('div');
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({ width: 0, height: 0 } as DOMRect);

    const ref = { current: el };
    const { unmount } = renderHook(() => useResizeObserver(ref));

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('cancels a pending resize update on unmount', () => {
    const el = document.createElement('div');
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({ width: 100, height: 200 } as DOMRect);

    const ref = { current: el };
    const { result, unmount } = renderHook(() => useResizeObserver(ref, 100));

    act(() => {
      triggerResize(300, 400);
    });

    unmount();

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toEqual({ width: 100, height: 200 });
  });
});
