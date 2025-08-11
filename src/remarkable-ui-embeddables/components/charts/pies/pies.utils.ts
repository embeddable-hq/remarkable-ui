import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { ChartData, ChartOptions } from 'chart.js';
import { groupTailAsOther } from '../charts.utils';
import { Theme } from '../../../theme/theme.types';
import { remarkableTheme } from '../../../theme/theme.constants';
import { getThemeFormatter } from '../../../theme/formatter/formatter.utils';
import { getColor } from '../../../theme/styles/stytles.utils';
import { chartColors } from '../../../../remarkable-ui';

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

  const backgroundColor = groupedData.map((item, i) =>
    getColor(
      `${props.dimension.name}.${item[props.dimension.name]}.backgroundColor`,
      theme.charts.backgroundColors ?? chartColors,
      i,
      'chartBackgroundColors',
    ),
  );

  const borderColor = groupedData.map((item, i) =>
    getColor(
      `${props.dimension.name}.${item[props.dimension.name]}.borderColor`,
      theme.charts.borderColors ?? chartColors,
      i,
      'chartBorderColors',
    ),
  );

  return {
    labels: groupedData.map((item) =>
      themeFormatter.data(props.dimension, item[props.dimension.name]),
    ),
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
        formatter: (value: string | number) => themeFormatter.number(Number(value)),
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
            return `${themeFormatter.number(raw)} (${pct}%)`;
          },
        },
      },
    },
  };
};
