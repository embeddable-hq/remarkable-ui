import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.css'

type Props = {
    children?: React.ReactNode;
}

// Debounce function
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
}

export default function ChartContainer({children}:Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState(0);

    const updateHeight = () => {
        if (containerRef.current) {
          // Measure the container's own height
          const height = containerRef.current.offsetHeight;
          console.log(containerRef.current.offsetHeight);
          setContainerHeight(height);
        }
    };
    
    const debouncedUpdateHeight = debounce(updateHeight, 100);
    
    useEffect(() => {
        // Initial measurement
        updateHeight();

        // Watch for size changes
        const resizeObserver = new ResizeObserver(() => {
            debouncedUpdateHeight();
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [debouncedUpdateHeight]);

    return (
        <div
            ref={containerRef}
            className={styles.chartContainer}
        >
            <div
                className={styles.chartContainerInner}
                style={{ height: containerHeight === 0 ? '100%' : `${containerHeight}px`}}
            >
                {children}
            </div>                         
        </div>
    );
}