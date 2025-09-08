import { forwardRef } from 'react';
import { InputField } from '../InputField/InputField';
import styles from './TextField.module.css';
import { Typography } from '../../shared/Typography/Typography';
import { InputFieldProps } from '../InputField/InputField';

type TextFieldProps = Omit<InputFieldProps, 'value' | 'onChange'> & {
  maxLength?: number;
  value?: string;
  onChange: (value: string) => void;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      value = '',
      placeholder = 'Enter text',
      startIcon: StartIcon,
      endIcon: EndIcon,
      onChange,
      maxLength,
      ...props
    },
    ref,
  ) => {
    const currentLength = value?.length || 0;

    return (
      <div className={styles.textField}>
        <InputField
          value={value}
          placeholder={placeholder}
          startIcon={StartIcon}
          endIcon={EndIcon}
          onChange={onChange}
          ref={ref}
          maxLength={maxLength}
          clearable
          {...props}
        />
        {maxLength && (
          <Typography as="span" className={styles.characterCount}>
            {currentLength}/{maxLength} Characters
          </Typography>
        )}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
