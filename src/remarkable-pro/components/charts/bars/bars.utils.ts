import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { Theme } from '../../../theme/theme.types';
import { remarkableTheme } from '../../../theme/theme.constants';
import { ChartData, ChartOptions } from 'chart.js';
import { getThemeFormatter } from '../../../theme/formatter/formatter.utils';
import { groupTailAsOther } from '../charts.utils';
import { getColor } from '../../../theme/styles/styles.utils';
import { chartColors, chartContrastColors } from '../../../../remarkable-ui';
import { getObjectStableKey } from '../../../utils.ts/object.utils';
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
  const groupDimensionName = `${groupDimension.name}${groupDimension.inputs?.granularity ? `.${groupDimension.inputs.granularity}` : ''}`;
  const groupBy = [...new Set(data.map((d) => d[groupDimensionName]))].filter(Boolean);

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
          (d) => d[groupDimensionName] === groupByItem && d[dimension.name] === axisItem,
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
  if (!props.data) {
    return {
      labels: [],
      datasets: [{ data: [] }],
    };
  }

  const themeFormatter = getThemeFormatter(theme);
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
        data: groupedData.map((item) => item[measure.name] ?? 0),
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
    measures: Measure[];
    dimension: Dimension;
    horizontal: boolean;
    data: ChartData<'bar'>;
  },
  theme: Theme,
): Partial<ChartOptions<'bar'>> => {
  const { onBarClicked, measures, dimension, horizontal, data } = options;

  const themeFormatter = getThemeFormatter(theme);
  return {
    plugins: {
      legend: { position: theme.charts.legendPosition ?? 'bottom' },
      datalabels: {
        labels: {
          total: {
            formatter: (_value: string | number, context: Context) =>
              getBarChartProDatalabelTotalFormatter(context, (value: number) =>
                themeFormatter.data(measures[0]!, value),
              ),
          },
          value: {
            formatter: (value: string | number, context) => {
              const measure = measures[context.datasetIndex % measures.length]!;
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
            const measure = measures[context.datasetIndex % measures.length]!;
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
              return themeFormatter.data(measures[0]!, value);
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
              return themeFormatter.data(measures[0]!, value);
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
