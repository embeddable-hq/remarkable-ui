import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { ChartData, ChartOptions } from 'chart.js';
import { groupTailAsOther } from '../charts.utils';
import { Theme } from '../../../theme/theme.types';
import { remarkableTheme } from '../../../theme/theme.constants';
import { getThemeFormatter } from '../../../theme/formatter/formatter.utils';
import { getColor } from '../../../theme/styles/styles.utils';
import { chartColors } from '../../../../remarkable-ui';
import { i18n } from '../../../theme/i18n/i18n';

export const getPieChartData = (
  props: {
    data: DataResponse['data'];
    dimension: Dimension;
    measure: Measure;
    maxLegendItems?: number;
  },
  theme: Theme = remarkableTheme,
): ChartData<'pie'> => {
  const themeFormatter = getThemeFormatter(theme);

  if (!props.data)
    return {
      labels: [],
      datasets: [{ data: [] }],
    };

  const groupedData = groupTailAsOther(
    props.data,
    props.dimension,
    props.measure,
    props.maxLegendItems,
  );

  const themeUniqueId = JSON.stringify(theme);

  const backgroundColor = groupedData.map((item, i) =>
    getColor(
      `${themeUniqueId}.${props.dimension.name}.${item[props.dimension.name]}.backgroundColor`,
      theme.charts.backgroundColors ?? chartColors,
      i,
      'chartBackgroundColors',
    ),
  );

  const borderColor = groupedData.map((item, i) =>
    getColor(
      `${themeUniqueId}.${props.dimension.name}.${item[props.dimension.name]}.borderColor`,
      theme.charts.borderColors ?? chartColors,
      i,
      'chartBorderColors',
    ),
  );

  return {
    labels: groupedData.map((item) => {
      const value = item[props.dimension.name];
      const formattedValue = themeFormatter.data(props.dimension, value);

      // If formatter did not work, try i18n translation
      if (value === formattedValue) {
        return i18n.t(value);
      }
      return formattedValue;
    }),
    datasets: [
      {
        data: groupedData.map((item) => item[props.measure.name]),
        backgroundColor,
        borderColor,
      },
    ],
  };
};

export type DefaultPieChartOptions = {
  measure: Measure;
  showTooltips: boolean;
  showLegend: boolean;
  showValueLabels: boolean;
};

export const getDefaultPieChartOptions = (
  options: DefaultPieChartOptions,
  theme: Theme = remarkableTheme,
): Partial<ChartOptions<'pie'>> => {
  const themeFormatter = getThemeFormatter(theme);

  return {
    plugins: {
      legend: { display: options.showLegend, position: theme.charts.legendPosition ?? 'bottom' },
      datalabels: {
        display: options.showValueLabels ? 'auto' : false,
        formatter: (value: string | number) => themeFormatter.data(options.measure, value),
      },
      tooltip: {
        enabled: options.showTooltips,
        callbacks: {
          label(context) {
            const raw = context.raw as number;
            const total = context.dataset.data.reduce(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (sum: number, v: any) => sum + parseFloat(v),
              0,
            );
            const pct = Math.round((raw / total) * 100);
            return `${themeFormatter.data(options.measure, raw)} (${pct}%)`;
          },
        },
      },
    },
  };
};
