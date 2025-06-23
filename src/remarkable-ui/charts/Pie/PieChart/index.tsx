//Third Party Libraries
import { useRef } from 'react';

// Local Libraries
import BasePieChart from '../../../shared/BasePieChart';
import Card from '../../../shared/Card';
import { PieChartProps } from './PieChart.emb';
import { buildExportConfig } from '../../../utils/exportUtils';

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
}: PieChartProps) => {
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
			<BasePieChart
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
