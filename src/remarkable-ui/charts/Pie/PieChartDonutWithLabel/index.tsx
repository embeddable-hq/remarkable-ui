// Third Party Libraries
import { useRef } from 'react';

// Local Libraries
import { buildExportConfig } from '../../../utils/exportUtils';
import { PieChartDonutWithLabelProps } from './PieChartDonutWithLabel.emb';
import { PieChartDonutWithLabel } from '../../../shared/BasePieChart/variants/PieChartDonutWithLabel';
import Card from '../../../shared/Card';

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
	...exportFlags
}: PieChartDonutWithLabelProps) => {
	const containerRef = useRef<HTMLDivElement | null>(null);

	return (
		<Card
			data={results.data}
			description={description}
			errorMessage={results.error}
			exportConfig={buildExportConfig(
				results.data,
				containerRef,
				[dimension],
				[measure],
				title,
				exportFlags,
			)}
			isLoading={results.isLoading || resultsInnerLabel.isLoading}
			containerRef={containerRef}
			title={title}
		>
			<PieChartDonutWithLabel
				dimension={dimension}
				innerLabelMeasure={innerLabelMeasure}
				innerLabelText={innerLabelText}
				maxLegendItems={maxLegendItems}
				measure={measure}
				onSegmentClick={onSegmentClick}
				results={results}
				resultsInnerLabel={resultsInnerLabel}
				showLegend={showLegend}
				showTooltips={showTooltips}
				showValueLabels={showValueLabels}
			/>
		</Card>
	);
};
