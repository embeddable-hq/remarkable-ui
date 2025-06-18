// Local Libraries
import Card from '../../../shared/Card';
import BasePieChart from '../../../shared/BasePieChart';
import { DonutChartProps } from './DonutChart.emb';
import { generateExportConfig } from '../../../utils/exportUtils';

export default ({
	description,
	dimension,
	downloadCSV,
	downloadPNG,
	maxLegendItems,
	measure,
	onSegmentClick,
	results,
	showLegend,
	showTooltips,
	showValueLabels,
	title,
}: DonutChartProps) => {
	const chartOptionsOverrides = {
		cutout: '60%',
	};

	return (
		<Card
			data={results.data}
			description={description}
			errorMessage={results.error}
			isLoading={results.isLoading}
			title={title}
			exportConfig={generateExportConfig(results.data, [dimension], [measure], title, {
				downloadCSV: downloadCSV || false,
				downloadPNG: downloadPNG || false,
			})}
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
