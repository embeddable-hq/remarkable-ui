import { IconX, TablerIcon } from '@tabler/icons-react';
import styles from './TextField.module.css';
import clsx from 'clsx';
import { forwardRef } from 'react';

type TextFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  value?: string;
  placeholder?: string;
  startIcon?: TablerIcon;
  endIcon?: TablerIcon;
  onChange: (value: string) => void;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
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
      ...props
    },
    ref,
  ) => {
    return (
      <div className={clsx(styles.input, className)}>
        {StartIcon && <StartIcon />}
        <input
          type="text"
          role={role}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          ref={ref}
          {...props}
        />
        <div>
          {value && <IconX className={styles.clearIcon} onClick={() => onChange('')} />}
          {EndIcon && <EndIcon />}
        </div>
      </div>
    );
  },
);

TextField.displayName = 'TextField';
