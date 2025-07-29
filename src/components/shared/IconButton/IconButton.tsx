import clsx from 'clsx';
import React from 'react';
import styles from './IconButton.module.css';
import { TablerIcon } from '@tabler/icons-react';

type IconButtonProps = {
  className?: string;
  icon: TablerIcon;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, className, ...props }, ref) => {
    return (
      <button ref={ref} className={clsx(styles.iconButton, className)} {...props}>
        <Icon className={styles.icon} />
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
