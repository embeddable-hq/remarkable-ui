import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { getDefaultPieChartOptions, getPieChartData } from '../pies.utils';
import { DefaultReadyMadePieChartProps } from '../pies.types';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { DonutChart } from '../../../../../remarkable-ui';

type ReadyMadeDonutChartProps = DefaultReadyMadePieChartProps;

const ReadyMadeDonutChart = ({
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
}: ReadyMadeDonutChartProps) => {
  const theme = useTheme() as Theme;
  i18nSetup(theme);

  const data = getPieChartData({ data: results.data, dimension, measure, maxLegendItems }, theme);

  const options = getDefaultPieChartOptions(
    {
      measure,
      showTooltips,
      showLegend,
      showValueLabels,
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
      <DonutChart data={data} options={options} onSegmentClick={handleSegmentClick} />
    </ChartCard>
  );
};

export default ReadyMadeDonutChart;
