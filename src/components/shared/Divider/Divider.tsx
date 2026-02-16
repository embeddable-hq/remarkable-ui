import clsx from 'clsx';
import styles from './Divider.module.css';

type DividerProps = {
  className?: string;
  color?: string;
  thickness?: number;
  vertical?: boolean;
};

const getStyle = (color?: string, thickness?: number, vertical?: boolean) => {
  const style: React.CSSProperties = {};
  if (color) style.backgroundColor = color;

  if (thickness) {
    if (vertical) {
      style.width = thickness;
    } else {
      style.height = thickness;
    }
  }

  return style;
};

export const Divider = ({ color, thickness, vertical, className }: DividerProps) => {
  return (
    <div
      className={clsx(styles.divider, vertical && styles.vertical, className)}
      style={getStyle(color, thickness, vertical)}
    />
  );
};
