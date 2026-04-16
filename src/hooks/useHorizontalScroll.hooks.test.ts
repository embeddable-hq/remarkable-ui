import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useHorizontalScroll } from './useHorizontalScroll.hooks';

const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

class MockResizeObserver {
  callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe = mockObserve;
  disconnect = mockDisconnect;
  unobserve = vi.fn();
}

describe('useHorizontalScroll', () => {
  let originalResizeObserver: typeof ResizeObserver;

  beforeEach(() => {
    vi.clearAllMocks();
    originalResizeObserver = globalThis.ResizeObserver;
    globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
  });

  afterEach(() => {
    globalThis.ResizeObserver = originalResizeObserver;
  });

  it('returns initial state with scroll disabled in both directions', () => {
    const { result } = renderHook(() => useHorizontalScroll());

    expect(result.current.canScrollLeft).toBe(false);
    expect(result.current.canScrollRight).toBe(false);
  });

  it('returns scrollRef, handleScrollLeft, and handleScrollRight', () => {
    const { result } = renderHook(() => useHorizontalScroll());

    expect(result.current.scrollRef).toBeDefined();
    expect(typeof result.current.handleScrollLeft).toBe('function');
    expect(typeof result.current.handleScrollRight).toBe('function');
  });

  it('handleScrollRight calls scrollBy with positive left value', () => {
    const scrollByMock = vi.fn();
    const div = document.createElement('div');
    div.scrollBy = scrollByMock;

    const { result } = renderHook(() => useHorizontalScroll());
    Object.defineProperty(result.current.scrollRef, 'current', { value: div, writable: true });

    act(() => {
      result.current.handleScrollRight();
    });

    expect(scrollByMock).toHaveBeenCalledWith({ left: 200, behavior: 'smooth' });
  });

  it('handleScrollLeft calls scrollBy with negative left value', () => {
    const scrollByMock = vi.fn();
    const div = document.createElement('div');
    div.scrollBy = scrollByMock;

    const { result } = renderHook(() => useHorizontalScroll());
    Object.defineProperty(result.current.scrollRef, 'current', { value: div, writable: true });

    act(() => {
      result.current.handleScrollLeft();
    });

    expect(scrollByMock).toHaveBeenCalledWith({ left: -200, behavior: 'smooth' });
  });

  it('does not throw when scrollRef.current is null', () => {
    const { result } = renderHook(() => useHorizontalScroll());

    expect(() => {
      act(() => {
        result.current.handleScrollLeft();
        result.current.handleScrollRight();
      });
    }).not.toThrow();
  });
});
