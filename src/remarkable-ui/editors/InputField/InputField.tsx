import { IconX, TablerIcon } from '@tabler/icons-react';
import styles from './InputField.module.css';
import clsx from 'clsx';
import { forwardRef } from 'react';

export type InputFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  value?: string;
  placeholder?: string;
  startIcon?: TablerIcon;
  endIcon?: TablerIcon;
  onChange: (value: string) => void;
  clearable?: boolean;
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
};

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
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
      ...props
    },
    ref,
  ) => {
    return (
      <div className={clsx(styles.input, className)}>
        {StartIcon && <StartIcon />}
        <input
          type={type}
          role={role}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          ref={ref}
          {...props}
        />
        <div>
          {value && !clearable && (
            <IconX className={styles.clearIcon} onClick={() => onChange('')} />
          )}
          {EndIcon && <EndIcon />}
        </div>
      </div>
    );
  },
);

InputField.displayName = 'InputField';
