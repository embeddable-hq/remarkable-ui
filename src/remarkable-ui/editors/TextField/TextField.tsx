import { IconX, TablerIcon } from '@tabler/icons-react';
import styles from './TextField.module.css';
import { FC } from 'react';

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  startIcon?: TablerIcon;
  endIcon?: TablerIcon;
  value?: string;
  onChange: (value: string) => void;
};

export const TextField: FC<TextFieldProps> = ({
  value,
  disabled,
  placeholder = 'Enter text',
  startIcon: StartIcon,
  endIcon: EndIcon,
  onChange,
  ...props
}) => {
  return (
    <div className={styles.input} {...props}>
      {StartIcon && <StartIcon />}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <div>
        {value && <IconX onClick={() => onChange('')} />}
        {EndIcon && <EndIcon />}
      </div>
    </div>
  );
};
