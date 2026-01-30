import styles from './SelectFieldTrigger.module.css';
import { IconCaretDownFilled, IconLoader2, IconProps, IconX } from '@tabler/icons-react';
import clsx from 'clsx';
import { forwardRef } from 'react';
import { GhostButton } from '../../../../shared/GhostButton/GhostButton';

type SelectFieldTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  startIcon?: React.ComponentType<IconProps>;
  valueLabel?: string;
  placeholder?: string;
  isClearable?: boolean;
  isLoading?: boolean;
  onClear?: () => void;
  error?: boolean;
  variant?: 'default' | 'ghost';
};

export const SelectFieldTrigger = forwardRef<HTMLButtonElement, SelectFieldTriggerProps>(
  (
    {
      startIcon: StartIcon,
      valueLabel,
      placeholder = 'Select',
      isClearable,
      isLoading,
      onClear,
      error = false,
      variant = 'default',
      ...props
    },
    ref,
  ) => {
    const displayValue = valueLabel || placeholder;

    const showClearButton = valueLabel && isClearable;

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onClear?.();
    };

    if (variant === 'ghost') {
      return (
        <GhostButton ref={ref} endIcon={isLoading ? IconLoader2 : IconCaretDownFilled} {...props}>
          {displayValue}
          {showClearButton && <IconX onPointerDown={handleClear} />}
        </GhostButton>
      );
    }

    return (
      <button
        ref={ref}
        className={clsx(
          styles.selectFieldTrigger,
          valueLabel && styles.filled,
          error && styles.error,
        )}
        {...props}
      >
        {StartIcon && <StartIcon />}
        <span>{displayValue}</span>
        {showClearButton && <IconX onPointerDown={handleClear} />}
        {isLoading ? <IconLoader2 className={styles.loading} /> : <IconCaretDownFilled />}
      </button>
    );
  },
);

SelectFieldTrigger.displayName = 'SelectFieldTrigger';
