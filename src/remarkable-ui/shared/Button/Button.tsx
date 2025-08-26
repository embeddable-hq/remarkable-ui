import { TablerIcon } from '@tabler/icons-react';
import clsx from 'clsx';
import styles from './Button.module.css';
import { Typography } from '../Typography/Typography';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  startIcon?: TablerIcon;
  endIcon?: TablerIcon;
  children: string;
  variant: 'primary' | 'secondary';
  size: 'small' | 'medium';
};

export const Button: React.FC<ButtonProps> = ({
  variant,
  startIcon: StartIcon,
  endIcon: EndIcon,
  size,
  className,
  children,
  ...props
}) => {
  return (
    <button {...props} className={clsx(styles.button, styles[variant], styles[size], className)}>
      {StartIcon && <StartIcon />}
      <Typography>{children}</Typography>
      {EndIcon && <EndIcon />}
    </button>
  );
};
