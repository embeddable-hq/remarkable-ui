import { TablerIcon } from '@tabler/icons-react';
import styles from './Button.module.css';
import clsx from 'clsx';

type ButtonProps = {
  startIcon?: TablerIcon;
  endIcon?: TablerIcon;
  children: string;
  size?: 'small' | 'medium';
  variant?: 'primary' | 'secondary';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  startIcon: StartIcon,
  endIcon: EndIcon,
  className,
  ...props
}) => {
  return (
    <button className={clsx(styles.button, styles[variant], styles[size], className)} {...props}>
      {StartIcon && <StartIcon />}
      <span>{children}</span>
      {EndIcon && <EndIcon />}
    </button>
  );
};
