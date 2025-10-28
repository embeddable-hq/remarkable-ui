import clsx from 'clsx';
import React from 'react';
import styles from './BaseButton.module.css';

export type BaseButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium';
  ref?: React.Ref<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const BaseButton: React.FC<BaseButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={clsx(styles.baseButton, styles[variant], styles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
