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
  valueFontSize,
  valueFormatter,
}) => {
  const hasComparisonValue = comparisonValue !== undefined;
  const equalComparison = hasComparisonValue && comparisonValue === value;

  const displayValue = valueFormatter ? valueFormatter(value) : value;

  return (
    <div className={styles.kpiChartContainer}>
      <Typography className={styles.kpiValue} style={{ fontSize: valueFontSize }}>
        {displayValue}
      </Typography>
      <div className={styles.kpiComparisonContainer}>
        {equalComparison ? (
          <Typography>{equalComparisonLabel}</Typography>
        ) : (
          <KpiChartChange
            className={clsx(!hasComparisonValue && styles.kpiChangeHidden)}
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
