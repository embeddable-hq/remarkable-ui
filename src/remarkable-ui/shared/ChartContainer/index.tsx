import React, { useState, useLayoutEffect, useCallback, useEffect, useRef } from 'react';
import styles from './index.module.css'

type ChartContainerProps = {
    children?: React.ReactNode;
}

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
}

export default function ChartContainer({children}:ChartContainerProps) {
    
    const containerRef = useRef<HTMLDivElement>(null);
    const [innerContainerHeight, setInnerContainerHeight] = useState(0);

    const updateHeight = useCallback(() => {
        if (containerRef.current) {
            const height = containerRef.current.offsetHeight;
            setInnerContainerHeight(height);
        }
    }, []);
    
    const debouncedUpdateHeight = useCallback(debounce(updateHeight, 0), [updateHeight]);

    useLayoutEffect(() => {
        updateHeight();
        const resizeObserver = new ResizeObserver(() => {
            debouncedUpdateHeight();
        });
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        return () => {
            resizeObserver.disconnect();
        };
    }, [debouncedUpdateHeight, updateHeight]);

    return (
        <div
            ref={containerRef}
            className={styles.chartContainer}
        >
            <div
                className={styles.chartInnerContainer}
                style={{ height: `${innerContainerHeight}px`}}
            >
                {innerContainerHeight && children}
            </div>                         
        </div>
    );
}