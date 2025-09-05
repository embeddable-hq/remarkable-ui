import { TablerIcon } from '@tabler/icons-react';
import { forwardRef } from 'react';
import { InputField } from '../InputField/InputField';
import styles from './TextField.module.css';
import { Typography } from '../../shared/Typography/Typography';

type TextFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  value?: string;
  placeholder?: string;
  startIcon?: TablerIcon;
  endIcon?: TablerIcon;
  onChange: (value: string) => void;
  characterLimit?: number;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      value = '',
      disabled,
      placeholder = 'Enter text',
      role,
      startIcon: StartIcon,
      endIcon: EndIcon,
      onChange,
      className,
      characterLimit,
      ...props
    },
    ref,
  ) => {
    const currentLength = value?.length || 0;

    const handleChange = (newValue: string) => {
      if (characterLimit && newValue.length > characterLimit) {
        return; // Prevent typing beyond the limit
      }
      onChange(newValue);
    };

    return (
      <div className={styles.textField}>
        <InputField
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          role={role}
          startIcon={StartIcon}
          endIcon={EndIcon}
          onChange={handleChange}
          className={className}
          ref={ref}
          clearable
          {...props}
        />
        {characterLimit && (
          <Typography as="span" className={styles.characterCount}>
            {currentLength}/{characterLimit} Characters
          </Typography>
        )}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
