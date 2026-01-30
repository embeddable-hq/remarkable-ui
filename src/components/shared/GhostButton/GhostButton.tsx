import React from 'react';
import { Icon } from '@tabler/icons-react';
import clsx from 'clsx';
import styles from './GhostButton.module.css';

type GhostButtonProps = {
  startIcon?: Icon;
  endIcon?: Icon;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const GhostButton = React.forwardRef<HTMLButtonElement, GhostButtonProps>(
  ({ startIcon: StartIcon, endIcon: EndIcon, children, className, ...props }, ref) => {
    return (
      <button ref={ref} className={clsx(styles.ghostButton, className)} {...props}>
        {StartIcon && <StartIcon />}
        <span>{children}</span>
        {EndIcon && <EndIcon />}
      </button>
    );
  },
);
GhostButton.displayName = 'GhostButton';
