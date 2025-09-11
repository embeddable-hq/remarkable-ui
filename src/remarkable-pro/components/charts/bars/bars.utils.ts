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
import { chartContrastColors } from '../../../../remarkable-ui/charts/charts.constants';

export const getBarStackedChartProData = (
  props: {
    data: DataResponse['data'];
    dimension: Dimension;
    groupDimension: Dimension;
    measure: Measure;
  },
  theme: Theme,
): ChartData<'bar'> => {
  const themeFormatter = getThemeFormatter(theme);
  const { data = [], dimension, groupDimension, measure } = props;

  const axis = [
    ...new Set(
      data.map((d) => d[dimension.name]).filter(Boolean), // remove nulls
    ),
  ].sort(); // sort ascending

  const groupBy = [...new Set(data.map((d) => d[groupDimension.name]))];

  const themeKey = getObjectStableKey(theme);

  const datasets = groupBy.map((groupByItem, index) => {
    const backgroundColor = getColor(
      `${themeKey}.charts.backgroundColors`,
      groupByItem,
      theme.charts.backgroundColors ?? chartContrastColors,
      index,
    );

    const borderColor = getColor(
      `${themeKey}.charts.borderColors`,
      groupByItem,
      theme.charts.borderColors ?? chartContrastColors,
      index,
    );

    return {
      label: themeFormatter.data(groupDimension, groupByItem),
      backgroundColor,
      borderColor,
      data: axis.map((axisItem) => {
        const record = data.find(
          (d) => d[groupDimension.name] === groupByItem && d[dimension.name] === axisItem,
        );
        return record ? Number(record[measure.name]) : 0;
      }),
    };
  });

  return {
    labels: axis.map((axisItem) => themeFormatter.data(dimension, axisItem)),
    datasets,
  };
};
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
        label: measure.title,
        data: groupedData.map((item) => item[measure.name]),
        backgroundColor,
        borderColor,
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
