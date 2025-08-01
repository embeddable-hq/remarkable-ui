import React from 'react';
import { useTheme } from '@embeddable.com/react';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { ChartCard } from '../../../components/charts/ChartCard/ChartCard';
import { PieChart } from '../../../components/charts/PieChart/PieChart';
import { Theme } from '../../../theme/theme';
import { i18nSetup } from '../../../theme/i18n';
import { getPieChartData, getPieChartOptions } from './PieChart.utils';

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
      dimensionsAndMeasures={[dimension, measure]}
      errorMessage={results.error}
      subtitle={description}
      title={title}
    >
      <PieChart data={data} options={options} />
    </ChartCard>
  );
};

export default ReadyMadePieChart;
