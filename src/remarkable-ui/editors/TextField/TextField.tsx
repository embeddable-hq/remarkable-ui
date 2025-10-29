import { forwardRef } from 'react';
import { InputField } from '../InputField/InputField';
import styles from './TextField.module.css';
import { Typography } from '../../shared/Typography/Typography';
import { InputFieldProps } from '../InputField/InputField';

export const TextField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ value = '', placeholder = 'Enter text', maxLength, error, errorMessage, ...props }, ref) => {
    return (
      <div className={styles.textField}>
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
          <Typography as="span" className={styles.characterCount}>
            {value?.length}/{maxLength} Characters
          </Typography>
        )}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
