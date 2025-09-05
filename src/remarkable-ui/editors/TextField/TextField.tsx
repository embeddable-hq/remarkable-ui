import { forwardRef } from 'react';
import { InputField } from '../InputField/InputField';
import { InputFieldProps } from '../InputField/InputField';

type TextFieldProps = Omit<InputFieldProps, 'value' | 'onChange'> & {
  characterLimit?: number;
  value?: string;
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
