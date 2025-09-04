import React from 'react';
import clsx from 'clsx';
import styles from './Switch.module.css';
import { Typography } from '../Typography/Typography';

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
    <div className={clsx(styles.switchContainer, className)}>
      <label
        className={clsx(styles.switchLabel, checked && styles.checked, disabled && styles.disabled)}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={styles.switchInput}
          role="switch"
          aria-checked={checked}
          aria-disabled={disabled}
          {...props}
        />
        <span className={styles.switchTrack} aria-hidden="true">
          <span className={styles.switchThumb} aria-hidden="true" />
        </span>
        {label && (
          <Typography as="span" className={clsx(styles.labelText, disabled && styles.disabled)}>
            {label}
          </Typography>
        )}
      </label>
    </div>
  );
};
