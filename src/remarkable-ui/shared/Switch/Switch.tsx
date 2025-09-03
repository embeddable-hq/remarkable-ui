import React from 'react';
import clsx from 'clsx';
import styles from './Switch.module.css';

type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'checked'> & {
  /**
   * The current state of the switch
   */
  checked: boolean;
  /**
   * Callback fired when the switch state changes
   */
  onChange?: (checked: boolean) => void;
  /**
   * Whether the switch is disabled
   */
  disabled?: boolean;
  /**
   * Additional CSS class name
   */
  className?: string;
  /**
   * Label for the switch (optional)
   */
  label?: string;
  /**
   * Accessible label for screen readers (required if no label is provided)
   */
  'aria-label'?: string;
  /**
   * Additional description for screen readers
   */
  'aria-describedby'?: string;
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow space and enter to toggle the switch
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (!disabled && onChange) {
        onChange(!checked);
      }
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
          onKeyDown={handleKeyDown}
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
          <span className={clsx(styles.labelText, disabled && styles.disabled)}>{label}</span>
        )}
      </label>
    </div>
  );
};
