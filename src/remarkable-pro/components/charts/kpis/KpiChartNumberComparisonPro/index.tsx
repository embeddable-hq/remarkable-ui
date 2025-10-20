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
  percentageDecimalPlaces: number;
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
    percentageDecimalPlaces,
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

  const value: number = results.data?.[0]?.[measure.name];
  const comparisonValue = comparisonDateRange
    ? resultsComparison?.data?.[0]?.[measure.name]
    : undefined;

  const themeFormatter = getThemeFormatter(theme);
  const valueFormatter = (valueToFormat: number) => themeFormatter.data(measure, valueToFormat);
  const comparisonLabel = `vs ${getComparisonPeriodLabel(comparisonPeriod, theme).toLowerCase()}`;

  const resultsCombined: DataResponse = {
    isLoading: results.isLoading,
    data: results.isLoading
      ? undefined
      : [
          ...(results.data?.length ? [{ label: 'Primary period', ...results.data[0] }] : []),
          ...(resultsComparison?.data?.length
            ? [{ label: 'Comparison period', ...resultsComparison.data[0] }]
            : []),
        ],
  };

  return (
    <ChartCard
      data={resultsCombined}
      dimensionsAndMeasures={[
        // Add a label dimension to distinguish primary and comparison periods in exports
        { name: 'label', title: 'Label', nativeType: 'string', __type__: 'dimension' },
        measure,
      ]}
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
        percentageDecimalPlaces={percentageDecimalPlaces}
      />
    </ChartCard>
  );
};

export default KpiChartNumberComparisonPro;
