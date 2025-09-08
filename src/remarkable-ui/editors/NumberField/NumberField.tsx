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
  ({ value = null, placeholder = 'Enter number', onChange, ...props }, ref) => {
    const handleChange = (stringValue: string) => {
      if (stringValue === '' || stringValue === null || stringValue === undefined) {
        onChange?.(null);
        return;
      }

      const numericValue = Number(stringValue);
      if (!isNaN(numericValue) && isFinite(numericValue)) {
        onChange?.(numericValue);
      }
    };

    return (
      <InputField
        {...props}
        value={value?.toString() || ''}
        placeholder={placeholder}
        onChange={handleChange}
        type="number"
        clearable={false}
        ref={ref}
      />
    );
  },
);

NumberField.displayName = 'NumberField';
