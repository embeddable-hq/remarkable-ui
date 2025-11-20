import { IconX, TablerIcon } from '@tabler/icons-react';
import styles from './InputField.module.css';
import clsx from 'clsx';
import { forwardRef } from 'react';
import { FieldHeader, FieldHeaderProps } from '../../../../shared/Field/FieldHeader';
import { FieldFeedback } from '../../../../shared/Field/FieldFeedback';

export type InputFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  value?: string;
  placeholder?: string;
  startIcon?: TablerIcon;
  endIcon?: TablerIcon;
  onChange: (value: string) => void;
  clearable?: boolean;
  error?: boolean;
  errorMessage?: string;
} & FieldHeaderProps;

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      required,
      value = '',
      disabled,
      placeholder = 'Enter text',
      role,
      startIcon: StartIcon,
      endIcon: EndIcon,
      onChange,
      className,
      clearable = false,
      type = 'text',
      error = false,
      errorMessage,
      requiredLabel,
      ...props
    },
    ref,
  ) => {
    const showClearButton = value && clearable;
    const hasError = error || errorMessage;
    return (
      <div className={className}>
        <FieldHeader label={label} required={required} requiredLabel={requiredLabel} />
        <div className={clsx(styles.input, hasError && styles.error)}>
          {StartIcon && <StartIcon />}
          <input
            ref={ref}
            type={type}
            role={role}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            {...props}
          />
          <IconX
            className={clsx(styles.clearIcon, showClearButton && styles.clearIconVisible)}
            onClick={() => onChange('')}
          />
          {EndIcon && <EndIcon />}
        </div>
        {errorMessage && <FieldFeedback variant="error" message={errorMessage} />}
      </div>
    );
  },
);

InputField.displayName = 'InputField';
