import React from 'react';
import { useTheme } from '@embeddable.com/react';
import { ChartCard } from '../../../../components/charts/ChartCard/ChartCard';
import { PieChart } from '../../../../components/charts/PieChart/PieChart';
import { Theme } from '../../../../theme/theme';
import { i18nSetup } from '../../../../theme/i18n';
import { getDefaultPieChartOptions, getPieChartData } from '../pies.utils';
import { DefaultReadyMadePieChartProps } from '../pies.types';

type ReadyMadePieChartProps = DefaultReadyMadePieChartProps;

const ReadyMadePieChart: React.FC<ReadyMadePieChartProps> = ({
  description,
  dimension,
  maxLegendItems,
  measure,
  results,
  showLegend,
  showTooltips,
  showValueLabels,
  title,
  onSegmentClick,
}) => {
  const theme = useTheme() as Theme;
  i18nSetup(theme);

  const data = getPieChartData({ data: results.data, dimension, measure, maxLegendItems }, theme);
  const options = getDefaultPieChartOptions(
    {
      showTooltips,
      showLegend,
      showValueLabels,
      legendPosition: theme.charts.legendPosition,
    },
    theme,
  );

  const handleSegmentClick = (index: number | undefined) => {
    onSegmentClick({
      dimensionValue: index === undefined ? undefined : results.data?.[index]?.[dimension.name],
    });
  };

  return (
    <ChartCard
      data={results}
      dimensionsAndMeasures={[dimension, measure]}
      errorMessage={results.error}
      subtitle={description}
      title={title}
    >
      <PieChart data={data} options={options} onSegmentClick={handleSegmentClick} />
    </ChartCard>
  );
};

export default ReadyMadePieChart;
