import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { Theme } from '../../../theme/theme.types';
import { ChartData, ChartOptions } from 'chart.js';
import { getThemeFormatter } from '../../../theme/formatter/formatter.utils';
import { getObjectStableKey } from '../../../utils.ts/object.utils';
import { colorWithOpacity, getStyleNumber, isValidColor } from '../../../../remarkable-ui';
import { getColor } from '../../../theme/styles/styles.utils';
import { chartContrastColors } from '../../../../remarkable-ui/charts/charts.constants';

export const getLineChartProData = (
  props: {
    data: DataResponse['data'];
    dimension: Dimension;
    measures: Measure[];
  },
  theme: Theme,
): ChartData<'line'> => {
  if (!props.data) {
    return {
      labels: [],
      datasets: [{ data: [] }],
    };
  }

  const themeFormatter = getThemeFormatter(theme);

  const themeKey = getObjectStableKey(theme);
  const groupedData = props.data;

  return {
    labels: groupedData.map((item) => {
      return item[props.dimension.name];
    }),
    datasets: props.measures.map((measure, index) => {
      const zeroFill = Boolean(measure.inputs?.['connectGaps']);
      const values = groupedData.map((item) => item[measure.name] ?? (zeroFill ? 0 : null));

      const lineColor = measure.inputs?.['lineColor'];

      const backgroundColor = isValidColor(lineColor)
        ? lineColor
        : getColor(
            `${themeKey}.charts.backgroundColors`,
            measure.name,
            theme.charts.backgroundColors ?? chartContrastColors,
            index,
          );

      const borderColor = isValidColor(lineColor)
        ? lineColor
        : getColor(
            `${themeKey}.charts.borderColors`,
            measure.name,
            theme.charts.borderColors ?? chartContrastColors,
            index,
          );

      return {
        label: themeFormatter.dimensionOrMeasureTitle(measure),
        data: values,
        backgroundColor: colorWithOpacity(
          backgroundColor,
          getStyleNumber('--em-line-chart-line-fill-opacity'),
        ),
        pointBackgroundColor: backgroundColor,
        borderDash: measure.inputs?.['dashedLine']
          ? [
              getStyleNumber('--em-line-chart-line-dash-length'),
              getStyleNumber('--em-line-chart-line-gap-length'),
            ]
          : undefined,
        borderColor,
        fill: Boolean(measure.inputs?.['fillUnderLine']),
      };
    }),
  };
};

export const getLineChartProOptions = (
  options: { dimension: Dimension; measures: Measure[]; data: ChartData<'line'> },
  theme: Theme,
): ChartOptions<'line'> => {
  const { dimension, data, measures } = options;
  const themeFormatter = getThemeFormatter(theme);

  const lineChartOptions: ChartOptions<'line'> = {
    plugins: {
      datalabels: {
        labels: {
          value: {
            formatter: (value: string | number, context) => {
              const measure = measures[context.datasetIndex]!;
              return themeFormatter.data(measure, value);
            },
          },
        },
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const label = context[0]?.label;
            return themeFormatter.data(dimension, label);
          },
          label: (context) => {
            const measure = measures[context.datasetIndex]!;
            const raw = context.raw as number;
            return `${themeFormatter.data(dimension, context.dataset.label) || ''}: ${themeFormatter.data(measure, raw)}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: (value) => {
            if (!data || !data.labels) return undefined;

            const label = data.labels[Number(value)] as string;
            return themeFormatter.data(dimension, label);
          },
        },
      },
      y: {
        ticks: {
          callback: (value) => {
            return themeFormatter.data(measures[0]!, value);
          },
        },
      },
    },
  };

  return lineChartOptions;
};
