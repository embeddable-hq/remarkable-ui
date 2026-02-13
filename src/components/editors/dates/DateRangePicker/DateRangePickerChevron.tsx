import { IconCaretLeftFilled } from '@tabler/icons-react';
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
  const rotation =
    orientation === 'left' ? 'undefined' : orientation === 'right' ? 'rotate(180deg)' : undefined;

  const isSmallChevron = size === SMALL_SIZE;

  return (
    <button
      className={clsx(styles.chevron, isSmallChevron && styles.small)}
      style={{
        transform: rotation,
      }}
    >
      <IconCaretLeftFilled />
    </button>
  );
};
