import { render, screen, renderHook, act, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useHorizontalScroll } from './useHorizontalScroll.hooks';

// Overrides read-only scroll properties that jsdom doesn't let you set directly.
function setScrollProps(
  el: HTMLElement,
  props: Partial<Record<'scrollLeft' | 'clientWidth' | 'scrollWidth', number>>,
) {
  for (const [key, value] of Object.entries(props)) {
    Object.defineProperty(el, key, { value, writable: true, configurable: true });
  }
}

// Surfaces hook state as data-attributes so render-based tests can assert on them.
function TestScrollContainer({ scrollStep }: { scrollStep?: number }) {
  const { scrollRef, canScrollLeft, canScrollRight } = useHorizontalScroll(scrollStep);
  return (
    <div
      ref={scrollRef}
      data-testid="scroll-el"
      data-can-scroll-left={String(canScrollLeft)}
      data-can-scroll-right={String(canScrollRight)}
    />
  );
}

describe('useHorizontalScroll', () => {
  let resizeCallback: ResizeObserverCallback | null;
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    resizeCallback = null;
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();

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
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // ─── Initial state ───────────────────────────────────────────────────────────

  it('starts with scrolling disabled in both directions', () => {
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

  // ─── Scroll handlers ─────────────────────────────────────────────────────────

  it('handleScrollRight calls scrollBy with the default step of 200', () => {
    const scrollByMock = vi.fn();
    const div = document.createElement('div');
    div.scrollBy = scrollByMock;

    const { result } = renderHook(() => useHorizontalScroll());
    Object.defineProperty(result.current.scrollRef, 'current', { value: div, writable: true });

    act(() => result.current.handleScrollRight());

    expect(scrollByMock).toHaveBeenCalledWith({ left: 200, behavior: 'smooth' });
  });

  it('handleScrollLeft calls scrollBy with the default step of -200', () => {
    const scrollByMock = vi.fn();
    const div = document.createElement('div');
    div.scrollBy = scrollByMock;

    const { result } = renderHook(() => useHorizontalScroll());
    Object.defineProperty(result.current.scrollRef, 'current', { value: div, writable: true });

    act(() => result.current.handleScrollLeft());

    expect(scrollByMock).toHaveBeenCalledWith({ left: -200, behavior: 'smooth' });
  });

  it('handleScrollRight respects a custom scrollStep', () => {
    const scrollByMock = vi.fn();
    const div = document.createElement('div');
    div.scrollBy = scrollByMock;

    const { result } = renderHook(() => useHorizontalScroll(50));
    Object.defineProperty(result.current.scrollRef, 'current', { value: div, writable: true });

    act(() => result.current.handleScrollRight());

    expect(scrollByMock).toHaveBeenCalledWith({ left: 50, behavior: 'smooth' });
  });

  it('handleScrollLeft respects a custom scrollStep', () => {
    const scrollByMock = vi.fn();
    const div = document.createElement('div');
    div.scrollBy = scrollByMock;

    const { result } = renderHook(() => useHorizontalScroll(50));
    Object.defineProperty(result.current.scrollRef, 'current', { value: div, writable: true });

    act(() => result.current.handleScrollLeft());

    expect(scrollByMock).toHaveBeenCalledWith({ left: -50, behavior: 'smooth' });
  });

  it('handlers do not throw when scrollRef is null', () => {
    const { result } = renderHook(() => useHorizontalScroll());

    expect(() => {
      act(() => {
        result.current.handleScrollLeft();
        result.current.handleScrollRight();
      });
    }).not.toThrow();
  });

  // ─── Effect: setup ───────────────────────────────────────────────────────────

  it('observes the element via ResizeObserver on mount', () => {
    render(<TestScrollContainer />);

    expect(mockObserve).toHaveBeenCalledWith(screen.getByTestId('scroll-el'));
  });

  it('registers a scroll event listener on the element on mount', () => {
    render(<TestScrollContainer />);
    const el = screen.getByTestId('scroll-el');
    const addSpy = vi.spyOn(el, 'addEventListener');

    // Re-render to confirm the listener was added (spying post-mount still
    // lets us verify via a scroll event triggering state updates below).
    setScrollProps(el, { scrollLeft: 5 });
    act(() => fireEvent.scroll(el));

    // State updated means the listener fired — addEventListener was wired up.
    expect(el.dataset.canScrollLeft).toBe('true');
    addSpy.mockRestore();
  });

  // ─── Effect: cleanup ─────────────────────────────────────────────────────────

  it('disconnects the ResizeObserver on unmount', () => {
    const { unmount } = render(<TestScrollContainer />);

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('removes the scroll event listener on unmount', () => {
    const { unmount } = render(<TestScrollContainer />);
    const el = screen.getByTestId('scroll-el');
    const removeSpy = vi.spyOn(el, 'removeEventListener');

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  // ─── canScrollLeft ───────────────────────────────────────────────────────────

  it('canScrollLeft becomes true when scrollLeft > 1', () => {
    render(<TestScrollContainer />);
    const el = screen.getByTestId('scroll-el');

    setScrollProps(el, { scrollLeft: 2 });
    act(() => fireEvent.scroll(el));

    expect(el.dataset.canScrollLeft).toBe('true');
  });

  it('canScrollLeft stays false when scrollLeft is exactly 1', () => {
    render(<TestScrollContainer />);
    const el = screen.getByTestId('scroll-el');

    setScrollProps(el, { scrollLeft: 1 });
    act(() => fireEvent.scroll(el));

    expect(el.dataset.canScrollLeft).toBe('false');
  });

  it('canScrollLeft stays false when scrollLeft is 0', () => {
    render(<TestScrollContainer />);
    const el = screen.getByTestId('scroll-el');

    setScrollProps(el, { scrollLeft: 0 });
    act(() => fireEvent.scroll(el));

    expect(el.dataset.canScrollLeft).toBe('false');
  });

  // ─── canScrollRight ──────────────────────────────────────────────────────────

  it('canScrollRight becomes true when content overflows to the right', () => {
    render(<TestScrollContainer />);
    const el = screen.getByTestId('scroll-el');

    // 0 + 100 = 100 < 300 - 1 = 299 → true
    setScrollProps(el, { scrollLeft: 0, clientWidth: 100, scrollWidth: 300 });
    act(() => fireEvent.scroll(el));

    expect(el.dataset.canScrollRight).toBe('true');
  });

  it('canScrollRight stays false when scrolled to the rightmost position', () => {
    render(<TestScrollContainer />);
    const el = screen.getByTestId('scroll-el');

    // 199 + 100 = 299, NOT < scrollWidth - 1 (299) → false
    setScrollProps(el, { scrollLeft: 199, clientWidth: 100, scrollWidth: 300 });
    act(() => fireEvent.scroll(el));

    expect(el.dataset.canScrollRight).toBe('false');
  });

  it('canScrollRight resets to false once scrolled to the end', () => {
    render(<TestScrollContainer />);
    const el = screen.getByTestId('scroll-el');

    setScrollProps(el, { scrollLeft: 0, clientWidth: 100, scrollWidth: 300 });
    act(() => fireEvent.scroll(el));
    expect(el.dataset.canScrollRight).toBe('true');

    setScrollProps(el, { scrollLeft: 199 });
    act(() => fireEvent.scroll(el));
    expect(el.dataset.canScrollRight).toBe('false');
  });

  // ─── State updates via ResizeObserver ────────────────────────────────────────

  it('updates scroll state when the ResizeObserver fires', () => {
    render(<TestScrollContainer />);
    const el = screen.getByTestId('scroll-el');

    setScrollProps(el, { scrollLeft: 0, clientWidth: 100, scrollWidth: 300 });

    act(() => {
      resizeCallback!([], {} as ResizeObserver);
    });

    expect(el.dataset.canScrollRight).toBe('true');
  });

  it('passes updateScrollState as the ResizeObserver callback', () => {
    render(<TestScrollContainer />);

    // The callback captured by the mock constructor must be a function.
    expect(typeof resizeCallback).toBe('function');
  });
});
