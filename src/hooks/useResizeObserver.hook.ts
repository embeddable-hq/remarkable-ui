import { useLayoutEffect, useRef, useState } from 'react';

type Size = {
  width: number;
  height: number;
};

export const useResizeObserver = <T extends HTMLElement>(
  elRef: React.RefObject<T | null>,
  timeout = 100,
): Size => {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const timeoutRef = useRef<number | undefined>(undefined);
  const timeoutMsRef = useRef(timeout);
  const observerRef = useRef<ResizeObserver | null>(null);
  const observedRef = useRef<T | null>(null);

  useLayoutEffect(() => {
    timeoutMsRef.current = timeout;
  }, [timeout]);

  // Runs after every commit: a remount can point the ref at a new element
  // (e.g. a card moving into a dialog), so re-attach whenever it changes,
  // and disconnect when the element is conditionally removed.
  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) {
      observerRef.current?.disconnect();
      observerRef.current = null;
      observedRef.current = null;
      return;
    }
    if (observedRef.current === el) return;

    observerRef.current?.disconnect();
    observedRef.current = el;

    const updateSize = (rect: DOMRectReadOnly | DOMRect) => {
      setSize({
        width: Math.max(0, rect.width),
        height: Math.max(0, rect.height),
      });
    };

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        updateSize(entry.contentRect);
      }, timeoutMsRef.current);
    });

    observerRef.current = ro;
    ro.observe(el);

    // initial size
    updateSize(el.getBoundingClientRect());
  });

  useLayoutEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      observerRef.current?.disconnect();
      observerRef.current = null;
      observedRef.current = null;
    };
  }, []);

  return size;
};
