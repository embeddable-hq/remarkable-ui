import { useState, useEffect, FC } from 'react';
import styles from './ColorEditor.module.css';
import { ActionIcon } from '../../../remarkable-ui';
import { IconX } from '@tabler/icons-react';

type ColorInputProps = {
  value: string;
  onChange: (color?: string) => void;
};

const ColorInput: FC<ColorInputProps> = ({ value, onChange }) => {
  const [color, setColor] = useState<string>(value);

  useEffect(() => {
    setColor(value);
  }, [value, setColor]);

  return (
    <div className={styles.colorInputContainer}>
      <input
        type="color"
        className={styles.colorInput}
        value={color ?? '#FFFFFF'}
        onChange={(e) => onChange(e.target.value)}
      />
      {color && <ActionIcon icon={IconX} onClick={() => onChange(undefined)} />}
    </div>
  );
};

export default ColorInput;
