import { FC } from 'react';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import styles from './KpiTrend.module.css';
import clsx from 'clsx';

export type KpiTrendProps = {
  value: string;
  reverseTrend?: boolean;
  /** Controls badge color independently of arrow direction. Defaults to `reverseTrend`. */
  reverseColor?: boolean;
  className?: string;
};

export const KpiTrend: FC<KpiTrendProps> = ({
  value,
  reverseTrend = false,
  reverseColor = reverseTrend,
  className,
}) => {
  const Icon = reverseTrend ? IconTrendingDown : IconTrendingUp;

  return (
    <span
      className={clsx(styles.badge, reverseColor ? styles.negative : styles.positive, className)}
    >
      <Icon />
      <span>{value}</span>
    </span>
  );
};
