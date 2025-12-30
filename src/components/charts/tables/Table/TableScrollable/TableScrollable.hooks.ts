import { useEffect, useRef } from 'react';

export function useInfiniteScroll({
  rootRef,
  enabled = true,
  onPrefetch,
  bottomDistanceToPrefetch = 750,
}: {
  rootRef: React.RefObject<HTMLElement | null>;
  enabled?: boolean;
  onPrefetch: () => void;
  bottomDistanceToPrefetch?: number;
}) {
  const loadingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const el = rootRef.current;
    if (!el) return;

    const onScroll = () => {
      if (!enabled) return;
      if (loadingRef.current) return;

      const { scrollTop, clientHeight, scrollHeight } = el;

      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      if (distanceFromBottom <= bottomDistanceToPrefetch) {
        loadingRef.current = true;
        onPrefetch();
      }
    };

    onScroll(); // When is near to bottom
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [enabled, onPrefetch, rootRef, bottomDistanceToPrefetch]);

  useEffect(() => {
    if (enabled) loadingRef.current = false;
  }, [enabled]);
}
