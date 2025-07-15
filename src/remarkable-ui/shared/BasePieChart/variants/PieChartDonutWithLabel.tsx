// Third Party Libraries
import { ChartOptions } from 'chart.js';

// Embeddable Libraries
import { useTheme } from '@embeddable.com/react';

// Local Libraries
import BasePieChart from '..';
import { Theme } from '../../../../themes/remarkableTheme/theme';
import { formatValue } from '../../../utils/formatUtils';
import { getStyle } from '../../../utils/cssUtils';
import { BasePieChartProps } from '..';
import { DataResponse, Measure } from '@embeddable.com/core';
import useI18n from '../../../hooks/useI18n';

//TODO: showValuesLabels and showDataLabels: should use one single name.

type PieChartDonutWithLabelProps = {
	innerLabelMeasure: Measure;
	innerLabelText?: string;
	resultsInnerLabel: DataResponse;
} & BasePieChartProps;

export function PieChartDonutWithLabel({
	dimension,
	innerLabelMeasure,
	innerLabelText,
	maxLegendItems,
	measure,
	onSegmentClick,
	results,
	resultsInnerLabel,
	showLegend,
	showTooltips,
	showValueLabels,
}: PieChartDonutWithLabelProps) {
	const theme = useTheme() as Theme;
	const i18n = useI18n(theme);

	const innerLabelValue = resultsInnerLabel?.data?.[0]?.[innerLabelMeasure.name] || '...';

	const chartOptionsOverrides: Partial<ChartOptions<'pie'>> = {
		cutout: '60%',
		plugins: {
			annotation: {
				annotations: {
					innerlabel: {
						type: 'doughnutLabel',
						content: () => [
							i18n.data(innerLabelMeasure, innerLabelValue),
							innerLabelText
								? formatValue(innerLabelText || '', { typeHint: 'string', theme: theme })
								: '',
						], //one element per line
						font: [
							{
								family: getStyle('--em-donut-number-family'),
								size: getStyle('--em-donut-number-size'),
								weight: getStyle('--em-donut-number-weight'),
							},
							{
								family: getStyle('--em-donut-label-family'),
								size: getStyle('--em-donut-label-size'),
								weight: getStyle('--em-donut-label-weight'),
							},
						],
						color: [
							getStyle('--em-donut-number-color') as string,
							getStyle('--em-donut-label-color') as string,
						],
					},
				} as any,
				//TODO: any above is due to the error mentioned here: https://github.com/chartjs/chartjs-plugin-annotation/issues/968
				//According to the last comment, a fix should be coming in the next release: https://github.com/chartjs/chartjs-plugin-annotation/commit/1e95744fb98e6fe9426f8b6a7bd17b1fcdee2f42
			},
		},
	};

	return (
		<BasePieChart
			chartOptionsOverrides={chartOptionsOverrides}
			dimension={dimension}
			maxLegendItems={maxLegendItems}
			measure={measure}
			onSegmentClick={onSegmentClick}
			results={results}
			showValueLabels={showValueLabels ? 'auto' : false}
			showLegend={showLegend}
			showTooltips={showTooltips}
		/>
	);
}
