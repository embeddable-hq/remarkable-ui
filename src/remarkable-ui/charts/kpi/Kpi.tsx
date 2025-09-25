import { FC } from 'react';
import { Typography } from '../../shared/Typography/Typography';
import styles from './Kpi.module.css';
import { KpiChange } from './KpiChange';
import { KpiProps } from './Kpi.types';
import clsx from 'clsx';

export const Kpi: FC<KpiProps> = ({
  value,
  comparisonValue,
  comparisonLabel,
  invertChangeColors,
  showChangeAsPercentage,
  equalComparisonLabel = 'No change',
}) => {
  const equalComparison = comparisonValue && comparisonValue === value;

  return (
    <div className={styles.kpiContainer}>
      <Typography>{value}</Typography>
      <div className={styles.kpiComparisonContainer}>
        {equalComparison ? (
          <Typography>{equalComparisonLabel}</Typography>
        ) : (
          <KpiChange
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
