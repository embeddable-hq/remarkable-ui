import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { resolveI18nProps } from '../../../component.utils';
import { BarChart } from '../../../../../remarkable-ui/charts/bars/BarChart';
import { getBarChartProOptions, getBarStackedChartProData } from '../bars.utils';
import { mergician } from 'mergician';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';

type BarChartStackedProProps = {
  description: string;
  groupBy: Dimension;
  maxLegendItems?: number;
  measure: Measure;
  onSegmentClick: (args: { dimensionValue: string | null }) => void;
  results: DataResponse;
  reverseXAxis: boolean;
  showLegend: boolean;
  showLogarithmicScale: boolean;
  showTooltips: boolean;
  showTotalLabels?: boolean;
  showValueLabels: boolean;
  title: string;
  xAxis: Dimension;
  xAxisLabel: string;
  yAxisLabel: string;
  yAxisRangeMax?: number;
  yAxisRangeMin?: number;
  // displayPercentages: boolean;
};

const BarChartStackedPro = (props: BarChartStackedProProps) => {
  const theme = useTheme() as Theme;
  i18nSetup(theme);

  const {
    description,
    measure,
    xAxis,
    groupBy,
    results,
    title,
    xAxisLabel,
    // xAxisMaxItems,
    yAxisLabel,
    yAxisRangeMin,
    yAxisRangeMax,
    showLegend,
    showLogarithmicScale,
    showTooltips,
    showValueLabels,
    reverseXAxis,
    showTotalLabels,
    // displayPercentages,
    onSegmentClick,
  } = resolveI18nProps(props);

  const data = getBarStackedChartProData(
    {
      data: results.data,
      dimension: xAxis,
      groupDimension: groupBy,
      measure,
    },
    theme,
  );

  const options = mergician(
    getBarChartProOptions(theme, measure, false, true), // Format Y axis based on first measure
    theme.charts?.barChartPro?.options || {},
  );

  const handleSegmentClick = (index: number | undefined) => {
    onSegmentClick({
      dimensionValue: index === undefined ? undefined : results.data?.[index]?.[groupBy.name],
    });
  };

  return (
    <ChartCard
      data={results}
      dimensionsAndMeasures={[measure, xAxis, groupBy]}
      errorMessage={results.error}
      subtitle={description}
      title={title}
    >
      <BarChart
        data={data}
        onSegmentClick={handleSegmentClick}
        showLegend={showLegend}
        showTooltips={showTooltips}
        showValueLabels={showValueLabels}
        showLogarithmicScale={showLogarithmicScale}
        xAxisLabel={xAxisLabel}
        yAxisLabel={yAxisLabel}
        reverseXAxis={reverseXAxis}
        yAxisRangeMin={yAxisRangeMin}
        yAxisRangeMax={yAxisRangeMax}
        showTotalLabels={showTotalLabels}
        options={options}
        stacked="stacked"
      />
    </ChartCard>
  );
};

export default BarChartStackedPro;
