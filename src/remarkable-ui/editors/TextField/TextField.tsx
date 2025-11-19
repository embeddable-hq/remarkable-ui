import { forwardRef } from 'react';
import { InputField } from '../InputField/InputField';
import { InputFieldProps } from '../InputField/InputField';
import { FieldFeedback } from '../../shared/Field/FieldFeedback';

export const TextField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ value = '', placeholder = 'Enter text', maxLength, error, errorMessage, ...props }, ref) => {
    return (
      <>
        <InputField
          value={value}
          placeholder={placeholder}
          ref={ref}
          maxLength={maxLength}
          clearable
          error={error}
          errorMessage={errorMessage}
          {...props}
        />
        {maxLength && <FieldFeedback message={`${value?.length}/${maxLength} Characters`} />}
      </>
    );
  },
);

TextField.displayName = 'TextField';
