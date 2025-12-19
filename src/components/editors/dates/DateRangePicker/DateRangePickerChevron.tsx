import { IconCaretDownFilled } from '@tabler/icons-react';
import styles from './DateRangePickerChevron.module.css';
import clsx from 'clsx';

type DateRangePickerChevronProps = {
  className?: string;
  orientation?: 'up' | 'down' | 'left' | 'right';
  size?: number;
};

const SMALL_SIZE = 18;

export const DateRangePickerChevron = ({
  orientation,
  size,
}: DateRangePickerChevronProps): React.JSX.Element => {
  console.log('size', size);
  const rotation =
    orientation === 'left'
      ? 'rotate(90deg)'
      : orientation === 'right'
        ? 'rotate(-90deg)'
        : undefined;

  const isSmallChevron = size === SMALL_SIZE;

  return (
    <button
      className={clsx(styles.chevron, isSmallChevron && styles.small)}
      style={{
        transform: rotation,
      }}
    >
      <IconCaretDownFilled />
    </button>
  );
};
