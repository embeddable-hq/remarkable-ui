import clsx from 'clsx';
import React from 'react';
import styles from './ActionIcon.module.css';
import { TablerIcon } from '@tabler/icons-react';

type ActionIconProps = {
  className?: string;
  icon: TablerIcon;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ActionIcon: React.FC<ActionIconProps> = ({ icon: Icon, className, ...props }) => {
  return (
    <button className={clsx(styles.actionIcon, className)} {...props}>
      <Icon className={styles.icon} />
    </button>
  );
};
