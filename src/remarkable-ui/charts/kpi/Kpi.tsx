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
}) => {
  const hideComparisonContainer = !comparisonValue || comparisonValue === value;

  return (
    <div className={styles.kpiContainer}>
      <Typography>{value}</Typography>
      <div
        className={clsx(styles.kpiComparisonContainer, hideComparisonContainer && styles.hidden)}
      >
        <KpiChange
          value={value}
          comparisonValue={comparisonValue}
          invertChangeColors={invertChangeColors}
          showChangeAsPercentage={showChangeAsPercentage}
        />
        {comparisonLabel && <Typography>{comparisonLabel}</Typography>}
      </div>
    </div>
  );
};
