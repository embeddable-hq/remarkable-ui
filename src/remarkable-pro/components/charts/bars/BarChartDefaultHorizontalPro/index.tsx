import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { resolveI18nProps } from '../../../component.utils';
import { BarChart } from '../../../../../remarkable-ui/charts/bars/BarChart';
import { getBarChartProData, getBarChartProOptions } from '../bars.utils';
import { mergician } from 'mergician';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { useChartDataWithFillGaps } from '../../charts.fillGaps.hooks';

type BarChartDefaultHorizontalProProps = {
  description: string;
  dimension: Dimension;
  measures: Measure[];
  results: DataResponse;
  reverseYAxis: boolean;
  showLegend: boolean;
  showLogarithmicScale: boolean;
  showTooltips: boolean;
  showValueLabels: boolean;
  title: string;
  xAxisLabel: string;
  xAxisRangeMax?: number;
  xAxisRangeMin?: number;
  yAxisLabel: string;
  yAxisMaxItems: number;
  onBarClicked: (args: { axisDimensionValue: string | null }) => void;
};

const BarChartDefaultHorizontalPro = (props: BarChartDefaultHorizontalProProps) => {
  const theme = useTheme() as Theme;
  i18nSetup(theme);

  const {
    description,
    dimension,
    measures,
    reverseYAxis,
    showLegend,
    showLogarithmicScale,
    showTooltips,
    showValueLabels,
    title,
    xAxisLabel,
    xAxisRangeMax,
    xAxisRangeMin,
    yAxisLabel,
    yAxisMaxItems,
    onBarClicked,
  } = resolveI18nProps(props);

  const results = useChartDataWithFillGaps(props.results, props.dimension);

  const data = getBarChartProData(
    { data: results.data, dimension, measures, maxItems: yAxisMaxItems },
    theme,
  );

  const options = mergician(
    getBarChartProOptions({ measures, horizontal: true, onBarClicked, data, dimension }, theme), // Format X axis based on first measure
    theme.charts?.barChartDefaultHorizontalPro?.options || {},
  );

  return (
    <ChartCard
      data={results}
      dimensionsAndMeasures={[dimension, ...measures]}
      errorMessage={results.error}
      subtitle={description}
      title={title}
    >
      <BarChart
        horizontal
        data={data}
        options={options}
        reverseYAxis={reverseYAxis}
        showLegend={showLegend}
        showLogarithmicScale={showLogarithmicScale}
        showTooltips={showTooltips}
        showValueLabels={showValueLabels}
        xAxisLabel={xAxisLabel}
        xAxisRangeMax={xAxisRangeMax}
        xAxisRangeMin={xAxisRangeMin}
        yAxisLabel={yAxisLabel}
      />
    </ChartCard>
  );
};

export default BarChartDefaultHorizontalPro;
