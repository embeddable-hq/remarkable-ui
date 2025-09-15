import { TablerIcon } from '@tabler/icons-react';
import styles from './Button.module.css';
import { BaseButton, type BaseButtonProps } from '../BaseButton';
import { Typography } from '../Typography/Typography';
import clsx from 'clsx';

type ButtonProps = BaseButtonProps & {
  startIcon?: TablerIcon;
  endIcon?: TablerIcon;
  children: string;
  size: 'small' | 'medium';
};

export const Button: React.FC<ButtonProps> = ({
  variant,
  startIcon: StartIcon,
  endIcon: EndIcon,
  children,
  size,
  ...props
}) => {
  return (
    <BaseButton
      variant={variant}
      className={size === 'medium' ? styles.buttonMedium : styles.buttonSmall}
      {...props}
      size={size}
    >
      {StartIcon && <StartIcon className={styles.icon} />}
      <Typography
        as="span"
        className={clsx(
          styles.buttonText,
          styles[`buttonText${size.charAt(0).toUpperCase() + size.slice(1)}`],
        )}
      >
        {children}
      </Typography>
      {EndIcon && <EndIcon className={styles.icon} />}
    </BaseButton>
  );
};
