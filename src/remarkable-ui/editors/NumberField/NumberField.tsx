import { InputField, InputFieldProps } from '../InputField/InputField';
import { forwardRef } from 'react';

type NumberFieldProps = Omit<InputFieldProps, 'value' | 'onChange'> & {
  value?: number | null;
  step?: number;
  min?: number;
  max?: number;
  onChange?: (value: number | null) => void;
};

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  ({ value = 0, placeholder = 'Enter number', onChange, ...props }, ref) => {
    return (
      <InputField
        {...props}
        value={value?.toString() || ''}
        placeholder={placeholder}
        onChange={(value) => onChange?.(+value)}
        type="number"
        clearable={false}
        ref={ref}
      />
    );
  },
);

NumberField.displayName = 'NumberField';
