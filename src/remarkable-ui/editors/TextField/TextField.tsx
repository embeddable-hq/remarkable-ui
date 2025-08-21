import { IconX, TablerIcon } from '@tabler/icons-react';
import styles from './TextField.module.css';
import { FC } from 'react';
import clsx from 'clsx';

type TextFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  startIcon?: TablerIcon;
  endIcon?: TablerIcon;
  value?: string;
  onChange: (value: string) => void;
};

export const TextField: FC<TextFieldProps> = ({
  value = '',
  disabled,
  placeholder = 'Enter text',
  role,
  startIcon: StartIcon,
  endIcon: EndIcon,
  onChange,
  className,
  ...props
}) => {
  return (
    <div className={clsx(styles.input, className)}>
      {StartIcon && <StartIcon />}
      <input
        type="text"
        role={role}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
      <div>
        {value && <IconX onClick={() => onChange('')} />}
        {EndIcon && <EndIcon />}
      </div>
    </div>
  );
};
