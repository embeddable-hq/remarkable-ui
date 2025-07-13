import { useState, useRef } from 'react';
import { Chart as ChartJS, ArcElement, LinearScale, Tooltip, Legend, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import { mergician } from 'mergician';

import { useTheme } from '@embeddable.com/react';

import {
	getTooltipStyle,
	getDatalabelStyle,
	getLegendStyle,
} from '../../constants/commonChartStyles';
import { Theme } from '../../../themes/remarkableTheme/theme';
import { formatValue } from '../../utils/formatUtils';
import { aggregateLongTail } from '../../utils/dataUtils';
import { getColor } from '../../utils/colorUtils';
import { handlePieClick } from './handlers';
import type { BasePieChartProps } from './index';
import useI18n from '../../hooks/useI18n';

ChartJS.register(ArcElement, LinearScale, Tooltip, Legend, ChartDataLabels, AnnotationPlugin);

export function useBasePieChart({
	chartOptionsOverrides,
	dimension,
	measure,
	onSegmentClick,
	results,
	showValueLabels,
	showLegend,
	showTooltips,
	maxLegendItems,
}: BasePieChartProps) {
	const [clickedIndex, setClickedIndex] = useState<number | null>(null);
	const chartRef = useRef<ChartJS<'pie', number[]>>(null);

	const { data } = results;
	const mergedData = aggregateLongTail(data, dimension, measure, maxLegendItems) || [];

	const theme = useTheme() as Theme;
	const i18n = useI18n(theme);
	const themeColors = mergedData.map((item, i) =>
		getColor(item[dimension.name], theme.charts.colors, i),
	);
	const themeBorderColors = mergedData.map((item, i) =>
		getColor(item[dimension.name], theme.charts.borderColors || [], i),
	);

	const chartData = () => ({
		labels: mergedData.map((item) =>
			i18n.dimension(dimension, item[dimension.name])
		),
		datasets: [
			{
				data: mergedData.map((item) => item[measure.name]),
				backgroundColor: themeColors,
				borderColor: themeBorderColors,
				borderWidth: 0,
				hoverBackgroundColor: themeBorderColors,
				hoverBorderWidth: 0,
			},
		],
	});

	const { tooltipOptions, dataLabelOptions, legendOptions } = {
		tooltipOptions: getTooltipStyle(),
		dataLabelOptions: getDatalabelStyle(),
		legendOptions: getLegendStyle(),
	};

	const chartOptions = () =>
		mergician(
			{
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					datalabels: {
						display: showValueLabels ? 'auto' : false,
						...dataLabelOptions,
						anchor: 'center',
						align: 'center',
						formatter: (value: string) => formatValue(value, { typeHint: 'number', theme }),
					},
					legend: {
						display: showLegend !== false,
						position: theme.charts.legendPosition || 'bottom',
						labels: legendOptions,
					},
					tooltip: {
						enabled: showTooltips !== false,
						...tooltipOptions,
						callbacks: {
							label(context: any) {
								const raw = context.raw as number;
								const total = context.dataset.data.reduce(
									(sum: number, v: any) => sum + parseFloat(v),
									0,
								);
								const pct = Math.round((raw / total) * 100);
								return `${formatValue(raw, { typeHint: 'number', theme })} (${pct}%)`;
							},
						},
					},
				},
			},
			chartOptionsOverrides || {},
		) as ChartOptions<'pie'>;

	const onClick = (event: any) =>
		handlePieClick(
			event,
			chartRef.current,
			clickedIndex,
			onSegmentClick,
			setClickedIndex,
			data,
			dimension,
			mergedData,
		);

	return { chartRef, chartData, chartOptions, onClick };
}
