import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { resolveI18nProps } from '../../../component.utils';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { LineChart } from '../../../../../remarkable-ui/charts/lines/LineChart';
import { getLineChartProData, getLineChartProOptions } from './LineChartDefaultPro.utils';
import { useFillGaps } from '../../charts.newFillGaps.hooks';

type LineChartProProp = {
  description: string;
  dimension: Dimension;
  measures: Measure[];
  results: DataResponse;
  reverseXAxis: boolean;
  showLegend: boolean;
  showLogarithmicScale: boolean;
  showTooltips: boolean;
  showValueLabels: boolean;
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  yAxisRangeMax?: number;
  yAxisRangeMin?: number;
};

const LineChartPro = (props: LineChartProProp) => {
  const theme: Theme = useTheme() as Theme;
  i18nSetup(theme);

  const { title, description, xAxisLabel, yAxisLabel } = resolveI18nProps(props);
  const {
    measures,
    dimension,
    reverseXAxis,
    showLegend,
    showLogarithmicScale,
    showTooltips,
    showValueLabels,
    yAxisRangeMax,
    yAxisRangeMin,
  } = props;

  const results = useFillGaps({
    results: props.results,
    dimension,
  });

  const data = getLineChartProData({ data: results.data, dimension, measures }, theme);
  const options = getLineChartProOptions({ data, dimension, measures }, theme);

  return (
    <ChartCard
      data={results}
      dimensionsAndMeasures={[...measures, dimension]}
      errorMessage={results.error}
      subtitle={description}
      title={title}
    >
      <LineChart
        data={data}
        reverseXAxis={reverseXAxis}
        showLegend={showLegend}
        showLogarithmicScale={showLogarithmicScale}
        showTooltips={showTooltips}
        showValueLabels={showValueLabels}
        xAxisLabel={xAxisLabel}
        yAxisLabel={yAxisLabel}
        yAxisRangeMax={yAxisRangeMax}
        yAxisRangeMin={yAxisRangeMin}
        options={options}
      />
    </ChartCard>
  );
};

export default LineChartPro;
