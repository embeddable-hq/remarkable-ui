import { TablerIcon } from '@tabler/icons-react';
import clsx from 'clsx';
import styles from './ChartCardInfo.module.css';
import { Typography } from '../../../../../../remarkable-ui';

type ChartCardInfoProps = {
  className?: string;
  icon?: TablerIcon;
  title: string;
  message: string;
};

export const ChartCardInfo: React.FC<ChartCardInfoProps> = ({
  icon: Icon,
  title,
  message,
  className,
}) => {
  return (
    <div className={clsx(styles.info, className)}>
      {Icon && <Icon />}
      <Typography as="h2" className={styles.title}>
        {title}
      </Typography>
      <Typography as="p" className={styles.message}>
        {message}
      </Typography>
    </div>
  );
};
