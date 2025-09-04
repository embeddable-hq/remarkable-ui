import { TextField } from '../TextField/TextField';
import { forwardRef, useState, useCallback } from 'react';

type NumberFieldProps = Omit<
  React.ComponentProps<typeof TextField>,
  'onChange' | 'type' | 'value'
> & {
  defaultValue?: number;
  step?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
};

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  (
    {
      defaultValue = 0,
      disabled,
      placeholder = 'Enter number',
      step = 1,
      min,
      max,
      onChange,
      className,
      ...textFieldProps
    },
    ref,
  ) => {
    const [value, setValue] = useState(defaultValue);

    const handleInputChange = useCallback(
      (inputVal: string) => {
        const numValue = parseFloat(inputVal);
        if (!isNaN(numValue)) {
          setValue(numValue);
          onChange?.(numValue);
        }
      },
      [onChange],
    );

    return (
      <TextField
        {...textFieldProps}
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
