import { FC } from 'react';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import styles from './KpiTrend.module.css';
import clsx from 'clsx';

export type KpiTrendProps = {
  value: string;
  reverseTrend?: boolean;
  /**
   * Controls the badge color (positive/negative) independently of the arrow
   * direction. Defaults to `reverseTrend`, so existing usages that only pass
   * `reverseTrend` keep coloring and arrow direction coupled together, as
   * before (see TPS-1470).
   */
  invertColor?: boolean;
  className?: string;
};

export const KpiTrend: FC<KpiTrendProps> = ({
  value,
  reverseTrend = false,
  invertColor = reverseTrend,
  className,
}) => {
  const Icon = reverseTrend ? IconTrendingDown : IconTrendingUp;

  return (
    <span
      className={clsx(styles.badge, invertColor ? styles.negative : styles.positive, className)}
    >
      <Icon />
      <span>{value}</span>
    </span>
  );
};
