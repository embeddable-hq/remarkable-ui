import styles from './SelectButton.module.css';
import { IconCaretDownFilled, IconLoader2, IconX } from '@tabler/icons-react';
import clsx from 'clsx';
import { forwardRef } from 'react';
import { Typography } from '../../../../shared/Typography/Typography';

type SelectButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  valueLabel?: string;
  placeholder?: string;
  isClearable?: boolean;
  isLoading?: boolean;
  onClear?: () => void;
};

export const SelectButton = forwardRef<HTMLButtonElement, SelectButtonProps>(
  ({ valueLabel, placeholder = 'Select', isClearable, isLoading, onClear, ...props }, ref) => {
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
        className={clsx(styles.button, showClearButton && styles.hasValue)}
        {...props}
      >
        <Typography>{displayValue}</Typography>
        <div>
          {showClearButton && <IconX onPointerDown={handleClear} />}
          {isLoading ? <IconLoader2 className={styles.loading} /> : <IconCaretDownFilled />}
        </div>
      </button>
    );
  },
);

SelectButton.displayName = 'SelectButton';
