import React, { CSSProperties, FC } from 'react';
import { IconAlertCircle, IconLoader2 } from '@tabler/icons-react';
import { i18nTheme } from '../../../theme/i18n';
import { Card, CardContent, CardHeader } from '../../shared/Card/Card';
import { Skeleton } from '../../shared/Skeleton/Skeleton';
import { ChartCardInfo } from './sub-components/ChartCardInfo';
import styles from './ChartCard.module.css';
import { ChartCardOptions } from './sub-components/ChartCardOptions/ChartCardOptions';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  data: DataResponse;
  isLoading?: boolean;
  errorMessage?: string;
  style?: CSSProperties;
  dimensions?: Dimension[];
  measures?: Measure[];
};

export const ChartCard: FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  data,
  errorMessage,
  dimensions,
  measures,
  ...props
}) => {
  const i18n = i18nTheme();
  const chartRef = React.createRef<HTMLDivElement>();

  const hasData = data.data && data.data.length > 0;

  const getDisplay = () => {
    if (!hasData && data.isLoading) {
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

    if (!hasData) {
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
    <Card ref={chartRef} {...props}>
      <div className={styles.header}>
        <CardHeader title={title} subtitle={subtitle} />
        <div data-png-export-ignore>
          {data.isLoading ? (
            <IconLoader2 className={styles.loading} />
          ) : (
            <ChartCardOptions
              title={title}
              containerRef={chartRef}
              data={data.data}
              dimensions={dimensions}
              measures={measures}
            />
          )}
        </div>
      </div>
      <CardContent>{getDisplay()}</CardContent>
    </Card>
  );
};
