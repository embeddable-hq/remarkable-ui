import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { Theme } from '../../../theme/theme.types';
import { remarkableTheme } from '../../../theme/theme.constants';
import { ChartData, ChartOptions } from 'chart.js';
import { getThemeFormatter } from '../../../theme/formatter/formatter.utils';
import { groupTailAsOther } from '../charts.utils';
import { getColor } from '../../../theme/styles/styles.utils';
import { chartColors } from '../../../../remarkable-ui';
import { getObjectStableKey } from '../../../utils.ts/object.utils';
import { chartContrastColors } from '../../../../remarkable-ui/charts/charts.constants';
import { Context } from 'chartjs-plugin-datalabels';

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

  const axis = [...new Set(data.map((d) => d[dimension.name]).filter(Boolean))].sort();

  const groupBy = [...new Set(data.map((d) => d[groupDimension.name]))];

  const themeKey = getObjectStableKey(theme);

  const datasets = groupBy.map((groupByItem, index) => {
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

    return {
      label: themeFormatter.data(groupDimension, groupByItem),
      rawLabel: groupByItem,
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
    labels: axis,
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
      return item[props.dimension.name];
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
        label: themeFormatter.dimensionOrMeasureTitle(measure),
        data: groupedData.map((item) => item[measure.name]),
        backgroundColor,
        borderColor,
      };
    }),
  };
};

const getBarChartProDatalabelTotalFormatter = (
  context: Context,
  formatter: (value: number) => string,
) => {
  const { datasets } = context.chart.data;
  const i = context.dataIndex;

  const total = datasets.reduce((sum, ds) => {
    const val = ds.data[i] as number;
    return sum + (val || 0);
  }, 0);

  return formatter(total);
};

export const getBarChartProOptions = (
  options: {
    onBarClicked: (args: {
      axisDimensionValue: string | null;
      groupingDimensionValue: string | null;
    }) => void;
    measure: Measure;
    dimension: Dimension;
    horizontal: boolean;
    data: ChartData<'bar'>;
  },
  theme: Theme,
): Partial<ChartOptions<'bar'>> => {
  const { onBarClicked, measure, dimension, horizontal, data } = options;

  const themeFormatter = getThemeFormatter(theme);
  return {
    plugins: {
      legend: { position: theme.charts.legendPosition ?? 'bottom' },
      datalabels: {
        labels: {
          total: {
            formatter: (_value: string | number, context: Context) =>
              getBarChartProDatalabelTotalFormatter(context, (value: number) =>
                themeFormatter.data(options.measure, value),
              ),
          },
          value: {
            formatter: (value: string | number) => themeFormatter.data(options.measure, value),
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
            return `${themeFormatter.data(dimension, context.dataset.label) || ''}: ${themeFormatter.data(measure, raw)}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: (value) => {
            if (horizontal) {
              return themeFormatter.data(measure, value);
            }

            if (!data || !data.labels) return undefined;

            const label = data.labels[Number(value)] as string;
            return themeFormatter.data(dimension, label);
          },
        },
      },
      y: {
        ticks: {
          callback: (value) => {
            if (!horizontal) {
              return themeFormatter.data(measure, value);
            }
            if (!data || !data.labels) return undefined;
            const label = data.labels[Number(value)] as string;
            return themeFormatter.data(dimension, label);
          },
        },
      },
    },
    onClick: (_event, elements, chart) => {
      const element = elements[0];
      const axisDimensionValue = (element ? chart.data.labels![element.index] : null) as
        | string
        | null;
      const groupingDimensionValue = (
        element
          ? (chart.data.datasets[element.datasetIndex] as { rawLabel?: string | null })?.rawLabel
          : null
      ) as string | null;

      onBarClicked({
        axisDimensionValue,
        groupingDimensionValue,
      });
    },
  };
};
