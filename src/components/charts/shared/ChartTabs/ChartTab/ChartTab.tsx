import { FC } from 'react';
import styles from './ChartTab.module.css';
import clsx from 'clsx';

export type ChartTabItemProps = {
  id: string;
  label: string;
  value?: number | string;
  slot?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
};

export const ChartTabItem: FC<ChartTabItemProps> = ({
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
