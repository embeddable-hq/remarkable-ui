import { useEffect, useRef } from 'react';

export function useDebouncedEffect(
  effect: () => void,  // the callback to run after the “quiet” period
  dependencies: any[], // list of dependencies that reset the timer when they change
  delay: number        // how long to wait (ms) after the last change before running
) {
  // 1. Keep a ref to the latest effect so the timeout always calls the freshest one
  const saved = useRef(effect);

  // 2. Whenever the effect callback changes, update our ref
  useEffect(() => {
    saved.current = effect;
  }, [effect]);

  // 3. Main debounce logic: set a timer whenever deps or delay change
  useEffect(() => {
    // handler that invokes the latest effect
    const handler = () => {
      saved.current();
    };

    // schedule it
    const id = setTimeout(handler, delay);

    // cleanup: clear the timeout if deps/delay change or component unmounts
    return () => {
      clearTimeout(id);
    };
  // spread deps plus delay so either one resetting the timer
  }, [...dependencies, delay]);
}