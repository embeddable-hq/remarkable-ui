import { InputField } from '../InputField/InputField';
import { forwardRef } from 'react';

type NumberFieldProps = Omit<
  React.ComponentProps<typeof InputField>,
  'onChange' | 'type' | 'value'
> & {
  value?: number | null;
  step?: number;
  min?: number;
  max?: number;
  onChange?: (value: number | null) => void;
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
    return (
      <InputField
        {...inputFieldProps}
        value={value?.toString() || ''}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(value) => onChange?.(+value)}
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
