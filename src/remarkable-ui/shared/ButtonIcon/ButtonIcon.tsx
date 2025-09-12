import React from 'react';
import clsx from 'clsx';
import styles from './ButtonIcon.module.css';
import { BaseButton, type BaseButtonProps } from '../BaseButton';
import { TablerIcon } from '@tabler/icons-react';

type ButtonIconProps = Omit<BaseButtonProps, 'size'> & {
  icon: TablerIcon;
};

export const ButtonIcon = React.forwardRef<HTMLButtonElement, ButtonIconProps>(
  ({ icon: Icon, variant = 'primary', ...props }, ref) => {
    return (
      <BaseButton
        ref={ref}
        variant={variant}
        size="medium"
        className={styles.buttonIcon}
        {...props}
      >
        <Icon
          className={clsx(
            styles.icon,
            styles[`icon${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
          )}
        />
      </BaseButton>
    );
  },
);

ButtonIcon.displayName = 'ButtonIcon';
