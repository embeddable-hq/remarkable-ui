import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { resolveI18nProps } from '../../../component.utils';
import { BarChart } from '../../../../../remarkable-ui/charts/bars/BarChart';
import { getBarChartProData, getBarChartProOptions } from '../bars.utils';
import { mergician } from 'mergician';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';

type BarChartProProps = {
  description: string;
  dimension: Dimension;
  xAxisMaxItems: number;
  measures: Measure[];
  results: DataResponse;
  showLegend: boolean;
  showTooltips: boolean;
  showValueLabels: boolean;
  showLogarithmicScale: boolean;
  xAxisLabel: string;
  yAxisLabel: string;
  reverseXAxis: boolean;
  title: string;
  yAxisRangeMin?: number;
  yAxisRangeMax?: number;
  onSegmentClick: (args: { dimensionValue: string | null }) => void;
};

const BarChartPro = (props: BarChartProProps) => {
  const theme = useTheme() as Theme;
  i18nSetup(theme);

  const {
    description,
    dimension,
    xAxisMaxItems,
    measures,
    results,
    showLegend,
    showTooltips,
    showValueLabels,
    showLogarithmicScale,
    xAxisLabel,
    yAxisLabel,
    reverseXAxis,
    yAxisRangeMin,
    yAxisRangeMax,
    title,
    onSegmentClick,
  } = resolveI18nProps(props);

  const data = getBarChartProData(
    { data: results.data, dimension, measures, xAxisMaxItems },
    theme,
  );

  const options = mergician(
    getBarChartProOptions(theme, measures[0]!), // Format Y axis based on first measure
    theme.charts?.barChartPro?.options || {},
  );

  const handleSegmentClick = (index: number | undefined) => {
    onSegmentClick({
      dimensionValue: index === undefined ? undefined : results.data?.[index]?.[dimension.name],
    });
  };

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
        options={options}
      />
    </ChartCard>
  );
};

export default BarChartPro;
