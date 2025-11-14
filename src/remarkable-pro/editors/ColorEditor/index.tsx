import { useState, useEffect, FC } from 'react';
import styles from './ColorEditor.module.css';

type ColorInputProps = {
  value: string;
  onChange: (color: string) => void;
};

const DEFAULT_COLOR = '#FFFFFF';

const ColorInput: FC<ColorInputProps> = ({ value, onChange }) => {
  const [color, setColor] = useState<string>(value);

  useEffect(() => {
    if (!value) {
      onChange(DEFAULT_COLOR);
      return;
    }
    setColor(value);
  }, [value, setColor]);

  return (
    <input
      type="color"
      className={styles.colorInput}
      value={color}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default ColorInput;
