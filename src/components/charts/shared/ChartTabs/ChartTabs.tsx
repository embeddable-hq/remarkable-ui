import { FC } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { ChartTabsItem, ChartTabsItemProps } from './ChartTabsItem/ChartTabsItem';
import styles from './ChartTabs.module.css';
import { useHorizontalScroll } from '../../../../hooks/useHorizontalScroll.hooks';
import { ActionIcon } from '../../../shared/ActionIcon/ActionIcon';

type ChartTabsProps = {
  items: ChartTabsItemProps[];
  value: ChartTabsItemProps['id'];
  onChange: (value: ChartTabsItemProps['id']) => void;
};

export const ChartTabs: FC<ChartTabsProps> = ({ items, onChange }) => {
  const { scrollRef, canScrollLeft, canScrollRight, handleScrollLeft, handleScrollRight } =
    useHorizontalScroll();

  return (
    <div className={styles.tabsContainer}>
      {canScrollLeft && (
        <ActionIcon
          icon={IconChevronLeft}
          className={styles.scrollLeftButton}
          onClick={handleScrollLeft}
        />
      )}
      <div className={styles.tabsScroll} ref={scrollRef}>
        {items.map((tab) => (
          <ChartTabsItem key={tab.id} {...tab} onClick={() => onChange(tab.id)} />
        ))}
      </div>
      {canScrollRight && (
        <ActionIcon
          icon={IconChevronRight}
          className={styles.scrollRightButton}
          onClick={handleScrollRight}
        />
      )}
    </div>
  );
};
