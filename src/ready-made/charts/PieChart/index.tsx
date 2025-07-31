//Third Party Libraries
import { ChartCard } from '../../../components/charts/ChartCard/ChartCard';
import { PieChart } from '../../../components/charts/PieChart/PieChart';
import { useTheme } from '@embeddable.com/react';
import { remarkableTheme, Theme } from '../../../theme/theme';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { ChartData, ChartOptions } from 'chart.js';
import React from 'react';
import { groupTailAsOther } from '../../ready-made-utils/data.utils';
import { useThemeFormatter } from '../../../theme/theme-formatter/theme-formatter.hook';
import { i18nSetup } from '../../../theme/i18n';

const getPieChartData = (
  props: {
    data: DataResponse['data'];
    dimension: Dimension;
    measure: Measure;
    maxLegendItems?: number;
  },
  theme: Theme = remarkableTheme,
): ChartData<'pie'> => {
  const themeFormatter = useThemeFormatter(theme);

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

const getPieChartOptions = (
  props: {
    showTooltips: boolean;
    showLegend: boolean;
    showValueLabels: boolean;
    legendPosition: 'left' | 'top' | 'right' | 'bottom' | 'center';
  },
  theme: Theme = remarkableTheme,
): Partial<ChartOptions<'pie'>> => {
  const themeFormatter = useThemeFormatter(theme);

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
              ? dataset.data.reduce((sum: number, v: unknown) => sum + parseFloat(v as string), 0)
              : 0;
            const pct = total ? Math.round((raw / total) * 100) : 0;
            return `${themeFormatter.number(Number(raw))} (${pct}%)`;
          },
        },
      },
    },
  };
};

interface PieChartProps {
  description: string;
  dimension: Dimension;
  maxLegendItems: number;
  measure: Measure;
  results: DataResponse;
  showLegend: boolean;
  showTooltips: boolean;
  showValueLabels: boolean;
  title: string;
}

const ReadyMadePieChart: React.FC<PieChartProps> = ({
  description,
  dimension,
  maxLegendItems,
  measure,
  results,
  showLegend,
  showTooltips,
  showValueLabels,
  title,
}) => {
  const theme = useTheme() as Theme;
  i18nSetup(theme);

  const data = getPieChartData({ data: results.data, dimension, measure, maxLegendItems }, theme);
  const options = getPieChartOptions(
    {
      showTooltips,
      showLegend,
      showValueLabels,
      legendPosition: theme.charts.legendPosition,
    },
    theme,
  );

  return (
    <ChartCard
      data={results}
      dimensions={[dimension]}
      measures={[measure]}
      errorMessage={results.error}
      subtitle={description}
      title={title}
    >
      <PieChart data={data} options={options} />
    </ChartCard>
  );
};

export default ReadyMadePieChart;
