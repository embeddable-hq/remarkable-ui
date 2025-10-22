import { useLayoutEffect, useState } from 'react';

export const useObserverHeight = (elRef: React.RefObject<HTMLDivElement | null>): number => {
  const [height, setHeight] = useState<number>(0);
  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(Math.max(0, entry.contentRect.height));
      }
    });
    ro.observe(el);
    setHeight(el.getBoundingClientRect().height || 0);
    return () => ro.disconnect();
  }, [elRef]);
  return height;
};
