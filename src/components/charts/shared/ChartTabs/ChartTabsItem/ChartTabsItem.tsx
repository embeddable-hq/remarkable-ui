import { FC } from 'react';
import styles from './ChartTabsItem.module.css';
import clsx from 'clsx';

export type ChartTabsItemProps = {
  id: string;
  label: string;
  value?: number | string;
  slot?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
};

export const ChartTabsItem: FC<ChartTabsItemProps> = ({
  id,
  label,
  value,
  slot,
  isActive,
  onClick,
}) => {
  return (
    <button
      id={`chart-kpi-tab-${id}`}
      className={clsx(styles.tab, isActive && styles.active)}
      onClick={onClick}
      type="button"
    >
      <span className={styles.tabTitle}>{label}</span>
      {value && <span className={styles.tabValue}>{value}</span>}
      {slot}
    </button>
  );
};
