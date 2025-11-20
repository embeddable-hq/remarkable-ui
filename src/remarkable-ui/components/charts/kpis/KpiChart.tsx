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
  percentageDecimalPlaces = 1,
  equalComparisonLabel = 'No change',
  valueFontSize,
  valueFormatter,
}) => {
  const hasComparisonValue = comparisonValue !== undefined;
  const equalComparison = hasComparisonValue && comparisonValue === value;

  const displayValue = value === undefined ? '' : valueFormatter ? valueFormatter(value) : value;

  return (
    <div className={styles.kpiChartContainer}>
      <Typography style={{ fontSize: valueFontSize }}>{displayValue}</Typography>
      <div className={styles.kpiComparisonContainer} style={{ fontSize: changeFontSize }}>
        {equalComparison ? (
          <Typography>{equalComparisonLabel}</Typography>
        ) : (
          <KpiChartChange
            changeFontSize={changeFontSize}
            className={clsx(!hasComparisonValue && styles.kpiChangeHidden)}
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
  );
};
