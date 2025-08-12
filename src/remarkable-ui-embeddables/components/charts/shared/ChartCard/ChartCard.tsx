import React, { CSSProperties, FC } from 'react';
import { IconAlertCircle } from '@tabler/icons-react';
import { Card, CardContent, CardHeader, Skeleton } from '../../../../../remarkable-ui';
import styles from './ChartCard.module.css';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { ChartCardInfo } from './ChartCardInfo/ChartCardInfo';
import { useTheme } from '@embeddable.com/react';
import { ChartCardLoading } from './ChartCardLoading/ChartCardLoading';
import { ChartCardMenu } from './ChartCardMenu/ChartCardMenu';
import { Theme } from '../../../../theme/theme.types';
import { i18n, i18nSetup } from '../../../../theme/i18n/i18n';

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  data: DataResponse;
  isLoading?: boolean;
  errorMessage?: string;
  style?: CSSProperties;
  dimensionsAndMeasures?: (Dimension | Measure)[];
};

export const ChartCard: FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  data,
  errorMessage,
  dimensionsAndMeasures = [],
  ...props
}) => {
  const theme: Theme = useTheme() as Theme;
  i18nSetup(theme);

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
          message={errorMessage}
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
        <div data-html2canvas-ignore>
          {data.isLoading ? (
            <ChartCardLoading />
          ) : (
            <ChartCardMenu
              title={title}
              containerRef={chartRef}
              data={data.data}
              dimensionsAndMeasures={dimensionsAndMeasures}
            />
          )}
        </div>
      </div>
      <CardContent>{getDisplay()}</CardContent>
    </Card>
  );
};
