import clsx from 'clsx';
import React from 'react';
import styles from './ButtonIcon.module.css';
import { TablerIcon } from '@tabler/icons-react';

type ButtonIconProps = {
  icon: TablerIcon;
  variant?: 'primary' | 'secondary';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ButtonIcon = React.forwardRef<HTMLButtonElement, ButtonIconProps>(
  ({ icon: Icon, className, variant = 'primary', ...props }, ref) => {
    return (
      <button ref={ref} className={clsx(styles.buttonIcon, styles[variant], className)} {...props}>
        <Icon className={styles.icon} />
      </button>
    );
  },
);

ButtonIcon.displayName = 'ButtonIcon';
