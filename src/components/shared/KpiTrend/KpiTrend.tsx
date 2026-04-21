import { FC } from 'react';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import styles from './KpiTrend.module.css';
import clsx from 'clsx';

export type KpiTrendProps = {
  value: string;
  reverseTrend?: boolean;
  className?: string;
};

export const KpiTrend: FC<KpiTrendProps> = ({ value, reverseTrend = false, className }) => {
  const Icon = reverseTrend ? IconTrendingDown : IconTrendingUp;

  return (
    <span
      className={clsx(styles.badge, reverseTrend ? styles.negative : styles.positive, className)}
    >
      <Icon />
      <span>{value}</span>
    </span>
  );
};
