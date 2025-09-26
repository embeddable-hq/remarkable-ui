import { FC } from 'react';
import styles from './KpiChartChange.module.css';
import clsx from 'clsx';
import { Typography } from '../../../shared/Typography/Typography';
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
  className,
}) => {
  const difference = value - comparisonValue;
  const isPositive = difference > 0;

  let differenceLabel: string = difference.toString();

  if (showChangeAsPercentage) {
    const percentage = comparisonValue === 0 ? 0 : (difference / comparisonValue) * 100;
    differenceLabel = `${percentage.toFixed(2)}%`;
  }

  const displayValue = `${isPositive ? '+' : ''}${differenceLabel}`;

  const Icon = isPositive ? IconTrendingUp : IconTrendingDown;

  return (
    <div className={clsx(className, styles.kpiChartChangeContainer)}>
      <div className={clsx(styles.kpiChangeBadge, getChangeClass(isPositive, invertChangeColors))}>
        <Icon />
        <Typography>{displayValue}</Typography>
      </div>
      {comparisonLabel && <Typography>{comparisonLabel}</Typography>}
    </div>
  );
};
