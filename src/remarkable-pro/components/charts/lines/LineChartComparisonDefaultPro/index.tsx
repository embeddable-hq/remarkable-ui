import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { DataResponse, Dimension, Measure, TimeRange } from '@embeddable.com/core';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { resolveI18nProps } from '../../../component.utils';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { LineChart } from '../../../../../remarkable-ui/charts/lines/LineChart';
import { useEffect } from 'react';
import { getComparisonPeriodDateRange } from '../../../utils/timeRange.utils';
import {
  getLineChartComparisonProData,
  getLineChartComparisonProOptions,
} from './LineChartComparisonDefaultPro.utils';
import { useFillGaps } from '../../charts.newFillGaps.hooks';
import { LineChartProOptionsClick } from '../lines.utils';

type LineChartComparisonDefaultProProps = {
  description: string;
  xAxis: Dimension;
  measures: Measure[];
  results: DataResponse;
  resultsComparison: DataResponse | undefined;
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
  comparisonPeriod?: string;
  comparisonDateRange: TimeRange;
  showComparisonAxis: boolean;
  primaryDateRange: TimeRange;
  setComparisonDateRange: (dateRange: TimeRange) => void;
  onLineClicked: LineChartProOptionsClick;
};

const LineChartComparisonDefaultPro = (props: LineChartComparisonDefaultProProps) => {
  const theme: Theme = useTheme() as Theme;
  i18nSetup(theme);

  const { title, description, xAxisLabel, yAxisLabel } = resolveI18nProps(props);
  const {
    comparisonPeriod,
    measures,
    xAxis,
    reverseXAxis,
    showLegend,
    showLogarithmicScale,
    showTooltips,
    showValueLabels,
    yAxisRangeMax,
    yAxisRangeMin,
    primaryDateRange,
    comparisonDateRange,
    showComparisonAxis,
    setComparisonDateRange,
    onLineClicked,
  } = props;

  useEffect(() => {
    const newComparisonDateRange = getComparisonPeriodDateRange(
      primaryDateRange,
      comparisonPeriod,
      theme,
    );
    setComparisonDateRange(newComparisonDateRange);
  }, [comparisonPeriod, JSON.stringify(primaryDateRange), theme]);

  const results = useFillGaps({ results: props.results, dimension: xAxis });

  const resultsComparison = useFillGaps({
    results: props.resultsComparison,
    dimension: xAxis,
    externalDateBounds: comparisonDateRange,
  });

  const showDataComparison = Boolean(primaryDateRange && comparisonPeriod);
  const data = getLineChartComparisonProData(
    {
      data: results.data,
      dataComparison: showDataComparison ? (resultsComparison?.data ?? []) : undefined,
      dimension: xAxis,
      measures,
      hasMinMaxYAxisRange: Boolean(yAxisRangeMin != null || yAxisRangeMax != null),
    },
    theme,
  );

  const options = getLineChartComparisonProOptions(
    {
      data: data,
      dimension: xAxis,
      measures,
      xAxisLabel,
      showComparisonAxis,
      showDataComparison,
      onLineClicked,
    },
    theme,
  );

  const resultsCombined: DataResponse = {
    isLoading: Boolean(results.isLoading || resultsComparison?.isLoading),
    data:
      !results?.data && !resultsComparison?.data
        ? undefined
        : [...(results.data ?? []), ...(resultsComparison?.data ?? [])],
  };

  return (
    <ChartCard
      data={resultsCombined}
      dimensionsAndMeasures={[...measures, xAxis]}
      errorMessage={results.error || resultsComparison?.error}
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

export default LineChartComparisonDefaultPro;
