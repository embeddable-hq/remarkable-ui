import styles from './SelectFieldTrigger.module.css';
import { IconCaretDownFilled, IconLoader2, IconX, TablerIcon } from '@tabler/icons-react';
import clsx from 'clsx';
import { forwardRef } from 'react';

type SelectFieldTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  startIcon?: TablerIcon;
  valueLabel?: string;
  placeholder?: string;
  isClearable?: boolean;
  isLoading?: boolean;
  onClear?: () => void;
  error?: boolean;
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
