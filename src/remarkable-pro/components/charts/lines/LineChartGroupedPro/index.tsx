import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { resolveI18nProps } from '../../../component.utils';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { LineChart } from '../../../../../remarkable-ui/charts/lines/LineChart';
import {
  getLineChartGroupedProData,
  getLineChartGroupedProOptions,
} from './LineChartGroupedPro.utils';
import { useFillGaps } from '../../charts.newFillGaps.hooks';
import { LineChartProOptionsClick } from '../lines.utils';

export type LineChartGroupedProPropsOnLineClicked = {
  axisDimensionValue: string | null;
  groupingDimensionValue: string | null;
};

type LineChartGroupedProProp = {
  description: string;
  xAxis: Dimension;
  groupBy: Dimension;
  measure: Measure;
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
  onLineClicked: LineChartProOptionsClick;
};

const LineChartGroupedPro = (props: LineChartGroupedProProp) => {
  const theme: Theme = useTheme() as Theme;
  i18nSetup(theme);

  const { title, description, xAxisLabel, yAxisLabel } = resolveI18nProps(props);
  const {
    measure,
    xAxis,
    groupBy,
    reverseXAxis,
    showLegend,
    showLogarithmicScale,
    showTooltips,
    showValueLabels,
    yAxisRangeMax,
    yAxisRangeMin,
    onLineClicked,
  } = props;

  const results = useFillGaps({
    results: props.results,
    dimension: props.xAxis,
  });

  const data = getLineChartGroupedProData(
    {
      data: results.data,
      dimension: xAxis,
      groupDimension: groupBy,
      measure,
      hasMinMaxYAxisRange: Boolean(yAxisRangeMin || yAxisRangeMax),
    },

    theme,
  );
  const options = getLineChartGroupedProOptions(
    { data, dimension: xAxis, measure, onLineClicked },
    theme,
  );

  return (
    <ChartCard
      data={results}
      dimensionsAndMeasures={[measure, xAxis, groupBy]}
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

export default LineChartGroupedPro;
