import { FC } from 'react';
import styles from './KpiChartChange.module.css';
import clsx from 'clsx';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { KpiChartProps } from '../KpiChart.types';

const getChangeClass = (isPositive: boolean, invertChangeColors: boolean) => {
  if (isPositive) return invertChangeColors ? styles.negative : styles.positive;
  return invertChangeColors ? styles.positive : styles.negative;
};

type KpiChartChangeProps = KpiChartProps & { className?: string };

export const KpiChartChange: FC<KpiChartChangeProps> = ({
  value,
  comparisonValue = 0,
  showChangeAsPercentage,
  invertChangeColors = false,
  comparisonLabel,
  valueFormatter,
  percentageDecimalPlaces = 1,
  equalComparisonLabel,
  noPreviousDataLabel,
}) => {
  const equalComparison = comparisonValue === value;

  const difference = value - comparisonValue;
  const isPositive = difference > 0;

  let differenceLabel: string;

  if (showChangeAsPercentage) {
    const percentage = (difference / comparisonValue) * 100;
    differenceLabel = `${percentage.toFixed(percentageDecimalPlaces)}%`;
  } else {
    differenceLabel = valueFormatter ? valueFormatter(difference) : difference.toString();
  }

  const displayValue = `${isPositive ? '+' : ''}${differenceLabel}`;

  const Icon = isPositive ? IconTrendingUp : IconTrendingDown;

  const showNoPreviousData = showChangeAsPercentage && Number(comparisonValue) === 0;

  return (
    <div className={styles.kpiChangeContainerSizeGuide}>
      {/* This is responsible to setting the size of the container */}
      <div className={clsx(styles.kpiChartChangeContainer, styles.hidden)}>
        <span
          className={clsx(styles.kpiChangeBadge, getChangeClass(isPositive, invertChangeColors))}
        >
          <Icon />
          <span>{displayValue}</span>
        </span>
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
                <span
                  className={clsx(
                    styles.kpiChangeBadge,
                    getChangeClass(isPositive, invertChangeColors),
                  )}
                >
                  <Icon />
                  <span>{displayValue}</span>
                </span>
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
