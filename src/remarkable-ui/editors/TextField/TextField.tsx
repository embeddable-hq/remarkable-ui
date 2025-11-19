import { forwardRef } from 'react';
import { InputField } from '../InputField/InputField';
import styles from './TextField.module.css';
import { InputFieldProps } from '../InputField/InputField';

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
        {maxLength && (
          <p className={styles.characterCount}>
            {value?.length}/{maxLength} Characters
          </p>
        )}
      </>
    );
  },
);

TextField.displayName = 'TextField';
