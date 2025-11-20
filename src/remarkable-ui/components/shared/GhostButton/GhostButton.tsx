import React from 'react';
import { Icon } from '@tabler/icons-react';
import clsx from 'clsx';
import styles from './GhostButton.module.css';

type GhostButtonProps = {
  startIcon?: Icon;
  endIcon?: Icon;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const GhostButton: React.FC<GhostButtonProps> = ({
  startIcon: StartIcon,
  endIcon: EndIcon,
  children,
  className,
  ...props
}) => {
  return (
    <button className={clsx(styles.ghostButton, className)} {...props}>
      {StartIcon && <StartIcon />}
      <span>{children}</span>
      {EndIcon && <EndIcon />}
    </button>
  );
};
