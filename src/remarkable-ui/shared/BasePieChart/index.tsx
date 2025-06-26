// Third Party Libraries
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import { Pie } from 'react-chartjs-2';

// Embeddable Libraries
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';

import { useBasePieChart } from './useBasePieChart';

// Register ChartJS components
ChartJS.register(ArcElement, LinearScale, Tooltip, Legend, ChartDataLabels, AnnotationPlugin);

export type BasePieChartProps = {
	chartOptionsOverrides?: Partial<ChartOptions<'pie'>>;
	dimension: Dimension;
	maxLegendItems?: number;
	measure: Measure;
	onSegmentClick?: (args: { dimensionValue: string | null }) => void;
	results: DataResponse;
	showValueLabels?: 'auto' | true | false;
	showLegend?: boolean;
	showTooltips?: boolean;
};

export default function BasePieChart(props: BasePieChartProps) {
	const { chartRef, chartData, chartOptions, onClick } = useBasePieChart(props);
	return <Pie data={chartData()} options={chartOptions()} onClick={onClick} ref={chartRef} />;
}
