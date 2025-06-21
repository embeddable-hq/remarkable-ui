import { useRef } from 'react';

// Local Libraries
import Card from '../../../shared/Card';
import BasePieChart from '../../../shared/BasePieChart';
import { DonutChartProps } from './DonutChart.emb';
import { ExportConfig } from '../../../shared/ExportButton/useExportItems';

export default ({
	description,
	dimension,
	downloadCSV,
	downloadPNG,
	downloadExcel,
	maxLegendItems,
	measure,
	onSegmentClick,
	results,
	showLegend,
	showTooltips,
	showValueLabels,
	title,
}: DonutChartProps) => {
	const containerRef = useRef<HTMLDivElement | null>(null);

	const chartOptionsOverrides = {
		cutout: '60%',
	};

	const exportConfig: ExportConfig = {
		containerRef: containerRef,
		dataToExport: results.data,
		dimensions: [dimension],
		measures: [measure],
		title,
		enabledOptions: {
			downloadCSV: downloadCSV,
			downloadPNG: downloadPNG,
			downloadExcel: downloadExcel,
		},
	};

	return (
		<Card
			containerRef={containerRef}
			data={results.data}
			description={description}
			errorMessage={results.error}
			isLoading={results.isLoading}
			title={title}
			exportConfig={exportConfig}
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
