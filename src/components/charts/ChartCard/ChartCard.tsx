import { CSSProperties, FC } from 'react';
import { Card, CardContent, CardHeader } from '../../shared/Card/Card';
import { Skeleton } from '../../shared/Skeleton/Skeleton';
import { IconAlertCircle } from '@tabler/icons-react';
import { ChartCardInfo } from './sub-components/ChartCardInfo';
import styles from './ChartCard.module.css';

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  hasResults?: boolean;
  isLoading?: boolean;
  errorMessage?: string;
  style?: CSSProperties;
};

export const ChartCard: FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  hasResults,
  isLoading,
  errorMessage,
  ...props
}) => {
  const getDisplay = () => {
    if (!hasResults && isLoading) {
      return <Skeleton />;
    }

    if (errorMessage) {
      return (
        <ChartCardInfo
          className={styles.error}
          icon={IconAlertCircle}
          title="Something went wrong."
          message={errorMessage ?? 'Please try again.'}
        />
      );
    }

    if (!hasResults) {
      return <ChartCardInfo title="It's a bit empty here." message="Try adding something." />;
    }

    return children;
  };

  return (
    <Card isLoading={isLoading} {...props}>
      <CardHeader title={title} subtitle={subtitle} />
      <CardContent>{getDisplay()}</CardContent>
    </Card>
  );
};
