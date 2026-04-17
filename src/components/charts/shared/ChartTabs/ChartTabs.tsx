import { FC } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { ChartTabsItem, ChartTabsItemProps } from './ChartTabsItem/ChartTabsItem';
import styles from './ChartTabs.module.css';
import { useHorizontalScroll } from '../../../../hooks/useHorizontalScroll.hooks';
import { ActionIcon } from '../../../shared/ActionIcon/ActionIcon';
import clsx from 'clsx';

export type ChartTabsProps = {
  items: ChartTabsItemProps[];
  value: ChartTabsItemProps['id'];
  onChange: (value: ChartTabsItemProps['id']) => void;
  className?: string;
};

export const ChartTabs: FC<ChartTabsProps> = ({ value, items, className, onChange }) => {
  const { scrollRef, canScrollLeft, canScrollRight, handleScrollLeft, handleScrollRight } =
    useHorizontalScroll();

  return (
    <div className={clsx(styles.tabs, className)}>
      {canScrollLeft && <ActionIcon icon={IconChevronLeft} onClick={handleScrollLeft} />}
      <div className={styles.scroll} ref={scrollRef}>
        {items.map((item) => (
          <ChartTabsItem
            key={item.id}
            {...item}
            active={item.id === value}
            onClick={() => onChange(item.id)}
          />
        ))}
      </div>
      {canScrollRight && <ActionIcon icon={IconChevronRight} onClick={handleScrollRight} />}
    </div>
  );
};
