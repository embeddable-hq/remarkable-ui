import React from 'react';
import { useTheme } from '@embeddable.com/react';
import { PieChart } from '../../../../../remarkable-ui';
import { Theme } from '../../../../theme/theme.types';
import { DefaultPieChartOptions, getDefaultPieChartOptions, getPieChartData } from '../pies.utils';
import { ChartOptions } from 'chart.js';
import { DefaultReadyMadePieChartProps } from '../pies.types';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { ChartCard } from '../../shared/ChartCard/ChartCard';

const getDonutChartOptions = (
  options: DefaultPieChartOptions,
  theme: Theme,
): Partial<ChartOptions<'pie'>> => {
  return {
    cutout: '60%',
    ...getDefaultPieChartOptions(options, theme),
  };
};

type ReadyMadeDonutChartProps = DefaultReadyMadePieChartProps & {};

const ReadyMadeDonutChart: React.FC<ReadyMadeDonutChartProps> = ({
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
  const options = getDonutChartOptions(
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

export default ReadyMadeDonutChart;
