import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { DataResponse, Measure, TimeRange } from '@embeddable.com/core';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { resolveI18nProps } from '../../../component.utils';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { KpiChart } from '../../../../../remarkable-ui';
import { getThemeFormatter } from '../../../../theme/formatter/formatter.utils';
import { useEffect } from 'react';

type KpiChartNumberComparisonProProp = {
  comparisonPeriod?: string;
  description: string;
  displayChangeAsPercentage?: boolean;
  fontSize: number;
  measure: Measure;
  primaryDateRange: TimeRange;
  results: DataResponse;
  resultsComparison: DataResponse | undefined;
  reversePositiveNegativeColors?: boolean;
  title: string;
  setComparisonDateRange: (dateRange: TimeRange) => void;
};

const KpiChartNumberComparisonPro = (props: KpiChartNumberComparisonProProp) => {
  const theme: Theme = useTheme() as Theme;
  i18nSetup(theme);

  const { title, description } = resolveI18nProps(props);
  const {
    comparisonPeriod,
    displayChangeAsPercentage,
    fontSize,
    measure,
    primaryDateRange,
    results,
    resultsComparison,
    reversePositiveNegativeColors,
    setComparisonDateRange,
  } = props;

  useEffect(() => {
    const primaryDateRangeRange = primaryDateRange?.relativeTimeString
      ? theme.editors.dateRangeSelectFieldPro.options
          .find((x) => x.value === primaryDateRange?.relativeTimeString)
          ?.getRange()
      : primaryDateRange;

    const selectedOption = theme.editors.comparisonPeriodSelectFieldPro.options
      .find((x) => x.value === comparisonPeriod)
      ?.getRange(primaryDateRangeRange);

    setComparisonDateRange(selectedOption);
  }, [comparisonPeriod, JSON.stringify(primaryDateRange)]);

  const value = results.data?.[0]?.[measure.name];
  const comparisonValue = resultsComparison?.data?.[0]?.[measure.name];

  const themeFormatter = getThemeFormatter(theme);
  const valueFormatter = (valueToFormat: number) => themeFormatter.data(measure, valueToFormat);

  return (
    <ChartCard
      data={results}
      dimensionsAndMeasures={[measure]}
      errorMessage={results.error}
      subtitle={description}
      title={title}
    >
      <KpiChart
        value={value}
        comparisonValue={comparisonValue}
        valueFormatter={valueFormatter}
        valueFontSize={fontSize}
        invertChangeColors={reversePositiveNegativeColors}
        showChangeAsPercentage={displayChangeAsPercentage}
        comparisonLabel={'vs ' + comparisonPeriod}
      />
    </ChartCard>
  );
};

export default KpiChartNumberComparisonPro;
