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

  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;

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
      }, timeout);
    });

    ro.observe(el);

    // initial size
    updateSize(el.getBoundingClientRect());

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      ro.disconnect();
    };
  }, [elRef, timeout]);

  return size;
};
