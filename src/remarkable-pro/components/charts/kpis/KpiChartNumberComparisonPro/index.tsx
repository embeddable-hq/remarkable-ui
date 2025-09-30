import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { DataResponse, Measure, TimeRange } from '@embeddable.com/core';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { resolveI18nProps } from '../../../component.utils';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { KpiChart } from '../../../../../remarkable-ui';
import { getThemeFormatter } from '../../../../theme/formatter/formatter.utils';
import { useEffect } from 'react';
import {
  getComparisonPeriodDateRange,
  getComparisonPeriodLabel,
} from '../../../utils/timeRange.utils';

type KpiChartNumberComparisonProProp = {
  changeFontSize: number;
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
  comparisonDateRange: TimeRange;
  setComparisonDateRange: (dateRange: TimeRange) => void;
};

const KpiChartNumberComparisonPro = (props: KpiChartNumberComparisonProProp) => {
  const theme: Theme = useTheme() as Theme;
  i18nSetup(theme);

  const { title, description } = resolveI18nProps(props);
  const {
    changeFontSize,
    comparisonPeriod,
    comparisonDateRange,
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
    const newComparisonDateRange = getComparisonPeriodDateRange(
      primaryDateRange,
      comparisonPeriod,
      theme,
    );
    setComparisonDateRange(newComparisonDateRange);
  }, [comparisonPeriod, JSON.stringify(primaryDateRange)]);

  const value = results.data?.[0]?.[measure.name];
  const comparisonValue = comparisonDateRange
    ? resultsComparison?.data?.[0]?.[measure.name]
    : undefined;

  const themeFormatter = getThemeFormatter(theme);
  const valueFormatter = (valueToFormat: number) => themeFormatter.data(measure, valueToFormat);
  const comparisonLabel = `vs ${getComparisonPeriodLabel(comparisonPeriod, theme).toLowerCase()}`;

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
        changeFontSize={changeFontSize}
        invertChangeColors={reversePositiveNegativeColors}
        showChangeAsPercentage={displayChangeAsPercentage}
        comparisonLabel={comparisonLabel}
      />
    </ChartCard>
  );
};

export default KpiChartNumberComparisonPro;
