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

type LineChartComparisonDefaultProProps = {
  description: string;
  dimension: Dimension;
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
};

const LineChartComparisonDefaultPro = (props: LineChartComparisonDefaultProProps) => {
  const theme: Theme = useTheme() as Theme;
  i18nSetup(theme);

  const { title, description, xAxisLabel, yAxisLabel } = resolveI18nProps(props);
  const {
    comparisonPeriod,
    measures,
    dimension,
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
  } = props;

  useEffect(() => {
    const newComparisonDateRange = getComparisonPeriodDateRange(
      primaryDateRange,
      comparisonPeriod,
      theme,
    );
    setComparisonDateRange(newComparisonDateRange);
  }, [comparisonPeriod, JSON.stringify(primaryDateRange), theme]);

  const results = useFillGaps({ results: props.results, dimension });

  const resultsComparison = useFillGaps({
    results: props.resultsComparison,
    dimension,
    externalDateBounds: comparisonDateRange,
  });

  const showDataComparison = Boolean(primaryDateRange && comparisonPeriod);
  const data = getLineChartComparisonProData(
    {
      data: results.data,
      dataComparison: showDataComparison ? resultsComparison.data : undefined,
      dimension,
      measures,
    },
    theme,
  );

  const options = getLineChartComparisonProOptions(
    {
      data: data,
      dimension,
      measures,
      xAxisLabel,
      showComparisonAxis,
    },
    theme,
  );

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

export default LineChartComparisonDefaultPro;
