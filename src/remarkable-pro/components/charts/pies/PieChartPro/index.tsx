import { useTheme } from '@embeddable.com/react';
import { PieChart } from '../../../../../remarkable-ui';
import { Theme } from '../../../../theme/theme.types';
import { getPieChartProOptions, getPieChartProData } from '../pies.utils';
import { DefaultPieChartProps } from '../pies.types';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { mergician } from 'mergician';
import { resolveI18nProps } from '../../../component.utils';

type PieChartProProps = DefaultPieChartProps;

const PieChartPro = (props: PieChartProProps) => {
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

  const data = getPieChartProData(
    { data: results.data, dimension, measure, maxLegendItems },
    theme,
  );

  const options = mergician(
    getPieChartProOptions(measure, theme),
    theme.charts.pieChartPro?.options ?? {},
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
      <PieChart
        data={data}
        options={options}
        showLegend={showLegend}
        showTooltips={showTooltips}
        showValueLabels={showValueLabels}
        onSegmentClick={handleSegmentClick}
      />
    </ChartCard>
  );
};

export default PieChartPro;
