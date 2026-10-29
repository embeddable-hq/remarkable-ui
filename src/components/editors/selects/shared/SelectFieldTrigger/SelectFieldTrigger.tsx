import styles from './SelectFieldTrigger.module.css';
import { IconCaretDownFilled, IconLoader2, IconProps, IconX } from '@tabler/icons-react';
import clsx from 'clsx';
import { forwardRef, useCallback, useRef } from 'react';
import { GhostButton } from '../../../../shared/GhostButton/GhostButton';

type SelectFieldTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  startIcon?: React.ComponentType<IconProps>;
  valueLabel?: string;
  placeholder?: string;
  isClearable?: boolean;
  isLoading?: boolean;
  onClear?: () => void;
  clearLabel?: string;
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
      clearLabel = 'Clear',
      error = false,
      variant = 'default',
      ...props
    },
    ref,
  ) => {
    const triggerRef = useRef<HTMLButtonElement | null>(null);

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const displayValue = valueLabel || placeholder;

    const showClearButton = valueLabel && isClearable;

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onClear?.();
      // The clear button unmounts once the value is gone; keep keyboard focus in the field (WCAG 2.4.3)
      triggerRef.current?.focus();
    };

    // The clear control is a sibling of the trigger, not a child: interactive content
    // can't be nested inside a <button>, and a sibling gets its own tab stop.
    const clearButton = showClearButton && (
      <button
        type="button"
        className={clsx(styles.clearButton, variant === 'ghost' && styles.clearButtonGhost)}
        aria-label={clearLabel}
        disabled={props.disabled}
        onClick={handleClear}
      >
        <IconX aria-hidden="true" />
      </button>
    );

    if (variant === 'ghost') {
      return (
        <span className={clsx(styles.root, styles.rootGhost)}>
          <GhostButton
            ref={setRefs}
            endIcon={isLoading ? IconLoader2 : IconCaretDownFilled}
            {...props}
          >
            {displayValue}
          </GhostButton>
          {clearButton}
        </span>
      );
    }

    return (
      <span className={styles.root}>
        <button
          ref={setRefs}
          className={clsx(
            styles.selectFieldTrigger,
            valueLabel && styles.filled,
            error && styles.error,
            showClearButton && styles.hasClear,
          )}
          {...props}
        >
          {StartIcon && <StartIcon />}
          <span>{displayValue}</span>
          {isLoading ? <IconLoader2 className={styles.loading} /> : <IconCaretDownFilled />}
        </button>
        {clearButton}
      </span>
    );
  },
);

SelectFieldTrigger.displayName = 'SelectFieldTrigger';
