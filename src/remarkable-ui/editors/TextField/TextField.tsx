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
  hideClearIcon?: boolean;
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
      hideClearIcon = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={clsx(styles.input, className)}>
        {StartIcon && <StartIcon />}
        <input
          type={props.type || 'text'}
          role={role}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          ref={ref}
          {...props}
        />
        <div>
          {value && !hideClearIcon && (
            <IconX className={styles.clearIcon} onClick={() => onChange('')} />
          )}
          {EndIcon && <EndIcon />}
        </div>
      </div>
    );
  },
);

TextField.displayName = 'TextField';
