import { useLayoutEffect, useRef, useState } from 'react';

export const useObserverHeight = (elRef: React.RefObject<HTMLDivElement | null>): number => {
  const [height, setHeight] = useState(0);
  const timeoutRef = useRef<number | undefined>(undefined);

  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const updateHeight = (newHeight: number) => {
      setHeight(Math.max(0, newHeight));
    };

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      // clear previous debounce
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // wait 100ms before updating
      timeoutRef.current = window.setTimeout(() => {
        updateHeight(entry.contentRect.height);
      }, 100);
    });

    ro.observe(el);
    // initial height
    updateHeight(el.getBoundingClientRect().height || 0);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      ro.disconnect();
    };
  }, [elRef]);

  return height;
};
