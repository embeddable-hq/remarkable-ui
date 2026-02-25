import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useDebounce } from './useDebounce.hook';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls the function after the delay', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebounce(fn, 300));

    act(() => {
      result.current('arg1');
    });

    expect(fn).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith('arg1');
  });

  it('does not call the function before the delay elapses', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebounce(fn, 300));

    act(() => {
      result.current();
      vi.advanceTimersByTime(299);
    });

    expect(fn).not.toHaveBeenCalled();
  });

  it('debounces multiple rapid calls into one', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebounce(fn, 300));

    act(() => {
      result.current();
      result.current();
      result.current();
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(fn).toHaveBeenCalledOnce();
  });

  it('resets the timer on each call', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebounce(fn, 300));

    act(() => {
      result.current();
      vi.advanceTimersByTime(200);
      result.current();
      vi.advanceTimersByTime(200);
    });

    expect(fn).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(fn).toHaveBeenCalledOnce();
  });

  it('uses default delay of 300ms', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebounce(fn));

    act(() => {
      result.current();
      vi.advanceTimersByTime(299);
    });

    expect(fn).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(fn).toHaveBeenCalledOnce();
  });

  it('clears the pending timer on unmount', () => {
    const fn = vi.fn();
    const { result, unmount } = renderHook(() => useDebounce(fn, 300));

    act(() => {
      result.current();
    });

    unmount();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(fn).not.toHaveBeenCalled();
  });

  it('calls the latest version of fn when the callback reference changes', () => {
    const firstFn = vi.fn();
    const { result, rerender } = renderHook(({ callback }) => useDebounce(callback, 300), {
      initialProps: { callback: firstFn },
    });

    act(() => {
      result.current();
    });

    const secondFn = vi.fn();
    rerender({ callback: secondFn });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(firstFn).not.toHaveBeenCalled();
    expect(secondFn).toHaveBeenCalledOnce();
  });
});
