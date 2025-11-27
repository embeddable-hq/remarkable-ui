import React, { CSSProperties, useRef } from 'react';
import { IconAlertCircle } from '@tabler/icons-react';
import {
  Card,
  CardContent,
  CardFeedback,
  CardHeader,
  Skeleton,
} from '../../../../../remarkable-ui';
import styles from './ChartCard.module.css';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { useTheme } from '@embeddable.com/react';
import { ChartCardLoading } from './ChartCardLoading/ChartCardLoading';
import { ChartCardMenuPro } from './ChartCardMenuPro/ChartCardMenuPro';
import { Theme } from '../../../../theme/theme.types';
import { i18n, i18nSetup } from '../../../../theme/i18n/i18n';
import clsx from 'clsx';
import { ChartCardMenuOptionOnClickProps } from '../../../../theme/defaults/defaults.ChartCardMenu.constants';

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  data: DataResponse;
  isLoading?: boolean;
  errorMessage?: string;
  style?: CSSProperties;
  dimensionsAndMeasures?: (Dimension | Measure)[];
  onCustomDownload?: (props: (props: ChartCardMenuOptionOnClickProps) => void) => void;
};

export const ChartCard = React.forwardRef<HTMLDivElement, ChartCardProps>(
  (
    { title, subtitle, children, data, errorMessage, dimensionsAndMeasures = [], ...props },
    ref,
  ) => {
    const theme: Theme = useTheme() as Theme;
    i18nSetup(theme);

    const chartRef = useRef<HTMLDivElement>(null);

    const hasData = Boolean(data?.data && data.data?.length > 0);

    const isLoading = !data || data?.isLoading;

    const getDisplay = () => {
      if (isLoading && !hasData) {
        return <Skeleton />;
      }

      if (errorMessage) {
        return (
          <CardFeedback
            variant="error"
            icon={IconAlertCircle}
            title={i18n.t('charts.errorTitle')}
            message={errorMessage}
          />
        );
      }

      if (!hasData) {
        return (
          <CardFeedback
            title={i18n.t('charts.emptyTitle')}
            message={i18n.t('charts.emptyMessage')}
          />
        );
      }

      return children;
    };

    return (
      <Card className={styles.chartCard} {...props}>
        <CardHeader
          title={title}
          subtitle={subtitle}
          rightContent={
            <div className={styles.chartCardRightContent}>
              <div
                className={clsx(styles.fixedContent, isLoading ? styles.loading : styles.hidden)}
              >
                <ChartCardLoading />
              </div>
              <div
                className={clsx(styles.fixedContent, isLoading ? styles.hidden : styles.visible)}
              >
                <ChartCardMenuPro
                  title={title}
                  containerRef={chartRef}
                  data={data?.data}
                  dimensionsAndMeasures={dimensionsAndMeasures}
                  onCustomDownload={props.onCustomDownload}
                />
              </div>
            </div>
          }
        />

        <CardContent ref={props.onCustomDownload ? ref : chartRef}>{getDisplay()}</CardContent>
      </Card>
    );
  },
);

ChartCard.displayName = 'ChartCard';
