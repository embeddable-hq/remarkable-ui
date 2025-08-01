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
        formatter: (value: string) => themeFormatter.number(Number(value)),
      },
      tooltip: {
        enabled: props.showTooltips,
        callbacks: {
          label(tooltipItem) {
            const raw = tooltipItem.raw as number;
            const dataset = tooltipItem.dataset;
            const total = Array.isArray(dataset.data)
              ? dataset.data.reduce((sum: number, v: number) => sum + parseFloat(v.toString()), 0)
              : 0;
            const pct = total ? Math.round((raw / total) * 100) : 0;
            return `${themeFormatter.number(Number(raw))} (${pct}%)`;
          },
        },
      },
    },
  };
};
