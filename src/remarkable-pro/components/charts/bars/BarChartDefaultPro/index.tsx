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

type BarChartDefaultProProps = {
  description: string;
  dimension: Dimension;
  measures: Measure[];
  results: DataResponse;
  title: string;
  xAxisLabel: string;
  xAxisMaxItems: number;
  yAxisLabel: string;
  yAxisRangeMin?: number;
  yAxisRangeMax?: number;
  showLegend: boolean;
  showLogarithmicScale: boolean;
  showTooltips: boolean;
  showValueLabels: boolean;
  reverseXAxis: boolean;
  onBarClicked: (args: { axisDimensionValue: string | null }) => void;
};

const BarChartDefaultPro = (props: BarChartDefaultProProps) => {
  const theme = useTheme() as Theme;
  i18nSetup(theme);

  const {
    description,
    dimension,
    measures,
    title,
    xAxisLabel,
    xAxisMaxItems,
    yAxisLabel,
    yAxisRangeMin,
    yAxisRangeMax,
    showLegend,
    showLogarithmicScale,
    showTooltips,
    showValueLabels,
    reverseXAxis,
    onBarClicked,
  } = resolveI18nProps(props);

  const results = useChartDataWithFillGaps(props.results, props.dimension);

  const data = getBarChartProData(
    { data: results.data, dimension, measures, maxItems: xAxisMaxItems },
    theme,
  );

  const options = mergician(
    getBarChartProOptions({ measures, horizontal: false, onBarClicked, data, dimension }, theme), // Format Y axis based on first measure
    theme.charts?.barChartDefaultPro?.options || {},
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
        options={options}
      />
    </ChartCard>
  );
};

export default BarChartDefaultPro;
