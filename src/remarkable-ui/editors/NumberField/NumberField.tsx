import { InputField } from '../InputField/InputField';
import { forwardRef, useCallback } from 'react';

type NumberFieldProps = Omit<
  React.ComponentProps<typeof InputField>,
  'onChange' | 'type' | 'value'
> & {
  value?: number;
  step?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
};

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  (
    {
      value = 0,
      disabled,
      placeholder = 'Enter number',
      step = 1,
      min,
      max,
      onChange,
      className,
      ...inputFieldProps
    },
    ref,
  ) => {
    const handleInputChange = useCallback(
      (inputVal: string) => {
        const numValue = parseFloat(inputVal);
        if (!isNaN(numValue)) {
          onChange?.(numValue);
        }
      },
      [onChange],
    );

    return (
      <InputField
        {...inputFieldProps}
        value={value.toString()}
        disabled={disabled}
        placeholder={placeholder}
        onChange={handleInputChange}
        hideClearIcon={true}
        type="number"
        step={step}
        min={min}
        max={max}
        className={className}
        ref={ref}
      />
    );
  },
);

NumberField.displayName = 'NumberField';
