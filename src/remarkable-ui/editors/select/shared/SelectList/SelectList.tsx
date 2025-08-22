import { useEffect, useRef } from 'react';
import styles from './SelectList.module.css';
import clsx from 'clsx';

type SelectListProps = {
  children: React.ReactNode;
  autoFocus?: boolean;
  autoWidth?: boolean;
};

export const SelectList: React.FC<SelectListProps> = ({ children, autoFocus, autoWidth }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = Array.from(container.querySelectorAll('[role="menuitem"]')) as HTMLElement[];

    const focusItem = (index: number) => {
      if (index >= 0 && index < items.length) {
        items[index]?.focus();
        currentIndex.current = index;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      console.log('currentIndex:', currentIndex.current);
      if (items.length === 0) return;
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          focusItem((currentIndex.current + 1) % items.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          focusItem((currentIndex.current - 1 + items.length) % items.length);
          break;
        case 'Home':
          e.preventDefault();
          focusItem(0);
          break;
        case 'End':
          e.preventDefault();
          focusItem(items.length - 1);
          break;
      }
    };

    container.addEventListener('keydown', onKeyDown);

    if (autoFocus) {
      setTimeout(() => {
        currentIndex.current = 0;
        focusItem(0);
      }, 0);
    }

    return () => {
      container.removeEventListener('keydown', onKeyDown);
    };
  }, [autoFocus, children]);

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className={clsx(styles.list, autoWidth && styles.autoWidth)}
    >
      {children}
    </div>
  );
};
