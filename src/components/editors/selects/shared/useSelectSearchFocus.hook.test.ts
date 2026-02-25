import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSelectSearchFocus } from './useSelectSearchFocus.hook';

describe('useSelectSearchFocus', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('focuses the search field after 100ms when isOpen becomes true', () => {
    const focusMock = vi.fn();
    const inputEl = { focus: focusMock } as unknown as HTMLInputElement;
    const searchFieldRef = { current: inputEl };

    renderHook(() => useSelectSearchFocus(true, searchFieldRef));

    expect(focusMock).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(focusMock).toHaveBeenCalledOnce();
  });

  it('does not focus the search field when isOpen is false', () => {
    const focusMock = vi.fn();
    const inputEl = { focus: focusMock } as unknown as HTMLInputElement;
    const searchFieldRef = { current: inputEl };

    renderHook(() => useSelectSearchFocus(false, searchFieldRef));

    vi.advanceTimersByTime(200);

    expect(focusMock).not.toHaveBeenCalled();
  });

  it('handles null ref gracefully', () => {
    const searchFieldRef = { current: null };

    expect(() => {
      renderHook(() => useSelectSearchFocus(true, searchFieldRef));
      vi.advanceTimersByTime(100);
    }).not.toThrow();
  });
});
