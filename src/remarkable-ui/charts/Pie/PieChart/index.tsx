// Local Libraries
import BasePieChart from '../../../shared/BasePieChart';
import Card from '../../../shared/Card';
import { PieChartProps } from './PieChart.emb';

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
}: PieChartProps) => {
	return (
		<Card
			data={results.data}
			description={description}
			errorMessage={results.error}
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
