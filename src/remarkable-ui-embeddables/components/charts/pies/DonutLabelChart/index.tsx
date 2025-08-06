import React from 'react';
import { useTheme } from '@embeddable.com/react';
import { PieChart, getStyleNumber, getStyle } from '../../../../../remarkable-ui';
import { Theme } from '../../../../theme/theme.types';
import { DefaultPieChartOptions, getDefaultPieChartOptions, getPieChartData } from '../pies.utils';
import { ChartOptions } from 'chart.js';
import { AnnotationOptions } from 'chartjs-plugin-annotation';
import { DefaultReadyMadePieChartProps } from '../pies.types';
import { DataResponse, Measure } from '@embeddable.com/core';
import { getThemeFormatter } from '../../../../theme/formatter/formatter.utils';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { ChartCard } from '../../shared/ChartCard/ChartCard';

type ReadyMadeDonutLabelChartProps = DefaultReadyMadePieChartProps & {
  innerLabelMeasure: Measure;
  innerLabelText: string;
  resultsInnerLabel: DataResponse;
};

const getDonutChartOptions = (
  options: DefaultPieChartOptions & {
    resultsInnerLabel: ReadyMadeDonutLabelChartProps['resultsInnerLabel'];
    innerLabelMeasure: ReadyMadeDonutLabelChartProps['innerLabelMeasure'];
    innerLabelText: ReadyMadeDonutLabelChartProps['innerLabelText'];
  },
  theme: Theme,
): Partial<ChartOptions<'pie'>> => {
  const innerLabelValue =
    options.resultsInnerLabel?.data?.[0]?.[options.innerLabelMeasure.name] || '...';

  const themeFormatter = getThemeFormatter(theme);

  return {
    cutout: '60%',
    plugins: {
      ...getDefaultPieChartOptions(options, theme).plugins,
      annotation: {
        annotations: {
          innerlabel: {
            type: 'doughnutLabel',
            content: () => [themeFormatter.number(innerLabelValue), options.innerLabelText],
            font: [
              {
                size: getStyleNumber('--em-pie-chart-donut-number-font-size'),
                weight: getStyleNumber('--em-pie-chart-donut-label-font-weight'),
                height: getStyleNumber('--em-pie-chart-donut-number-font-line-height'),
                family: 'Inter, sans-serif',
              },
              {
                size: getStyleNumber('--em-pie-chart-donut-label-font-size'),
                weight: getStyleNumber('--em-pie-chart-donut-label-font-weight'),
                height: getStyleNumber('--em-pie-chart-donut-label-font-line-height'),
                family: 'Inter, sans-serif',
              },
            ],
            color: [
              getStyle('--em-pie-chart-donut-number-color-default'),
              getStyle('--em-pie-chart-donut-label-color-default'),
            ],
          },
        } as unknown as Record<string, AnnotationOptions>,
      },
    },
  };
};

const ReadyMadeDonutChart: React.FC<ReadyMadeDonutLabelChartProps> = ({
  description,
  dimension,
  maxLegendItems,
  measure,
  results,
  showLegend,
  showTooltips,
  showValueLabels,
  title,
  innerLabelMeasure,
  resultsInnerLabel,
  innerLabelText = '',
  onSegmentClick,
}) => {
  const theme = useTheme() as Theme;
  i18nSetup(theme);

  const data = getPieChartData({ data: results.data, dimension, measure, maxLegendItems }, theme);
  const options = getDonutChartOptions(
    {
      showTooltips,
      showLegend,
      showValueLabels,
      legendPosition: theme.charts.legendPosition,
      resultsInnerLabel,
      innerLabelMeasure,
      innerLabelText,
    },
    theme,
  );

  const handleSegmentClick = (index: number | undefined) => {
    onSegmentClick({
      dimensionValue: index === undefined ? undefined : results.data?.[index]?.[dimension.name],
    });
  };

  return (
    <ChartCard
      data={results}
      dimensionsAndMeasures={[dimension, measure]}
      errorMessage={results.error}
      subtitle={description}
      title={title}
    >
      <PieChart data={data} options={options} onSegmentClick={handleSegmentClick} />
    </ChartCard>
  );
};

export default ReadyMadeDonutChart;
