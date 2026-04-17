import { FC } from 'react';
import styles from '../ChartTabs.module.css';
import clsx from 'clsx';

export type ChartTabsItemProps = {
  id: string;
  label: string;
  value?: number | string;
  slot?: React.ReactNode;
  active?: boolean;
  className?: string;
  onClick?: () => void;
};

export const ChartTabsItem: FC<ChartTabsItemProps> = ({
  id,
  active,
  label,
  value,
  slot,
  className,
  onClick,
}) => {
  return (
    <button
      id={`chart-kpi-tab-${id}`}
      className={clsx(styles.tab, active && styles.active, className)}
      type="button"
      onClick={onClick}
    >
      <span className={styles.tabTitle}>{label}</span>
      {value && <span className={styles.tabValue}>{value}</span>}
      {slot}
    </button>
  );
};
