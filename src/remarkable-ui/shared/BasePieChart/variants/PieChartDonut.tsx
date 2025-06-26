// Third Party Libraries
import { ChartOptions } from 'chart.js';

// Local Libraries
import BasePieChart from '..';
import { BasePieChartProps } from '..';

type PieChartDonutProps = Omit<BasePieChartProps, 'chartOptionsOverrides'>;

export function PieChartDonut({
	dimension,
	maxLegendItems,
	measure,
	onSegmentClick,
	results,
	showLegend,
	showTooltips,
	showValueLabels,
}: PieChartDonutProps) {
	const chartOptionsOverrides: Partial<ChartOptions<'pie'>> = {
		cutout: '60%',
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
