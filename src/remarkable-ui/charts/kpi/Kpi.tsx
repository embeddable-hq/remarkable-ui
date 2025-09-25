import { FC } from 'react';
import { Typography } from '../../shared/Typography/Typography';
import styles from './Kpi.module.css';
import { KpiChange } from './KpiChange';
import { KpiProps } from './Kpi.types';
import clsx from 'clsx';

export const Kpi: FC<KpiProps> = ({ comparisonLabel = 'vs previous period.', ...props }) => {
  return (
    <div className={styles.kpiContainer}>
      <Typography>{props.value}</Typography>
      <div className={clsx(styles.kpiComparisonContainer, !props.comparisonValue && styles.hidden)}>
        <KpiChange {...props} />
        <Typography>{comparisonLabel}</Typography>
      </div>
    </div>
  );
};
