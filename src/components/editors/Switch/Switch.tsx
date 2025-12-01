import React from 'react';
import clsx from 'clsx';
import styles from './Switch.module.css';

type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
};

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  className,
  label,
  ...props
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && onChange) {
      onChange(event.target.checked);
    }
  };

  // Ensure accessibility: either aria-label must be provided
  if (!props['aria-label']) {
    console.warn(
      'Switch component requires either a label prop or aria-label prop for accessibility',
    );
  }

  return (
    <label
      className={clsx(
        className,
        styles.switch,
        checked && styles.checked,
        disabled && styles.disabled,
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        {...props}
      />
      <span className={styles.switchTrack} aria-hidden="true">
        <span className={styles.switchThumb} aria-hidden="true" />
      </span>
      {label && <span className={clsx(styles.switchLabel)}>{label}</span>}
    </label>
  );
};
