import styles from './SelectButton.module.css';
import { IconCaretDownFilled, IconLoader2, IconX, TablerIcon } from '@tabler/icons-react';
import clsx from 'clsx';
import { forwardRef } from 'react';
import { Typography } from '../../../../shared/Typography/Typography';

type SelectButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  startIcon?: TablerIcon;
  valueLabel?: string;
  placeholder?: string;
  isClearable?: boolean;
  isLoading?: boolean;
  onClear?: () => void;
  error?: boolean;
};

export const SelectButton = forwardRef<HTMLButtonElement, SelectButtonProps>(
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
          styles.button,
          showClearButton && styles.hasValue,
          error && styles.buttonError,
        )}
        {...props}
      >
        <span className={styles.leftContent}>
          {StartIcon && <StartIcon />}
          <Typography as="span">{displayValue}</Typography>
        </span>
        <span className={styles.rightContent}>
          {showClearButton && <IconX onPointerDown={handleClear} />}
          {isLoading ? <IconLoader2 className={styles.loading} /> : <IconCaretDownFilled />}
        </span>
      </button>
    );
  },
);

SelectButton.displayName = 'SelectButton';
