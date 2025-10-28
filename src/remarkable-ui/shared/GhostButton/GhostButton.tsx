import React from 'react';
import { Icon } from '@tabler/icons-react';
import clsx from 'clsx';
import styles from './GhostButton.module.css';

export type GhostButtonProps = {
  startIcon?: Icon;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const GhostButton: React.FC<GhostButtonProps> = ({
  startIcon: StartIcon,
  children,
  className,
  ...props
}) => {
  return (
    <button className={clsx(styles.ghostButton, className)} {...props}>
      {StartIcon && <StartIcon className={styles.icon} />}
      {children}
    </button>
  );
};
