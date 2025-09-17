import React, { useState, useEffect, useRef } from 'react';
import styles from './EmptyStateSkeleton.module.css';

interface EmptyStateSkeletonProps {
  className?: string;
}

export const EmptyStateSkeleton: React.FC<EmptyStateSkeletonProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleColumns, setVisibleColumns] = useState(2);

  useEffect(() => {
    const calculateColumns = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const padding = 32; // 2rem total padding (1rem each side)
      const gap = 16; // 1rem gap between columns
      const minColumnWidth = 128; // 8rem
      const maxColumnWidth = 256; // 16rem

      const availableWidth = containerWidth - padding;

      // Calculate how many columns can fit at minimum width
      const maxPossibleColumns = Math.floor((availableWidth + gap) / (minColumnWidth + gap));

      // Calculate actual column width if we use maxPossibleColumns
      const actualColumnWidth =
        (availableWidth - (maxPossibleColumns - 1) * gap) / maxPossibleColumns;

      // If columns would be wider than max width, reduce column count
      let finalColumns = maxPossibleColumns;
      if (actualColumnWidth > maxColumnWidth) {
        finalColumns = Math.floor((availableWidth + gap) / (maxColumnWidth + gap));
      }

      setVisibleColumns(Math.max(2, finalColumns)); // Minimum 2 columns
    };

    calculateColumns();

    const resizeObserver = new ResizeObserver(calculateColumns);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const renderColumn = (index: number) => {
    const isEvenColumn = index % 2 === 0;
    return (
      <div key={index} className={styles.column}>
        {isEvenColumn ? (
          <>
            <div className={`${styles.box} ${styles.short}`}></div>
            <div className={`${styles.box} ${styles.tall}`}></div>
            <div className={`${styles.box} ${styles.short}`}></div>
            <div className={`${styles.box} ${styles.tall}`}></div>
          </>
        ) : (
          <>
            <div className={`${styles.box} ${styles.tall}`}></div>
            <div className={`${styles.box} ${styles.short}`}></div>
            <div className={`${styles.box} ${styles.tall}`}></div>
            <div className={`${styles.box} ${styles.short}`}></div>
          </>
        )}
      </div>
    );
  };

  return (
    <div ref={containerRef} className={`${styles.container} ${className || ''}`}>
      {Array.from({ length: visibleColumns }, (_, index) => renderColumn(index))}
    </div>
  );
};
