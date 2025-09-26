import { FC } from 'react';
import { Typography } from '../../shared/Typography/Typography';
import styles from './KpiChart.module.css';
import { KpiChartChange } from './components/KpiChartChange';
import { KpiChartProps } from './KpiChart.types';
import clsx from 'clsx';

export const KpiChart: FC<KpiChartProps> = ({
  value,
  comparisonValue,
  comparisonLabel,
  invertChangeColors,
  showChangeAsPercentage,
  equalComparisonLabel = 'No change',
}) => {
  const equalComparison = comparisonValue && comparisonValue === value;

  return (
    <div className={styles.kpiChartContainer}>
      <Typography>{value}</Typography>
      <div className={styles.kpiComparisonContainer}>
        {equalComparison ? (
          <Typography>{equalComparisonLabel}</Typography>
        ) : (
          <KpiChartChange
            className={clsx(!comparisonValue && styles.kpiChangeHidden)}
            value={value}
            comparisonValue={comparisonValue}
            invertChangeColors={invertChangeColors}
            showChangeAsPercentage={showChangeAsPercentage}
            comparisonLabel={comparisonLabel}
          />
        )}
      </div>
    </div>
  );
};
