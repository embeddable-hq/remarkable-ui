//Third Party Libraries
import { ChartCard } from '../../../components/charts/ChartCard/ChartCard';
import { PieChart } from '../../../components/charts/PieChart/PieChart';
import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../theme/theme';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { ChartData, ChartOptions } from 'chart.js';
import React from 'react';
import { groupTailAsOther } from '../../ready-made-utils/data.utils';
// import {
//   UseThemeFormatter,
//   useThemeFormatter,
// } from '../../../theme/theme-formatter/theme-formatter.hook';

const getPieChartData = (
  data: DataResponse['data'],
  dimension: Dimension,
  measure: Measure,
  maxLegendItems?: number,
): ChartData<'pie'> => {
  const groupedData = groupTailAsOther(data, dimension, measure, maxLegendItems);
  return {
    labels: groupedData.map((item) => item[dimension.name]),
    datasets: [
      {
        data: groupedData.map((item) => item[measure.name]),
      },
    ],
  };
};

const getPieChartOptions = (props: {
  showTooltips: boolean;
  showLegend: boolean;
  showValueLabels: boolean;
  legendPosition: 'left' | 'top' | 'right' | 'bottom' | 'center';
  // themeFormatter: UseThemeFormatter;
}): Partial<ChartOptions<'pie'>> => {
  return {
    plugins: {
      legend: { display: props.showLegend, position: props.legendPosition },
      datalabels: {
        display: props.showValueLabels,
        // formatter: (value: string) => props.themeFormatter.number(Number(value)),
      },
      tooltip: {
        enabled: props.showTooltips,
        callbacks: {
          label(tooltipItem) {
            // const raw = tooltipItem.raw as number;
            // const dataset = tooltipItem.dataset;
            // const total = Array.isArray(dataset.data)
            //   ? dataset.data.reduce((sum: number, v: unknown) => sum + parseFloat(v as string), 0)
            //   : 0;
            // const pct = total ? Math.round((raw / total) * 100) : 0;
            console.log('tooltipItem', tooltipItem);
            return '1';
            // return `${props.themeFormatter.number(Number(raw))} (${pct}%)`;
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
  console.log('theme', theme.charts);
  // const themeFormatter = useThemeFormatter(theme);

  const data = getPieChartData(results.data ?? [], dimension, measure, maxLegendItems);
  const options = getPieChartOptions({
    showTooltips,
    showLegend,
    showValueLabels,
    legendPosition: theme?.charts?.legendPosition ?? 'bottom',
    // themeFormatter,
  });

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
