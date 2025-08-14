import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { getDefaultPieChartOptions, getPieChartData } from '../pies.utils';
import { DefaultReadyMadePieChartProps } from '../pies.types';
import { DataResponse, Measure } from '@embeddable.com/core';
import { getThemeFormatter } from '../../../../theme/formatter/formatter.utils';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { DonutChart } from '../../../../../remarkable-ui';
import { mergician } from 'mergician';

type ReadyMadeDonutLabelChartProps = DefaultReadyMadePieChartProps & {
  innerLabelMeasure: Measure;
  innerLabelText: string;
  resultsInnerLabel: DataResponse;
};

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
  innerLabelMeasure,
  resultsInnerLabel,
  innerLabelText = '',
  onSegmentClick,
}: ReadyMadeDonutLabelChartProps) => {
  const theme = useTheme() as Theme;
  const themeFormatter = getThemeFormatter(theme);
  i18nSetup(theme);

  const data = getPieChartData({ data: results.data, dimension, measure, maxLegendItems }, theme);

  const handleSegmentClick = (index: number | undefined) => {
    onSegmentClick({
      dimensionValue: index === undefined ? undefined : results.data?.[index]?.[dimension.name],
    });
  };

  const rawLabel = resultsInnerLabel?.data?.[0]?.[innerLabelMeasure.name] || '...';
  const label = themeFormatter.number(rawLabel) ?? '';

  const options = mergician(
    getDefaultPieChartOptions(
      {
        showTooltips,
        showLegend,
        showValueLabels,
      },
      theme,
    ),
    theme.charts.overwriteDonutLabelChart ?? {},
  );

  return (
    <ChartCard
      data={results}
      dimensionsAndMeasures={[dimension, measure]}
      errorMessage={results.error}
      subtitle={description}
      title={title}
    >
      <DonutChart
        label={label}
        subLabel={innerLabelText}
        data={data}
        options={options}
        onSegmentClick={handleSegmentClick}
      />
    </ChartCard>
  );
};

export default ReadyMadeDonutChart;
