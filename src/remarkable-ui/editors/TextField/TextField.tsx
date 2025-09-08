import { forwardRef } from 'react';
import { InputField } from '../InputField/InputField';
import { InputFieldProps } from '../InputField/InputField';

type TextFieldProps = Omit<InputFieldProps, 'value' | 'onChange'> & {
  characterLimit?: number;
  value?: string;
  onChange: (value: string) => void;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ value = '', placeholder = 'Enter text', onChange, ...props }, ref) => {
    return (
      <InputField
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        ref={ref}
        clearable
        {...props}
      />
    );
  },
);

TextField.displayName = 'TextField';
