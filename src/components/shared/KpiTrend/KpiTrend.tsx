import { FC } from 'react';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import styles from './KpiTrend.module.css';
import clsx from 'clsx';

export type KpiTrendDirection = 'positive' | 'negative';

export type KpiTrendProps = {
  direction: KpiTrendDirection;
  value: string;
  className?: string;
};

export const KpiTrend: FC<KpiTrendProps> = ({ direction, value, className }) => {
  const Icon = direction === 'positive' ? IconTrendingUp : IconTrendingDown;

  return (
    <span className={clsx(styles.badge, styles[direction], className)}>
      <Icon />
      <span>{value}</span>
    </span>
  );
};
