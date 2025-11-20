import { forwardRef } from 'react';
import { InputField, InputFieldProps } from '../shared/InputField/InputField';

type NumberFieldProps = Omit<InputFieldProps, 'value' | 'onChange'> & {
  value?: number | null;
  step?: number;
  min?: number;
  max?: number;
  onChange?: (value: number | null) => void;
};

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  (
    {
      value = null,
      placeholder = 'Enter number',
      onChange,
      error,
      errorMessage,
      clearable,
      ...props
    },
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
        clearable={clearable}
        error={error}
        errorMessage={errorMessage}
        ref={ref}
      />
    );
  },
);

NumberField.displayName = 'NumberField';
