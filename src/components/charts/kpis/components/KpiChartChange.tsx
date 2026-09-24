import { FC } from 'react';
import styles from './KpiChartChange.module.css';
import clsx from 'clsx';
import { KpiChartProps } from '../KpiChart.types';
import { KpiTrend } from '../../../shared/KpiTrend/KpiTrend';

type KpiChartChangeProps = Omit<KpiChartProps, 'value'> & { value: number; className?: string };

export const KpiChartChange: FC<KpiChartChangeProps> = ({
  value,
  comparisonValue,
  showChangeAsPercentage,
  invertChangeColors = false,
  invertTrendDirection,
  comparisonLabel,
  valueFormatter,
  percentageDecimalPlaces = 1,
  equalComparisonLabel,
  noPreviousDataLabel,
}) => {
  const showNoPreviousData = comparisonValue == null;

  let displayValue = '';
  let isBadTrendColor = false;
  let isBadTrendDirection = false;
  let equalComparison = false;

  if (comparisonValue != null) {
    equalComparison = comparisonValue === value;

    const difference = value - comparisonValue;
    const isPositive = difference > 0;

    let differenceLabel: string;

    if (showChangeAsPercentage && comparisonValue !== 0) {
      const percentage = (difference / comparisonValue) * 100;
      differenceLabel = `${percentage.toFixed(percentageDecimalPlaces)}%`;
    } else {
      differenceLabel = valueFormatter ? valueFormatter(difference) : difference.toString();
    }

    displayValue = `${isPositive ? '+' : ''}${differenceLabel}`;

    isBadTrendColor = isPositive === invertChangeColors;
    // Falls back to invertChangeColors when invertTrendDirection is unset.
    isBadTrendDirection = isPositive === (invertTrendDirection ?? invertChangeColors);
  }

  return (
    <div className={styles.kpiChangeContainerSizeGuide}>
      {/* This is responsible to setting the size of the container */}
      <div className={clsx(styles.kpiChartChangeContainer, styles.hidden)}>
        <KpiTrend
          value={displayValue}
          reverseTrend={isBadTrendDirection}
          reverseColor={isBadTrendColor}
        />
        <span className={styles.kpiComparisonLabel}>{comparisonLabel}</span>
      </div>
      {/* This is responsible for displaying the content on the available size of the container */}
      <div className={styles.kpiAbsoluteContainer}>
        <div className={styles.kpiChartChangeContainer}>
          {showNoPreviousData ? (
            <span className={styles.kpiComparisonLabel}>{noPreviousDataLabel}</span>
          ) : (
            <>
              {!equalComparison && (
                <KpiTrend
                  value={displayValue}
                  reverseTrend={isBadTrendDirection}
                  reverseColor={isBadTrendColor}
                />
              )}
              <span className={styles.kpiComparisonLabel}>
                {equalComparison ? (equalComparisonLabel ?? comparisonLabel) : comparisonLabel}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
