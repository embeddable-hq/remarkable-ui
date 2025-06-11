// Third Party Libraries
import { ChartOptions } from 'chart.js';

// Embeddable Libraries
import { useTheme } from '@embeddable.com/react';

// Local Libraries
import BasePieChart from '../../../shared/BasePieChart';
import Card from '../../../shared/Card';
import { DonutChartWithLabelProps } from './DonutChartWithLabel.emb';
import { Theme } from '../../../../themes/remarkableTheme/theme';
import { formatValue } from '../../../utils/formatUtils';
import { getStyle } from '../../../utils/cssUtils';

export default ({
	description,
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
	title,
}: DonutChartWithLabelProps) => {
	const theme = useTheme() as Theme;

	const innerLabelValue = resultsInnerLabel?.data?.[0]?.[innerLabelMeasure.name] || '...';

	const chartOptionsOverrides: Partial<ChartOptions<'pie'>> = {
		cutout: '60%',
		plugins: {
			annotation: {
				annotations: {
					innerlabel: {
						type: 'doughnutLabel',
						content: () => [
							formatValue(innerLabelValue, {
								typeHint: 'number',
								theme: theme,
							}),
							innerLabelText
								? formatValue(innerLabelText || '', { typeHint: 'string', theme: theme })
								: '',
						], //one element per line
						font: [
							{
								family: getStyle('--donut-number-family'),
								size: getStyle('--donut-number-size'),
								weight: getStyle('--donut-number-weight'),
							},
							{
								family: getStyle('--donut-label-family'),
								size: getStyle('--donut-label-size'),
								weight: getStyle('--donut-label-weight'),
							},
						],
						color: [
							getStyle('--donut-number-color') as string,
							getStyle('--donut-label-color') as string,
						],
					},
				} as any,
				//TODO: any above is due to the error mentioned here: https://github.com/chartjs/chartjs-plugin-annotation/issues/968
				//According to the last comment, a fix should be coming in the next release: https://github.com/chartjs/chartjs-plugin-annotation/commit/1e95744fb98e6fe9426f8b6a7bd17b1fcdee2f42
			},
		},
	};

	return (
		<Card
			data={results.data}
			description={description}
			errorMessage={results.error}
			isLoading={results.isLoading || resultsInnerLabel.isLoading}
			title={title}
		>
			<BasePieChart
				chartOptionsOverrides={chartOptionsOverrides}
				dimension={dimension}
				maxLegendItems={maxLegendItems}
				measure={measure}
				onSegmentClick={onSegmentClick}
				results={results}
				showDataLabels={showValueLabels ? 'auto' : false}
				showLegend={showLegend}
				showTooltips={showTooltips}
			/>
		</Card>
	);
};
