import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRef } from 'react';
import { useResizeObserver } from './useResizeObserver.hook';

class MockResizeObserver {
  static instances: MockResizeObserver[] = [];
  observed: Element[] = [];
  disconnected = false;

  constructor(public callback: ResizeObserverCallback) {
    MockResizeObserver.instances.push(this);
  }

  observe(el: Element) {
    this.observed.push(el);
  }

  disconnect() {
    this.disconnected = true;
  }

  unobserve() {}
}

const Probe = ({ swap }: { swap: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const size = useResizeObserver(ref);
  return <div key={swap ? 'b' : 'a'} ref={ref} data-testid="box" data-height={size.height} />;
};

describe('useResizeObserver', () => {
  beforeEach(() => {
    MockResizeObserver.instances = [];
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 300,
      height: 150,
    } as DOMRect);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('observes the element and reports its initial size', () => {
    const { getByTestId } = render(<Probe swap={false} />);

    expect(MockResizeObserver.instances).toHaveLength(1);
    expect(MockResizeObserver.instances[0]!.observed).toEqual([getByTestId('box')]);
    expect(getByTestId('box')).toHaveAttribute('data-height', '150');
  });

  it('re-attaches when the ref points at a new element after a remount', () => {
    const { getByTestId, rerender } = render(<Probe swap={false} />);
    const firstBox = getByTestId('box');

    rerender(<Probe swap />);
    const secondBox = getByTestId('box');
    expect(secondBox).not.toBe(firstBox);

    expect(MockResizeObserver.instances).toHaveLength(2);
    expect(MockResizeObserver.instances[0]!.disconnected).toBe(true);
    expect(MockResizeObserver.instances[1]!.observed).toEqual([secondBox]);
    expect(secondBox).toHaveAttribute('data-height', '150');
  });

  it('disconnects on unmount', () => {
    const { unmount } = render(<Probe swap={false} />);

    unmount();

    expect(MockResizeObserver.instances[0]!.disconnected).toBe(true);
  });
});
