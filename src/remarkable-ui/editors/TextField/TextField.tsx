import { forwardRef } from 'react';
import { InputField } from '../InputField/InputField';
import { InputFieldProps } from '../InputField/InputField';

type TextFieldProps = InputFieldProps & {
  maxLength?: number;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ value = '', placeholder = 'Enter text', ...props }, ref) => {
    return <InputField value={value} placeholder={placeholder} ref={ref} clearable {...props} />;
  },
);

TextField.displayName = 'TextField';
