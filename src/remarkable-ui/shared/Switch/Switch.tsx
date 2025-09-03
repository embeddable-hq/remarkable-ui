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
  onCheckedChange?: (checked: boolean) => void;
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
  onCheckedChange,
  disabled = false,
  className,
  label,
  id,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  ...props
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(event.target.checked);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow space and enter to toggle the switch
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked);
      }
    }
  };

  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;
  const labelId = `${switchId}-label`;

  // Ensure accessibility: either label or aria-label must be provided
  const accessibleLabel = label || ariaLabel;
  if (!accessibleLabel) {
    console.warn(
      'Switch component requires either a label prop or aria-label prop for accessibility',
    );
  }

  return (
    <div className={clsx(styles.switchContainer, className)}>
      <label
        htmlFor={switchId}
        id={labelId}
        className={clsx(styles.switchLabel, disabled && styles.disabled)}
      >
        <input
          type="checkbox"
          id={switchId}
          checked={checked}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={styles.switchInput}
          role="switch"
          aria-checked={checked}
          aria-labelledby={label ? labelId : undefined}
          aria-label={!label ? ariaLabel : undefined}
          aria-describedby={ariaDescribedby}
          aria-disabled={disabled}
          {...props}
        />
        <span
          className={clsx(
            styles.switchTrack,
            checked && styles.checked,
            disabled && styles.disabled,
          )}
          aria-hidden="true"
        >
          <span
            className={clsx(
              styles.switchThumb,
              checked && styles.checked,
              disabled && styles.disabled,
            )}
            aria-hidden="true"
          />
        </span>
      </label>
      {label && (
        <span id={labelId} className={clsx(styles.labelText, disabled && styles.disabled)}>
          {label}
        </span>
      )}
    </div>
  );
};
