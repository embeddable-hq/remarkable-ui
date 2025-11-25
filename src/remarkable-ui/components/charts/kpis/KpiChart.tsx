import { FC, useEffect, useRef, useState } from 'react';
import styles from './KpiChart.module.css';
import { KpiChartChange } from './components/KpiChartChange';
import { KpiChartProps } from './KpiChart.types';

export const KpiChart: FC<KpiChartProps> = ({
  value,
  valueFontSize,
  changeFontSize,
  comparisonValue,
  comparisonLabel,
  invertChangeColors,
  showChangeAsPercentage,
  percentageDecimalPlaces = 1,
  equalComparisonLabel = 'No change',
  valueFormatter,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(20);

  useEffect(() => {
    const container = containerRef.current!;

    const updateFont = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;

      // proportional to the smaller dimension
      const newSize = Math.min(w, h) * 0.3; // 40% of the smaller dimension
      setFontSize(newSize);
    };

    const observer = new ResizeObserver(updateFont);
    observer.observe(container);

    updateFont(); // initial run

    return () => observer.disconnect();
  }, []);

  const hasComparisonValue = comparisonValue !== undefined;

  const displayValue = value === undefined ? '' : valueFormatter ? valueFormatter(value) : value;

  return (
    <div className={styles.kpiChartContainer} ref={containerRef}>
      <div className={styles.kpiChartCenter}>
        <h2
          title={displayValue.toString()}
          style={{
            fontSize: valueFontSize ?? fontSize,
          }}
        >
          {displayValue}
        </h2>
        <div className={styles.kpiComparisonContainer} style={{ fontSize: changeFontSize }}>
          {hasComparisonValue && (
            <KpiChartChange
              equalComparisonLabel={equalComparisonLabel}
              changeFontSize={changeFontSize}
              comparisonLabel={comparisonLabel}
              comparisonValue={comparisonValue}
              invertChangeColors={invertChangeColors}
              percentageDecimalPlaces={percentageDecimalPlaces}
              showChangeAsPercentage={showChangeAsPercentage}
              value={value}
              valueFormatter={valueFormatter}
            />
          )}
        </div>
      </div>
    </div>
  );
};
