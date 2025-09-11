import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { resolveI18nProps } from '../../../component.utils';
import { BarChart } from '../../../../../remarkable-ui/charts/bars/BarChart';
import { getBarChartProData, getBarChartProOptions } from '../bars.utils';
import { mergician } from 'mergician';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';

type BarChartHorizontalProProps = {
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
  onSegmentClick: (args: { dimensionValue: string | null }) => void;
};

const BarChartHorizontalPro = (props: BarChartHorizontalProProps) => {
  const theme = useTheme() as Theme;
  i18nSetup(theme);

  const {
    description,
    dimension,
    measures,
    results,
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
    onSegmentClick,
  } = resolveI18nProps(props);

  const data = getBarChartProData(
    { data: results.data, dimension, measures, maxItems: yAxisMaxItems },
    theme,
  );

  const options = mergician(
    getBarChartProOptions(theme, measures[0]!, true), // Format X axis based on first measure
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
        onSegmentClick={handleSegmentClick}
      />
    </ChartCard>
  );
};

export default BarChartHorizontalPro;
