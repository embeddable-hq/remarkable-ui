import { IconCaretDownFilled } from '@tabler/icons-react';
import styles from './DateRangePickerChevron.module.css';

type DateRangePickerChevronProps = {
  className?: string;
  orientation?: 'up' | 'down' | 'left' | 'right';
};

export const DateRangePickerChevron = ({
  orientation,
}: DateRangePickerChevronProps): React.JSX.Element => {
  const rotation =
    orientation === 'left'
      ? 'rotate(90deg)'
      : orientation === 'right'
        ? 'rotate(-90deg)'
        : undefined;

  return (
    <button
      className={styles.chevron}
      style={{
        transform: rotation,
      }}
    >
      <IconCaretDownFilled />
    </button>
  );
};
