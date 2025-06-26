import { useRef } from 'react';

// Local Libraries
import Card from '../../../shared/Card';
import { PieChartDonutProps } from './PieChartDonut.emb';
import { buildExportConfig } from '../../../utils/exportUtils';
import { PieChartDonut } from '../../../shared/BasePieChart/variants/PieChartDonut';

export default ({
	description,
	dimension,
	maxLegendItems,
	measure,
	onSegmentClick,
	results,
	showLegend,
	showTooltips,
	showValueLabels,
	title,
	...exportFlags
}: PieChartDonutProps) => {
	const containerRef = useRef<HTMLDivElement | null>(null);

	return (
		<Card
			containerRef={containerRef}
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
			isLoading={results.isLoading}
			title={title}
		>
			<PieChartDonut
				dimension={dimension}
				maxLegendItems={maxLegendItems}
				measure={measure}
				onSegmentClick={onSegmentClick}
				results={results}
				showValueLabels={showValueLabels ? 'auto' : false}
				showLegend={showLegend}
				showTooltips={showTooltips}
			/>
		</Card>
	);
};
