import { useTheme } from '@embeddable.com/react';
import { PieChart } from '../../../../../remarkable-ui';
import { Theme } from '../../../../theme/theme.types';
import { DefaultPieChartOptions, getDefaultPieChartOptions, getPieChartData } from '../pies.utils';
import { DefaultReadyMadePieChartProps } from '../pies.types';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { mergician } from 'mergician';
import { resolveI18nProps } from '../../../component.utils';

type ReadyMadePieChartProps = DefaultReadyMadePieChartProps;

const ReadyMadePieChart = (props: ReadyMadePieChartProps) => {
  const theme = useTheme() as Theme;
  i18nSetup(theme);

  const {
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
  } = resolveI18nProps(props);

  const data = getPieChartData({ data: results.data, dimension, measure, maxLegendItems }, theme);

  const options = mergician(
    getDefaultPieChartOptions(
      {
        showTooltips,
        showLegend,
        showValueLabels,
      } as DefaultPieChartOptions,
      theme,
    ),
    theme.charts.overwritePieChart ?? {},
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
