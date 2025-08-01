import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { ChartData, ChartOptions } from 'chart.js';
import { getThemeFormatter } from '../../../theme/theme-formatter/theme-formatter';
import { groupTailAsOther } from '../../ready-made-utils/data.utils';
import { remarkableTheme, Theme, ThemeChartsLegendPosition } from '../../../theme/theme';

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
  return {
    labels: groupedData.map((item) =>
      themeFormatter.data(props.dimension, item[props.dimension.name]),
    ),
    datasets: [
      {
        data: groupedData.map((item) => item[props.measure.name]),
      },
    ],
  };
};

export const getPieChartOptions = (
  props: {
    showTooltips: boolean;
    showLegend: boolean;
    showValueLabels: boolean;
    legendPosition: ThemeChartsLegendPosition;
  },
  theme: Theme = remarkableTheme,
): Partial<ChartOptions<'pie'>> => {
  const themeFormatter = getThemeFormatter(theme);

  return {
    plugins: {
      legend: { display: props.showLegend, position: props.legendPosition },
      datalabels: {
        display: props.showValueLabels,
        formatter: (value: string | number) => themeFormatter.number(Number(value)),
      },
      tooltip: {
        enabled: props.showTooltips,
        callbacks: {
          label(context) {
            const raw = context.raw as number;
            const total = context.dataset.data.reduce(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (sum: number, v: any) => sum + parseFloat(v),
              0,
            );
            const pct = Math.round((raw / total) * 100);
            return `${themeFormatter.number(raw)} (${pct}%)`;
          },
        },
      },
    },
  };
};
