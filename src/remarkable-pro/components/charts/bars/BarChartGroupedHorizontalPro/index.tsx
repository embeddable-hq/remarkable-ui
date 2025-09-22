import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { resolveI18nProps } from '../../../component.utils';
import { BarChart } from '../../../../../remarkable-ui/charts/bars/BarChart';
import { getBarChartProOptions, getBarStackedChartProData } from '../bars.utils';
import { mergician } from 'mergician';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';

type BarChartGroupedHorizontalProProps = {
  description: string;
  groupBy: Dimension;
  measure: Measure;
  results: DataResponse;
  reverseYAxis: boolean;
  showLegend: boolean;
  showLogarithmicScale: boolean;
  showTooltips: boolean;
  showTotalLabels?: boolean;
  showValueLabels: boolean;
  title: string;
  yAxis: Dimension;
  xAxisLabel: string;
  yAxisLabel: string;
  xAxisRangeMax?: number;
  xAxisRangeMin?: number;
  onBarClicked: (args: {
    axisDimensionValue: string | null;
    groupingDimensionValue: string | null;
  }) => void;
};

const BarChartGroupedHorizontalPro = (props: BarChartGroupedHorizontalProProps) => {
  const theme = useTheme() as Theme;
  i18nSetup(theme);

  const {
    description,
    groupBy,
    measure,
    results,
    reverseYAxis,
    showLegend,
    showLogarithmicScale,
    showTooltips,
    showTotalLabels,
    showValueLabels,
    title,
    yAxis,
    xAxisLabel,
    yAxisLabel,
    xAxisRangeMax,
    xAxisRangeMin,
    onBarClicked,
  } = resolveI18nProps(props);

  const data = getBarStackedChartProData(
    {
      data: results.data,
      dimension: yAxis,
      groupDimension: groupBy,
      measure,
    },
    theme,
  );

  const options = mergician(
    getBarChartProOptions({ measure, horizontal: true, onBarClicked }, theme), // Format X axis based on first measure
    theme.charts?.barChartGroupedHorizontalPro?.options || {},
  );

  return (
    <ChartCard
      data={results}
      dimensionsAndMeasures={[measure, yAxis, groupBy]}
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
        reverseYAxis={reverseYAxis}
        xAxisRangeMin={xAxisRangeMin}
        xAxisRangeMax={xAxisRangeMax}
        showTotalLabels={showTotalLabels}
        options={options}
        horizontal
      />
    </ChartCard>
  );
};

export default BarChartGroupedHorizontalPro;
