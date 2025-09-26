import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { DataResponse, Measure } from '@embeddable.com/core';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { resolveI18nProps } from '../../../component.utils';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { KpiChart } from '../../../../../remarkable-ui';
import { getThemeFormatter } from '../../../../theme/formatter/formatter.utils';

type KpiChartNumberProProp = {
  title: string;
  description: string;
  results: DataResponse;
  measure: Measure;
  fontSize: number;
};

const KpiChartNumberPro = (props: KpiChartNumberProProp) => {
  const theme: Theme = useTheme() as Theme;
  i18nSetup(theme);

  const { title, description, results, measure, fontSize } = resolveI18nProps(props);

  const value = results.data?.[0]?.[measure.name];

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
      <KpiChart value={value} valueFormatter={valueFormatter} valueFontSize={fontSize} />
    </ChartCard>
  );
};

export default KpiChartNumberPro;
