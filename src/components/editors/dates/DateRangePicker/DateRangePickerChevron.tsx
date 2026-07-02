import { IconCaretLeftFilled } from '@tabler/icons-react';
import styles from './DateRangePickerChevron.module.css';
import clsx from 'clsx';

type DateRangePickerChevronProps = {
  className?: string;
  orientation?: 'up' | 'down' | 'left' | 'right';
  size?: number;
};

const SMALL_SIZE = 18;

const getRotation = (
  orientation: DateRangePickerChevronProps['orientation'],
): string | undefined => {
  switch (orientation) {
    case 'up':
      return 'rotate(90deg)';
    case 'down':
      return 'rotate(270deg)';
    case 'right':
      return 'rotate(180deg)';
    case 'left':
    default:
      return undefined;
  }
};

export const DateRangePickerChevron = ({
  orientation,
  size,
  className,
}: DateRangePickerChevronProps): React.JSX.Element => {
  const rotation = getRotation(orientation);

  const isSmallChevron = size === SMALL_SIZE;

  return (
    <span
      data-testid="date-range-picker-chevron"
      className={clsx(styles.chevron, isSmallChevron && styles.small, className)}
      style={{
        transform: rotation,
      }}
    >
      <IconCaretLeftFilled />
    </span>
  );
};
