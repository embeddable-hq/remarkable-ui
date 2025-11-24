import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { Theme } from '../../../../theme/theme.types';
import { ChartData, ChartOptions } from 'chart.js';
import { getThemeFormatter } from '../../../../theme/formatter/formatter.utils';
import { mergician } from 'mergician';
import { getObjectStableKey } from '../../../../utils.ts/object.utils';
import { getColor } from '../../../../theme/styles/styles.utils';
import { setColorAlpha } from '../../../../utils.ts/color.utils';
import { chartContrastColors } from '../../../../../remarkable-ui';
import { getLineChartProOptions, LineChartProOptionsClick } from '../lines.utils';

export const getLineChartGroupedProData = (
  props: {
    data: DataResponse['data'];
    dimension: Dimension;
    groupDimension: Dimension;
    measure: Measure;
    hasMinMaxYAxisRange: boolean;
  },
  theme: Theme,
): ChartData<'line'> => {
  const themeFormatter = getThemeFormatter(theme);
  const { data = [], dimension, groupDimension, measure, hasMinMaxYAxisRange } = props;

  const axis = [...new Set(data.map((d) => d[dimension.name]).filter(Boolean))].sort();
  const groupBy = [...new Set(data.map((d) => d[groupDimension.name]))].filter(Boolean);

  const themeKey = getObjectStableKey(theme);

  const datasets: ChartData<'line'>['datasets'] = groupBy.map((groupByItem, index) => {
    const backgroundColor = getColor(
      `${themeKey}.charts.backgroundColors`,
      `${groupDimension.name}.${groupByItem}`,
      theme.charts.backgroundColors ?? chartContrastColors,
      index,
    );

    const borderColor = getColor(
      `${themeKey}.charts.borderColors`,
      `${groupDimension.name}.${groupByItem}`,
      theme.charts.borderColors ?? chartContrastColors,
      index,
    );

    const dataset = {
      clip: hasMinMaxYAxisRange,
      label: themeFormatter.data(groupDimension, groupByItem),
      rawLabel: groupByItem,
      backgroundColor: setColorAlpha(backgroundColor, 0.5),
      pointBackgroundColor: backgroundColor,
      fill: measure.inputs?.['fillUnderLine'],
      borderColor,
      data: axis.map((axisItem) => {
        const record = data.find(
          (d) => d[groupDimension.name] === groupByItem && d[dimension.name] === axisItem,
        );
        return record?.[measure.name] ?? (measure.inputs?.['connectGaps'] ? 0 : null);
      }),
    } as ChartData<'line'>['datasets'][number];

    return dataset;
  });

  return {
    labels: axis,
    datasets,
  };
};

export const getLineChartGroupedProOptions = (
  options: {
    dimension: Dimension;
    measure: Measure;
    data: ChartData<'line'>;
    onLineClicked: LineChartProOptionsClick;
  },
  theme: Theme,
): ChartOptions<'line'> => {
  const { dimension, data, measure, onLineClicked } = options;
  const themeFormatter = getThemeFormatter(theme);

  const lineChartOptions: ChartOptions<'line'> = {
    plugins: {
      datalabels: {
        labels: {
          value: {
            formatter: (value: string | number) => {
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
            const raw = context.raw as number;
            return `${context.dataset.label}: ${themeFormatter.data(measure, raw)}`;
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
            return themeFormatter.data(measure, value);
          },
        },
      },
    },
  };

  return mergician(
    getLineChartProOptions({ onLineClicked }),
    lineChartOptions,
    theme.charts?.lineChartGroupedPro?.options || {},
  );
};
