import clsx from 'clsx';
import React from 'react';
import styles from './BaseButton.module.css';

export type BaseButtonProps = {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  ({ variant = 'primary', size = 'medium', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(styles.baseButton, styles[variant], styles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

BaseButton.displayName = 'BaseButton';
