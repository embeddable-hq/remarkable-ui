import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { Theme } from '../../../theme/theme.types';
import { remarkableTheme } from '../../../theme/theme.constants';
import { ChartData, ChartOptions } from 'chart.js';
import { getThemeFormatter } from '../../../theme/formatter/formatter.utils';
import { groupTailAsOther } from '../charts.utils';
import { i18n } from '../../../theme/i18n/i18n';
import { getColor } from '../../../theme/styles/styles.utils';
import { chartColors } from '../../../../remarkable-ui';
import { getObjectStableKey } from '../../../utils.ts/object.utils';
import { resolveI18nString } from '../../component.utils';

export const getBarChartProData = (
  props: {
    data: DataResponse['data'];
    dimension: Dimension;
    measures: Measure[];
    maxItems?: number;
  },
  theme: Theme = remarkableTheme,
): ChartData<'bar'> => {
  const themeFormatter = getThemeFormatter(theme);

  if (!props.data) {
    return {
      labels: [],
      datasets: [{ data: [] }],
    };
  }

  const themeKey = getObjectStableKey(theme);
  const groupedData = groupTailAsOther(props.data, props.dimension, props.measures, props.maxItems);

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
    datasets: props.measures.map((measure, index) => {
      const backgroundColor = getColor(
        `${themeKey}.charts.backgroundColors`,
        measure.name,
        theme.charts.backgroundColors ?? chartColors,
        index,
      );

      const borderColor = getColor(
        `${themeKey}.charts.borderColors`,
        measure.name,
        theme.charts.borderColors ?? chartColors,
        index,
      );

      return {
        label:
          resolveI18nString(measure.inputs?.displayName) ??
          themeFormatter.data({ ...measure, nativeType: 'string' }, measure.name),
        data: groupedData.map((item) => item[measure.name]),
        backgroundColor,
        borderColor,
        datalabels: {
          formatter: (value) => themeFormatter.data(measure, value),
        },
      };
    }),
  };
};

export const getBarChartProOptions = (
  theme: Theme,
  measure: Measure,
  horizontal: boolean = false,
): Partial<ChartOptions<'bar'>> => {
  const themeFormatter = getThemeFormatter(theme);
  return {
    plugins: {
      tooltip: {
        callbacks: {
          label(context) {
            const raw = context.raw as number;
            return `${context.dataset.label || ''}: ${themeFormatter.data(measure, raw)}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          ...(horizontal && {
            callback: (value) => themeFormatter.data(measure, value),
          }),
        },
      },
      y: {
        ticks: {
          ...(!horizontal && {
            callback: (value) => themeFormatter.data(measure, value),
          }),
        },
      },
    },
  };
};
