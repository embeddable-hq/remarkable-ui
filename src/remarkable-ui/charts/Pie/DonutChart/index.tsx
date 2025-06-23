import { useRef } from 'react';

// Local Libraries
import Card from '../../../shared/Card';
import BasePieChart from '../../../shared/BasePieChart';
import { DonutChartProps } from './DonutChart.emb';
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
}: DonutChartProps) => {
	const containerRef = useRef<HTMLDivElement | null>(null);

	const chartOptionsOverrides = {
		cutout: '60%',
	};

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
