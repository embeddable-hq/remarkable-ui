import React from 'react';
import clsx from 'clsx';
import styles from './ButtonIcon.module.css';
import { TablerIcon } from '@tabler/icons-react';

type ButtonIconProps = {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium';
  icon: TablerIcon;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ButtonIcon: React.FC<ButtonIconProps> = ({
  icon: Icon,
  size = 'medium',
  variant = 'primary',
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(styles.buttonIcon, styles[variant], styles[size], className)}
      {...props}
    >
      <Icon />
    </button>
  );
};
