import React, { useEffect, useState } from 'react';
import styles from './EmptyStateSkeleton.module.css';

export const EmptyStateSkeleton: React.FC = () => {
  const [dimensions, setDimensions] = useState({ columns: 4 });

  const calculateColumns = () => {
    const width = window.innerWidth;
    let wrapperWidth: number;

    if (width >= 1440) {
      wrapperWidth = 69.8125 * 16; // Convert rem to px
    } else if (width >= 768) {
      wrapperWidth = 32.5 * 16;
    } else {
      wrapperWidth = 22.375 * 16;
    }

    const columnWidth = 8 * 16; // 8rem in px
    const gap = 16; // 1rem in px
    const columnsCount = Math.floor((wrapperWidth + gap) / (columnWidth + gap));

    setDimensions({
      columns: Math.max(1, columnsCount),
    });
  };

  useEffect(() => {
    calculateColumns();
    const handleResize = () => calculateColumns();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderColumn = (columnIndex: number) => {
    const isEvenColumn = columnIndex % 2 === 1; // 0-indexed, so second column is index 1
    const elements: React.ReactNode[] = [];

    // Create the alternating pattern: short-tall-short-tall...
    const patternLength = 4; // Basic repeating unit
    for (let i = 0; i < patternLength; i++) {
      const shouldBeShort = isEvenColumn ? i % 2 === 1 : i % 2 === 0;
      elements.push(<div key={i} className={shouldBeShort ? styles.short : styles.tall} />);
    }

    return elements;
  };

  return (
    <div className={styles.wrapper}>
      {Array.from({ length: dimensions.columns }, (_, columnIndex) => (
        <div key={columnIndex} className={styles.column}>
          {renderColumn(columnIndex)}
        </div>
      ))}
    </div>
  );
};
