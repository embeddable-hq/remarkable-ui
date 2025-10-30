import { InputField, InputFieldProps } from '../InputField/InputField';
import { forwardRef } from 'react';

type NumberFieldProps = Omit<InputFieldProps, 'value' | 'onChange'> & {
  value?: number | null;
  step?: number;
  min?: number;
  max?: number;
  onChange?: (value: number | null) => void;
  error?: boolean;
  errorMessage?: string;
};

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  (
    { value = null, placeholder = 'Enter number', onChange, error, errorMessage, ...props },
    ref,
  ) => {
    const handleChange = (value: string) => {
      if (value === '') {
        onChange?.(null);
        return;
      }

      const numericValue = Number(value);
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
        error={error}
        errorMessage={errorMessage}
        ref={ref}
      />
    );
  },
);

NumberField.displayName = 'NumberField';
