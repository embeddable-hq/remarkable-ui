import { TablerIcon } from '@tabler/icons-react';
import { forwardRef } from 'react';
import { InputField } from '../InputField/InputField';

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
      <InputField
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        role={role}
        startIcon={StartIcon}
        endIcon={EndIcon}
        onChange={onChange}
        className={className}
        ref={ref}
        clearable
        {...props}
      />
    );
  },
);

TextField.displayName = 'TextField';
