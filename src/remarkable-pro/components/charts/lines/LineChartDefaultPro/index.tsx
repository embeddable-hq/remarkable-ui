import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { resolveI18nProps } from '../../../component.utils';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { LineChart } from '../../../../../remarkable-ui/charts/lines/LineChart';
import { ChartData } from 'chart.js';
import { getThemeFormatter } from '../../../../theme/formatter/formatter.utils';
import { getObjectStableKey } from '../../../../utils.ts/object.utils';
import { getColor } from '../../../../theme/styles/styles.utils';
import { chartContrastColors } from '../../../../../remarkable-ui/charts/charts.constants';

type KpiChartNumberProProp = {
  title: string;
  description: string;
  results: DataResponse;
  measures: Measure[];
  dimension: Dimension;
};

const getLineChartProData = (
  props: {
    data: DataResponse['data'];
    dimension: Dimension;
    measures: Measure[];
  },
  theme: Theme,
): ChartData<'line'> => {
  if (!props.data) {
    return {
      labels: [],
      datasets: [{ data: [] }],
    };
  }

  const themeFormatter = getThemeFormatter(theme);

  const themeKey = getObjectStableKey(theme);
  const groupedData = props.data;

  return {
    labels: groupedData.map((item) => {
      return item[props.dimension.name];
    }),
    datasets: props.measures.map((measure, index) => {
      const backgroundColor = getColor(
        `${themeKey}.charts.backgroundColors`,
        measure.name,
        theme.charts.backgroundColors ?? chartContrastColors,
        index,
      );

      const borderColor = getColor(
        `${themeKey}.charts.borderColors`,
        measure.name,
        theme.charts.borderColors ?? chartContrastColors,
        index,
      );

      return {
        label: themeFormatter.dimensionOrMeasureTitle(measure),
        data: groupedData.map((item) => item[measure.name]),
        backgroundColor,
        borderColor,
        fill: Boolean(measure.inputs?.['fillUnderLine']),
      };
    }),
  };
};

const KpiChartNumberPro = (props: KpiChartNumberProProp) => {
  const theme: Theme = useTheme() as Theme;
  i18nSetup(theme);

  const { title, description } = resolveI18nProps(props);
  const { results, measures, dimension } = props;

  const data = getLineChartProData({ data: results.data, dimension, measures }, theme);
  const options = theme.charts?.lineChartDefaultPro?.options || {};

  return (
    <ChartCard
      data={results}
      dimensionsAndMeasures={[...measures, dimension]}
      errorMessage={results.error}
      subtitle={description}
      title={title}
    >
      <LineChart data={data} options={options} />
    </ChartCard>
  );
};

export default KpiChartNumberPro;
