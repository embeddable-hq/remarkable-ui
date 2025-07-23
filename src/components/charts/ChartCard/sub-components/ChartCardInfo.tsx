import { TablerIcon } from '@tabler/icons-react';
import clsx from 'clsx';
import { Typography } from 'src/components/shared/Typography/Typography';
import styles from './ChartCardInfo.module.css';

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
      <Typography size="sm" weight="medium">
        {title}
      </Typography>
      <Typography size="sm" weight="regular">
        {message}
      </Typography>
    </div>
  );
};
