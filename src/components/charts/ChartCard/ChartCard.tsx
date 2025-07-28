import { CSSProperties, FC } from 'react';
import { IconAlertCircle } from '@tabler/icons-react';
import { i18nTheme } from '../../../theme/i18n';
import { Card, CardContent, CardHeader } from '../../shared/Card/Card';
import { Skeleton } from '../../shared/Skeleton/Skeleton';
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
  const i18n = i18nTheme();

  const getDisplay = () => {
    if (!hasResults && isLoading) {
      return <Skeleton />;
    }

    if (errorMessage) {
      return (
        <ChartCardInfo
          className={styles.error}
          icon={IconAlertCircle}
          title={i18n.t('charts.errorTitle')}
          message={i18n.t('charts.errorMessage')}
        />
      );
    }

    if (!hasResults) {
      return (
        <ChartCardInfo
          title={i18n.t('charts.emptyTitle')}
          message={i18n.t('charts.emptyMessage')}
        />
      );
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
