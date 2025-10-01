import { FC } from 'react';
import { Typography } from '../../shared/Typography/Typography';
import styles from './KpiChart.module.css';
import { KpiChartChange } from './components/KpiChartChange';
import { KpiChartProps } from './KpiChart.types';
import clsx from 'clsx';

export const KpiChart: FC<KpiChartProps> = ({
  value,
  changeFontSize,
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
      <Typography style={{ fontSize: valueFontSize }}>{displayValue}</Typography>
      <div className={styles.kpiComparisonContainer} style={{ fontSize: changeFontSize }}>
        {equalComparison ? (
          <Typography>{equalComparisonLabel}</Typography>
        ) : (
          <KpiChartChange
            className={clsx(!hasComparisonValue && styles.kpiChangeHidden)}
            value={value}
            valueFormatter={valueFormatter}
            comparisonValue={comparisonValue}
            invertChangeColors={invertChangeColors}
            showChangeAsPercentage={showChangeAsPercentage}
            comparisonLabel={comparisonLabel}
            changeFontSize={changeFontSize}
          />
        )}
      </div>
    </div>
  );
};
