import { TablerIcon } from '@tabler/icons-react';
import { CardContent } from '../../shared/Card/Card';
import { Skeleton } from '../../shared/Skeleton/Skeleton';
import styles from './ChartCardContent.module.css';
import { IconAlertCircle } from '@tabler/icons-react';
import { Typography } from '../../shared/Typography/Typography';
import clsx from 'clsx';
import React from 'react';

type ChartCardContentProps = {
  errorMessage?: string;
  isLoading?: boolean;
  children: React.ReactNode;
  hasResults?: boolean;
};

export const ChartCardContent: React.FC<ChartCardContentProps> = ({
  children,
  errorMessage,
  isLoading,
  hasResults,
}) => {
  const getDisplay = () => {
    if (!hasResults && isLoading) {
      return <Skeleton />;
    }

    if (errorMessage) {
      return (
        <ChartCardContentInfo
          className={styles.error}
          icon={IconAlertCircle}
          title="Something went wrong."
          message={errorMessage ?? 'Please try again.'}
        />
      );
    }

    if (!hasResults) {
      return (
        <ChartCardContentInfo title="It's a bit empty here." message="Try adding something." />
      );
    }

    return children;
  };

  return <CardContent>{getDisplay()}</CardContent>;
};

type ChartCardContentInfoProps = {
  className?: string;
  icon?: TablerIcon;
  title: string;
  message: string;
};

export const ChartCardContentInfo: React.FC<ChartCardContentInfoProps> = ({
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
