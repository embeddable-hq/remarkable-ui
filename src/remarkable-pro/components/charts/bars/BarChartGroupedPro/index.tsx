import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { resolveI18nProps } from '../../../component.utils';
import { BarChart } from '../../../../../remarkable-ui/charts/bars/BarChart';
import { getBarChartProOptions, getBarStackedChartProData } from '../bars.utils';
import { mergician } from 'mergician';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';

type BarChartGroupedProProps = {
  description: string;
  groupBy: Dimension;
  measure: Measure;
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
  onBarClicked: (args: {
    axisDimensionValue: string | null;
    groupingDimensionValue: string | null;
  }) => void;
};

const BarChartGroupedPro = (props: BarChartGroupedProProps) => {
  const theme = useTheme() as Theme;
  i18nSetup(theme);

  const {
    description,
    groupBy,
    measure,
    results,
    reverseXAxis,
    showLegend,
    showLogarithmicScale,
    showTooltips,
    showTotalLabels,
    showValueLabels,
    title,
    xAxis,
    xAxisLabel,
    yAxisLabel,
    yAxisRangeMax,
    yAxisRangeMin,
    onBarClicked,
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
    getBarChartProOptions({ measure, horizontal: false, onBarClicked }, theme), // Format Y axis based on first measure
    theme.charts?.barChartGroupedPro?.options || {},
  );

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
      />
    </ChartCard>
  );
};

export default BarChartGroupedPro;
