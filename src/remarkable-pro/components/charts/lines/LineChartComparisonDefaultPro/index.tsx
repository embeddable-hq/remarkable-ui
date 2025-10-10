import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { DataResponse, Dimension, Measure, TimeRange } from '@embeddable.com/core';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { resolveI18nProps } from '../../../component.utils';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { LineChart } from '../../../../../remarkable-ui/charts/lines/LineChart';
import { useChartDataWithFillGaps } from '../../charts.fillGaps.hooks';
import { useEffect } from 'react';
import { getComparisonPeriodDateRange } from '../../../utils/timeRange.utils';
import {
  getLineChartComparisonProData,
  getLineChartComparisonProOptions,
} from './LineChartComparisonDefaultPro.utils';

type LineChartComparisonDefaultProProps = {
  description: string;
  dimensionTime: Dimension;
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
  setComparisonDateRange: (dateRange: TimeRange) => void;
};

const LineChartComparisonDefaultPro = (props: LineChartComparisonDefaultProProps) => {
  const theme: Theme = useTheme() as Theme;
  i18nSetup(theme);

  const { title, description, xAxisLabel, yAxisLabel } = resolveI18nProps(props);
  const {
    comparisonPeriod,
    measures,
    dimensionTime,
    reverseXAxis,
    showLegend,
    showLogarithmicScale,
    showTooltips,
    showValueLabels,
    yAxisRangeMax,
    yAxisRangeMin,
    comparisonDateRange,
    setComparisonDateRange,
  } = props;

  const dimensionDateBounds = dimensionTime.inputs?.['dateBounds'];

  useEffect(() => {
    const newComparisonDateRange = getComparisonPeriodDateRange(
      dimensionDateBounds,
      comparisonPeriod,
      theme,
    );
    setComparisonDateRange(newComparisonDateRange);
  }, [comparisonPeriod, JSON.stringify(dimensionDateBounds), theme]);

  const results = useChartDataWithFillGaps(props.results, props.dimensionTime);

  const resultsComparison = useChartDataWithFillGaps(
    props.resultsComparison,
    props.dimensionTime,
    comparisonDateRange,
  );

  const showDataComparison = Boolean(dimensionDateBounds && comparisonPeriod);
  const data = getLineChartComparisonProData(
    {
      data: results.data,
      dataComparison: showDataComparison ? resultsComparison.data : undefined,
      dimensionTime,
      measures,
    },
    theme,
  );

  const options = getLineChartComparisonProOptions(
    {
      data: data,
      dimension: dimensionTime,
      measures,
      xAxisLabel,
    },
    theme,
  );

  return (
    <ChartCard
      data={results}
      dimensionsAndMeasures={[...measures, dimensionTime]}
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
