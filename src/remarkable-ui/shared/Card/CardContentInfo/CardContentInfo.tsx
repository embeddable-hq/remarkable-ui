import { TablerIcon } from '@tabler/icons-react';
import clsx from 'clsx';
import styles from './CardContentInfo.module.css';
import { Typography } from '../../Typography/Typography';

type CardContentInfoProps = {
  className?: string;
  icon?: TablerIcon;
  title: string;
  message: string;
};

export const CardContentInfo: React.FC<CardContentInfoProps> = ({
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
